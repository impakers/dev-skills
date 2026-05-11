# Gate Checklist — impakers-dev-standards

Phase 5에서 아래 항목을 검증한다. 실패 시 해당 슬롯만 재인터뷰/재합성한다.

## 구조 Gate

- [ ] 파일명은 `docs/DEV_STANDARDS.md`다.
- [ ] 챕터 1~12가 모두 존재하고 순서가 고정되어 있다.
- [ ] `2. 시스템 아키텍처`에 `mermaid` 코드블록이 1개 이상 있다.
- [ ] `3. 비즈니스 불변 규칙`에 규칙 3개 이상과 백엔드 구현·프론트엔드 구현 칼럼이 있다.
- [ ] `5. 명명규칙`에 언어별 섹션 3개 이상이 있다.
- [ ] `9. 배포`에 pipeline stage 표가 있다.
- [ ] `10. Directory`에 tree 코드블록이 1개 이상 있다.
- [ ] `11. Git`에 branch 표와 commit type 표가 있다.
- [ ] `12. 장애`에 장애 유형 × 대응 표가 있다.

## 개발표준 Gate

- [ ] `6. 개발표준`에 client/server/shared 또는 프로젝트 채택 레이어 경계 표와 source of truth 표가 있다.
- [ ] 기본 FSD profile이면 `app route entry`, `widgets/*/ui`, `features/*/ui`, `entities/*/ui`, `shared/ui`, `components/ui` 책임 표가 있다. 비-FSD override면 controller/service/domain/infra 등 동등 레이어 표가 있다.
- [ ] 허용 의존성, 금지 의존성, public API/export boundary, 예외 승인 기준이 있다.
- [ ] `6. 개발표준` 또는 `8. 품질 기준`에 레이어링 검증 명령(eslint/boundaries/no-restricted-imports/ArchUnit/import-linter/custom validate script/수동 QA 중 실제 적용 항목)과 미검증 리스크가 있다.
- [ ] 기본 TypeScript profile이면 typia runtime schema 필수 적용 표가 있다: TypeScript interface/type source of truth, `unknown` 외부 입력, server action/API route/file upload/parser/IPC/callback 경계, strict typia validator 초과 속성 거부, error status mapping.
- [ ] 비-TypeScript override면 replacement runtime validation profile/validator/schema와 근거가 있다.
- [ ] `as any`, `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`를 표준 허용 예시로 둔 문장이 없다.

## 품질·측정 Gate

- [ ] `8. 품질 기준`에 테스트/coverage tooling 상태와 coverage 측정 가능 여부가 있다.
- [ ] LoC/SLoC/token proxy/search cost 등 정량 지표의 산식·범위·출처가 있다.
- [ ] 검증 명령, 결과, 경고, 수동 QA, 미검증 리스크 표가 있다.
- [ ] coverage/token/time을 근거 없이 exact 값으로 단정한 문장이 없다.
- [ ] 측정값은 `측정값 | proxy | 측정 불가` 중 하나로 분류되어 있다.

## 문서·아티팩트 Gate

- [ ] draft/preview/confirmed/export/public fixture/FileAsset 같은 artifact 등급 표가 있다.
- [ ] 코드 변경 시 함께 갱신해야 하는 docs sync 목록이 있다.
- [ ] 모든 표에 정렬 지정이 있다.
- [ ] 모든 코드블록에 언어 태그가 있다.
- [ ] 깨진 내부 링크가 없다.
- [ ] 이모지·아이콘·hex 컬러 하드코딩이 없다.
- [ ] TODO 인덱스 섹션이 있다. 비어 있어도 헤딩은 남긴다.
