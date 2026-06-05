/** Route alias redirects — old path → canonical route id */
export const ROUTE_REDIRECTS: Record<string, string> = {
  "/cloud-managed":      "/cloud",
  "/managed":            "/cloud",
  "/open-source":        "/community",
  "/community-edition":  "/community",
  "/api":                "/openapi",
  "/assessment":         "/guided-assessment",
  "/audit":              "/dataset-audit",
  "/contact":            "/request-access",
};
