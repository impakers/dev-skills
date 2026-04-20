---
name: impakers-dev-standards
description: Interview-driven generator for an IMPAKERS-style 개발표준정의서. Ingests every document in the target repo's docs/, README, CLAUDE.md, AGENTS.md, PRD/SCOPE/ARCH/ADR/API specs, extracts what it can, INTERVIEWS the user for missing slots, then fills the fixed 12-chapter Markdown template (docs/DEV_STANDARDS.md). Output is project-agnostic Markdown only — no icons, no brand styling, no DOCX. Rendering (branding, Pretendard, icon set, DOCX/PDF export) is delegated to a separate renderer app that consumes the Markdown. Use when the user says "개발표준정의서 만들어줘", "dev standards 문서 생성", "DEV_STANDARDS.md 작성", "표준 문서화해줘", or when starting standards authoring for any new project.
version: 0.2.0
author: IMPAKERS
compatibility:
  claude_code: ">=1.0"
  codex_cli: ">=0.19"
license: internal
---

# Skill — 개발표준정의서 제너레이터 (범용 · 인터뷰형)

> 이 파일은 **Claude Code skill** 포맷과 **Codex `AGENTS.md` 섹션** 양쪽에서 직접 읽히도록 작성되었다.
> 산출물은 단일 Markdown 파일(`docs/DEV_STANDARDS.md`) 뿐이며, 시각화·브랜딩·포맷 변환은 **별도의 렌더러 앱**이 담당한다.

---

## 0. 이 스킬이 하는 일 / 하지 않는 일

| 한다                                                                            | 하지 않는다                                              |
| ------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 어느 프로젝트의 `docs/` 든 읽고, 12장 Markdown 초안을 생성한다.                 | DOCX · PDF 를 만들지 않는다.                             |
| 수집 단계에서 누락된 정보를 식별하고, **사용자에게 질문**하여 채운다.           | 아이콘을 삽입하지 않는다 (렌더러가 치환).                |
| 기술 스택 · RBAC · 불변 규칙 · 배포 환경을 **증거 기반**으로 추출한다.          | Pretendard · 컬러 토큰 등 시각 스타일을 주입하지 않는다. |
| 채우지 못한 슬롯은 `<!-- TODO: ... -->` 주석으로 명시하여 다음 라운드를 남긴다. | 로고·레이아웃을 생성하지 않는다.                         |

**렌더러 앱(별도 프로젝트)**이 Markdown 을 업로드받아 임패커스 아이콘·Pretendard·브랜드 컬러를 입혀 화면/DOCX/PDF 로 출력한다.

---

## 1. 스킬 발동 조건 (Trigger)

아래 중 하나라도 참일 때 본 스킬을 적용한다.

- 사용자가 **`개발표준정의서`**, **`DEV_STANDARDS`**, **`dev standards`**, **`개발 표준 문서`**, **`dev standard 생성`**, **`표준 문서화`** 중 하나 이상을 언급.
- 사용자가 신규 프로젝트의 **초기 문서화 번들** 작성을 요청.
- 대상 리포의 `docs/` 또는 루트에 PRD/SCOPE/ARCH/ADR/API 중 하나 이상이 존재하면서, `docs/DEV_STANDARDS.md` 가 **없거나** 사용자가 재작성을 요청.

---

## 2. 산출물

| 파일                          | 포맷 | 상태 |
| ----------------------------- | ---- | ---- |
| `docs/DEV_STANDARDS.md`       | MD   | 필수 |
| `docs/raw-specs/` (수집 로그) | MD   | 선택 |

> **원칙:** 결과물은 **범용 Markdown** 이며, 특정 조직/브랜드 식별자(이즈피엠피 등)는 사용자가 명시하거나 프로젝트 docs 에서 추출 가능한 경우에만 기입한다.

---

## 3. 작업 절차 (6-Phase)

