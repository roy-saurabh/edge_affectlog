"""
Rate limiting using slowapi (limits library).

Limits are configurable via settings and applied per-IP.
"""

from __future__ import annotations

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])
