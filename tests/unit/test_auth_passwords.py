"""Tests for password hashing and verification."""

from affectlog.auth.password import hash_password, needs_rehash, verify_password


def test_hash_is_not_plaintext():
    pw = "correct-horse-battery-staple-2024!"
    hashed = hash_password(pw)
    assert hashed != pw
    assert len(hashed) > 30


def test_verify_correct_password():
    pw = "correct-horse-battery-staple-2024!"
    hashed = hash_password(pw)
    assert verify_password(pw, hashed) is True


def test_verify_wrong_password():
    hashed = hash_password("correct-horse-battery-staple-2024!")
    assert verify_password("wrong-password-9999", hashed) is False


def test_needs_rehash_returns_bool():
    hashed = hash_password("correct-horse-battery-staple-2024!")
    result = needs_rehash(hashed)
    assert isinstance(result, bool)


def test_different_passwords_different_hashes():
    h1 = hash_password("password-alpha-1234!")
    h2 = hash_password("password-beta-9876!")
    assert h1 != h2


def test_same_password_different_hashes_due_to_salt():
    pw = "salted-password-12345!"
    h1 = hash_password(pw)
    h2 = hash_password(pw)
    assert h1 != h2
    assert verify_password(pw, h1)
    assert verify_password(pw, h2)