```
[P1] Discovery   → 리포지토리 스캔 & 1차 분류
[P2] Extraction  → 슬롯 단위 사실 추출 (증거 인용)
[P3] Interview   → 누락 슬롯 식별 → 사용자에게 질문
[P4] Synthesis   → 12장 템플릿 채우기 (+ 사용자 응답 병합)
[P5] Gate        → 품질 체크리스트 자동 검증
[P6] Handoff     → 파일 저장 + 요약 보고 (+ 렌더러 앱 안내)
```

---

## 4. Phase 1 — Discovery (리포지토리 스캔)

**대상:**

- `docs/**/*.{md,mdx,yaml,yml,json,mmd,txt}`
- `README.md`, `README.*`, `CLAUDE.md`, `AGENTS.md`
- `PRD*.md`, `SCOPE*.md`, `ARCH*.md`, `ADR-*.md`
- `openapi.{yaml,json}`, `api/**`, `docs/api/**`
- `package.json`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `Gemfile` (기술 스택 힌트)
- `.gitlab-ci.yml`, `.github/workflows/**`, `vercel.json`, `vercel.ts`, `Dockerfile*`, `deploy/**`, `infra/**`
- `prisma/**`, `db/migration/**`, `*.sql` (데이터 모델 힌트)

**제외:** `node_modules`, `.next`, `dist`, `build`, `.git`, `.omc/logs`, `coverage`, 바이너리.

**분류 태그:** `PRD | SCOPE | ARCH | ADR | API | DATA_MODEL | WORKFLOW | SECURITY | INFRA | BRAND | GLOSSARY | RAW`

---

## 5. Phase 2 — Extraction (슬롯 단위 사실 추출)

아래 **슬롯 카탈로그**의 각 슬롯을 증거(파일:라인) 인용과 함께 채운다. 확신도가 낮은 값은 Phase 3 질문 큐로 넘긴다.

### 5-1. 슬롯 카탈로그

