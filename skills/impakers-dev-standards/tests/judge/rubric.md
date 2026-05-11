# LLM Judge Rubric — impakers-dev-standards internal accuracy

## Scope

Judge only whether `impakers-dev-standards` followed its own contract. Do not reward general writing quality unless it improves standards accuracy, evidence fidelity, or actionability.

## Criteria

| Criterion | Weight | Pass signal | Fail signal |
|---|---:|---|---|
| Evidence fidelity | 35% | Claims are supported by cited project evidence and do not overstate source material. | Unsupported high-confidence claims, hallucinated stack/policy, evidence that does not support the claim. |
| Uncertainty handling | 20% | Missing, low-confidence, and conflicting values become interview questions, TODOs, or explicit risks. | Guessing `project.client`, `project.vendor`, `ops.availability`, coverage, stack, or compliance posture. |
| Profile correctness | 20% | Default Next.js + TypeScript + FSD + typia profile is applied only when appropriate; non-default stacks have explicit override evidence. | Default profile forced onto a nonmatching repo or non-default override without evidence. |
| Standards actionability | 15% | Chapter 6 and Chapter 8 give concrete boundaries, validation rules, commands, and risk posture a developer can act on. | Vague guidance, missing boundary tables, missing validation/error mapping, or unverifiable completion criteria. |
| Risk transparency | 10% | Measurement gaps, draft artifacts, unverified checks, and renderer URL absence are explicitly reported. | Exact metrics without tooling, draft/preview promoted as confirmed/export, hidden unverified risk. |

## Blocking failures

The judge must return `fail` when any of these are present, regardless of the weighted score.

- `unsupported_high_confidence_claim`
- `hallucinated_stack_or_policy`
- `hidden_measurement_gap`
- `wrong_default_profile_application`
- `source_of_truth_confusion`
- `missing_handoff_risk_status`

## Output rule

Return structured JSON only. Use `reasoning_summary` for concise evidence-based rationale; do not include hidden chain-of-thought.
