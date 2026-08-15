// Core domain types for EvidenceForge.
// These are deliberately framework-agnostic so a real AI pipeline
// can produce objects matching these interfaces without UI changes.

export type ConfidenceLevel = "high" | "moderate" | "low" | "very-low";

export type EvidenceStance = "supporting" | "contradicting" | "mixed";

export type InvestigationStatus =
  | "idle"
  | "decomposing"
  | "gathering"
  | "analyzing"
  | "synthesizing"
  | "complete"
  | "error";

export interface Source {
  id: string;
  title: string;
  authors: string[];
  publication: string;
  date: string; // ISO date string
  url: string;
  type: "peer-reviewed" | "preprint" | "report" | "meta-analysis" | "systematic-review" | "working-paper";
}

export interface EvidenceItem {
  id: string;
  claimId: string;
  title: string;
  source: Source;
  excerpt: string;
  summary: string;
  stance: EvidenceStance;
  confidence: ConfidenceLevel;
  relevanceScore: number; // 0–1
  publicationDate: string; // ISO date string
}

export interface Claim {
  id: string;
  text: string;
  evidenceCount: number;
  supportingCount: number;
  contradictingCount: number;
  mixedCount: number;
  confidence: ConfidenceLevel;
}

export interface ResearchBrief {
  executiveFinding: string;
  strongestSupportingEvidenceId: string;
  strongestContradictingEvidenceId: string;
  uncertainties: string[];
  limitations: string[];
  openQuestions: string[];
  sourceIds: string[];
}

export interface Investigation {
  id: string;
  question: string;
  status: InvestigationStatus;
  claims: Claim[];
  evidence: EvidenceItem[];
  brief: ResearchBrief | null;
  confidence: ConfidenceLevel;
  unknowns: string[];
  createdAt: string; // ISO date string
  isDemo: boolean;
}