| 슬롯 ID                         | 설명                                       | 기본 확보 경로                                        |
| ------------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| `project.name_ko`               | 프로젝트 한글명                            | README, PRD, package.json description                 |
| `project.name_en`               | 영문 부제                                  | README, PRD                                           |
| `project.client`                | 클라이언트/발주처 (선택)                   | PRD, 계약문서                                         |
| `project.vendor`                | 개발사                                     | 기본값 "임패커스 (IMPAKERS)" — 사용자 확인 필요       |
| `project.last_modified`         | 문서 최종 수정일                           | 오늘 날짜                                             |
| `tech.frontend`                 | 프론트 프레임워크 · UI · 상태관리          | package.json, next.config.\*, tsconfig                |
| `tech.backend`                  | 백엔드 프레임워크 · ORM · 빌드도구         | pom.xml, build.gradle, pyproject.toml                 |
| `tech.db`                       | DB · 마이그레이션 도구                     | prisma, flyway, migrations 폴더                       |
| `tech.auth`                     | 인증/세션 방식                             | ARCH, security middleware, JWT 설정                   |
| `tech.infra`                    | 컨테이너 · CI/CD · 레지스트리 · 클러스터   | Dockerfile, .gitlab-ci.yml, GitHub Actions, vercel.ts |
| `architecture.overview_mermaid` | 전체 구조 Mermaid                          | ARCH 문서, workflow.mmd                               |
| `architecture.modules`          | 핵심 모듈 목록(이름 · 설명 · 엔티티)       | PRD, ARCH, 엔티티/테이블 정의                         |
| `architecture.integrations`     | 외부 연동 시스템(HS, LLM, SSO 등)          | ARCH, API 문서, env 변수                              |
| `rbac.roles`                    | 역할 목록 · 접근 범위 · 적용 방식(4단계)   | PRD, security config, 권한 테이블                     |
| `invariants`                    | 비즈니스 불변 규칙(최소 3개)               | PRD, ADR, "절대 ~ 금지", "필수", "반드시" 언급        |
| `data.classification`           | 데이터 등급표(공개/기밀/제한)              | SECURITY 문서, PII 정책                               |
| `data.compliance`               | VoC · PII · GDPR 등 규정                   | SECURITY, legal 문서                                  |
| `naming.common`                 | 공통 명명 원칙                             | style guide, linter 설정                              |
| `naming.backend`                | 언어별 네이밍(Java/Kotlin/Python …)        | 소스 샘플 + style guide                               |
| `naming.frontend`               | TS/JS 네이밍 + 파일명 규칙                 | 소스 샘플                                             |
| `naming.db`                     | 테이블·컬럼·인덱스·FK 명명                 | migrations, schema                                    |
| `naming.api`                    | REST 엔드포인트 규칙                       | OpenAPI, Controller 샘플                              |
| `naming.domain_terms`           | 도메인 용어 ↔ 코드 식별자 매핑 표          | PRD, Glossary                                         |
| `dev.layering_rules`            | 레이어드 아키텍처 허용/금지                | ARCH, ADR                                             |
| `dev.dto_pattern`               | DTO/엔티티 분리 규칙                       | 소스 샘플                                             |
| `dev.validation`                | 검증(입력/비즈니스/권한)                   | style guide, validator 샘플                           |
| `dev.exceptions`                | 예외 처리 전략                             | GlobalExceptionHandler                                |
| `dev.transaction`               | 트랜잭션 규칙                              | `@Transactional` 정책                                 |
| `dev.logging`                   | 로깅 프레임워크 · MDC                      | logback/logstash 설정                                 |
| `dev.testing`                   | 테스트 전략(단위/통합/E2E) · 커버리지 목표 | test configs, PRD                                     |
| `dev.comments`                  | 주석 표준(JavaDoc/JSDoc)                   | style guide                                           |
| `ui.principles`                 | 디자인 원칙 (5개 내외)                     | PRD, 디자인 문서                                      |
| `ui.color_tokens`               | 컬러 토큰 테이블                           | design tokens                                         |
| `ui.components`                 | 핵심 컴포넌트 패턴                         | UI kit 문서                                           |
| `ui.layouts`                    | 레이아웃 패턴                              | UI kit 문서                                           |
| `ui.responsive`                 | 반응형 전략                                | UI kit 문서                                           |
| `quality.data_kpi`              | 데이터 품질 지표·목표                      | PRD                                                   |
| `quality.code_kpi`              | 코드 품질 지표·목표                        | PRD, CI 기준                                          |
| `quality.gates`                 | 기능 단위 완료 기준                        | PRD, DoD                                              |
| `deploy.infra_components`       | 인프라 구성(레지스트리, K8s, DB)           | infra 문서, .gitlab-ci.yml                            |
| `deploy.pipeline_stages`        | CI/CD 스테이지                             | .gitlab-ci.yml, actions                               |
| `deploy.environments`           | dev/staging/prod 분리                      | env 설정, values-\*.yaml                              |
| `deploy.container_policy`       | 베이스 이미지 · 헬스체크                   | Dockerfile                                            |
| `deploy.strategy`               | 배포·롤백 전략                             | ArgoCD, Kustomize, GitOps 문서                        |
| `directory.monorepo_tree`       | 모노레포 트리                              | 실제 구조(`ls -R`) + README                           |
| `directory.backend_tree`        | 백엔드 디렉토리 트리                       | apps/api 실제 구조                                    |
| `directory.frontend_tree`       | 프론트 디렉토리 트리                       | apps/web 실제 구조                                    |
| `git.branch_strategy`           | 브랜치 전략                                | CONTRIBUTING, README                                  |
| `git.commit_convention`         | 커밋 메시지 규칙                           | commitlint, CONTRIBUTING                              |
| `git.mr_rules`                  | MR/PR 규칙                                 | CODEOWNERS, CONTRIBUTING                              |
| `ops.availability`              | 가용성 목표(단계별)                        | PRD, SLA                                              |
| `ops.monitoring`                | 모니터링 대상 · 지표 · 도구                | 운영 문서                                             |
| `ops.incidents`                 | 장애 유형 × 영향 × 대응                    | 운영 문서, 런북                                       |
| `ops.backup`                    | 백업 주기 · 보관 · 복구 테스트             | 운영 문서                                             |
| `ops.mock_fallback`             | 시범운영 이전 목업 폴백 정책 (선택)        | PRD                                                   |

