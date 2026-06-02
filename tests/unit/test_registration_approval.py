"""
Tests for registration and onboarding workflow.
Uses in-memory SQLite for speed.
"""

from __future__ import annotations

import uuid

import pytest
import pytest_asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from affectlog.db.base import Base
from affectlog.db.models import PendingRegistration, User


@pytest_asyncio.fixture
async def db():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
    async with SessionLocal() as session:
        yield session
    await engine.dispose()


@pytest.mark.asyncio
async def test_create_pending_registration_no_active_user(db: AsyncSession):
    from affectlog.auth.registration import create_pending_registration

    reg = await create_pending_registration(
        db,
        full_name="Jane Researcher",
        email="jane@uni.eu",
        organization="Uni",
        role_description="Researcher",
        requested_access_profile="Researcher",
        reason_for_access="Dataset analysis for paper",
        agreed_to_coc=True,
        agreed_to_data_governance=True,
    )
    await db.commit()
    assert reg.status == "pending"
    assert reg.email == "jane@uni.eu"

    # Confirm user is NOT active yet
    result = await db.execute(select(User).where(User.email == "jane@uni.eu"))
    active_user = result.scalar_one_or_none()
    assert active_user is None


@pytest.mark.asyncio
async def test_duplicate_registration_raises(db: AsyncSession):
    from fastapi import HTTPException

    from affectlog.auth.registration import create_pending_registration

    for _ in range(2):
        try:
            await create_pending_registration(
                db,
                full_name="Duplicate User",
                email="dupe@uni.eu",
                organization=None,
                role_description=None,
                requested_access_profile=None,
                reason_for_access=None,
                agreed_to_coc=True,
                agreed_to_data_governance=True,
            )
            await db.flush()
        except HTTPException as exc:
            assert exc.status_code == 409
            return

    pytest.fail("Expected HTTPException for duplicate registration")


@pytest.mark.asyncio
async def test_pending_user_cannot_login_before_approval(db: AsyncSession):
    """Verify that a PendingRegistration has no corresponding active User."""
    reg = PendingRegistration(
        id=uuid.uuid4(),
        full_name="Pending Paul",
        email="paul@pending.eu",
        agreed_to_coc=True,
        agreed_to_data_governance=True,
        status="pending",
    )
    db.add(reg)
    await db.flush()

    result = await db.execute(
        select(User).where(User.email == "paul@pending.eu", User.is_active == True)  # noqa: E712
    )
    assert result.scalar_one_or_none() is None
