# Fixtures

이 디렉터리는 `impakers-dev-standards` 내부 정확성 평가에 사용하는 합성 대상 리포 fixture를 보관한다. 각 fixture는 최소한 README, docs, 설정 파일, 대표 source tree 중 평가 목적에 필요한 파일만 포함한다.

초기 case matrix는 다음 fixture ID를 예약한다.

| Fixture | Purpose |
|---|---|
| `next-ts-fsd-typia-rich` | 기본 profile happy path |
| `non-default-stack-override` | 비기본 stack override 검증 |
| `sparse-readme-only` | 정보 부족 시 interview/TODO 검증 |
| `conflicting-docs` | evidence 충돌 처리 검증 |
| `no-coverage-tooling` | coverage tooling 부재 검증 |
| `artifact-confusion` | artifact/source-of-truth 혼동 방지 |
| `boundary-validation-edge` | client/server/shared 및 runtime validation 경계 검증 |
