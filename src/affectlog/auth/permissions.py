"""
All permissions used in AffectLog RBAC.

Each permission is a string constant so callers can `from affectlog.auth.permissions import P`
and use `P.DATASETS_UPLOAD` etc. — avoiding magic strings in route guards.
"""

from __future__ import annotations


class P:
    """Permission name constants."""

    # User management
    USERS_READ = "users:read"
    USERS_CREATE = "users:create"
    USERS_UPDATE = "users:update"
    USERS_DISABLE = "users:disable"
    USERS_APPROVE = "users:approve"
    USERS_ASSIGN_ROLES = "users:assign_roles"

    # Roles
    ROLES_READ = "roles:read"
    ROLES_MANAGE = "roles:manage"

    # Audit logs
    AUDIT_LOGS_READ = "audit_logs:read"

    # Datasets
    DATASETS_READ = "datasets:read"
    DATASETS_UPLOAD = "datasets:upload"
    DATASETS_DELETE = "datasets:delete"
    DATASETS_TRANSFORM = "datasets:transform"
    DATASETS_PROFILE = "datasets:profile"

    # Privacy
    PRIVACY_CONFIGURE = "privacy:configure"

    # Audits
    AUDITS_RUN = "audits:run"
    AUDITS_READ = "audits:read"
    AUDITS_DELETE = "audits:delete"

    # Reports
    REPORTS_READ = "reports:read"
    REPORTS_EXPORT = "reports:export"

    # Models
    MODELS_REGISTER = "models:register"
    MODELS_READ = "models:read"
    MODELS_PREDICT = "models:predict"
    MODELS_EXPLAIN = "models:explain"

    # Compliance
    COMPLIANCE_READ = "compliance:read"
    COMPLIANCE_EXPORT = "compliance:export"

    # Recipes
    RECIPES_READ = "recipes:read"
    RECIPES_CREATE = "recipes:create"
    RECIPES_UPDATE = "recipes:update"
    RECIPES_PUBLISH = "recipes:publish"

    # PDC
    PDC_CONFIGURE = "pdc:configure"
    PDC_REQUEST_ARTIFACTS = "pdc:request_artifacts"

    # System
    SYSTEM_READ = "system:read"
    SYSTEM_CONFIGURE = "system:configure"


ALL_PERMISSIONS: list[tuple[str, str]] = [
    (P.USERS_READ, "View user accounts"),
    (P.USERS_CREATE, "Create user accounts"),
    (P.USERS_UPDATE, "Update user accounts"),
    (P.USERS_DISABLE, "Disable user accounts"),
    (P.USERS_APPROVE, "Approve pending registrations"),
    (P.USERS_ASSIGN_ROLES, "Assign roles to users"),
    (P.ROLES_READ, "View roles and permissions"),
    (P.ROLES_MANAGE, "Create and modify roles"),
    (P.AUDIT_LOGS_READ, "Read security and action audit logs"),
    (P.DATASETS_READ, "View dataset metadata"),
    (P.DATASETS_UPLOAD, "Upload datasets"),
    (P.DATASETS_DELETE, "Delete datasets"),
    (P.DATASETS_TRANSFORM, "Transform datasets"),
    (P.DATASETS_PROFILE, "Profile datasets"),
    (P.PRIVACY_CONFIGURE, "Configure privacy / pseudonymisation settings"),
    (P.AUDITS_RUN, "Run assessment audits"),
    (P.AUDITS_READ, "View audit run results"),
    (P.AUDITS_DELETE, "Delete audit runs"),
    (P.REPORTS_READ, "Read reports and dashboards"),
    (P.REPORTS_EXPORT, "Export reports"),
    (P.MODELS_REGISTER, "Register model adapters"),
    (P.MODELS_READ, "View model registry"),
    (P.MODELS_PREDICT, "Run model predictions"),
    (P.MODELS_EXPLAIN, "Run model explanations"),
    (P.COMPLIANCE_READ, "View compliance outputs"),
    (P.COMPLIANCE_EXPORT, "Export compliance artifacts"),
    (P.RECIPES_READ, "View assessment recipes"),
    (P.RECIPES_CREATE, "Create assessment recipes"),
    (P.RECIPES_UPDATE, "Update assessment recipes"),
    (P.RECIPES_PUBLISH, "Publish assessment recipes"),
    (P.PDC_CONFIGURE, "Configure PDC connector"),
    (P.PDC_REQUEST_ARTIFACTS, "Request model artifacts via PDC"),
    (P.SYSTEM_READ, "View system health"),
    (P.SYSTEM_CONFIGURE, "Configure system settings"),
]


