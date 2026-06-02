"""
Tests for CARiSMA and LOLA interoperability metadata exchange.
Validates schemas, export construction, and import parsing.
"""

from affectlog.interoperability.carisma import (
    CARISMA_EXCHANGE_SCHEMA,
    CARISMA_SCHEMA_VERSION,
    build_carisma_export,
    parse_carisma_report,
)
from affectlog.interoperability.lola import (
    LOLA_EXCHANGE_SCHEMA,
    LOLA_SCHEMA_VERSION,
    SHARED_METRICS_VOCABULARY,
    build_lola_export,
    parse_lola_results,
)

SAMPLE_AUDIT = {
    "run_id": "run-test-001",
    "dataset_id": "ds-test-001",
    "privacy_report": {
        "overall_risk": "low",
        "pii_field_count": 2,
        "pseudonymization_applied": True,
    },
    "metrics": {
        "completeness_score": 0.97,
        "quality_score": 0.91,
        "fairness_flags": ["long_tail_imbalance"],
        "gini_coefficient": 0.42,
        "dominance_ratio": 0.15,
        "coverage_at_k": 0.78,
        "entropy": 3.2,
        "sparsity": 0.85,
    },
    "schema_profile": {"row_count": 50000, "entity_count": 1200, "resource_count": 340},
    "gdpr_articles": ["Art.5", "Art.25"],
    "ai_act_relevant": True,
}


class TestCARiSMAExchange:
    def test_schema_has_required_fields(self):
        assert "schemaVersion" in CARISMA_EXCHANGE_SCHEMA["properties"]
        assert "auditSummary" in CARISMA_EXCHANGE_SCHEMA["properties"]
        assert CARISMA_EXCHANGE_SCHEMA["$schema"] == "https://json-schema.org/draft/2020-12/schema"

    def test_schema_version_constant(self):
        assert CARISMA_SCHEMA_VERSION == "1.0"

    def test_build_export_returns_dict(self):
        export = build_carisma_export(SAMPLE_AUDIT)
        assert isinstance(export, dict)

    def test_export_has_schema_version(self):
        export = build_carisma_export(SAMPLE_AUDIT)
        assert export["schemaVersion"] == CARISMA_SCHEMA_VERSION

    def test_export_contains_audit_summary(self):
        export = build_carisma_export(SAMPLE_AUDIT)
        summary = export["auditSummary"]
        assert summary["privacyRiskLevel"] == "low"
        assert summary["piiFieldsDetected"] == 2
        assert summary["pseudonymisationApplied"] is True

    def test_export_contains_concentration_metrics(self):
        export = build_carisma_export(SAMPLE_AUDIT)
        metrics = export["concentrationMetrics"]
        assert abs(metrics["giniCoefficient"] - 0.42) < 0.001

    def test_export_compliance_mappings(self):
        export = build_carisma_export(SAMPLE_AUDIT)
        assert "Art.5" in export["complianceMappings"]["gdprArticlesTriggered"]
        assert export["complianceMappings"]["aiActAnnexIVRelevant"] is True

    def test_parse_carisma_report(self):
        report = {
            "riskCategories": ["data_privacy", "model_bias"],
            "complianceFindings": ["GDPR Art.22 applicable"],
            "securityFindings": [],
        }
        parsed = parse_carisma_report(report)
        assert parsed["source"] == "carisma"
        assert "data_privacy" in parsed["riskCategories"]

    def test_carisma_export_is_not_replacement_for_carisma(self):
        """Export format explicitly notes it does not execute CARiSMA."""
        export = build_carisma_export(SAMPLE_AUDIT)
        assert "carismaAnnotations" in export
        assert export["exportType"] == "dataset_audit"


class TestLOLAExchange:
    def test_schema_has_required_fields(self):
        assert "metrics" in LOLA_EXCHANGE_SCHEMA["properties"]
        assert "schemaVersion" in LOLA_EXCHANGE_SCHEMA["properties"]

    def test_schema_version(self):
        assert LOLA_SCHEMA_VERSION == "1.0"

    def test_shared_metrics_vocabulary_non_empty(self):
        assert len(SHARED_METRICS_VOCABULARY) > 5

    def test_shared_vocabulary_has_gini(self):
        assert "gini_coefficient" in SHARED_METRICS_VOCABULARY

    def test_shared_vocabulary_has_coverage(self):
        assert "coverage_at_k" in SHARED_METRICS_VOCABULARY

    def test_build_lola_export(self):
        audit = {
            **SAMPLE_AUDIT,
            "coverage_metrics": {"coverage_at_k": 0.78},
            "concentration_metrics": {"gini": 0.42},
            "temporal_span_days": 180,
        }
        export = build_lola_export(audit, lola_scenario_id="scenario-001")
        assert export["schemaVersion"] == LOLA_SCHEMA_VERSION
        assert export["scenarioId"] == "scenario-001"
        assert "gini_coefficient" in export["metrics"]
        assert "entropy" in export["metrics"]

    def test_parse_lola_results(self):
        results = {
            "scenarioId": "sc-001",
            "algorithmId": "algo-knn",
            "metrics": {
                "coverage_at_k": 0.72,
                "ndcg": 0.61,
                "unknown_metric": 0.5,
            },
        }
        parsed = parse_lola_results(results)
        assert parsed["source"] == "lola"
        assert "coverage_at_k" in parsed["metrics"]
        assert "ndcg" in parsed["metrics"]
        assert "unknown_metric" not in parsed["metrics"]