### 5-2. 각 슬롯의 출력 형식

```yaml
- slot: invariants
  confidence: high | medium | low | missing
  value: |
    (추출된 값. 표·리스트·코드 블록 허용)
  evidence:
    - "docs/PRD.md:42-58"
    - "docs/ADR-0003-auth.md:L12"
```

---

## 6. Phase 3 — Interview (누락 슬롯 질문)

### 6-1. 언제 질문하는가

- `confidence = missing` 또는 `low` 인 슬롯.
- 모순이 있는 슬롯(여러 문서에서 서로 다른 사실이 잡힐 때).
- 조직·계약에 귀속되는 슬롯(`project.client`, `project.vendor`, `ops.availability` 등)은 추측 금지, **항상 질문**.

### 6-2. 질문 규칙

- **배치 전송:** 슬롯별로 질문하지 말고, 관련 슬롯을 묶어 **최대 5개 질문 번들**로 한 번에 제시한다. 과도한 핑퐁 금지.
- **선택지 우선:** 가능하면 단답형 객관식 / 예시 테이블로 물어 응답 부담을 최소화.
- **Why 설명 생략 가능:** "왜 필요한지"는 묻지 말고, 필요한 값만 요청.
- **재질문 금지:** 한 번 답변받은 슬롯은 라운드 내에서 다시 묻지 않는다. 불확실하면 "이 값으로 확정할까요?" 형태로 1회만 확인.
- **기본값 제시:** 이 스킬이 추측한 후보를 함께 제시해 수정·승인으로 빠르게 끝낼 수 있도록 한다.

### 6-3. 표준 질문 번들 템플릿

**번들 A — 프로젝트 메타**

```
1) 프로젝트 공식 한글명 / 영문명은?
2) 클라이언트(있다면) 이름과 개발사명은?
3) 문서 최종 수정일로 표기할 날짜는? (기본: 오늘)
```

**번들 B — 기술 스택 & 아키텍처**

```
1) 프론트엔드 · 백엔드 · DB 스택 (감지된 후보: X / Y / Z)
2) 인증 방식 (JWT 쿠키 / OAuth / 세션 / 기타)
3) 외부 연동 시스템 3개 이내 (이름 · 방향 · 상태)
4) 전체 구조 Mermaid 가 기존 문서에 없다면, 핵심 경로를 한 줄로 설명해 주세요.
```

**번들 C — RBAC & 불변 규칙**

```
1) 역할 목록과 각 역할의 접근 범위 (감지된 후보: …)
2) 반드시 지켜야 할 비즈니스 규칙 3개 이상 (예: 삭제 금지, 출처 태깅 필수 …)
3) 규정/컴플라이언스 이슈 (VoC / PII / GDPR / 국내법)
```

**번들 D — 품질 · 테스트 · 배포**

```
1) 테스트 전략 (단위/통합/E2E) 및 커버리지 목표
2) CI/CD 파이프라인 스테이지 (감지된 후보: lint/test/build/publish/deploy)
3) 환경 분리 (dev/staging/prod) 및 배포 트리거
```

**번들 E — 운영 & 장애**

```
1) 가용성 목표(단계별)
2) 모니터링 도구와 대상
3) 주요 장애 유형 ≥ 3개와 대응 방안
4) 백업 주기 및 보관 기간
```

### 6-4. 응답 없는 슬롯 처리

