# Slot Catalog — impakers-dev-standards

Phase 2에서 이 파일을 읽고 모든 슬롯을 `confidence`와 `evidence`로 채운다. 증거는 `path/to/file.md:42-58` 형식을 사용한다. 확신도가 낮거나 누락된 값은 Phase 3 질문 큐로 넘긴다.

## 출력 형식

```yaml
- slot: invariants
  confidence: high | medium | low | missing
  value: |
    추출된 값. 표·리스트·코드 블록 허용.
  evidence:
    - "docs/PRD.md:42-58"
```

## 슬롯 목록

| 슬롯 ID | 설명 | 기본 확보 경로 |
| :--- | :--- | :--- |
| `project.name_ko` | 프로젝트 한글명 | README, PRD, package description |
| `project.name_en` | 영문명/부제 | README, PRD |
| `project.client` | 클라이언트/발주처 | PRD, 계약문서, 사용자 확인 |
| `project.vendor` | 개발사 | README, 계약문서, 사용자 확인 |
| `project.last_modified` | 문서 최종 수정일 | 오늘 날짜 또는 사용자 지정 |
| `tech.frontend` | 프론트 프레임워크·UI·상태관리 | package.json, next.config.*, tsconfig |
| `tech.backend` | 백엔드 프레임워크·ORM·빌드도구 | pom.xml, build.gradle, pyproject.toml, go.mod |
| `tech.db` | DB·마이그레이션 도구 | prisma, migrations, SQL |
| `tech.auth` | 인증/세션 방식 | ARCH, SECURITY, middleware, JWT/session config |
| `tech.infra` | 컨테이너·CI/CD·레지스트리·클러스터 | Dockerfile, workflows, deploy, infra |
| `architecture.overview_mermaid` | 전체 구조 Mermaid | ARCH, workflow.mmd |
| `architecture.modules` | 핵심 모듈 목록 | PRD, ARCH, source tree |
| `architecture.integrations` | 외부 연동 시스템 | ARCH, API docs, env vars |
| `rbac.roles` | 역할 목록·접근 범위 | PRD, SECURITY, 권한 테이블/config |
| `invariants` | 비즈니스 불변 규칙 | PRD, ADR, 필수/금지 문장 |
| `data.classification` | 데이터 등급표 | SECURITY, PII 정책 |
| `data.compliance` | 규정/컴플라이언스 | SECURITY, legal docs |
| `naming.common` | 공통 명명 원칙 | style guide, linter |
| `naming.backend` | 백엔드 언어별 네이밍 | source samples, style guide |
| `naming.frontend` | TS/JS 네이밍·파일명 | source samples |
| `naming.db` | 테이블·컬럼·인덱스·FK 명명 | migrations, schema |
| `naming.api` | API endpoint 규칙 | OpenAPI, route/controller samples |
| `naming.domain_terms` | 도메인 용어 ↔ 코드 식별자 | PRD, glossary |
| `dev.layering_rules` | 레이어드 아키텍처 허용/금지 | ARCH, ADR |
| `dev.boundary_map` | client/server/shared 또는 채택 레이어 책임 경계 | ARCH, frontend/backend docs, source structure |
| `dev.fsd_enforcement` | 기본값은 FSD 강제. FSD 레이어별 책임, 허용 import, 금지 import, page/widget/component 분리 기준. 비-FSD 프로젝트는 근거와 `FSD 미채택` override, 대체 레이어링 규칙 필요 | FSD docs, frontend docs, eslint/boundary config, source structure |
| `dev.dto_pattern` | DTO/엔티티 분리 규칙 | source samples |
| `dev.validation` | 입력/비즈니스/권한 검증 | validator samples, style guide |
| `dev.runtime_validation` | 기본값은 TypeScript typia runtime schema 강제. TypeScript interface/type 정본, `unknown` 입력, strict typia validator, error status mapping 필요. 비-TypeScript 프로젝트는 근거와 replacement runtime validation profile override 필요 | TS guide, ADR, API route, parser, backend validator samples |
| `dev.source_of_truth` | DB/type schema/registry/snapshot 등 정본 경계 | ARCH, DATA_MODEL, SECURITY, domain docs |
| `dev.client_server_boundary` | client-only/server-only/shared helper 구분 | frontend/backend docs, SECURITY, route/controller/server code |
| `dev.exceptions` | 예외 처리 전략 | handler/filter/middleware samples |
| `dev.transaction` | 트랜잭션 규칙 | DB transaction/unit-of-work docs |
| `dev.logging` | 로깅 프레임워크·request context | logger/tracing config |
| `dev.testing` | 테스트 전략·커버리지 목표 | test configs, PRD |
| `dev.comments` | 주석 표준 | style guide |
| `ui.principles` | 디자인 원칙 | PRD, design docs |
| `ui.color_tokens` | 컬러 토큰 | design tokens |
| `ui.components` | 핵심 컴포넌트 패턴 | UI kit docs |
| `ui.layouts` | 레이아웃 패턴 | UI docs |
| `ui.responsive` | 반응형 전략 | UI docs |
| `quality.data_kpi` | 데이터 품질 지표·목표 | PRD |
| `quality.code_kpi` | 코드 품질 지표·목표 | PRD, CI 기준 |
| `quality.coverage_status` | 테스트/커버리지 tooling 존재 여부와 gap | package scripts, test config, CI |
| `quality.metrics_methodology` | LoC/SLoC/token proxy/search cost 산식·범위 | git diff, CI report, metrics docs |
| `quality.validation_log` | 검증 명령·결과·경고·수동 QA 기록 방식 | exec plans, CI logs, package scripts |
| `quality.gates` | 기능 단위 완료 기준 | PRD, DoD |
| `quality.fsd_compliance_gate` | 기본값은 FSD compliance gate. FSD 위반 자동 검증 명령, 수동 QA, 예외 승인 기준. FSD 미채택 override는 채택 레이어링 compliance gate 기록 | eslint config, architecture tests, validator scripts, CI |
| `artifacts.classification` | draft/preview/confirmed/export/public fixture/file asset 상태 구분 | pipeline docs, SECURITY, file model |
| `docs.sync_policy` | 코드 변경 시 동기화할 docs/spec/security/frontend 문서 | AGENTS, CLAUDE, docs index |
| `deploy.infra_components` | 인프라 구성 | infra docs, CI |
| `deploy.pipeline_stages` | CI/CD stage | workflows, .gitlab-ci.yml |
| `deploy.environments` | dev/staging/prod 분리 | env config, values files |
| `deploy.container_policy` | base image·healthcheck | Dockerfile |
| `deploy.strategy` | 배포·롤백 전략 | ArgoCD, Kustomize, GitOps docs |
| `directory.monorepo_tree` | 모노레포 트리 | 실제 구조 + README |
| `directory.backend_tree` | 백엔드 트리 | backend/api/server/service structure |
| `directory.frontend_tree` | 프론트 트리 | frontend/web/app/client structure |
| `git.branch_strategy` | 브랜치 전략 | CONTRIBUTING, README |
| `git.commit_convention` | 커밋 메시지 규칙 | commitlint, CONTRIBUTING |
| `git.mr_rules` | MR/PR 규칙 | CODEOWNERS, CONTRIBUTING |
| `ops.availability` | 가용성 목표 | PRD, SLA, 사용자 확인 |
| `ops.monitoring` | 모니터링 대상·지표·도구 | ops docs |
| `ops.incidents` | 장애 유형 × 영향 × 대응 | runbook |
| `ops.backup` | 백업 주기·보관·복구 테스트 | ops docs |
| `ops.mock_fallback` | 시범운영 이전 목업 폴백 정책 | PRD |
