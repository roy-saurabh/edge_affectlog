import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import { ROUTE_BY_ID, getRoute } from "../../routing/routes";
import { EXTERNAL_LINKS, getExternalLink, type ExternalLinkId } from "../../links/externalLinks";
import { cn } from "../cn";

interface InternalLinkProps {
  routeId: string;
  params?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  disabledReason?: string;
}

interface ExternalLinkProps {
  externalId: ExternalLinkId;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  onClick?: () => void;
}

// ── Internal app link ─────────────────────────────────────────────────────
export function AppLink({
  routeId,
  params = {},
  children,
  className,
  onClick,
  disabled,
  disabledReason,
}: InternalLinkProps) {
  const route = getRoute(routeId);

  let path = route.path;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, value);
  }

  if (disabled) {
    return (
      <span
        className={cn("cursor-not-allowed opacity-50", className)}
        title={disabledReason}
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  return (
    <Link to={path} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

// ── External link ─────────────────────────────────────────────────────────
export function ExtLink({
  externalId,
  children,
  className,
  showIcon = true,
  onClick,
}: ExternalLinkProps) {
  const link = getExternalLink(externalId);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`${link.label} (opens in new tab)`}
      onClick={onClick}
    >
      {children}
      {showIcon && <ExternalLinkIcon size={10} className="opacity-40 flex-shrink-0" />}
    </a>
  );
}

export { ROUTE_BY_ID, EXTERNAL_LINKS };
