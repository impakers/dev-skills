---
name: impakers-intent-planning
description: "Maker의 구두 발화, 기능 요청, UX 불편, 신규 서비스 아이디어를 의도 중심 기획 산출물로 변환하는 임패커스 front-door planning skill. 핵심 의도, 미션, Soul Statement, 대표 유저 스토리, 워크플로우, UI Flow, 개발 설계 초안, QA-as-Requirement를 정리해야 할 때 사용한다. 트리거: 기획서 작성, 요구사항에서 의도 도출, 유저 스토리화, 워크플로우 설계, Agent 개발 기획서, 기능 아이디어 정리, 문제 상황을 제품 스펙으로 전환."
version: 0.1.0
author: IMPAKERS
license: internal
---

# Skill - Impakers Intent Planning

이 스킬은 Maker의 최초 발화나 기능 아이디어를 바로 구현 스펙으로 고정하지 않고, 의도와 성공 기준을 먼저 드러낸 뒤 downstream 스킬이 정본화할 수 있는 기획 산출물로 만든다.

## 발동 조건

- 사용자가 신규 기능, 서비스 아이디어, 문제 상황, UX 불편, 업무 자동화 니즈를 자연어로 설명한다.
- 아직 핵심 의도, 대표 사용자, 미션, 성공 기준, QA 기준이 정리되지 않았다.
- 사용자가 "기획서", "요구사항에서 의도 도출", "유저 스토리", "워크플로우", "Agent 개발 기획서", "기능 아이디어 정리"를 요청한다.

이미 `docs/product-specs/`, `docs/design-docs/`, QA 문서가 충분히 있고 정본화만 필요한 경우에는 `impakers-bz-logic-spec`을 먼저 사용한다.

## 리소스 로딩 규칙

상세 규칙은 필요한 단계에서만 아래 파일을 읽는다.

| 리소스 | 읽는 시점 |
|---|---|
| `resources/stage-catalog.md` | Capture -> Verify 단계별 산출물을 정해야 할 때 |
| `resources/output-template.md` | 최종 Intent Planning Spec을 작성할 때 |
| `resources/feedback-gates.md` | Maker/Impakers 피드백 라운드와 acceptance gate를 둘 때 |
| `resources/qa-as-requirement.md` | QA를 요구사항 성공 기준으로 바꿀 때 |
| `resources/skill-connection-map.md` | 산출물을 다른 임패커스 스킬과 docs 구조로 넘길 때 |

리소스를 읽지 않고 단계, 템플릿, 라우팅 규칙을 임의로 축약하지 않는다.

## 핵심 원칙

1. **발화를 보존한다.** Maker의 원문 표현은 `Raw Requirement`로 남기고 해석 결과와 섞지 않는다.
2. **의도를 먼저 고른다.** 기능 목록보다 Maker가 얻고 싶은 변화, 피하고 싶은 손실, 절대 잃으면 안 되는 본질을 먼저 쓴다.
3. **대표 스토리를 하나 고른다.** 모든 가능성을 나열하기보다 첫 vertical slice가 될 사용자 스토리를 명확히 선택한다.
4. **QA를 뒤로 미루지 않는다.** QA는 구현 후 체크리스트가 아니라 요구사항의 성공 기준으로 쓴다.
5. **확정과 가설을 분리한다.** Maker가 말한 사실, Impakers의 해석, Agent Team의 구현 가설을 구분한다.

## 실행 절차

1. **Capture** - Maker 발화를 원문에 가깝게 보존하고, 문제/요청/제약/맥락을 분리한다.
2. **Interpret** - 반복되는 니즈, 감정적 신호, 업무 변화 목표를 핵심 의도 후보로 해석한다.
3. **Missionize** - Core Intent, Mission Statement, Soul Statement를 작성한다.
4. **Storyize** - 대표 사용자, 상황, 목표, 완료 신호가 있는 Selected User Story를 고른다.
5. **Flowize** - 업무 흐름과 UI Flow를 사용자의 실제 순서대로 쓴다.
6. **Systemize** - 데이터, 상태, 정책, API, 권한, 예외 처리 초안을 작성한다.
7. **Verify** - QA-as-Requirement, acceptance gate, vertical slice 후보를 정리한다.

## 산출물

최종 산출물은 `Impakers Intent Planning Spec` Markdown이다. 기본 섹션은 `resources/output-template.md`를 따른다.

| 섹션 | 목적 |
|---|---|
| Raw Requirement | Maker 원문과 비가공 요청 보존 |
| Requirement Atoms | 요청을 구현/검증 가능한 최소 의미 단위로 분해 |
| Core Intent | Maker가 진짜 얻고 싶은 변화 |
| Mission / Soul Statement | 기능의 존재 이유와 보존해야 할 본질 |
| Selected User Story | 첫 구현 단위가 될 대표 스토리 |
| Workflow / UI Flow | 사용자 업무 흐름과 화면 흐름 |
| Development Design Draft | 데이터, 상태, 정책, API, 권한, 예외 초안 |
| QA-as-Requirement | 요구사항 성공 기준 |
| Vertical Slice Candidates | 구현 계획으로 넘길 수 있는 후보 |
| Open Questions | Maker 또는 Impakers가 결정해야 할 미결정 |

## Downstream 연결

Intent Planning 결과는 정본 문서가 아니라 front-door planning 산출물이다. 정본화가 필요하면 다음 순서로 넘긴다.

```text
impakers-intent-planning
-> impakers-bz-logic-spec
-> impakers-dev-standards
-> impakers-components-rules
```

- `impakers-bz-logic-spec`: 산출물을 `docs/raw-specs`, `docs/PRODUCT_SENSE.md`, `docs/product-specs`, `docs/design-docs`, `docs/test-plans`, `docs/exec-plans`로 라우팅한다.
- `impakers-dev-standards`: 축적된 docs를 읽어 개발표준정의서를 만든다.
- `impakers-components-rules`: 확정된 UI/UX 방향을 실제 UI 구현 규칙으로 적용한다.

## 보고 포맷

완료 보고에는 선택한 Core Intent, Mission/Soul Statement, Selected User Story, 핵심 QA 기준, downstream 라우팅, 남은 질문을 짧게 포함한다.