ROLE_DEFAULTS: dict[str, list[str]] = {
    "Super Admin": [p for p, _ in ALL_PERMISSIONS],
    "Admin": [
        P.USERS_READ,
        P.USERS_CREATE,
        P.USERS_UPDATE,
        P.USERS_DISABLE,
        P.USERS_APPROVE,
        P.USERS_ASSIGN_ROLES,
        P.ROLES_READ,
        P.ROLES_MANAGE,
        P.AUDIT_LOGS_READ,
        P.DATASETS_READ,
        P.SYSTEM_READ,
        P.SYSTEM_CONFIGURE,
        P.REPORTS_READ,
        P.RECIPES_READ,
        P.COMPLIANCE_READ,
        P.AUDITS_READ,
        P.MODELS_READ,
    ],
    "Project Maintainer": [
        P.DATASETS_READ,
        P.DATASETS_UPLOAD,
        P.DATASETS_TRANSFORM,
        P.DATASETS_PROFILE,
        P.DATASETS_DELETE,
        P.PRIVACY_CONFIGURE,
        P.AUDITS_RUN,
        P.AUDITS_READ,
        P.AUDITS_DELETE,
        P.REPORTS_READ,
        P.REPORTS_EXPORT,
        P.RECIPES_READ,
        P.RECIPES_CREATE,
        P.RECIPES_UPDATE,
        P.RECIPES_PUBLISH,
        P.PDC_CONFIGURE,
        P.MODELS_READ,
        P.MODELS_REGISTER,
        P.COMPLIANCE_READ,
        P.COMPLIANCE_EXPORT,
    ],
    "Auditor": [
        P.DATASETS_READ,
        P.AUDITS_RUN,
        P.AUDITS_READ,
        P.REPORTS_READ,
        P.REPORTS_EXPORT,
        P.COMPLIANCE_READ,
        P.MODELS_READ,
        P.RECIPES_READ,
    ],
    "Data Steward": [
        P.DATASETS_READ,
        P.DATASETS_UPLOAD,
        P.DATASETS_TRANSFORM,
        P.DATASETS_PROFILE,
        P.PRIVACY_CONFIGURE,
        P.AUDITS_RUN,
        P.AUDITS_READ,
        P.REPORTS_READ,
        P.RECIPES_READ,
    ],
    "Model Developer": [
        P.MODELS_REGISTER,
        P.MODELS_READ,
        P.MODELS_PREDICT,
        P.MODELS_EXPLAIN,
        P.DATASETS_READ,
        P.REPORTS_READ,
        P.COMPLIANCE_READ,
    ],
    "Researcher": [
        P.DATASETS_READ,
        P.AUDITS_READ,
        P.REPORTS_READ,
        P.MODELS_READ,
        P.COMPLIANCE_READ,
        P.RECIPES_READ,
    ],
    "Viewer": [
        P.REPORTS_READ,
        P.AUDITS_READ,
        P.DATASETS_READ,
        P.MODELS_READ,
        P.COMPLIANCE_READ,
    ],
    "Developer Contributor": [
        P.RECIPES_READ,
        P.RECIPES_CREATE,
        P.DATASETS_READ,
        P.REPORTS_READ,
        P.MODELS_READ,
    ],
}
