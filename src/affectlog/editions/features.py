"""
Feature flag definitions for AffectLog editions.

Each Feature is a string constant used as a key throughout the system.
Boolean defaults are defined per edition below.
"""

from __future__ import annotations


class Feature:
    """Feature flag name constants."""

    # Multi-tenancy
    MULTI_TENANT = "multi_tenant"
    MANAGED_ONBOARDING = "managed_onboarding"
    CUSTOM_DOMAIN = "custom_domain"
    TENANT_SMTP = "tenant_smtp"

    # Operations
    MANAGED_BACKUPS = "managed_backups"
    ADVANCED_OBSERVABILITY = "advanced_observability"
    SUPPORT_ACCESS = "support_access"

    # Connectors
    PRIVATE_CONNECTORS = "private_connectors"
    MANAGED_PDC = "managed_pdc"

    # Enterprise
    ENTERPRISE_SSO = "enterprise_sso"
    AUDIT_RETENTION_POLICIES = "audit_retention_policies"

    # Billing
    BILLING = "billing"

    # Data
    RAW_EXPORT_EXCEPTION = "raw_export_exception_workflow"
    DEDICATED_WORKER_POOL = "dedicated_worker_pool"


# Community Edition defaults — all core workflow features ON,
# managed-service features OFF.
COMMUNITY_DEFAULTS: dict[str, bool] = {
    Feature.MULTI_TENANT: False,
    Feature.MANAGED_ONBOARDING: False,
    Feature.CUSTOM_DOMAIN: False,
    Feature.TENANT_SMTP: False,
    Feature.MANAGED_BACKUPS: False,
    Feature.ADVANCED_OBSERVABILITY: False,
    Feature.SUPPORT_ACCESS: False,
    Feature.PRIVATE_CONNECTORS: False,
    Feature.MANAGED_PDC: False,
    Feature.ENTERPRISE_SSO: False,
    Feature.AUDIT_RETENTION_POLICIES: False,
    Feature.BILLING: False,
    Feature.RAW_EXPORT_EXCEPTION: False,
    Feature.DEDICATED_WORKER_POOL: False,
}

# Managed Edition defaults — managed-service features ON by default.
MANAGED_DEFAULTS: dict[str, bool] = {
    Feature.MULTI_TENANT: True,
    Feature.MANAGED_ONBOARDING: True,
    Feature.CUSTOM_DOMAIN: True,
    Feature.TENANT_SMTP: True,
    Feature.MANAGED_BACKUPS: True,
    Feature.ADVANCED_OBSERVABILITY: True,
    Feature.SUPPORT_ACCESS: True,
    Feature.PRIVATE_CONNECTORS: False,  # opt-in per tenant
    Feature.MANAGED_PDC: False,  # opt-in per tenant
    Feature.ENTERPRISE_SSO: False,  # opt-in per tenant
    Feature.AUDIT_RETENTION_POLICIES: True,
    Feature.BILLING: False,  # billing placeholder not active
    Feature.RAW_EXPORT_EXCEPTION: True,
    Feature.DEDICATED_WORKER_POOL: False,  # opt-in per tenant
}
