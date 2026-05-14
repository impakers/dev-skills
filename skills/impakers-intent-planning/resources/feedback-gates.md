# Feedback Gates

Intent planning은 산출물을 한 번에 확정하지 않는다. Maker, Impakers, Agent Team의 검토 책임을 분리한다.

## Gate 1. Maker Intent Confirmation

목적: 해석된 Core Intent가 Maker의 진짜 목적과 맞는지 확인한다.

확인할 것:
- Raw Requirement가 왜곡 없이 보존되었는가?
- Selected Core Intent가 Maker가 얻고 싶은 변화와 맞는가?
- Mission/Soul Statement가 과하거나 좁지 않은가?
- 대표 유저 스토리가 실제 업무 상황을 반영하는가?

통과 기준:
- Maker가 Core Intent, Mission, Selected User Story를 명시적으로 승인하거나 수정 방향을 준다.

## Gate 2. Impakers Product/Spec Routing

목적: intent planning 결과를 어떤 정본 문서로 보낼지 결정한다.

확인할 것:
- Raw Requirement가 `docs/raw-specs/`로 보존될 수 있는가?
- 제품 감각과 기능 스펙, 설계 문서, QA 문서가 분리되어 있는가?
- 미결정 사항이 구현 계획으로 넘어가지 않았는가?

통과 기준:
- `impakers-bz-logic-spec`으로 넘길 docs 라우팅 표가 작성된다.

## Gate 3. Agent Team Implementation Readiness

목적: Agent가 실행 계획을 만들 수 있는 수준인지 확인한다.

확인할 것:
- Vertical Slice Candidate가 사용자 가치와 QA 기준을 가진다.
- 데이터, 상태, 권한, 실패 모드의 미확정 항목이 표시되어 있다.
- QA-as-Requirement가 구현 후 관찰 가능한 문장이다.

통과 기준:
- 구현 가능한 slice와 보류해야 할 질문이 분리된다.
