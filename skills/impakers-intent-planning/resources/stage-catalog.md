# Stage Catalog

Intent planning은 Maker 발화를 구현 가능한 정본 스펙으로 바로 바꾸지 않는다. 먼저 의도, 미션, 스토리, 흐름, QA 기준을 분리한다.

## 1. Capture

목적: Maker 원문을 보존하고 요청과 해석을 분리한다.

산출:
- Raw Requirement
- Requirement Atoms
- Maker context
- Observed pain
- Explicit constraints
- Unknowns

규칙:
- Maker가 쓴 단어를 가능한 한 유지한다.
- 하나의 문장에 여러 요구가 섞여 있으면 Requirement Atom으로 쪼갠다.
- 원문에 없는 해결책을 확정처럼 쓰지 않는다.
- 파일, 회의, 이슈, 채팅 링크가 있으면 출처를 남긴다.

## 2. Interpret

목적: 기능 요청 뒤의 업무 변화 목표를 찾는다.

산출:
- Intent candidates
- Pain-to-change mapping
- Risk of misinterpretation

규칙:
- "무엇을 만들어 달라"보다 "무엇이 가능해져야 하는가"를 먼저 쓴다.
- 후보가 여러 개면 우선순위와 판단 근거를 남긴다.

## 3. Missionize

목적: 기능의 존재 이유와 절대 잃으면 안 되는 본질을 고정한다.

산출:
- Selected Core Intent
- Mission Statement
- Soul Statement

규칙:
- Mission Statement는 가능하게 할 변화를 한 문장으로 쓴다.
- Soul Statement는 구현 방식이 바뀌어도 보존해야 하는 본질을 쓴다.

## 4. Storyize

목적: 첫 구현 단위가 될 대표 사용자 스토리를 선택한다.

산출:
- Primary persona
- Selected User Story
- Story acceptance signal
- Non-selected stories

규칙:
- 스토리는 "누가 / 어떤 상황에서 / 무엇을 하기 위해 / 어떤 결과를 얻는다"를 포함한다.
- 모든 스토리를 동등하게 늘어놓지 말고 첫 vertical slice 후보를 고른다.

## 5. Flowize

목적: 실제 업무 순서와 화면 흐름을 분리한다.

산출:
- Workflow
- UI Flow
- State transition notes
- Failure and empty states

규칙:
- 업무 흐름은 화면 구조보다 먼저 쓴다.
- UI Flow는 사용자가 보는 화면, 입력, 선택, 결과 표시 순서로 쓴다.

## 6. Systemize

목적: 구현자가 검토할 수 있는 설계 초안을 만든다.

산출:
- Data draft
- State draft
- Policy and permission draft
- API/event draft
- Integration and exception draft

규칙:
- 확정된 설계와 가설을 분리한다.
- 데이터 source of truth, 상태 전이, 권한, 실패 모드를 빠뜨리지 않는다.

## 7. Verify

목적: QA를 요구사항 성공 기준으로 고정하고 다음 실행 단위를 만든다.

산출:
- QA-as-Requirement
- Acceptance gates
- Vertical Slice Candidates
- Open Questions

규칙:
- QA 문장은 사용자가 성공을 관찰할 수 있는 형태로 쓴다.
- 불명확한 요구는 구현 계획으로 넘기지 말고 Open Questions에 둔다.
