"""
Security audit logging — write immutable audit trail entries to DB.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession

from affectlog.db.models import AuditLogEntry


async def log_event(
    db: AsyncSession,
    action: str,
    *,
    actor_id: uuid.UUID | None = None,
    actor_email: str | None = None,
    resource_type: str | None = None,
    resource_id: str | None = None,
    detail: str | None = None,
    ip_address: str | None = None,
    success: bool = True,
) -> None:
    entry = AuditLogEntry(
        actor_id=actor_id,
        actor_email=actor_email,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        detail=detail,
        ip_address=ip_address,
        success=success,
        logged_at=datetime.now(UTC),
    )
    db.add(entry)
    await db.flush()
