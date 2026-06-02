"""
AffectLog edition and feature-gate system.

Editions:
  community  — self-hosted, open-source, single-tenant by default
  managed    — AffectLog-operated SaaS, multi-tenant

Feature flags are resolved from:
  1. Deployment mode (AFFECTLOG_EDITION env var)
  2. Tenant-level overrides (managed mode)
  3. Platform-admin overrides
"""

from affectlog.editions.features import COMMUNITY_DEFAULTS, MANAGED_DEFAULTS, Feature
from affectlog.editions.gates import FeatureGate, requires_feature

__all__ = [
    "Feature",
    "COMMUNITY_DEFAULTS",
    "MANAGED_DEFAULTS",
    "requires_feature",
    "FeatureGate",
]
