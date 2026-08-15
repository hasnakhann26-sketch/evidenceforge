import type { EvidenceItem } from "@/types";
import { Card } from "@/components/ui/Card";
import { StanceBadge, Badge } from "@/components/ui/Badge";
import { ConfidenceIndicator } from "@/components/ui/ConfidenceIndicator";
import styles from "./EvidenceCard.module.css";

const sourceTypeLabels: Record<EvidenceItem["source"]["type"], string> = {
  "peer-reviewed": "Peer-reviewed",
  preprint: "Preprint",
  report: "Report",
  "meta-analysis": "Meta-analysis",
  "systematic-review": "Systematic review",
  "working-paper": "Working paper",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface EvidenceCardProps {
  evidence: EvidenceItem;
  highlighted?: boolean;
}

export function EvidenceCard({ evidence, highlighted = false }: EvidenceCardProps) {
  const { source, stance } = evidence;

  return (
    <Card
      elevated
      className={`${styles.card} ${styles[stance]} ${highlighted ? styles.highlighted : ""}`}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <StanceBadge stance={stance} />
          <Badge variant="source-type">{sourceTypeLabels[source.type]}</Badge>
        </div>
        <ConfidenceIndicator level={evidence.confidence} size="sm" />
      </div>

      <h3 className={styles.title}>{evidence.title}</h3>

      <div className={styles.meta}>
        <span className={styles.authors}>
          {source.authors.length > 0
            ? source.authors.join(", ")
            : "Unknown author"}
        </span>
        <span className={styles.separator}>·</span>
        <span className={styles.publication}>{source.publication}</span>
        <span className={styles.separator}>·</span>
        <span className={styles.date}>{formatDate(evidence.publicationDate)}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.summary}>{evidence.summary}</p>
        <blockquote className={styles.excerpt}>
          <span className={styles.excerptMark} aria-hidden="true">
            “
          </span>
          {evidence.excerpt}
        </blockquote>
      </div>

      <div className={styles.footer}>
        <div className={styles.relevance}>
          <span className={styles.relevanceLabel}>Relevance</span>
          <div className={styles.relevanceBar}>
            <div
              className={styles.relevanceFill}
              style={{ width: `${evidence.relevanceScore * 100}%` }}
            />
          </div>
          <span className={styles.relevanceValue}>
            {Math.round(evidence.relevanceScore * 100)}%
          </span>
        </div>
        <a
          href={source.url}
          className={styles.sourceLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View source: ${source.title}`}
        >
          View source
        </a>
      </div>
    </Card>
  );
}
