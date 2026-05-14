# impakers-intent-planning

Maker의 자연어 발화, 기능 요청, UX 불편, 신규 서비스 아이디어를 의도 중심 기획 산출물로 바꾸는 front-door planning skill입니다.

## 설치

```bash
npx skills add https://github.com/impakers/dev-skills --skill impakers-intent-planning
```

자체 CLI를 사용할 수도 있습니다.

```bash
npx -y github:impakers/dev-skills add intent-planning
```

## 포함 파일

```text
impakers-intent-planning/
├── SKILL.md
├── README.md
└── resources/
    ├── feedback-gates.md
    ├── output-template.md
    ├── qa-as-requirement.md
    ├── skill-connection-map.md
    └── stage-catalog.md
```

## 언제 사용하나

- Maker가 기능 아이디어, 업무 불편, 서비스 방향을 자연어로 설명했을 때
- 아직 핵심 의도, 대표 유저 스토리, QA 성공 기준이 정리되지 않았을 때
- 바로 product spec으로 고정하기 전에 의도와 미션을 먼저 잡아야 할 때
- Agent가 구현 계획을 세우기 전 front-door 기획 산출물이 필요할 때

## 산출물

기본 산출물은 `Impakers Intent Planning Spec` Markdown입니다.

| 섹션 | 내용 |
|---|---|
| Raw Requirement | Maker 원문과 비가공 요청 |
| Core Intent | Maker가 진짜 얻고 싶은 변화 |
| Mission / Soul Statement | 기능의 존재 이유와 보존해야 할 본질 |
| Selected User Story | 첫 vertical slice 후보가 되는 대표 스토리 |
| Workflow / UI Flow | 실제 업무 순서와 화면 흐름 |
| Development Design Draft | 데이터, 상태, 정책, API, 권한, 예외 초안 |
| QA-as-Requirement | 요구사항 성공 기준 |
| Vertical Slice Candidates | 구현 계획으로 넘길 작업 후보 |

## 기존 스킬과의 관계

```text
impakers-intent-planning
-> impakers-bz-logic-spec
-> impakers-dev-standards
-> impakers-components-rules
```

- `impakers-intent-planning`: Maker 발화에서 의도, 미션, 스토리, 워크플로우, QA 초안을 만든다.
- `impakers-bz-logic-spec`: 산출물을 표준 `docs/` 구조에 정본화한다.
- `impakers-dev-standards`: 축적된 docs를 읽어 개발표준정의서를 만든다.
- `impakers-components-rules`: 확정된 UI/UX 방향을 실제 UI 구현 규칙으로 적용한다.
