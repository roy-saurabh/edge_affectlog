"""
Support access grant management.

In managed mode, AffectLog support staff must not have blanket permanent
access to tenant data. This module implements the time-limited, audit-logged,
tenant-owner-approved support access flow.

Design invariants:
  - Only the tenant owner can grant access.
  - Access is time-limited (expires_at required).
  - Reason and scope are required fields.
  - raw_data_access defaults to False and requires explicit opt-in by tenant owner.
  - All grant creation, use, and revocation events are written to TenantAuditLog.
  - Break-glass procedures are documented but not enabled by default.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import TYPE_CHECKING

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

if TYPE_CHECKING:
    from affectlog.tenancy.models import SupportAccessGrant


async def create_support_grant(
    db: AsyncSession,
    *,
    tenant_id: uuid.UUID,
    granted_by_user_id: uuid.UUID,
    support_user_email: str,
    reason: str,
    scope: str,
    expires_at: datetime,
    raw_data_access: bool = False,
) -> SupportAccessGrant:
    from affectlog.tenancy.models import SupportAccessGrant, TenantAuditLog

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)

    grant = SupportAccessGrant(
        tenant_id=tenant_id,
        granted_by_user_id=granted_by_user_id,
        support_user_email=support_user_email,
        reason=reason,
        scope=scope,
        expires_at=expires_at,
        raw_data_access=raw_data_access,
        status="active",
    )
    db.add(grant)

    log = TenantAuditLog(
        tenant_id=tenant_id,
        actor_user_id=granted_by_user_id,
        event_type="support_access.granted",
        resource_type="support_access_grant",
        resource_id=str(grant.id),
        detail={
            "support_user_email": support_user_email,
            "reason": reason,
            "scope": scope,
            "expires_at": expires_at.isoformat(),
            "raw_data_access": raw_data_access,
        },
    )
    db.add(log)
    await db.flush()
    return grant


async def revoke_support_grant(
    db: AsyncSession,
    *,
    grant_id: uuid.UUID,
    revoked_by_user_id: uuid.UUID,
    tenant_id: uuid.UUID,
) -> None:
    from affectlog.tenancy.models import SupportAccessGrant, TenantAuditLog

    result = await db.execute(
        select(SupportAccessGrant)
        .where(SupportAccessGrant.id == grant_id)
        .where(SupportAccessGrant.tenant_id == tenant_id)
    )
    grant = result.scalar_one_or_none()
    if not grant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grant not found.")
    if grant.status == "revoked":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Grant already revoked."
        )

    grant.status = "revoked"
    grant.revoked_at = datetime.now(tz=UTC)
    grant.revoked_by_user_id = revoked_by_user_id

    log = TenantAuditLog(
        tenant_id=tenant_id,
        actor_user_id=revoked_by_user_id,
        event_type="support_access.revoked",
        resource_type="support_access_grant",
        resource_id=str(grant_id),
        detail={"grant_id": str(grant_id)},
    )
    db.add(log)
    await db.flush()


async def check_support_grant_active(
    db: AsyncSession,
    *,
    support_user_email: str,
    tenant_id: uuid.UUID,
) -> bool:
    """Returns True if the support user has an active, non-expired grant for this tenant."""
    from affectlog.tenancy.models import SupportAccessGrant

    now = datetime.now(tz=UTC)
    result = await db.execute(
        select(SupportAccessGrant)
        .where(SupportAccessGrant.tenant_id == tenant_id)
        .where(SupportAccessGrant.support_user_email == support_user_email)
        .where(SupportAccessGrant.status == "active")
        .where(SupportAccessGrant.expires_at > now)
    )
    return result.scalar_one_or_none() is not None
