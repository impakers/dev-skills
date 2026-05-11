# Synthesis Template — impakers-dev-standards

Phase 4에서 이 파일을 읽고 `docs/DEV_STANDARDS.md`를 작성한다. 12장 순서는 고정이며 `#####` 이하 헤딩은 금지한다.

## 12장 구조

| # | 챕터 | 최소 섹션 |
| :---: | :--- | :--- |
| 1 | 개요 | 준수 원칙 · 적용 범위 · 주요 용어 사전 |
| 2 | 시스템 아키텍처 | 전체 구조 Mermaid · 기술 스택 · 핵심 모듈 · RBAC · 패턴 · 연동 포인트 |
| 3 | 비즈니스 불변 규칙 | 규칙 표(백엔드 구현 × 프론트엔드 구현) + 컴플라이언스 |
| 4 | 데이터 분류 및 보안 | 등급표 · API 보안 · 보안 체크리스트 |
| 5 | 명명규칙 표준 | 공통 원칙 · 언어별 · DB · API · 도메인 용어 매핑 |
| 6 | 개발표준 | 레이어링 · FSD 강제 · 경계 설계 · DTO · 런타임 검증 · 예외 · 트랜잭션 · 로깅 · 테스트 · 주석 |
| 7 | UI/UX 표준 | 디자인 원칙 · 컬러 · 컴포넌트 · 레이아웃 · 반응형 |
| 8 | 품질 기준 | 데이터 품질 · 코드 품질 · 측정 방법 · 검증 로그 · 완료 기준 |
| 9 | 배포 및 CI/CD 표준 | 인프라 · 파이프라인 · 환경 분리 · 컨테이너 · 전략 |
| 10 | Directory 표준 | 모노레포 · 백엔드 · 프론트엔드 트리 |
| 11 | Git 컨벤션 | 브랜치 · 커밋 · MR |
| 12 | 장애 대응 및 모니터링 | 가용성 · 모니터링 · 장애 유형 · 백업 · 선택적 목업 폴백 |

## 채우기 규칙

1. 표는 정렬 지정자를 포함한다.
2. 코드블록은 언어 태그(`ts`, `java`, `sql`, `yaml`, `bash`, `mermaid` 등)를 단다.
3. 사실 주장은 각주 또는 표 칼럼으로 `파일:라인` 증거를 연결한다.
4. 이모지·아이콘·hex 컬러·브랜드 시각 요소는 넣지 않는다. 렌더러가 처리한다.
5. 미결 슬롯은 `<!-- TODO(slot-id): ... -->`로 남기고 부록 TODO 인덱스에 모은다.
6. 본문은 한국어 우선, 식별자는 영어 유지.
7. coverage/token/time/LoC/search cost는 `측정값 | proxy | 측정 불가` 중 하나로 출처·산식·범위를 쓴다.
8. client-only, server-only, shared contract, source of truth, temporary cache/browser storage를 같은 경계 표에서 구분한다.
9. 기본 profile에서는 Next.js + TypeScript + FSD + typia runtime schema를 적용한다. 비-Next/비-TypeScript/비-FSD는 명확한 증거와 override를 쓰고 실제 채택 기준을 우선한다.
10. Chapter 6에는 `app route entry`, `widgets/*/ui`, `features/*/ui`, `entities/*/ui`, `shared/ui`, `components/ui` 책임·허용 의존성·금지 의존성·public API/export boundary·예외 승인 기준·검증 명령을 표로 쓴다.
11. Chapter 6에는 TypeScript `interface`/`type` source of truth, `unknown` 외부 입력, server action/API route/file upload/parser/IPC/external callback 경계, mandatory typia runtime schema, strict typia validator 초과 속성 거부, field/path/expected 요약, HTTP/error status mapping을 표로 쓴다.

## 출력 뼈대

````markdown
# 개발표준정의서 — {project.name_ko}

**프로젝트:** {project.name_en}
**클라이언트:** {project.client} · **개발사:** {project.vendor}
**최종 수정일:** {project.last_modified}

> 본 문서는 {evidence summary} 기준으로 작성되었으며 원본 스냅샷은 필요 시 `docs/raw-specs/`에 보관한다.

## 목차

1. [개요](#1-개요) … 12. [장애 대응 및 모니터링](#12-장애-대응-및-모니터링)

## 1. 개요
### 준수 원칙
### 적용 범위
### 주요 용어 사전

## 2. 시스템 아키텍처
### 전체 구조
```mermaid
...
```
### 기술 스택
### 핵심 모듈
### RBAC 역할 및 접근 권한
### 아키텍처 패턴
### 연동 포인트

## 3. 비즈니스 불변 규칙
## 4. 데이터 분류 및 보안
## 5. 명명규칙 표준
## 6. 개발표준
### 레이어링 및 경계 설계
### 레이어링 강제 규칙
### DTO/계약 및 source of truth
### 런타임 검증 및 에러 매핑
### 예외 · 트랜잭션 · 로깅
### 테스트 · 주석 표준
## 7. UI/UX 표준
## 8. 품질 기준
### 데이터 품질 기준
### 코드 품질 기준
### 측정 방법 및 coverage 상태
### 검증 로그 및 수동 QA 기록
### 완료 기준과 미검증 리스크
## 9. 배포 및 CI/CD 표준
## 10. Directory 표준
## 11. Git 컨벤션
## 12. 장애 대응 및 모니터링

## 부록 A — TODO 인덱스
- [ ] {slot-id}: {짧은 설명}

## 부록 B — 증거 각주
[^fn1]: path/to/source.md:42
````

## 과장 방지 규칙

- coverage tooling 또는 test/spec 파일이 없으면 coverage percentage를 쓰지 말고 `측정 불가`와 대체 검증을 적는다.
- LLM/API 사용량 metadata 또는 tokenizer 실측이 없으면 exact token이 아니라 `token proxy`로 표기한다.
- preview/draft artifact를 confirmed/export artifact처럼 표현하지 않는다.
- browser storage, mock data, public fixture, screenshot을 업무 source of truth로 쓰지 않는다.
- entry/controller/page 파일에 orchestration을 넘어 도메인 상태·비즈니스 로직·데이터 변환이 남아 있으면 분리 대상으로 기록한다.
- 레이어링 import/dependency gate 또는 수동 QA 증거가 없으면 준수 완료라고 단정하지 않고 `미검증 리스크`로 남긴다.