- `<!-- TODO(slot-id): 사용자 응답 대기 -->` 주석을 문서 내 해당 위치에 남긴다.
- 생성된 문서 끝 **TODO 인덱스** 섹션에 목록화한다.
- `Phase 5 Gate` 에서 실패 처리하고 다음 라운드에 재질문한다.

---

## 7. Phase 4 — Synthesis (12장 템플릿 채우기)

### 7-1. 템플릿 (고정 구조, 절대 변경 금지)

| #   | 챕터                  | 최소 섹션                                                               |
| --- | --------------------- | ----------------------------------------------------------------------- |
| 1   | 개요                  | 준수 원칙 · 적용 범위 · 주요 용어 사전 (Glossary)                       |
| 2   | 시스템 아키텍처       | 전체 구조 (Mermaid) · 기술 스택 · 핵심 모듈 · RBAC · 패턴 · 연동 포인트 |
| 3   | 비즈니스 불변 규칙    | 규칙 표(백엔드 구현 × 프론트엔드 구현) + 컴플라이언스                   |
| 4   | 데이터 분류 및 보안   | 등급표 · API 보안 · 보안 체크리스트                                     |
| 5   | 명명규칙 표준         | 공통 원칙 · 언어별 · DB · API · 도메인 용어 매핑                        |
| 6   | 개발표준              | 레이어링 · DTO · 검증 · 예외 · 트랜잭션 · 로깅 · 테스트 · 주석          |
| 7   | UI/UX 표준            | 디자인 원칙 · 컬러 · 컴포넌트 · 레이아웃 · 반응형                       |
| 8   | 품질 기준             | 데이터 품질 · 코드 품질 · 완료 기준                                     |
| 9   | 배포 및 CI/CD 표준    | 인프라 · 파이프라인 · 환경 분리 · 컨테이너 · 전략                       |
| 10  | Directory 표준        | 모노레포 · 백엔드 · 프론트엔드 트리                                     |
| 11  | Git 컨벤션            | 브랜치 · 커밋 · MR                                                      |
| 12  | 장애 대응 및 모니터링 | 가용성 · 모니터링 · 장애 유형 · 백업 · (선택) 목업 폴백                 |

### 7-2. 채우기 규칙

1. **헤딩:** `#` 1개 → `##`(1~12) → `###` → `####` 까지. `#####` 이하 금지.
2. **표:** 모든 표에 정렬 지정 (`| :--- | :---: | ---: |`).
3. **코드블록:** 언어 태그 필수 (`ts`, `java`, `sql`, `yaml`, `bash`, `mermaid`).
4. **콜아웃:** `> **정의:** ...`, `> **주의:** ...`, `> **예외:** ...`.
5. **증거 인용:** 본문에서 주장한 사실이 특정 파일에서 왔을 때, 각주 형태로 `^fn1` 을 달고 문서 말미에 `[^fn1]: path/to/source.md:42` 로 매핑.
6. **아이콘·브랜드 금지:** 이모지·Lucide 참조·컬러 hex 등 시각 요소는 **넣지 않는다**. 필요하면 값 테이블만 남기고(예: "컬러 토큰: `--brand-primary`"), 시각 표현은 렌더러 앱이 수행.
7. **미결 슬롯:** `<!-- TODO(slot-id): ... -->` 주석으로 명시.
8. **언어:** 본문 한국어 우선, 식별자는 영어 유지.

### 7-3. 출력 뼈대

````markdown
# 개발표준정의서 — {project.name_ko}

**프로젝트:** {project.name_en}
**클라이언트:** {project.client}{" · "}**개발사:** {project.vendor}
**최종 수정일:** {project.last_modified}

> 본 문서는 {…} 기준으로 작성되었으며, 원본 스냅샷은 [docs/raw-specs/](./raw-specs/) 에 보관한다.

---

## 목차

