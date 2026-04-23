# impakers-bz-logic-spec

임패커스 프로젝트의 스펙 문서 정리 및 셋업 스킬입니다. 클라이언트 요구사항, 회의록, 엑셀, 화면기획서, API/ERP 문서, 레거시 코드, 샘플 데이터, 출력 템플릿을 Harness/에이전트가 읽기 좋은 `docs/` 구조로 정리합니다.

## 설치

`impakers/dev-skills` repo에서 설치합니다.

```bash
npx skills add https://github.com/impakers/dev-skills --skill impakers-bz-logic-spec
```

자체 CLI를 사용할 수도 있습니다.

```bash
npx -y github:impakers/dev-skills add bz-logic-spec
```

## 포함 파일

```text
impakers-bz-logic-spec/
├── SKILL.md
├── README.md
├── scripts/
│   └── create_standard_docs.py
└── templates/
    └── standard-docs/
```

## 언제 사용하나

- 신규 클라이언트 프로젝트의 `docs/` 구조를 처음 만들 때
- PRD, 회의록, 엑셀, PDF, DOCX, 피그마/화면기획서를 제품 스펙으로 정리할 때
- 레거시 Python, Apps Script, VBA, ERP/API 문서를 새 시스템의 비즈니스 규칙으로 번역할 때
- Harness나 Programming agent가 구현 전 읽어야 할 문서맵을 만들 때
- 구현 중 요구사항이 바뀌어 `product-specs`, `design-docs`, `exec-plans`를 갱신해야 할 때

## raw-specs 파일명 규칙

`docs/raw-specs/`에 넣는 모든 원본 파일은 파일명 앞부분을 아래 형식으로 맞춥니다.

```text
yy-mm-dd-[purpose]-raw-file.{ext}
```

예시:

```text
26-04-03-kickoff-meeting-raw-file.md
26-04-08-feature-spec-raw-file.xlsx
26-04-17-dev-standards-raw-file.md
26-04-21-screen-planning-raw-file.pptx
```

규칙:
- `yy-mm-dd`: 클라이언트에게 받은 날짜 또는 회의 날짜
- `[purpose]`: 파일 목적을 kebab-case로 작성
- `raw-file`: 원본 보관 파일임을 명시하는 고정 접미어
- `{ext}`: 원본 확장자를 유지

## 표준 docs 구조 생성

Programming agent가 빠르게 표준 구조를 만들 수 있도록 Python 스크립트를 제공합니다.

```bash
python3 skills/impakers-bz-logic-spec/scripts/create_standard_docs.py \
  --target . \
  --project-name "프로젝트명" \
  --client-name "클라이언트명"
```

설치된 스킬 경로에서 실행하는 예:

```bash
python3 ~/.claude/skills/impakers-bz-logic-spec/scripts/create_standard_docs.py \
  --target /path/to/project \
  --project-name "비즈니스 네트워크 CRM" \
  --client-name "이즈피엠피"
```

기본 생성물:

```text
AGENTS.md
CLAUDE.md
README.md
ARCHITECTURE.md
docs/PRODUCT_SENSE.md
docs/PLANS.md
docs/raw-specs/README.md
docs/references/index.md
docs/product-specs/index.md
docs/product-specs/_feature-template.md
docs/design-docs/index.md
docs/design-docs/_adr-template.md
docs/generated/.gitkeep
docs/exec-plans/active/.gitkeep
docs/exec-plans/completed/.gitkeep
docs/test-plans/.gitkeep
```

## AGENTS.md / CLAUDE.md 필수 작업 원칙

스캐폴드와 템플릿은 다음 운영 규칙을 한국어로 포함합니다.

- 자기 개선 루프: 비즈니스 로직 변경 후 관련 `docs/**/*.md` 스펙 갱신, 반복 실수 방지 규칙 작성, 교훈 검토
- 완료 전 검증: 테스트/로그/동작 증명 전 완료 금지
- 균형 잡힌 우아함 요구: 단순하지 않은 변경에서 더 나은 해법 검토, 과설계 금지
- 자율 버그 수정: 버그 리포트는 로그/오류/실패 테스트를 근거로 직접 해결
- 핵심 원칙: 단순성 우선, 근본 원인 해결, 임시방편 금지

## 클라이언트 요구별 스펙화 위치

| 요구 유형 | 원본 보관 | 정규화 문서 |
|---|---|---|
| PRD, 회의록, 전달자료 | `docs/raw-specs/` | `docs/product-specs/`, `docs/PRODUCT_SENSE.md` |
| API/ERP 문서, 샘플, 템플릿 | `docs/references/` | `ARCHITECTURE.md`, `docs/design-docs/` |
| 기능 요구, 사용자 플로우 | `docs/raw-specs/` | `docs/product-specs/<feature>.md` |
| 비즈니스 규칙, 파이프라인, source of truth | `docs/raw-specs/` | `docs/design-docs/` |
| 일정, 범위, 마일스톤 | `docs/raw-specs/` | `docs/PLANS.md`, `docs/exec-plans/active/` |
| ERD, SQL, codegen 결과 | 원본 또는 생성 명령 | `docs/generated/` |
| 에이전트 작업 라우팅 | 없음 | `AGENTS.md`, `CLAUDE.md` |

## Harness 친화 원칙

- `AGENTS.md`만 읽어도 에이전트가 다음에 읽을 문서를 알 수 있어야 합니다.
- 원본 자료와 정규화 스펙은 섞지 않습니다.
- 모든 기능 스펙은 수용 기준과 출처 문서를 포함합니다.
- 설계 결정과 source of truth는 `docs/design-docs/`에 남깁니다.
- 실행 중인 작업은 `docs/exec-plans/active/`, 완료 작업은 `docs/exec-plans/completed/`에 둡니다.
