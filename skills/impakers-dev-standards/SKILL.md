---
name: impakers-dev-standards
description: Generate a generic IMPAKERS-style docs/DEV_STANDARDS.md from project evidence. Default profile is Next.js + TypeScript + FSD + typia runtime schema; non-default stacks require explicit override evidence. Markdown only; renderer handles branding/DOCX/PDF.
version: 0.4.0
author: IMPAKERS
compatibility:
  claude_code: ">=1.0"
  codex_cli: ">=0.19"
license: internal
---

# Skill — 개발표준정의서 제너레이터

이 스킬은 대상 리포의 문서와 대표 소스 파일을 증거 기반으로 읽고 `docs/DEV_STANDARDS.md` 12장 Markdown 초안을 만든다. 출력은 범용 Markdown뿐이다. DOCX/PDF/브랜드 스타일/아이콘/Pretendard 적용은 별도 렌더러 앱이 담당한다.

## 리소스 로딩 규칙

초기 호출 비용을 줄이기 위해 상세 규칙은 필요 시 아래 파일을 읽는다.

| 리소스 | 읽는 시점 |
| :--- | :--- |
| `resources/slot-catalog.md` | Phase 2 슬롯 추출 전 |
| `resources/interview-bundles.md` | Phase 3 질문 번들 작성 전 |
| `resources/synthesis-template.md` | Phase 4 문서 합성 전 |
| `resources/gate-checklist.md` | Phase 5 품질 게이트 전 |

리소스를 읽지 않고 임의로 슬롯·템플릿·게이트를 축약하지 않는다.

## 실행 가능한 검증 구조

이 스킬은 문서 규칙뿐 아니라 대상 프로젝트나 스킬 패키지에서 재사용할 수 있는 검증 스크립트를 함께 제공한다.

| 스크립트 | 용도 |
| :--- | :--- |
| `scripts/validate-dev-standards.mjs` | `docs/DEV_STANDARDS.md`, slot data, 설치된 `SKILL.md`+`resources/` marker 검증 |
| `scripts/dev-standards.schema.json` | slot extraction, measurement, artifact, handoff JSON Schema |
| `scripts/dev-standards.contract.example.json` | v0.4 핵심 슬롯/FSD/typia/측정 fixture |
| `scripts/validate-fsd-structure.mjs` | 기본 FSD 폴더·slice public API 구조 검증 |
| `scripts/validate-typia-runtime-policy.mjs` | typia runtime schema 필수 정책 marker와 선택 표현 회귀 방지 |

## 발동 조건

- 사용자가 `개발표준정의서`, `DEV_STANDARDS`, `dev standards`, `개발 표준 문서`, `표준 문서화`를 언급한다.
- 신규 프로젝트 초기 문서화 번들을 요청한다.
- 대상 리포에 PRD/SCOPE/ARCH/ADR/API 성격 문서가 있고 `docs/DEV_STANDARDS.md`가 없거나 재작성 요청이 있다.

## 산출물과 범위

| 파일 | 상태 | 규칙 |
| :--- | :---: | :--- |
| `docs/DEV_STANDARDS.md` | 필수 | 12장 Markdown 고정 구조 |
| `docs/raw-specs/` | 선택 | 원본 스냅샷/수집 로그가 필요할 때만 |

대상 리포에서 수정 가능한 파일은 기본적으로 위 산출물뿐이다. 사용자가 별도 요청하지 않으면 제품 코드, 설정, 디자인 파일을 바꾸지 않는다.

## 기본 profile 계약

기본 profile은 **Next.js + TypeScript + FSD + typia runtime schema**다. 비-Next/비-TypeScript/비-FSD 프로젝트는 증거와 함께 `override`를 명시하고 실제 채택 stack·레이어링·runtime validation profile로 대체한다.

TypeScript 프로젝트에서는 TypeScript `interface`/`type`을 runtime schema의 source of truth로 삼고, 모든 `unknown` 외부 입력(server action, API route, file upload/parser, IPC, callback)은 업무 로직 전 mandatory typia runtime schema 또는 strict typia validator를 통과해야 한다. `as any`, `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`는 표준 위반으로 기록한다.

