import type { ReactNode } from "react";
import type { ConfidenceLevel, EvidenceStance } from "@/types";
import styles from "./Badge.module.css";

type BadgeVariant =
  | "supporting"
  | "contradicting"
  | "mixed"
  | "neutral"
  | "high"
  | "moderate"
  | "low"
  | "very-low"
  | "source-type";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
}

export function StanceBadge({ stance }: { stance: EvidenceStance }) {
  const labels: Record<EvidenceStance, string> = {
    supporting: "Supporting",
    contradicting: "Contradicting",
    mixed: "Mixed",
  };
  return <Badge variant={stance}>{labels[stance]}</Badge>;
}

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const labels: Record<ConfidenceLevel, string> = {
    high: "High confidence",
    moderate: "Moderate confidence",
    low: "Low confidence",
    "very-low": "Very low confidence",
  };
  return <Badge variant={level}>{labels[level]}</Badge>;
}
