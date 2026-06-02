#!/usr/bin/env python3
"""
Seed RBAC roles, permissions, and default workspaces.

Usage:
    python scripts/seed_rbac.py
    # or via Makefile:
    make seed
"""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from affectlog.auth.permissions import ALL_PERMISSIONS, ROLE_DEFAULTS
from affectlog.db.base import Base
from affectlog.db.models import Permission, Role, RolePermission, Workspace
from affectlog.db.session import AsyncSessionLocal, engine


async def seed(db: AsyncSession) -> None:
    # ── Ensure tables exist ─────────────────────────────────────────────
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # ── Permissions ─────────────────────────────────────────────────────
    perm_map: dict[str, Permission] = {}
    for name, description in ALL_PERMISSIONS:
        result = await db.execute(select(Permission).where(Permission.name == name))
        perm = result.scalar_one_or_none()
        if perm is None:
            perm = Permission(name=name, description=description)
            db.add(perm)
            await db.flush()
            print(f"  + permission: {name}")
        perm_map[name] = perm

    # ── Roles ────────────────────────────────────────────────────────────
    for role_name, perm_names in ROLE_DEFAULTS.items():
        result = await db.execute(select(Role).where(Role.name == role_name))
        role = result.scalar_one_or_none()
        if role is None:
            role = Role(name=role_name, is_system=True)
            db.add(role)
            await db.flush()
            print(f"  + role: {role_name}")

        # Sync permissions for role
        for pname in perm_names:
            if pname not in perm_map:
                continue
            perm = perm_map[pname]
            exists = await db.execute(
                select(RolePermission).where(
                    RolePermission.role_id == role.id,
                    RolePermission.permission_id == perm.id,
                )
            )
            if exists.scalar_one_or_none() is None:
                db.add(RolePermission(role_id=role.id, permission_id=perm.id))

    # ── Workspaces ───────────────────────────────────────────────────────
    default_workspaces = [
        ("default", "Default Workspace", False),
        ("demo", "Demo Workspace", False),
        ("maskott-tactileo", "Maskott / Tactileo", False),
        ("inokufu-becomino", "Inokufu / Becomino", False),
        ("public-samples", "Public Samples", True),
    ]
    for slug, name, is_public in default_workspaces:
        result = await db.execute(select(Workspace).where(Workspace.slug == slug))
        ws = result.scalar_one_or_none()
        if ws is None:
            db.add(Workspace(slug=slug, name=name, is_public_samples=is_public))
            print(f"  + workspace: {slug}")

    await db.commit()
    print("RBAC seed complete.")


async def main() -> None:
    print("Seeding RBAC roles, permissions, and workspaces…")
    async with AsyncSessionLocal() as db:
        await seed(db)


if __name__ == "__main__":
    asyncio.run(main())
