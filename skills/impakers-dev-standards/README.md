# impakers-dev-standards

**개발표준정의서(`DEV_STANDARDS.md`) 제너레이터** — 대상 리포의 `docs/`, README, CLAUDE.md, AGENTS.md, PRD/SCOPE/ARCH/ADR/API 등을 스캔해 12장 구조의 개발표준 Markdown 초안을 생성합니다. 누락 슬롯은 **인터뷰**로 채우고, IMPAKERS 기본 profile인 **Next.js + TypeScript + FSD + typia runtime schema**를 기준으로 레이어링 경계·runtime validation profile·측정 방법·문서 동기화까지 표준화합니다. 비-Next/비-TypeScript/비-FSD 프로젝트는 명시적 override와 근거를 문서에 남깁니다. 렌더링(브랜드/DOCX/PDF)은 별도 렌더러 앱이 담당합니다.

## 내용

- **범용 Markdown 출력** (아이콘·컬러·브랜드 스타일 주입 금지)
- **6-Phase 파이프라인**: Discovery → Extraction → Interview → Synthesis → Gate → Handoff
- **12장 고정 템플릿**: 개요 / 아키텍처 / 불변규칙 / 보안 / 명명규칙 / 개발표준 / UI-UX / 품질 / 배포 / 디렉토리 / Git / 장애대응
- **슬롯 카탈로그 60개 이상** (증거 인용 기반 추출)
- **레이어링·경계·검증·측정 슬롯**: default FSD layer/import/public API enforcement, client/server/shared, source of truth, mandatory typia runtime schema validation for TypeScript, strict validator/error status mapping, coverage/tooling status, metrics methodology, artifact classification, docs sync
- **실행 가능한 검증 구조**: `scripts/validate-dev-standards.mjs`, JSON Schema, contract fixture, FSD 구조 검증, typia runtime policy 회귀 방지 스크립트
- **내부 정확성 평가 자산**: `tests/` 하위 LLM Judge rubric, prompt, case matrix, gold expectation, report schema/template
- 누락 슬롯은 `<!-- TODO(slot-id): ... -->` 주석으로 명시

## 설치

```bash
# 권장: Vercel의 표준 skills CLI
npx skills add https://github.com/impakers/dev-skills --skill impakers-dev-standards

# 대체: 자체 CLI
npx -y github:impakers/dev-skills add dev-standards
```

## 트리거

사용자가 아래 중 하나를 언급하면 자동 발동:

- **"개발표준정의서 만들어줘"**
- **"dev standards 문서 생성"**
- **"DEV_STANDARDS.md 작성"**
- **"표준 문서화해줘"**
- 신규 프로젝트 초기 문서화 번들 요청
- 대상 리포에 PRD/SCOPE/ARCH 중 하나 이상 있으나 `docs/DEV_STANDARDS.md` 가 없는 상태

## 산출물

| 파일 | 포맷 | 필수 |
|---|---|---|
| `docs/DEV_STANDARDS.md` | Markdown | ✅ |
| `docs/raw-specs/` (수집 로그) | Markdown | 선택 |

## 포함된 검증 스크립트

| 파일 | 용도 |
|---|---|
| `scripts/validate-dev-standards.mjs` | `docs/DEV_STANDARDS.md`, slot data, skill/resources marker를 검증 |
| `scripts/dev-standards.schema.json` | slot extraction, measurement, artifact, handoff contract JSON Schema |
| `scripts/dev-standards.contract.example.json` | v0.4 핵심 슬롯/FSD/typia/측정 contract fixture |
| `scripts/validate-fsd-structure.mjs` | 대상 프로젝트의 기본 FSD 폴더/public API 구조 검증 |
| `scripts/validate-internal-accuracy.mjs` | 내부 정확성 case/gold/fixture/Judge prompt/report contract 검증 및 샘플 리포트 생성 |
| `scripts/validate-typia-runtime-policy.mjs` | typia runtime schema 필수 정책 marker와 선택 표현 회귀 방지 |

예시:

```bash
node ~/.claude/skills/impakers-dev-standards/scripts/validate-dev-standards.mjs \
  --no-target \
  --skill ~/.claude/skills/impakers-dev-standards/SKILL.md \
  --slot-data ~/.claude/skills/impakers-dev-standards/scripts/dev-standards.contract.example.json
```

내부 정확성 평가 자산 검증:

```bash
npm run validate:dev-standards:internal-accuracy
```

## 내부 정확성 평가 자산

`tests/`는 스킬 자체가 증거 기반 파이프라인을 정확히 따르는지 평가하기 위한 자산입니다. deterministic 검증은 구조·형식·금지 문자열을 확인하고, LLM Judge는 evidence fidelity, uncertainty handling, profile correctness, standards actionability, risk transparency를 평가합니다.

| 파일 | 용도 |
|---|---|
| `tests/README.md` | 내부 정확성 테스트 구조와 deterministic/Judge 역할 분리 |
| `tests/cases/internal-accuracy-cases.yaml` | fixture별 평가 목적과 judge focus 매트릭스 |
| `tests/gold/no-coverage-tooling.yaml` | coverage tooling 부재 회귀 방지용 gold expectation 예시 |
| `tests/judge/rubric.md` | LLM Judge 채점 기준과 blocking failure 정의 |
| `tests/judge/prompt.md` | 구조화된 Judge JSON 출력을 강제하는 prompt |
| `tests/judge/report-template.md` | 사람이 읽는 Markdown 결과 리포트 형식 |
| `tests/judge/report.schema.json` | CI가 읽는 JSON 결과 리포트 형식 |
| `tests/reports/` | harness가 생성하는 샘플 Markdown/JSON 리포트 |

## 사용 예시

```
User: "개발표준정의서 만들어줘. docs 다 읽고."

Claude: [스킬 로드]
  Phase 1 Discovery  — docs/ 38개 파일 스캔, 4개 카테고리로 분류
  Phase 2 Extraction — 슬롯 60개 이상 중 41개 추출 (evidence 포함)
  Phase 3 Interview  — 누락 13개 중 7개 Bundle 형식으로 질문
                      — 경계/검증/측정 Bundle 로 typia runtime schema 필수 경계·source of truth·coverage gap 확인
                      — 레이어링/FSD Bundle 로 기본 FSD 책임·허용/금지 의존성·검증 gate 확인
  Phase 4 Synthesis  — 12장 초안 작성
  Phase 5 Gate       — 품질 체크리스트 검증
  Phase 6 Handoff    — docs/DEV_STANDARDS.md 저장 + 렌더러 URL 안내
```

## 렌더러 연동

생성된 Markdown은 별도 배포된 **임패커스 렌더러 앱**에 업로드하면 아이콘·Pretendard·브랜드 컬러가 적용된 화면/DOCX/PDF 로 내보낼 수 있습니다. (URL은 환경변수 `IMPAKERS_RENDERER_URL` 또는 CLAUDE.md 로부터 읽음)

## 원본

원본 스킬 정의는 [`impakers/workflow`](https://github.com/impakers/workflow) 의 `docs/SKILLS.md` 에 있으며, 본 repo의 `SKILL.md` 는 그 사본입니다.
