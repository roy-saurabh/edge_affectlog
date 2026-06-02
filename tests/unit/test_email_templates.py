"""Tests that email templates render without errors."""

from pathlib import Path

import pytest
from jinja2 import Environment, FileSystemLoader, select_autoescape

TEMPLATES_DIR = Path(__file__).parent.parent.parent / "src/affectlog/templates/email"

REQUIRED_TEMPLATES = [
    "registration_received",
    "registration_approved_activation",
    "registration_rejected",
    "password_reset",
    "admin_new_registration_notification",
    "security_alert",
    "request_more_information",
]

SAMPLE_CONTEXTS = {
    "registration_received": {"full_name": "Test User", "app_base_url": "http://localhost:3000"},
    "registration_approved_activation": {
        "full_name": "Test User",
        "email": "test@example.org",
        "role": "Viewer",
        "activation_url": "http://localhost:3000/activate?token=abc123",
        "app_base_url": "http://localhost:3000",
    },
    "registration_rejected": {
        "full_name": "Test User",
        "reason": None,
        "app_base_url": "http://localhost:3000",
    },
    "password_reset": {
        "full_name": "Test User",
        "reset_url": "http://localhost:3000/reset-password?token=xyz",
        "app_base_url": "http://localhost:3000",
    },
    "admin_new_registration_notification": {
        "registrant_name": "Test User",
        "registrant_email": "test@example.org",
        "admin_url": "http://localhost:3000/admin/pending-registrations",
        "app_base_url": "http://localhost:3000",
    },
    "security_alert": {
        "full_name": "Test User",
        "alert_type": "Failed login attempt",
        "alert_detail": "3 failed logins from IP 1.2.3.4",
        "app_base_url": "http://localhost:3000",
    },
    "request_more_information": {
        "full_name": "Test User",
        "questions": "Please describe your intended dataset.",
        "app_base_url": "http://localhost:3000",
    },
}


@pytest.fixture(scope="module")
def jinja_env():
    return Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        autoescape=select_autoescape(["html"]),
    )


@pytest.mark.parametrize("template_name", REQUIRED_TEMPLATES)
def test_html_template_renders(template_name, jinja_env):
    template = jinja_env.get_template(f"{template_name}.html")
    html = template.render(**SAMPLE_CONTEXTS[template_name])
    assert len(html) > 100
    assert "AffectLog" in html or "affectlog" in html.lower()


def test_activation_email_contains_link(jinja_env):
    template = jinja_env.get_template("registration_approved_activation.html")
    html = template.render(**SAMPLE_CONTEXTS["registration_approved_activation"])
    assert "activate?token=abc123" in html


def test_password_reset_email_contains_link(jinja_env):
    template = jinja_env.get_template("password_reset.html")
    html = template.render(**SAMPLE_CONTEXTS["password_reset"])
    assert "reset-password?token=xyz" in html


def test_no_forbidden_terms_in_public_templates(jinja_env):
    """Homepage-facing templates must not mention internal deliverable references."""
    forbidden = ["D3.7", "TRL", "reporting period"]
    public_templates = ["registration_received", "registration_approved_activation"]
    for tname in public_templates:
        template = jinja_env.get_template(f"{tname}.html")
        html = template.render(**SAMPLE_CONTEXTS[tname])
        for term in forbidden:
            assert term not in html, f"Template {tname} contains forbidden term: {term}"
