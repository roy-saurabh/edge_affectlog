"""Tests for RBAC permission constants and role defaults."""

from affectlog.auth.permissions import ALL_PERMISSIONS, ROLE_DEFAULTS, P


def test_all_permissions_have_names_and_descriptions():
    for name, desc in ALL_PERMISSIONS:
        assert ":" in name, f"Permission name should be namespaced: {name}"
        assert len(desc) > 5


def test_all_permissions_referenced_in_p_class():
    p_attrs = {v for k, v in vars(P).items() if not k.startswith("_")}
    all_names = {name for name, _ in ALL_PERMISSIONS}
    assert p_attrs == all_names, "P class attrs must match ALL_PERMISSIONS names"


def test_super_admin_has_all_permissions():
    super_admin_perms = set(ROLE_DEFAULTS["Super Admin"])
    all_names = {name for name, _ in ALL_PERMISSIONS}
    assert super_admin_perms == all_names


def test_admin_has_approve_permission():
    assert P.USERS_APPROVE in ROLE_DEFAULTS["Admin"]


def test_viewer_cannot_upload():
    assert P.DATASETS_UPLOAD not in ROLE_DEFAULTS["Viewer"]


def test_data_steward_can_upload_but_not_manage_users():
    ds = ROLE_DEFAULTS["Data Steward"]
    assert P.DATASETS_UPLOAD in ds
    assert P.USERS_APPROVE not in ds
    assert P.USERS_DISABLE not in ds


def test_auditor_can_run_audits():
    assert P.AUDITS_RUN in ROLE_DEFAULTS["Auditor"]


def test_model_developer_can_register_models():
    assert P.MODELS_REGISTER in ROLE_DEFAULTS["Model Developer"]


def test_developer_contributor_has_no_production_dataset_access():
    dc = ROLE_DEFAULTS["Developer Contributor"]
    assert P.DATASETS_UPLOAD not in dc
    assert P.PRIVACY_CONFIGURE not in dc
