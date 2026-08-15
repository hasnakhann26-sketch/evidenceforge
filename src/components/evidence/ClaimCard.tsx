import type { Claim } from "@/types";
import { Card } from "@/components/ui/Card";
import { ConfidenceIndicator } from "@/components/ui/ConfidenceIndicator";
import styles from "./ClaimCard.module.css";

interface ClaimCardProps {
  claim: Claim;
  onClick?: () => void;
  active?: boolean;
}

export function ClaimCard({ claim, onClick, active = false }: ClaimCardProps) {
  return (
    <Card
      elevated
      className={`${styles.card} ${active ? styles.active : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.header}>
        <span className={styles.index}>Claim</span>
        <ConfidenceIndicator level={claim.confidence} size="sm" />
      </div>

      <p className={styles.text}>{claim.text}</p>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{claim.evidenceCount}</span>
          <span className={styles.statLabel}>Evidence</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.supporting}`}>
            {claim.supportingCount}
          </span>
          <span className={styles.statLabel}>Support</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.contradicting}`}>
            {claim.contradictingCount}
          </span>
          <span className={styles.statLabel}>Contradict</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.mixed}`}>
            {claim.mixedCount}
          </span>
          <span className={styles.statLabel}>Mixed</span>
        </div>
      </div>
    </Card>
  );
}
