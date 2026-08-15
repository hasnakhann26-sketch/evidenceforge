import type { ResearchBrief, EvidenceItem, Source } from "@/types";
import { Card } from "@/components/ui/Card";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import styles from "./ResearchBriefView.module.css";

interface ResearchBriefProps {
  brief: ResearchBrief;
  evidence: EvidenceItem[];
  sources: Source[];
}

function findEvidence(items: EvidenceItem[], id: string): EvidenceItem | undefined {
  return items.find((e) => e.id === id);
}

export function ResearchBriefView({
  brief,
  evidence,
  sources,
}: ResearchBriefProps) {
  const strongestSupport = findEvidence(evidence, brief.strongestSupportingEvidenceId);
  const strongestContradict = findEvidence(
    evidence,
    brief.strongestContradictingEvidenceId
  );

  return (
    <div className={styles.container}>
      {/* Executive finding */}
      <Card elevated className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </span>
          <h2 className={styles.sectionTitle}>Executive Finding</h2>
        </div>
        <p className={styles.executiveFinding}>{brief.executiveFinding}</p>
      </Card>

      {/* Strongest evidence */}
      <div className={styles.twoCol}>
        {strongestSupport && (
          <div className={styles.evidenceCol}>
            <div className={styles.colHeader}>
              <span className={`${styles.colIndicator} ${styles.support}`} />
              <h3 className={styles.colTitle}>Strongest Supporting Evidence</h3>
            </div>
            <EvidenceCard evidence={strongestSupport} highlighted />
          </div>
        )}
        {strongestContradict && (
          <div className={styles.evidenceCol}>
            <div className={styles.colHeader}>
              <span className={`${styles.colIndicator} ${styles.contradict}`} />
              <h3 className={styles.colTitle}>Strongest Contradicting Evidence</h3>
            </div>
            <EvidenceCard evidence={strongestContradict} highlighted />
          </div>
        )}
      </div>

      {/* Uncertainties & Limitations */}
      <div className={styles.twoCol}>
        <Card className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </span>
            <h2 className={styles.sectionTitle}>Uncertainties & Limitations</h2>
          </div>
          <ul className={styles.list}>
            {brief.uncertainties.map((item, i) => (
              <li key={`u-${i}`} className={styles.listItem}>
                {item}
              </li>
            ))}
            {brief.limitations.map((item, i) => (
              <li key={`l-${i}`} className={`${styles.listItem} ${styles.limitation}`}>
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
              </svg>
            </span>
            <h2 className={styles.sectionTitle}>Open Questions</h2>
          </div>
          <ul className={styles.list}>
            {brief.openQuestions.map((item, i) => (
              <li key={`q-${i}`} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Sources */}
      <Card className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </span>
          <h2 className={styles.sectionTitle}>Sources ({sources.length})</h2>
        </div>
        <div className={styles.sourcesGrid}>
          {sources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              className={styles.sourceItem}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.sourceTitle}>{source.title}</span>
              <span className={styles.sourceMeta}>
                {source.authors.length > 0
                  ? source.authors[0] + (source.authors.length > 1 ? " et al." : "")
                  : "Unknown"}{" "}
                · {source.publication}
              </span>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
