import React from "react";
import { Cpu, Code2, ExternalLink, CheckCircle2 } from "lucide-react";

const ADAPTERS = [
  {
    name: "sklearn",
    label: "scikit-learn",
    desc: "joblib/pickle serialised models. Supports classifiers, regressors, and pipelines.",
    status: "supported",
    example: `POST /v1/models/register\n{\n  "adapter": "sklearn",\n  "path": "models/rf_classifier.pkl"\n}`,
  },
  {
    name: "onnx",
    label: "ONNX Runtime",
    desc: "Cross-platform inference via onnxruntime. Framework-agnostic model format.",
    status: "supported",
    example: `POST /v1/models/register\n{\n  "adapter": "onnx",\n  "path": "models/model.onnx"\n}`,
  },
  {
    name: "torch",
    label: "PyTorch",
    desc: "TorchScript (.pt) and state-dict models. Requires torch in the environment.",
    status: "supported",
    example: `POST /v1/models/register\n{\n  "adapter": "torch",\n  "path": "models/model.pt"\n}`,
  },
  {
    name: "tensorflow",
    label: "TensorFlow / Keras",
    desc: "SavedModel format and .h5 Keras models. Requires tensorflow in the environment.",
    status: "supported",
    example: `POST /v1/models/register\n{\n  "adapter": "tensorflow",\n  "path": "models/saved_model/"\n}`,
  },
  {
    name: "http",
    label: "HTTP Model Service",
    desc: "Wraps any REST prediction endpoint. Useful for black-box or remote models.",
    status: "supported",
    example: `POST /v1/models/register\n{\n  "adapter": "http",\n  "url": "http://model-service:9090/predict"\n}`,
  },
  {
    name: "dummy",
    label: "Dummy / Test",
    desc: "Returns constant predictions. Used for integration testing and CI.",
    status: "test only",
    example: `POST /v1/models/register\n{\n  "adapter": "dummy"\n}`,
  },
];

const EXPLAIN_METHODS = [
  { name: "Feature Importance", desc: "Aggregated feature scores from model internals (coefficients, tree splits)" },
  { name: "Permutation Importance", desc: "Model-agnostic: measures accuracy drop when each feature is shuffled" },
  { name: "SHAP", desc: "Shapley-based explanations (requires affectlog[shap]). Global and local support" },
  { name: "Multi-model Comparison", desc: "Side-by-side performance and explanation comparison across registered models" },
];

export default function Models() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Model Adapters</h1>
        <p className="text-slate-400 text-sm">
          Register ML models to enable predictions, feature importance, SHAP explanations, and model cards.
        </p>
      </div>

      {/* Quick links */}
      <div className="flex gap-3">
        <a href="/api/docs#tag/Models" target="_blank" rel="noopener" className="btn-secondary">
          <ExternalLink size={14} /> Swagger UI → /v1/models
        </a>
        <a href="/openapi.json" target="_blank" rel="noopener" className="btn-ghost">
          <Code2 size={14} /> OpenAPI Spec
        </a>
      </div>

      {/* Adapters grid */}
      <div>
        <h2 className="section-title">Supported Adapters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ADAPTERS.map((a) => (
            <div key={a.name} className="card space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-indigo-900/50 border border-indigo-700/30 flex items-center justify-center">
                    <Cpu size={14} className="text-indigo-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100 text-sm">{a.label}</div>
                    <code className="text-xs text-slate-600">{a.name}</code>
                  </div>
                </div>
                <span className={a.status === "supported" ? "badge-ok" : "badge-info"}>
                  {a.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{a.desc}</p>
              <pre className="text-xs text-slate-500 font-mono bg-slate-900/70 rounded-lg p-3 leading-relaxed overflow-auto">
                {a.example}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Explainability methods */}
      <div>
        <h2 className="section-title">Explainability Methods</h2>
        <div className="card space-y-3">
          {EXPLAIN_METHODS.map((m) => (
            <div key={m.name} className="flex items-start gap-3 py-2 border-b border-slate-700/50 last:border-0">
              <CheckCircle2 size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-slate-200">{m.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API usage */}
      <div>
        <h2 className="section-title">API Usage</h2>
        <div className="card">
          <pre className="text-xs text-slate-400 font-mono leading-relaxed overflow-auto">
{`# Register a sklearn model
curl -X POST https://tai.affectlog.com/v1/models/register \\
  -H "Content-Type: application/json" \\
  -d '{"adapter": "sklearn", "path": "models/rf.pkl", "name": "random_forest_v1"}'

# Get predictions
curl -X POST https://tai.affectlog.com/v1/models/{model_id}/predict \\
  -H "Content-Type: application/json" \\
  -d '{"features": [[1.0, 2.0, 3.0, 4.0]]}'

# Get feature importance
curl https://tai.affectlog.com/v1/explanations/{model_id}/feature-importance

# Get SHAP values (requires affectlog[shap])
curl https://tai.affectlog.com/v1/explanations/{model_id}/shap \\
  -d '{"features": [[1.0, 2.0, 3.0, 4.0]]}'`}
          </pre>
        </div>
      </div>
    </div>
  );
}
