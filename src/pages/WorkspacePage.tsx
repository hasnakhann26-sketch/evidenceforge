import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { ConfidenceIndicator } from "@/components/ui/ConfidenceIndicator";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import { ClaimCard } from "@/components/evidence/ClaimCard";
import { ResearchBriefView } from "@/components/evidence/ResearchBriefView";
import { LoadingState } from "@/components/workspace/LoadingState";
import { ErrorState } from "@/components/workspace/ErrorState";
import { useInvestigation } from "@/hooks/useInvestigation";
import styles from "./WorkspacePage.module.css";

export function WorkspacePage() {
  const navigate = useNavigate();
  const {
    investigation,
    status,
    question,
    investigate,
    loadDemo,
    reset,
  } = useInvestigation();

  const [inputValue, setInputValue] = useState("");
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);

  const isLoading = useMemo(
    () =>
      status === "decomposing" ||
      status === "gathering" ||
      status === "analyzing" ||
      status === "synthesizing",
    [status]
  );

  const sources = useMemo(() => {
    if (!investigation?.brief) return [];
    const sourceMap = new Map();
    investigation.evidence.forEach((e) => {
      if (investigation.brief!.sourceIds.includes(e.source.id)) {
        sourceMap.set(e.source.id, e.source);
      }
    });
    return Array.from(sourceMap.values());
  }, [investigation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setActiveClaimId(null);
      investigate(inputValue);
    }
  };

  const handleNewInvestigation = () => {
    reset();
    setInputValue("");
    setActiveClaimId(null);
  };

  return (
    <div className={styles.page}>
      <Header
        rightContent={
          investigation ? (
            <Button size="sm" variant="outline" onClick={handleNewInvestigation}>
              New Investigation
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => navigate("/")}>
              Home
            </Button>
          )
        }
      />

      {/* Question input bar */}
      <section className={styles.inputBar}>
        <form className={styles.inputForm} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter a research question to investigate..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              aria-label="Research question"
              autoFocus
            />
          </div>
          <Button type="submit" size="md" disabled={!inputValue.trim() || isLoading}>
            {isLoading ? "Investigating..." : "Investigate"}
          </Button>
        </form>
      </section>

      {/* Content area */}
      <main className={styles.main}>
        {/* EMPTY STATE */}
        {status === "idle" && !investigation && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <h2 className={styles.emptyTitle}>
              Enter a research question to begin
            </h2>
            <p className={styles.emptyDescription}>
              EvidenceForge will decompose your question into claims, gather
              evidence, analyze it for support and contradiction, and produce a
              structured research brief.
            </p>
            <div className={styles.emptyExamples}>
              <span className={styles.emptyExamplesLabel}>
                Try a question like:
              </span>
              {[
                "Does remote work improve or reduce employee productivity?",
                "Is carbon capture technology effective at scale?",
                "What is the impact of minimum wage increases on employment?",
              ].map((q) => (
                <button
                  key={q}
                  className={styles.exampleChip}
                  onClick={() => {
                    setInputValue(q);
                    investigate(q);
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className={styles.demoDivider}>
              <span className={styles.demoDividerText}>or</span>
            </div>
            <Button variant="outline" onClick={loadDemo}>
              Load demo investigation
            </Button>
          </div>
        )}

        {/* LOADING STATE */}
        {isLoading && <LoadingState stage={status} />}

        {/* ERROR STATE */}
        {status === "error" && (
          <ErrorState message={undefined} onRetry={() => investigate(question)} />
        )}

        {/* POPULATED STATE */}
        {status === "complete" && investigation && (
          <div className={styles.results}>
            {investigation.isDemo && (
              <div className={styles.demoBanner}>
                <span className={styles.demoBadge}>Demo Data</span>
                <span className={styles.demoText}>
                  This investigation uses synthetic demo data for illustration.
                  No real research findings or citations are represented.
                </span>
              </div>
            )}

            {/* Research Question */}
            <section className={styles.questionSection}>
              <span className={styles.sectionLabel}>Research Question</span>
              <h1 className={styles.questionText}>{investigation.question}</h1>
              <div className={styles.questionMeta}>
                <ConfidenceIndicator level={investigation.confidence} />
                <span className={styles.metaSeparator}>·</span>
                <span className={styles.metaText}>
                  {investigation.claims.length} claims ·{" "}
                  {investigation.evidence.length} evidence items
                </span>
              </div>
            </section>

            {/* Claims */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Claims</h2>
                <span className={styles.sectionCount}>
                  {investigation.claims.length}
                </span>
              </div>
              <p className={styles.sectionDescription}>
                Your question decomposed into testable propositions.
              </p>
              <div className={styles.claimsGrid}>
                {investigation.claims.map((claim) => (
                  <ClaimCard
                    key={claim.id}
                    claim={claim}
                    onClick={() =>
                      setActiveClaimId(
                        activeClaimId === claim.id ? null : claim.id
                      )
                    }
                    active={activeClaimId === claim.id}
                  />
                ))}
              </div>
            </section>

            {/* Supporting Evidence */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={`${styles.sectionDot} ${styles.dotSupport}`} />
                  Supporting Evidence
                </h2>
                <span className={styles.sectionCount}>
                  {investigation.evidence.filter((e) => e.stance === "supporting").length}
                </span>
              </div>
              <p className={styles.sectionDescription}>
                Evidence that supports the claims above.
              </p>
              <div className={styles.evidenceGrid}>
                {investigation.evidence
                  .filter((e) => e.stance === "supporting")
                  .map((e) => (
                    <EvidenceCard key={e.id} evidence={e} />
                  ))}
              </div>
            </section>

            {/* Contradicting Evidence */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={`${styles.sectionDot} ${styles.dotContradict}`} />
                  Contradicting Evidence
                </h2>
                <span className={styles.sectionCount}>
                  {investigation.evidence.filter((e) => e.stance === "contradicting").length}
                </span>
              </div>
              <p className={styles.sectionDescription}>
                Evidence that contradicts or challenges the claims.
              </p>
              <div className={styles.evidenceGrid}>
                {investigation.evidence
                  .filter((e) => e.stance === "contradicting")
                  .map((e) => (
                    <EvidenceCard key={e.id} evidence={e} />
                  ))}
              </div>
            </section>

            {/* Mixed Evidence */}
            {investigation.evidence.some((e) => e.stance === "mixed") && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <span className={`${styles.sectionDot} ${styles.dotMixed}`} />
                    Mixed Evidence
                  </h2>
                  <span className={styles.sectionCount}>
                    {investigation.evidence.filter((e) => e.stance === "mixed").length}
                  </span>
                </div>
                <p className={styles.sectionDescription}>
                  Evidence with findings that both support and contradict aspects of the claims.
                </p>
                <div className={styles.evidenceGrid}>
                  {investigation.evidence
                    .filter((e) => e.stance === "mixed")
                    .map((e) => (
                      <EvidenceCard key={e.id} evidence={e} />
                    ))}
                </div>
              </section>
            )}

            {/* Confidence */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Confidence</h2>
              </div>
              <div className={styles.confidencePanel}>
                <div className={styles.confidenceMain}>
                  <ConfidenceIndicator
                    level={investigation.confidence}
                    size="md"
                  />
                  <p className={styles.confidenceText}>
                    Overall confidence in the findings is{" "}
                    <strong>
                      {investigation.confidence === "high"
                        ? "high"
                        : investigation.confidence === "moderate"
                        ? "moderate"
                        : investigation.confidence === "low"
                        ? "low"
                        : "very low"}
                    </strong>
                    . This reflects the quality, consistency, and quantity of
                    evidence across all claims.
                  </p>
                </div>
                <div className={styles.confidenceBreakdown}>
                  {investigation.claims.map((claim) => (
                    <div key={claim.id} className={styles.confidenceRow}>
                      <span className={styles.confidenceRowLabel}>
                        {claim.text.length > 60
                          ? claim.text.slice(0, 60) + "..."
                          : claim.text}
                      </span>
                      <ConfidenceIndicator
                        level={claim.confidence}
                        showLabel={false}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Unknowns */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Unknowns</h2>
                <span className={styles.sectionCount}>
                  {investigation.unknowns.length}
                </span>
              </div>
              <p className={styles.sectionDescription}>
                What the evidence doesn't tell us — gaps, limitations, and unaddressed factors.
              </p>
              <ul className={styles.unknownsList}>
                {investigation.unknowns.map((unknown, i) => (
                  <li key={i} className={styles.unknownItem}>
                    <span className={styles.unknownIcon} aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                    </span>
                    <span className={styles.unknownText}>{unknown}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Research Brief */}
            {investigation.brief && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Research Brief</h2>
                </div>
                <p className={styles.sectionDescription}>
                  A synthesized summary of the investigation's findings.
                </p>
                <ResearchBriefView
                  brief={investigation.brief}
                  evidence={investigation.evidence}
                  sources={sources}
                />
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
