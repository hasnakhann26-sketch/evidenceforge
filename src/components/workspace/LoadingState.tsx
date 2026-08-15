import styles from "./LoadingState.module.css";

const stageDescriptions: Record<string, string> = {
  decomposing: "Breaking your question into testable claims",
  gathering: "Searching peer-reviewed studies, meta-analyses, and reports",
  analyzing: "Assessing each evidence item's relationship to its claim",
  synthesizing: "Weighing evidence and writing the research brief",
};

export function LoadingState({ stage }: { stage: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="var(--neutral-200)"
            strokeWidth="4"
          />
          <path
            d="M24 4a20 20 0 0 1 20 20"
            stroke="var(--primary-600)"
            strokeWidth="4"
            strokeLinecap="round"
            className={styles.spinnerArc}
          />
        </svg>
      </div>
      <div className={styles.text}>
        <h2 className={styles.title}>{stageDescriptions[stage] ?? "Working..."}</h2>
        <p className={styles.subtitle}>
          This usually takes a few moments. The pipeline is running.
        </p>
      </div>

      {/* Skeleton preview */}
      <div className={styles.skeletonGrid}>
        <div className={styles.skeletonSection}>
          <div className={`${styles.skeletonLine} ${styles.skeletonLabel}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonWide}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonMedium}`} />
        </div>
        <div className={styles.skeletonCards}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={`${styles.skeletonLine} ${styles.skeletonNarrow}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonWide}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonMedium}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
