import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import styles from "./LandingPage.module.css";

const workflowSteps = [
  {
    num: "01",
    title: "Decompose",
    description:
      "Your research question is broken down into testable claims — each one a distinct proposition that can be independently evaluated against evidence.",
  },
  {
    num: "02",
    title: "Gather",
    description:
      "EvidenceForge searches across peer-reviewed studies, meta-analyses, reports, and working papers to find relevant evidence for and against each claim.",
  },
  {
    num: "03",
    title: "Analyze",
    description:
      "Each piece of evidence is assessed for its relationship to the claim — supporting, contradicting, or mixed — along with a confidence and relevance score.",
  },
  {
    num: "04",
    title: "Synthesize",
    description:
      "The evidence is weighed and synthesized into a structured research brief with an executive finding, key evidence, uncertainties, and open questions.",
  },
];

const principles = [
  {
    title: "Evidence before conclusion",
    description:
      "Conclusions follow from evidence, not the other way around. Every finding traces back to its sources.",
  },
  {
    title: "Show your uncertainty",
    description:
      "Confidence and unknowns are first-class citizens — never buried or hand-waved away.",
  },
  {
    title: "Contradiction is signal",
    description:
      "Contradicting evidence is surfaced alongside supporting evidence, not filtered out.",
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <Header
        rightContent={
          <Button size="sm" onClick={() => navigate("/workspace")}>
            Open Workspace
          </Button>
        }
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>AI-powered research investigation</span>
            <h1 className={styles.heroTitle}>
              Evidence
              <span className={styles.heroTitleAccent}> before </span>
              conclusion.
            </h1>
            <p className={styles.heroLead}>
              EvidenceForge decomposes your research question into claims,
              gathers and analyzes the evidence for and against each one, then
              synthesizes an evidence-based research brief — with confidence
              and uncertainty made explicit.
            </p>
            <div className={styles.heroActions}>
              <Button
                size="lg"
                onClick={() => navigate("/workspace")}
                aria-label="Investigate a research question"
              >
                Investigate a question
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
              <span className={styles.heroNote}>
                No sign-up required · Demo data available
              </span>
            </div>
          </div>

          {/* Visual element */}
          <div className={styles.heroVisual}>
            <div className={styles.visualCard}>
              <div className={styles.visualHeader}>
                <span className={styles.visualDot} />
                <span className={styles.visualDot} />
                <span className={styles.visualDot} />
              </div>
              <div className={styles.visualBody}>
                <div className={`${styles.visualLine} ${styles.wide}`} />
                <div className={`${styles.visualLine} ${styles.medium}`} />
                <div className={styles.visualRow}>
                  <div className={`${styles.visualBadge} ${styles.badgeSupport}`} />
                  <div className={`${styles.visualBadge} ${styles.badgeContradict}`} />
                  <div className={`${styles.visualBadge} ${styles.badgeMixed}`} />
                </div>
                <div className={`${styles.visualLine} ${styles.narrow}`} />
                <div className={`${styles.visualLine} ${styles.wide}`} />
                <div className={styles.visualRow}>
                  <div className={styles.visualBar} />
                  <div className={styles.visualBar} />
                  <div className={styles.visualBar} />
                  <div className={styles.visualBar} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principle band */}
      <section className={styles.principle}>
        <div className={styles.principleInner}>
          <h2 className={styles.principleTitle}>The principle</h2>
          <p className={styles.principleStatement}>
            "Evidence before conclusion."
          </p>
          <p className={styles.principleDescription}>
            Most research tools start with a conclusion and look for evidence
            to support it. EvidenceForge inverts that: it starts with your
            question, lets the evidence speak, and only then draws a conclusion
            — clearly labeled with how confident it is and what remains
            unknown.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.workflow}>
        <div className={styles.workflowInner}>
          <h2 className={styles.sectionHeading}>How it works</h2>
          <p className={styles.sectionSubheading}>
            A four-stage pipeline from question to evidence-based brief.
          </p>
          <div className={styles.workflowSteps}>
            {workflowSteps.map((step, i) => (
              <div
                key={step.num}
                className={`${styles.step} animate-slide-up delay-${i + 1}`}
              >
                <span className={styles.stepNum}>{step.num}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles grid */}
      <section className={styles.principles}>
        <div className={styles.principlesInner}>
          <h2 className={styles.sectionHeading}>What we believe</h2>
          <div className={styles.principlesGrid}>
            {principles.map((p, i) => (
              <div
                key={p.title}
                className={`${styles.principleCard} animate-fade-in delay-${i + 1}`}
              >
                <h3 className={styles.principleCardTitle}>{p.title}</h3>
                <p className={styles.principleCardDesc}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>
            Start with a question. End with evidence.
          </h2>
          <Button size="lg" onClick={() => navigate("/workspace")}>
            Investigate a question
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}>EvidenceForge</span>
          <span className={styles.footerTag}>
            Evidence before conclusion.
          </span>
        </div>
      </footer>
    </div>
  );
}
