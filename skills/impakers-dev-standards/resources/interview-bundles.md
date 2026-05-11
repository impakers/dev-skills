# Interview Bundles — impakers-dev-standards

Phase 3에서 missing/low/conflict 슬롯만 질문한다. 슬롯별로 따로 묻지 말고 관련 슬롯을 묶어 최대 5개 질문 번들로 제시한다. 한 번 답변받은 슬롯은 같은 라운드에서 재질문하지 않는다.

## 번들 A — 프로젝트 메타

```text
1) 프로젝트 공식 한글명 / 영문명은?
2) 클라이언트(있다면) 이름과 개발사명은?
3) 문서 최종 수정일로 표기할 날짜는? (기본: 오늘)
```

## 번들 B — 기술 스택 & 아키텍처

```text
1) 프론트엔드 · 백엔드 · DB 스택은? (감지된 후보 포함)
2) 인증 방식은? (JWT 쿠키 / OAuth / 세션 / 기타)
3) 외부 연동 시스템 3개 이내를 이름 · 방향 · 상태로 알려주세요.
4) 전체 구조 Mermaid가 없다면 핵심 경로를 한 줄로 설명해 주세요.
```

## 번들 C — RBAC & 불변 규칙

```text
1) 역할 목록과 각 역할의 접근 범위는?
2) 반드시 지켜야 할 비즈니스 규칙 3개 이상은?
3) 규정/컴플라이언스 이슈는? (VoC / PII / GDPR / 국내법)
```

## 번들 D — 품질 · 테스트 · 배포

```text
1) 테스트 전략과 커버리지 목표는?
2) CI/CD 파이프라인 stage는? (감지된 후보 포함)
3) 환경 분리(dev/staging/prod)와 배포 트리거는?
```

## 번들 E — 운영 & 장애

```text
1) 가용성 목표는?
2) 모니터링 도구와 대상은?
3) 주요 장애 유형 3개 이상과 대응 방안은?
4) 백업 주기와 보관 기간은?
```

## 번들 F — 경계 · 검증 · 측정

```text
1) 핵심 기능의 책임 경계는? (client/server/shared, routes/controllers, services/use-cases, domain, infra, UI layer 등)
2) client-only, server-only, shared contract/type/schema를 분리해야 하는 지점은?
3) 외부 입력은 어디서 들어오며 어떤 runtime validation profile로 필수 검증하나요? (기본: TypeScript typia runtime schema 필수. 비-TypeScript면 근거와 대체 validator 명시)
4) source of truth는 무엇인가요? (DB / type schema / registry / snapshot / 외부 시스템 / browser cache 제외 여부)
5) draft/preview/confirmed/export/public fixture/file asset 같은 artifact 상태를 어떻게 구분하나요?
6) 테스트·coverage tooling이 없거나 부족하다면 대체 검증과 남은 리스크는?
7) 코드 변경 시 함께 갱신해야 하는 docs/spec/security/frontend 문서는?
```

## 번들 G — 레이어링/FSD 강제 규칙

```text
1) 이 프로젝트가 채택한 레이어링 패턴은? (기본: Next.js + FSD. 비-FSD면 근거와 대체 패턴: Clean Architecture, Hexagonal, MVC, layered backend, modular monolith, package-by-feature)
2) 레이어별 책임과 public API/export boundary 규칙은?
3) 허용되는 의존 방향과 금지되는 cross-layer import/call은?
4) 파일/모듈이 비대해졌을 때 분리 기준은? (LOC/복잡도/반복 UI·로직/상태 머신/adapter)
5) 레이어링 위반 검증 명령은? (eslint boundaries, depcruise, ArchUnit, import-linter, custom validate script, 수동 QA)
```

응답이 없으면 `<!-- TODO(slot-id): 사용자 응답 대기 -->`를 해당 위치와 TODO 인덱스에 남긴다.
