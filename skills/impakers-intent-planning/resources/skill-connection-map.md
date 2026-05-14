# Skill Connection Map

## Chain

```text
impakers-intent-planning
-> impakers-bz-logic-spec
-> impakers-dev-standards
-> impakers-components-rules
```

## Roles

| Skill | Role |
|---|---|
| `impakers-intent-planning` | Maker 발화에서 의도, 미션, 스토리, 워크플로우, UI Flow, QA 초안을 만든다. |
| `impakers-bz-logic-spec` | Intent Planning 산출물을 표준 `docs/` 구조에 정본화한다. |
| `impakers-dev-standards` | 축적된 docs를 읽고 개발표준정의서를 생성한다. |
| `impakers-components-rules` | 확정된 UI/UX 방향을 실제 UI 구현 규칙으로 적용한다. |

## Routing

| Intent Planning Output | Target Docs |
|---|---|
| Raw Requirement | `docs/raw-specs/yy-mm-dd-[purpose]-raw-file.md` |
| Requirement Atoms | `docs/raw-specs/` 또는 관련 `docs/product-specs/*.md` |
| Core Intent / Mission / Soul Statement | `docs/PRODUCT_SENSE.md` 또는 `docs/design-docs/<feature>-intent.md` |
| Selected User Story | `docs/product-specs/<feature>.md` |
| Workflow / UI Flow | `docs/product-specs/<feature>.md` 또는 `docs/design-docs/<feature>-workflow.md` |
| Data / State / Policy / API Draft | `docs/design-docs/<feature>-design.md` |
| QA-as-Requirement | `docs/test-plans/<feature>-qa.md` |
| Vertical Slice Candidates | `docs/exec-plans/active/<feature>-implementation-plan.md` |

## Handoff Rules

- `impakers-intent-planning` 결과는 정본 docs가 아니라 planning handoff다.
- `impakers-bz-logic-spec`으로 넘길 때 Raw Requirement와 해석 결과를 분리한다.
- `impakers-dev-standards`는 충분한 docs가 축적된 뒤 실행한다.
- `impakers-components-rules`는 UI/UX 방향이 product spec 또는 design doc에서 확정된 뒤 적용한다.
