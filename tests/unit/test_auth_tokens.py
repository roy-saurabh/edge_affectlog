"""Tests for token generation, hashing, and expiry."""

from datetime import UTC, datetime, timedelta

from affectlog.auth.tokens import (
    activation_expiry,
    generate_token,
    hash_token,
    is_expired,
    password_reset_expiry,
)


def test_generate_token_returns_plain_and_hash():
    plain, digest = generate_token()
    assert len(plain) > 20
    assert len(digest) == 64  # SHA-256 hex


def test_generate_token_unique():
    plain1, _ = generate_token()
    plain2, _ = generate_token()
    assert plain1 != plain2


def test_hash_token_deterministic():
    plain, _ = generate_token()
    assert hash_token(plain) == hash_token(plain)


def test_hash_matches_generate():
    plain, digest = generate_token()
    assert hash_token(plain) == digest


def test_is_expired_past():
    past = datetime.now(UTC) - timedelta(seconds=1)
    assert is_expired(past) is True


def test_is_expired_future():
    future = datetime.now(UTC) + timedelta(hours=1)
    assert is_expired(future) is False


def test_activation_expiry_in_future():
    expiry = activation_expiry()
    assert expiry > datetime.now(UTC)


def test_password_reset_expiry_shorter_than_activation():
    activation = activation_expiry()
    reset = password_reset_expiry()
    assert reset < activation