1. [개요](#1-개요) … 12. [장애 대응 및 모니터링](#12-장애-대응-및-모니터링)

---

## 1. 개요

### 준수 원칙

### 적용 범위

### 1-3. 주요 용어 사전 (Glossary)

## 2. 시스템 아키텍처

### 2-1. 전체 구조

```mermaid
…
```
````

### 2-2. 기술 스택

### 2-3. 핵심 모듈

### 2-4. RBAC 역할 및 접근 권한

### 2-5. 아키텍처 패턴

### 2-6. 연동 포인트

## 3. 비즈니스 불변 규칙

## 4. 데이터 분류 및 보안

## 5. 명명규칙 표준

## 6. 개발표준

## 7. UI/UX 표준

## 8. 품질 기준

## 9. 배포 및 CI/CD 표준

## 10. Directory 표준

## 11. Git 컨벤션

## 12. 장애 대응 및 모니터링

---

## 부록 A — TODO 인덱스

- [ ] {slot-id}: {짧은 설명}

## 부록 B — 증거 각주

[^fn1]: path/to/source.md:42

````

---

## 8. Phase 5 — Gate (품질 체크리스트)

다음 항목이 모두 통과되어야 `Phase 6` 으로 넘어간다. 실패 시 해당 슬롯만 재인터뷰/재합성.

- [ ] 파일명 `docs/DEV_STANDARDS.md`
- [ ] 챕터 1~12 모두 존재 + 순서 고정
- [ ] `2. 시스템 아키텍처` 에 `mermaid` 코드블록 ≥ 1
- [ ] `3. 비즈니스 불변 규칙` 에 규칙 ≥ 3, 각 규칙에 (백엔드 구현 · 프론트엔드 구현) 2열
- [ ] `5. 명명규칙` 에 언어별 섹션 ≥ 3
- [ ] `9. 배포` 에 파이프라인 스테이지 표
- [ ] `10. Directory` 에 트리 코드블록 ≥ 1
- [ ] `11. Git` 에 브랜치 표 + 커밋 타입 표
- [ ] `12. 장애` 에 장애 유형 × 대응 표
- [ ] 모든 표에 정렬 지정
- [ ] 모든 코드블록에 언어 태그
- [ ] 깨진 내부 링크 0개
- [ ] 이모지·아이콘·hex 컬러 하드코딩 0개 (렌더러가 주입)
- [ ] TODO 인덱스 섹션 존재 (비어있어도 무방, 헤딩은 남김)

---

## 9. Phase 6 — Handoff (저장 & 보고)

- `docs/DEV_STANDARDS.md` 쓰기 (기존 파일 있으면 덮어쓰기 전 diff 요약 제시).
- 보고 메시지(사용자에게)는 아래 고정 포맷을 따른다:

  ```
  ✅ 개발표준정의서 초안이 생성되었습니다.

  📄 파일:          docs/DEV_STANDARDS.md
  🧩 채워진 슬롯:   {filled}/{total}
  📝 남은 TODO:     {todo_count} 건
                    · <!-- TODO(slot-id) --> 주석을 검색해 확인하세요.

  ▶ 다음 단계 — 임패커스 렌더러로 변환하기
     이 Markdown 을 아래 배포된 URL 에 업로드하면
     임패커스 아이콘 · Pretendard · 브랜드 컬러가 적용된
     화면 · DOCX · PDF 로 즉시 내려받을 수 있습니다.

     🔗 렌더러 URL:  https://standards.impakers.app   (운영)
                     https://standards-staging.impakers.app   (스테이징)
                     ※ URL 은 렌더러 앱 배포 상태에 따라 실제 값으로 교체됨

     업로드 방법 (요약):
       1) 상단 "Upload Markdown" 버튼 클릭
       2) docs/DEV_STANDARDS.md 를 드롭
       3) 브랜드 테마 선택(Default / Client Co-brand / Dark)
       4) "Export" → .docx / .pdf / .html 중 선택
  ```

- 보고 메시지에 포함할 것:
  1. 생성된 파일 경로
  2. 채워진 슬롯 수 / 전체 슬롯 수
  3. 남은 TODO 목록 (slot-id 기준)
  4. **렌더러 URL 안내 블록** (위 고정 포맷)
- `docs/raw-specs/` 디렉토리에 Phase 1~2 에서 참조한 원본 스냅샷(사본)을 저장(선택).

> **주의:** 스킬은 렌더러 URL 을 **하드코딩하지 않는다**. 환경변수 `IMPAKERS_RENDERER_URL` 또는 사용자/프로젝트 CLAUDE.md 에 정의된 값이 있으면 그것을 우선 사용한다. 없으면 위 기본 후보를 안내하고 "배포 URL 이 확정되지 않았다면 사내에 문의하세요" 문구를 덧붙인다.

---

## 10. Claude Code 실행 프로토콜

- **에이전트 라우팅**
  - `explore` → docs 스캔 & 슬롯 채우기(Phase 1~2)
  - `planner` → 누락 슬롯 인터뷰 번들 구성(Phase 3)
  - `executor` (model=opus) → 12장 합성(Phase 4)
  - `verifier` → 품질 게이트(Phase 5)
- **도구 사용:** `Glob`/`Grep`/`Read` 는 dedicated 도구 사용. `rg --files` 로 입력 목록 확보.
- **출력 이외 부수 변경 금지:** 대상 리포의 다른 파일을 건드리지 않는다(단, `docs/DEV_STANDARDS.md` 및 선택적 `docs/raw-specs/` 만 허용).

---

## 11. Codex CLI 실행 프로토콜

- 리포 루트 `AGENTS.md` 상단에 아래 한 줄이 있으면 본 스킬이 system context 로 자동 주입된다:

  ```md
  @skills: workflow/docs/SKILLS.md
````

- 수동 실행 시 프롬프트 예:

  ```bash
  codex -p "Use workflow/docs/SKILLS.md as the skill. \
  Read every file under docs/ and the repo README. Interview me for any missing slots. \
  Then write docs/DEV_STANDARDS.md."
  ```

- Codex 는 Phase 3 인터뷰 번들을 한 번에 한 세트씩 사용자에게 제시한다.

---

## 12. 매개변수 (Skill Arguments)

| 이름                   | 타입   | 기본값                  | 설명                                       |
| ---------------------- | ------ | ----------------------- | ------------------------------------------ |
| `target_path`          | string | 현재 작업 디렉토리      | 스킬이 스캔할 리포 루트                    |
| `output_path`          | string | `docs/DEV_STANDARDS.md` | 산출물 경로                                |
| `interview_mode`       | enum   | `on`                    | `on` / `batch` / `off` (완전 자동, 비권장) |
| `max_interview_rounds` | int    | `3`                     | 인터뷰 라운드 상한                         |
| `keep_raw_snapshots`   | bool   | `false`                 | `docs/raw-specs/` 저장 여부                |
| `language`             | enum   | `ko`                    | `ko` / `en` (본문 언어)                    |
| `project_name_ko`      | string | 자동 추출               | 강제 지정값                                |
| `project_vendor`       | string | `임패커스 (IMPAKERS)`   | 개발사 명 — 타 벤더 사용 시 오버라이드     |

---

## 13. 예시 흐름 (요약)

1. 사용자: `개발표준정의서 만들어줘. docs 다 읽고.`
2. 스킬: `docs/` 스캔 → 38개 파일 분류, 슬롯 54개 중 41개 추출, 13개 누락.
3. 스킬: **번들 B(기술스택), 번들 C(RBAC/불변)** 2세트 질문 제시.
4. 사용자 답변 수신 → 슬롯 병합.
5. 스킬: 12장 초안 작성 → 품질 게이트 통과 → `docs/DEV_STANDARDS.md` 저장.
6. 스킬: "남은 TODO 3건 · 렌더러 앱에 업로드하여 브랜드 적용 후 내보내기 가능" 보고.
