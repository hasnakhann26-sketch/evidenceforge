import { useState, useCallback, useRef } from "react";
import type { Investigation, InvestigationStatus } from "@/types";
import type { PipelineStage } from "@/types/pipeline";
import { getProvider, isDemoMode } from "@/ai";
import { InvestigationService } from "@/services/InvestigationService";
import { createDemoInvestigation } from "@/data/demoData";

// Maps pipeline stages to the UI-facing investigation status.
// The UI has 4 loading sub-statuses; the pipeline has 5 stages.
// We map "question-analysis" and "claim-decomposition" both to
// "decomposing" since they are conceptually the same phase for
// the user.
const STAGE_TO_STATUS: Record<PipelineStage, InvestigationStatus> = {
  "question-analysis": "decomposing",
  "claim-decomposition": "decomposing",
  "evidence-assessment": "analyzing",
  "uncertainty-analysis": "analyzing",
  "brief-synthesis": "synthesizing",
};

const STATUS_LABELS: Record<InvestigationStatus, string> = {
  idle: "Ready",
  decomposing: "Decomposing question into claims",
  gathering: "Gathering evidence from sources",
  analyzing: "Analyzing evidence for each claim",
  synthesizing: "Synthesizing research brief",
  complete: "Investigation complete",
  error: "Investigation failed",
};

export function useInvestigation() {
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [status, setStatus] = useState<InvestigationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = true;
    setInvestigation(null);
    setStatus("idle");
    setError(null);
  }, []);

  const investigate = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;

      abortRef.current = false;
      setInvestigation(null);
      setError(null);
      setQuestion(trimmed);
      setStatus("decomposing");

      const provider = getProvider();
      const service = new InvestigationService(provider);

      try {
        const result = await service.run(trimmed, (stage) => {
          if (abortRef.current) return;
          setStatus(STAGE_TO_STATUS[stage]);
        });

        if (abortRef.current) return;

        setInvestigation(result.investigation);
        setStatus("complete");
      } catch (err) {
        if (abortRef.current) return;
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        setStatus("error");
      }
    },
    []
  );

  const loadDemo = useCallback(() => {
    abortRef.current = true;
    setQuestion("Does remote work improve or reduce employee productivity?");
    const demo = createDemoInvestigation();
    setInvestigation(demo);
    setStatus("complete");
    setError(null);
  }, []);

  return {
    investigation,
    status,
    error,
    question,
    statusLabel: STATUS_LABELS[status],
    isDemoMode: isDemoMode(),
    investigate,
    loadDemo,
    reset,
  };
}
