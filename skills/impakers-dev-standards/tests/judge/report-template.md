# impakers-dev-standards 내부 정확성 평가 리포트

## 1. 실행 요약

| 항목 | 값 |
|---|---|
| Run ID | `<run-id>` |
| Fixture | `<fixture-id>` |
| Skill Version | `<version>` |
| 평가 대상 | `docs/DEV_STANDARDS.md` |
| Judge Model | `<model-name>` |
| 실행 일시 | `<yyyy-mm-dd hh:mm>` |
| 최종 판정 | `PASS | WARN | FAIL` |
| 총점 | `<score>` |
| 통과 기준 | `0.82 이상, blocking failure 없음` |

## 2. 최종 판정

**Verdict:** `PASS | WARN | FAIL`

요약:

- `<핵심 근거 1>`
- `<핵심 근거 2>`

Blocking failure:

- `<없음 또는 failure id>`

## 3. Phase별 결과

| Phase | 판정 | 점수 | 주요 결과 |
|---|---:|---:|---|
| Discovery | `<PASS/WARN/FAIL>` | `<score>` | `<summary>` |
| Extraction | `<PASS/WARN/FAIL>` | `<score>` | `<summary>` |
| Interview | `<PASS/WARN/FAIL>` | `<score>` | `<summary>` |
| Synthesis | `<PASS/WARN/FAIL>` | `<score>` | `<summary>` |
| Gate | `<PASS/WARN/FAIL>` | `<score>` | `<summary>` |
| Handoff | `<PASS/WARN/FAIL>` | `<score>` | `<summary>` |

## 4. Deterministic Gate 결과

| Gate | 판정 | 비고 |
|---|---:|---|
| 12장 구조 존재 | `<PASS/WARN/FAIL>` | `<note>` |
| Mermaid 코드블록 존재 | `<PASS/WARN/FAIL>` | `<note>` |
| TODO index 존재 | `<PASS/WARN/FAIL>` | `<note>` |
| 금지 문자열 없음 | `<PASS/WARN/FAIL>` | `<note>` |
| 측정값/proxy/측정 불가 분류 | `<PASS/WARN/FAIL>` | `<note>` |
| 코드블록 언어 태그 | `<PASS/WARN/FAIL>` | `<note>` |

## 5. LLM Judge Rubric 결과

| 기준 | 가중치 | 점수 | 판정 |
|---|---:|---:|---:|
| Evidence fidelity | 35% | `<score>` | `<PASS/WARN/FAIL>` |
| Uncertainty handling | 20% | `<score>` | `<PASS/WARN/FAIL>` |
| Profile correctness | 20% | `<score>` | `<PASS/WARN/FAIL>` |
| Standards actionability | 15% | `<score>` | `<PASS/WARN/FAIL>` |
| Risk transparency | 10% | `<score>` | `<PASS/WARN/FAIL>` |

## 6. 발견된 이슈

### `<ISSUE-ID>`: `<title>`

- Phase: `<phase>`
- 관련 슬롯: `<slot-id 또는 없음>`
- 설명: `<description>`
- 권장 조치: `<action>`

## 7. 회귀 방지 메모

- `<regression note>`

## 8. 산출물

| 산출물 | 경로 |
|---|---|
| Generated DEV_STANDARDS | `<path>` |
| Slot Map | `<path>` |
| Judge JSON | `<path>` |
