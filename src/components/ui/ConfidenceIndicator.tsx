import type { ConfidenceLevel } from "@/types";
import styles from "./ConfidenceIndicator.module.css";

interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  showLabel?: boolean;
  size?: "sm" | "md";
}

const config: Record<
  ConfidenceLevel,
  { label: string; bars: number; color: string }
> = {
  high: { label: "High", bars: 4, color: "var(--success-500)" },
  moderate: { label: "Moderate", bars: 3, color: "var(--secondary-500)" },
  low: { label: "Low", bars: 2, color: "var(--warning-500)" },
  "very-low": { label: "Very low", bars: 1, color: "var(--error-500)" },
};

export function ConfidenceIndicator({
  level,
  showLabel = true,
  size = "md",
}: ConfidenceIndicatorProps) {
  const { label, bars, color } = config[level];

  return (
    <div
      className={`${styles.container} ${styles[size]}`}
      role="img"
      aria-label={`Confidence: ${label}`}
    >
      <div className={styles.bars}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={styles.bar}
            style={{
              backgroundColor: i <= bars ? color : "var(--neutral-200)",
            }}
          />
        ))}
      </div>
      {showLabel && <span className={styles.label}>{label} confidence</span>}
    </div>
  );
}
