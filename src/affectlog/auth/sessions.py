"""
Session management — create, validate, revoke.

Sessions are stored in DB with hashed tokens.
The token is kept in an HttpOnly cookie client-side.
"""

from __future__ import annotations

import hashlib
import secrets
import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from affectlog.config import get_settings
from affectlog.db.models import Session, User


def _new_token() -> tuple[str, str]:
    raw = secrets.token_urlsafe(48)
    digest = hashlib.sha256(raw.encode()).hexdigest()
    return raw, digest


def _expiry() -> datetime:
    ttl = get_settings().session_ttl_seconds
    return datetime.now(UTC) + timedelta(seconds=ttl)


async def create_session(
    db: AsyncSession,
    user: User,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> str:
    """Create a DB session, return the plaintext token."""
    raw, digest = _new_token()
    session = Session(
        id=uuid.uuid4(),
        user_id=user.id,
        session_token_hash=digest,
        expires_at=_expiry(),
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.add(session)
    await db.flush()
    return raw


async def get_session_user(db: AsyncSession, token: str) -> User | None:
    """Validate token, return User or None if invalid/expired/revoked."""
    digest = hashlib.sha256(token.encode()).hexdigest()
    now = datetime.now(UTC)
    result = await db.execute(
        select(Session).where(
            Session.session_token_hash == digest,
            Session.expires_at > now,
            Session.revoked_at.is_(None),
        )
    )
    session = result.scalar_one_or_none()
    if session is None:
        return None
    user_result = await db.execute(
        select(User).where(User.id == session.user_id, User.is_active == True)  # noqa: E712
    )
    return user_result.scalar_one_or_none()


async def revoke_session(db: AsyncSession, token: str) -> None:
    digest = hashlib.sha256(token.encode()).hexdigest()
    now = datetime.now(UTC)
    await db.execute(
        update(Session).where(Session.session_token_hash == digest).values(revoked_at=now)
    )


async def revoke_all_sessions(db: AsyncSession, user_id: uuid.UUID) -> None:
    now = datetime.now(UTC)
    await db.execute(
        update(Session)
        .where(Session.user_id == user_id, Session.revoked_at.is_(None))
        .values(revoked_at=now)
    )
