# impakers-dev-standards internal accuracy tests

이 디렉터리는 `impakers-dev-standards` 스킬 자체의 내부 정확성을 평가하기 위한 테스트 자산을 보관한다. 대상은 범용 제품 QA가 아니라, 스킬이 `Discovery → Extraction → Interview → Synthesis → Gate → Handoff` 흐름에서 증거를 왜곡하지 않고 `docs/DEV_STANDARDS.md`를 생성했는지 검증하는 것이다.

## Directory

| Path | Purpose |
|---|---|
| `cases/` | fixture별 평가 의도, fixture, gold, judge rubric 연결 |
| `fixtures/` | 합성 대상 리포 스냅샷 또는 fixture 설명 |
| `gold/` | 기대 슬롯, 기대 인터뷰, 기대 gate verdict 같은 최소 정답셋 |
| `judge/` | LLM Judge rubric, prompt, 리포트 템플릿 |

## Evaluation split

| Check type | Use for |
|---|---|
| Deterministic checks | 파일명, 12장 순서, 필수 표/코드블록, 금지 문자열, evidence 형식, 측정값 분류 |
| LLM Judge checks | evidence와 주장 일치, override 타당성, 불확실성 처리, Chapter 6/8 실행 가능성, 리스크 투명성 |

## Report outputs

평가 실행 결과는 사람이 읽는 Markdown과 CI가 읽는 JSON을 함께 남긴다.

```text
tests/reports/<run-id>.md
tests/reports/<run-id>.json
```

리포트는 `judge/report-template.md`와 `judge/report.schema.json` 형식을 따른다.
