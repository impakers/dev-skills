# Judge Prompt — impakers-dev-standards internal accuracy

You are evaluating the internal accuracy of the `impakers-dev-standards` skill. The target is not general document beauty. The target is whether the skill followed its own evidence-based pipeline and produced a trustworthy `docs/DEV_STANDARDS.md` result.

## Inputs

You will receive:

1. Case metadata and gold expectations.
2. Source fixture summary or source files.
3. Generated `docs/DEV_STANDARDS.md`.
4. Slot map or extraction summary when available.
5. Deterministic gate results when available.

## Evaluate

Score the output using `rubric.md`:

- evidence_fidelity
- uncertainty_handling
- profile_correctness
- standards_actionability
- risk_transparency

Apply blocking failures before final verdict.

## Required JSON output

```json
{
  "run_id": "<run-id>",
  "fixture": "<fixture-id>",
  "skill_version": "<skill-version>",
  "verdict": "pass | warn | fail",
  "score": 0.0,
  "threshold": 0.82,
  "blocking_failures": [],
  "rubric_scores": {
    "evidence_fidelity": 0.0,
    "uncertainty_handling": 0.0,
    "profile_correctness": 0.0,
    "standards_actionability": 0.0,
    "risk_transparency": 0.0
  },
  "phase_results": {
    "discovery": { "verdict": "pass | warn | fail", "score": 0.0 },
    "extraction": { "verdict": "pass | warn | fail", "score": 0.0 },
    "interview": { "verdict": "pass | warn | fail", "score": 0.0 },
    "synthesis": { "verdict": "pass | warn | fail", "score": 0.0 },
    "gate": { "verdict": "pass | warn | fail", "score": 0.0 },
    "handoff": { "verdict": "pass | warn | fail", "score": 0.0 }
  },
  "issues": [
    {
      "id": "WARN-001",
      "severity": "warn | fail",
      "phase": "discovery | extraction | interview | synthesis | gate | handoff",
      "slot": "quality.coverage_status",
      "message": "Concise issue description.",
      "recommended_action": "Concrete fix."
    }
  ],
  "reasoning_summary": "Concise evidence-based rationale."
}
```
