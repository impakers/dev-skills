---
name: impakers-bz-logic-spec
description: "임패커스 프로젝트의 스펙 문서 정리 및 셋업 스킬. 클라이언트 요구사항, 회의록, 엑셀, 디자인, 레거시 코드, API/ERP 문서, 샘플 데이터, 개발표준, 제품 스펙, 실행 계획을 Harness 친화적인 docs 구조로 정리할 때 사용한다. 트리거: 프로젝트 스펙 정리, 클라이언트 요구사항 문서화, docs 셋업, raw-specs/product-specs/design-docs 정리, PRD 정리, 회의록 정리, 엑셀 스펙 정리, 레거시 코드 분석, Harness 문서 구조."
version: 1.0.0
author: IMPAKERS
license: internal
---

# 임패커스 프로젝트 스펙 문서 정리 및 셋업

이 스킬은 임패커스가 클라이언트 맞춤형 개발 프로젝트를 시작하거나, 이미 진행 중인 프로젝트의 요구사항 및 비즈니스 로직을 Harness/에이전트가 잘 읽을 수 있게 정리할 때 사용한다.

목표는 원본 자료를 보존하면서, 구현자가 바로 읽고 실행할 수 있는 정규화된 스펙 체계를 만드는 것이다.

## 핵심 원칙

1. **원본은 보존하고 정본은 분리한다.** 클라이언트가 준 파일, 회의록, PRD, 화면기획서, 엑셀, PDF, DOCX는 `docs/raw-specs/` 또는 `docs/references/`에 보관하고 직접 덮어쓰지 않는다.
2. **raw-specs 파일명은 표준화한다.** `docs/raw-specs/`에 넣는 원본 파일은 파일명 앞부분을 `yy-mm-dd-[purpose]-raw-file.{ext}` 형식으로 맞춘다. 예: `26-04-03-kickoff-meeting-raw-file.md`, `26-04-08-feature-spec-raw-file.xlsx`.
3. **기능 스펙은 구현 가능한 단위로 쪼갠다.** 사용자 플로우, 데이터 모델, 비즈니스 규칙, 수용 기준이 있는 문서만 `docs/product-specs/`에 둔다.
4. **왜 그렇게 만들었는지는 설계 문서에 남긴다.** source of truth, ADR, 비즈니스 불변 규칙, 파이프라인, 데이터 모델 결정은 `docs/design-docs/`에 둔다.
5. **출처를 추적한다.** 모든 정규화 문서는 마지막에 "출처 문서" 섹션을 두고 원본 파일명, 회의 날짜, 문서 섹션을 남긴다.
6. **인덱스를 유지한다.** `docs/product-specs/index.md`, `docs/design-docs/index.md`, 필요 시 `docs/references/index.md`를 최신 상태로 유지한다.
7. **완료 기준은 테스트 가능해야 한다.** 기능 스펙에는 체크박스 수용 기준을 포함한다.
8. **코드 변경 후 관련 스펙을 갱신한다.** 구현이 스펙과 달라지면 코드만 수정하지 말고 `docs/**/*.md`의 source of truth도 같이 업데이트한다.

## AGENTS.md/CLAUDE.md 필수 작업 규칙

AGENTS.md와 CLAUDE.md를 작성하거나 스캐폴드할 때는 아래 작업 원칙을 한국어로 반드시 포함한다.

## 작업 원칙 (필수)

### 자기 개선 루프 (Self-Improvement Loop)

- 비즈니스 로직을 변경한 뒤에는 항상 `docs/**/*.md` 하위의 관련 스펙 문서를 같은 변경 패턴으로 갱신한다.
- 같은 실수가 반복되지 않도록 자신에게 적용할 규칙을 작성한다.
- 실수율이 줄어들 때까지 해당 교훈을 엄격하게 반복 개선한다.
- 관련 프로젝트 작업을 시작할 때 이전 교훈과 작업 규칙을 먼저 검토한다.

### 완료 전 검증 (Verification Before Done)

- 작동을 증명하지 못한 작업은 완료로 표시하지 않는다.
- 필요한 경우 `main` 기준 동작과 변경 후 동작의 차이를 비교한다.
- 스스로 "스태프 엔지니어가 이 변경을 승인할까?"를 질문한다.
- 테스트를 실행하고, 로그를 확인하며, 정확성을 입증한다.

### 균형 잡힌 우아함 요구 (Demand Elegance)