FSD 기본값에서는 `app route entry`, `widgets/*/ui`, `features/*/ui`, `entities/*/ui`, `shared/ui`, `components/ui` 책임·허용 의존성·금지 의존성·public API/export boundary·예외 승인 기준·검증 명령을 문서화한다. 비-FSD면 대체 레이어링(Clean Architecture, Hexagonal, MVC, layered backend, modular monolith, package-by-feature 등)과 compliance gate를 기록한다.

## 실행 절차

1. **Discovery** — `docs/`, README, CLAUDE.md, AGENTS.md, PRD/SCOPE/ARCH/ADR/API, package/build/deploy/test 설정, 대표 소스 구조를 스캔한다. 제외: `node_modules`, `.next`, `dist`, `build`, `.git`, `.omc/logs`, `coverage`, 바이너리.
2. **Extraction** — `resources/slot-catalog.md`를 읽고 모든 슬롯을 `confidence`와 `evidence(path:line)`로 채운다.
3. **Interview** — missing/low/conflict 슬롯만 `resources/interview-bundles.md` 기준으로 최대 5개 질문 번들로 묶어 묻는다. 조직·계약 귀속값(`project.client`, `project.vendor`, `ops.availability`)은 추측하지 않는다.
4. **Synthesis** — `resources/synthesis-template.md`를 읽고 12장 Markdown을 채운다. 미결 슬롯은 `<!-- TODO(slot-id): ... -->`와 TODO 인덱스로 남긴다.
5. **Gate** — `resources/gate-checklist.md`를 읽고 실패 항목만 재인터뷰/재합성한다.
6. **Handoff** — 파일 경로, 채워진 슬롯 수, 남은 TODO, coverage/tooling 상태, FSD/레이어링 검증 상태, 측정값/proxy/측정 불가 항목, 미검증 리스크, 렌더러 URL 또는 `TODO(renderer.url)`을 보고한다.

## 스캔 힌트

우선순위는 문서 증거다: `docs/**/*.{md,mdx,yaml,yml,json,mmd,txt}`, README, CLAUDE.md, AGENTS.md, PRD/SCOPE/ARCH/ADR/API, OpenAPI, package/build/deploy/test 설정, DB/migration/schema, 대표 source tree. `coverage/**`는 산출물로 읽지 말고 존재 여부만 확인한다.

분류 태그는 `PRD | SCOPE | ARCH | ADR | API | DATA_MODEL | WORKFLOW | SECURITY | INFRA | BRAND | GLOSSARY | RAW | QUALITY | TEST | BOUNDARY | LAYERING | FSD | CLEAN_ARCH | MVC | HEXAGONAL | SOURCE_OF_TRUTH | ARTIFACT | METRICS`를 사용한다.

## 품질 원칙

- 모든 사실 주장은 가능한 한 `파일:라인` 증거를 둔다.
- coverage/token/time/LoC/search cost는 `측정값 | proxy | 측정 불가` 중 하나로 출처·산식·범위를 함께 쓴다.
- preview/draft artifact를 confirmed/export처럼 표현하지 않는다.
- browser storage, mock data, public fixture, screenshot은 업무 source of truth로 쓰지 않는다.
- 레이어링 import/dependency gate 또는 수동 QA 증거가 없으면 준수 완료라고 단정하지 않고 `미검증 리스크`로 남긴다.

## 실행 인자

| 이름 | 기본값 | 설명 |
| :--- | :--- | :--- |
| `target_path` | 현재 작업 디렉토리 | 스캔할 리포 루트 |
| `output_path` | `docs/DEV_STANDARDS.md` | 산출물 경로 |
| `interview_mode` | `on` | `on` / `batch` / `off` |
| `max_interview_rounds` | `3` | 인터뷰 라운드 상한 |
| `keep_raw_snapshots` | `false` | `docs/raw-specs/` 저장 여부 |
| `language` | `ko` | 본문 언어 |

## 보고 포맷

완료 보고에는 다음을 포함한다: 생성 파일 경로, 채워진 슬롯 수/전체 슬롯 수, 남은 TODO, 검증 결과, 미검증 리스크, 렌더러 URL 안내. 렌더러 URL은 환경변수·프로젝트 설정·사용자 응답에서 확인된 값만 쓰고, 없으면 `TODO(renderer.url)`로 남긴다.
