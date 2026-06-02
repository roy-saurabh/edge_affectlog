"""
Edition-aware configuration resolution.

Reads AFFECTLOG_EDITION from environment (community | managed | enterprise_private).
Provides get_feature() to resolve whether a feature is active, merging:
  edition defaults → platform-level override (future) → tenant-level override.
"""

from __future__ import annotations

import os
from typing import Literal

from affectlog.editions.features import COMMUNITY_DEFAULTS, MANAGED_DEFAULTS

DeploymentMode = Literal["community", "managed", "enterprise_private"]
TenantMode = Literal["single_tenant", "multi_tenant"]


def get_deployment_mode() -> DeploymentMode:
    raw = os.getenv("AFFECTLOG_EDITION", "community").lower().strip()
    if raw in ("managed", "managed_cloud", "cloud"):
        return "managed"
    if raw in ("enterprise_private", "enterprise"):
        return "enterprise_private"
    return "community"


def get_tenant_mode() -> TenantMode:
    mode = get_deployment_mode()
    if mode in ("managed", "enterprise_private"):
        return "multi_tenant"
    # Community Edition can also be configured multi-tenant
    if os.getenv("AFFECTLOG_MULTI_TENANT", "").lower() in ("1", "true", "yes"):
        return "multi_tenant"
    return "single_tenant"


def get_edition_defaults() -> dict[str, bool]:
    mode = get_deployment_mode()
    if mode == "community":
        return dict(COMMUNITY_DEFAULTS)
    return dict(MANAGED_DEFAULTS)


def get_feature(feature: str, tenant_overrides: dict[str, bool] | None = None) -> bool:
    """
    Resolve whether a feature is active.

    Resolution order (highest precedence wins):
      1. Tenant-level override (if provided)
      2. Edition defaults
    """
    defaults = get_edition_defaults()
    value = defaults.get(feature, False)
    if tenant_overrides:
        value = tenant_overrides.get(feature, value)
    return value