- 단순하지 않은 변경에서는 잠시 멈추고 "더 우아한 방법이 있는가?"를 검토한다.
- 수정이 임시방편처럼 느껴지면, 지금 아는 모든 것을 기준으로 더 우아한 해법을 구현한다.
- 단순하고 명백한 수정에는 이 기준을 과하게 적용하지 않는다. 불필요하게 과설계하지 않는다.

### 자율 버그 수정 (Autonomous Bug Fixing)

- 버그 리포트를 받으면 사용자에게 세부 지시를 요구하지 말고 직접 원인을 찾아 수정한다.
- 로그, 오류, 실패 테스트를 근거로 문제를 특정한 뒤 해결한다.
- 사용자의 추가 컨텍스트 전환 없이 끝까지 처리한다.
- 실패한 CI 테스트는 별도 지시가 없어도 원인을 찾아 고친다.

## 핵심 원칙 (Core Principles)

- **Simplicity First**: 모든 변경은 가능한 한 단순하게 만들고, 영향 범위를 최소화한다.
- **No Laziness**: 근본 원인을 찾는다. 임시방편을 남기지 않는다. 시니어 개발자 기준으로 마무리한다.

## 표준 디렉터리 역할

| 경로 | 역할 | 포함할 것 | 포함하지 말 것 |
|---|---|---|---|
| `AGENTS.md` | 에이전트 라우팅, 프로젝트 불변 규칙, 문서맵 | 담당 에이전트, 읽어야 할 문서, 핵심 제약, 도메인 용어 | 긴 PRD 본문 |
| `CLAUDE.md` | Claude Code/Codex 세션용 작업 규칙 | 기술 스택, 명령어, 문서 구조, 코딩 규칙 | 클라이언트 원본 자료 |
| `ARCHITECTURE.md` | 시스템 구조와 데이터 흐름 | 아키텍처 다이어그램, 모듈, 외부 연동, 핵심 제약 | 개별 기능 상세 플로우 |
| `docs/PRODUCT_SENSE.md` | 도메인 맥락 | 클라이언트 사업, 사용자, 문제, 안티패턴, 성공 지표 | 구현 태스크 목록 |
| `docs/raw-specs/` | 클라이언트 원본 요구 보관 | PRD, 회의록, 화면기획서, 전달받은 엑셀/PDF/DOCX, 원본 개발표준. 파일명은 `yy-mm-dd-[purpose]-raw-file.{ext}` | 에이전트가 재작성한 정규화 스펙 |
| `docs/references/` | 구현 참조 자료 | 외부 API/ERP 문서, 샘플 데이터, 출력 템플릿, 레거시 코드, 테스트 샘플 | 기능별 정본 스펙 |
| `docs/product-specs/` | 기능별 제품 스펙 | 개요, 사용자 플로우, 데이터 모델, 수용 기준, 출처 | 원본 파일 덤프 |
| `docs/design-docs/` | 설계 결정과 비즈니스 규칙 | ADR, core beliefs, pipeline, source of truth, 데이터/출력 형식 명세 | 일정 관리 |
| `docs/generated/` | 생성 산출물 | ERD, DBML, SQL, schema 문서, 통합 기능표, codegen 결과 | 수작업으로 유지할 정책 문서 |
| `docs/PLANS.md` | 전체 일정과 마일스톤 | 단계, 우선순위, 이해관계자, 큰 리스크 | 기능별 상세 요구 |
| `docs/exec-plans/` | 실행 계획 | active/completed 태스크, 주차별 계획, 기술부채 트래커 | 원본 요구사항 |
| `docs/test-plans/` | 테스트 계획 | E2E 시나리오, QA 체크리스트, 인수 테스트 | 제품 의사결정 |
| `docs/FRONTEND.md` | 프론트엔드 구현 규칙 | 라우트, 컴포넌트 패턴, 상태/폼/테이블 규칙 | 백엔드 도메인 정책 |
| `docs/DESIGN.md` | UI/UX 기준 | 화면 구조, 컴포넌트 사용 원칙, 디자인 토큰 | API 계약 |
| `docs/SECURITY.md` | 보안/권한/데이터 보호 | RBAC, 데이터 흐름, 개인정보/컴플라이언스 | 일반 UX 가이드 |

## 클라이언트 요구 라우팅

