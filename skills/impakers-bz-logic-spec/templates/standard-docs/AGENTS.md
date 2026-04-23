# AGENTS.md - <프로젝트명>

## Project Identity

**<프로젝트명>**는 **<클라이언트명>**를 위한 임패커스 개발 프로젝트입니다.

## Documentation Map

| Path | Purpose |
|---|---|
| `docs/PRODUCT_SENSE.md` | 도메인 맥락, 페르소나, 안티패턴 |
| `ARCHITECTURE.md` | 시스템 구조와 데이터 흐름 |
| `docs/product-specs/` | 기능별 제품 스펙 |
| `docs/design-docs/` | 설계 결정, ADR, 비즈니스 규칙 |
| `docs/raw-specs/` | 클라이언트 원본 요구사항 |
| `docs/references/` | API/ERP/샘플/템플릿/레거시 참조 |
| `docs/generated/` | ERD/SQL/codegen 생성 산출물 |
| `docs/exec-plans/` | 실행 계획과 완료 기록 |

## Raw Specs Naming Rule

`docs/raw-specs/` 원본 파일명은 `yy-mm-dd-[purpose]-raw-file.{ext}` 형식을 따른다.

## Core Invariants

- TODO

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

## Agent Routing

| Task | Primary Agent | Required Docs |
|---|---|---|
| 기능 구현 | Programming agent | `docs/product-specs/*.md`, 관련 `docs/design-docs/*.md` |
| DB/API 변경 | Backend agent | `ARCHITECTURE.md`, `docs/generated/`, 관련 spec |
| UI 구현 | Frontend agent | `docs/DESIGN.md`, `docs/FRONTEND.md`, 관련 spec |
