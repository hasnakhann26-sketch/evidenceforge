# EvidenceForge

AI-powered research evidence investigation tool. Enter a research question, and EvidenceForge decomposes it into claims, gathers and analyzes evidence, distinguishes supporting and contradicting evidence, communicates confidence and uncertainty, and produces an evidence-based research brief.

## Stage 1 — Foundation & Frontend Architecture

This stage delivers the polished application foundation and frontend architecture. The real AI inference pipeline is not yet connected — all investigation results use clearly-labeled demo data.

### Pages

- **Landing / Home** — Value proposition, the "Evidence before conclusion" principle, workflow explanation, and primary CTA.
- **Research Workspace** — Research question input, investigation pipeline with loading states, and structured results across all required sections.

### Workspace Sections

- Research Question
- Claims (with claim cards)
- Supporting Evidence
- Contradicting Evidence
- Mixed Evidence
- Confidence (overall + per-claim breakdown)
- Unknowns
- Research Brief (executive finding, strongest evidence, uncertainties, open questions, sources)

### States

- **Empty** — Before a question is submitted, with example questions and demo data option.
- **Loading** — Multi-stage pipeline animation (decompose → gather → analyze → synthesize).
- **Error** — Failure state with retry.
- **Populated** — Full investigation results with demo data.

### Architecture

- Data models/types are defined in `src/types/` and kept separate from UI components.
- The `useInvestigation` hook simulates the multi-stage pipeline. A real AI pipeline can be connected by replacing the hook's implementation — the frontend types and components won't need changes.
- Reusable components: `EvidenceCard`, `ClaimCard`, `ResearchBriefView` plus UI primitives (`Button`, `Badge`, `ConfidenceIndicator`, `Card`).
- Demo data is clearly labeled with a banner in the workspace.

### Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- CSS Modules with a custom design system (no purple/violet aesthetic)

### Build

```bash
npm install
npm run build
```