| 클라이언트 요구 또는 자료 | 먼저 보관할 위치 | 정규화할 위치 | 작성 기준 |
|---|---|---|---|
| 킥오프 회의록, 미팅 메모, 구두 요구 정리 | `docs/raw-specs/` | 관련 `docs/product-specs/*.md`, `docs/PRODUCT_SENSE.md` | 누가, 어떤 업무에서, 왜 필요한지 분리 |
| PRD, 개발계획서, 제안서, 화면기획서 | `docs/raw-specs/` | `docs/product-specs/`, `ARCHITECTURE.md`, `docs/PLANS.md` | 기능/일정/아키텍처/비기능 요구로 분해 |
| 엑셀 기능정의서, DB 샘플, 운영 데이터 | `docs/raw-specs/` 또는 `docs/references/` | `docs/product-specs/`, `docs/generated/`, `docs/design-docs/` | 필드 의미, enum, 검증 규칙, 예외를 문서화 |
| API 문서, ERP 문서, 외부 서비스 가이드 | `docs/references/` | `ARCHITECTURE.md`, `docs/design-docs/`, 필요 시 `docs/product-specs/` | 인증, 엔드포인트, 요청/응답, 실패 모드 명시 |
| 출력 양식, PDF/Excel 템플릿, 리포트 샘플 | `docs/references/` | `docs/design-docs/output-format-spec.md`, 관련 기능 스펙 | 컬럼, 포맷, 정렬, 집계 규칙을 source of truth로 기록 |
| 레거시 Python/Apps Script/VBA/기존 자동화 | `docs/references/legacy-*` | `docs/design-docs/business-logic.md`, pipeline 문서 | 함수/단계/예외/검증 로직을 새 스택 기준으로 번역 |
| 새로운 기능 요청 | 원문은 `docs/raw-specs/` 또는 이슈 링크 | `docs/product-specs/<feature>.md` | 개요, 사용자 플로우, 데이터 모델, 수용 기준 포함 |
| 비즈니스 규칙 변경 | 회의록은 `docs/raw-specs/` | `docs/design-docs/`, 관련 product spec | source of truth와 영향 범위 기록 |
| 일정, 마일스톤, 우선순위 조정 | `docs/raw-specs/` 또는 `docs/PLANS.md` | `docs/PLANS.md`, `docs/exec-plans/active/` | 누가 언제 무엇을 완료하는지 명시 |
| DB/ERD/API 계약 변경 | 원본은 `docs/raw-specs/` 또는 migration | `docs/generated/`, `ARCHITECTURE.md`, 관련 spec | 생성 산출물과 수작업 설명을 분리 |
| 에이전트 작업 방식 변경 | 없음 | `AGENTS.md`, `CLAUDE.md` | 어떤 에이전트가 무엇을 읽고 어디를 수정하는지 명시 |

## 신규 프로젝트 셋업 절차

1. **원본 수집**
   - 클라이언트가 준 모든 원본 자료는 `docs/raw-specs/`에 보관한다.
   - 파일명 앞부분은 반드시 `yy-mm-dd-[purpose]-raw-file.{ext}` 형식을 따른다.
   - 구현 참조 자료(API 문서, 출력 템플릿, 샘플 데이터, 레거시 코드)는 `docs/references/`에 보관한다.

2. **표준 디렉터리 생성**
   - 이 스킬 패키지의 `scripts/create_standard_docs.py`를 사용할 수 있다.
   - 예: `python3 skills/impakers-bz-logic-spec/scripts/create_standard_docs.py --target . --project-name "프로젝트명" --client-name "클라이언트명"`.

3. **프로젝트 정체성 작성**
   - `AGENTS.md`: 프로젝트 컨텍스트, 에이전트 역할, 문서맵, 핵심 불변 규칙.
   - `CLAUDE.md`: 기술 스택, 명령어, 작업 규칙, 문서 구조.
   - `README.md`: 사람용 빠른 소개와 실행 방법.

4. **도메인과 아키텍처 분리**
   - `docs/PRODUCT_SENSE.md`: 클라이언트 사업, 페르소나, 문제, 안티패턴.
   - `ARCHITECTURE.md`: 시스템 구성, 데이터 흐름, 외부 연동, 기술 제약.

5. **기능별 제품 스펙 작성**
   - `docs/product-specs/index.md`를 만들고 기능별 문서를 연결한다.
   - 각 기능 문서는 개요, 사용자 플로우, 데이터 모델, 수용 기준, 출처 문서를 포함한다.

