"""User management schemas for admin endpoints."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class PendingRegistrationOut(BaseModel):
    id: UUID
    full_name: str
    email: str
    organization: str | None
    role_description: str | None
    requested_access_profile: str | None
    reason_for_access: str | None
    agreed_to_coc: bool
    agreed_to_data_governance: bool
    status: str
    ip_address: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ApproveRegistrationRequest(BaseModel):
    role_name: str = "Viewer"
    workspace_slug: str = "default"
    access_expires_at: datetime | None = None
    admin_notes: str | None = None


class RejectRegistrationRequest(BaseModel):
    admin_notes: str | None = None


class RequestMoreInfoRequest(BaseModel):
    questions: str = Field(..., min_length=10)


class AdminUserOut(BaseModel):
    id: UUID
    email: str
    full_name: str
    organization: str | None
    is_active: bool
    is_superadmin: bool
    must_change_password: bool
    mfa_enabled: bool
    failed_login_count: int
    last_login_at: datetime | None
    created_at: datetime
    roles: list[str] = []

    model_config = {"from_attributes": True}


class AssignRolesRequest(BaseModel):
    role_names: list[str]


class AuditLogEntryOut(BaseModel):
    id: int
    actor_email: str | None
    action: str
    resource_type: str | None
    resource_id: str | None
    detail: str | None
    ip_address: str | None
    success: bool
    logged_at: datetime

    model_config = {"from_attributes": True}


class WorkspaceOut(BaseModel):
    id: int
    slug: str
    name: str
    description: str | None
    is_public_samples: bool
    is_active: bool

    model_config = {"from_attributes": True}