6. **설계 결정과 비즈니스 규칙 고정**
   - `docs/design-docs/index.md`를 만들고 ADR, core beliefs, business logic, pipeline, output format을 연결한다.
   - 구현자가 임의로 해석하면 위험한 규칙은 반드시 이 영역에 둔다.

7. **생성 산출물과 실행 계획 분리**
   - ERD/SQL/통합 기능표/codegen 결과는 `docs/generated/`에 둔다.
   - 일정과 작업 분해는 `docs/PLANS.md`, `docs/exec-plans/active/`에 둔다.

8. **Harness 친화 검수**
   - 에이전트가 `AGENTS.md`만 읽어도 다음에 읽을 문서를 찾을 수 있어야 한다.
   - 각 기능 스펙은 출처와 완료 기준을 가져야 한다.
   - 원본 자료와 정규화 문서가 섞이면 안 된다.

## 제품 스펙 템플릿

```markdown
# Feature Spec: <기능명>

## 개요
이 기능이 해결하는 클라이언트 업무 문제와 사용자 가치를 적는다.

## 사용자 플로우
1. 사용자가 어디에서 시작하는지
2. 어떤 입력/선택을 하는지
3. 시스템이 어떤 처리를 하는지
4. 결과가 어디에 저장되거나 표시되는지

## 데이터 모델
| 엔티티/테이블 | 역할 | 주요 필드 |
|---|---|---|
|  |  |  |

## 비즈니스 규칙
- 반드시 지켜야 하는 규칙
- 조건부 필수값, enum, 검증, 예외 처리
- 다른 기능이나 외부 시스템과의 충돌 규칙

## 수용 기준
- [ ] 사용자가 핵심 플로우를 완료할 수 있음
- [ ] 필수 검증이 실패 시 제출이 차단됨
- [ ] 데이터 저장/출력 결과가 출처 문서와 일치함
- [ ] 빈 상태/오류 상태가 정의됨

## 출처 문서
- `docs/raw-specs/yy-mm-dd-[purpose]-raw-file.{ext}` §<섹션>
- `docs/references/<참조파일>`
```

## 설계 문서 작성 기준

- `core-beliefs.md`: 프로젝트 전체 결정을 지배하는 원칙.
- `adr-###-*.md`: 되돌리기 어렵거나 여러 구현에 영향을 주는 결정.
- `business-logic.md`: 레거시 코드, 엑셀 수식, 운영 규칙에서 추출한 도메인 로직.
- `*-pipeline.md`: 여러 단계로 처리되는 데이터/출력 생성 흐름.
- `output-format-spec.md`: 출력물의 컬럼, 레이아웃, 포맷이 인수 기준인 경우.
- `data-model.md`: DB가 아니더라도 localStorage, JSON, 파일 스키마가 source of truth인 경우.

## Harness 친화 체크리스트

- [ ] `AGENTS.md`에 문서맵과 에이전트 라우팅이 있다.
- [ ] `docs/raw-specs/` 원본 파일명이 `yy-mm-dd-[purpose]-raw-file.{ext}` 규칙을 따른다.
- [ ] `docs/product-specs/index.md`가 모든 기능 스펙을 연결한다.
- [ ] `docs/design-docs/index.md`가 핵심 설계 문서를 연결한다.
- [ ] 원본 자료가 `raw-specs` 또는 `references`에 보존되어 있다.
- [ ] 기능 스펙마다 수용 기준과 출처 문서가 있다.
- [ ] 비즈니스 불변 규칙은 `AGENTS.md`와 `design-docs` 중 한 곳 이상에 명시되어 있다.
- [ ] 생성 산출물은 `docs/generated/`에 있고, 수작업 정본과 섞이지 않는다.
- [ ] 실행 중인 작업은 `docs/exec-plans/active/`, 완료 작업은 `docs/exec-plans/completed/`에 구분된다.

## 기존 사례에서 일반화한 패턴

- `ezpmp`형 복합 CRM 프로젝트: raw PRD/회의록/엑셀을 기능별 product spec과 ADR로 분해하고, 데이터 흐름/권한/출처 태깅을 설계 문서에 고정한다.
- `자금비서아리`형 업무자동화 프로젝트: 레거시 코드, 출력 템플릿, 샘플 데이터를 references에 보관하고, business logic/pipeline/output format을 설계 문서로 고정한다.

두 유형 모두 클라이언트 원본과 구현 정본을 분리하고, 에이전트가 인덱스를 통해 필요한 문서를 찾을 수 있게 만든다.
