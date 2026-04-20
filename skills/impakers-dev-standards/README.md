# impakers-dev-standards

**개발표준정의서(`DEV_STANDARDS.md`) 제너레이터** — 대상 리포의 `docs/`, README, CLAUDE.md, AGENTS.md, PRD/SCOPE/ARCH/ADR/API 등을 스캔해 12장 구조의 개발표준 Markdown 초안을 생성합니다. 누락 슬롯은 **인터뷰**로 채우고, 렌더링(브랜드/DOCX/PDF)은 별도 렌더러 앱이 담당합니다.

## 내용

- **범용 Markdown 출력** (아이콘·컬러·브랜드 스타일 주입 금지)
- **6-Phase 파이프라인**: Discovery → Extraction → Interview → Synthesis → Gate → Handoff
- **12장 고정 템플릿**: 개요 / 아키텍처 / 불변규칙 / 보안 / 명명규칙 / 개발표준 / UI-UX / 품질 / 배포 / 디렉토리 / Git / 장애대응
- **슬롯 카탈로그 54개** (증거 인용 기반 추출)
- 누락 슬롯은 `<!-- TODO(slot-id): ... -->` 주석으로 명시

## 설치

```bash
# 권장: Vercel의 표준 skills CLI
npx skills add https://github.com/impakers/dev-skills --skill impakers-dev-standards

# 대체: 자체 CLI
npx -y github:impakers/dev-skills add dev-standards
```

## 트리거

사용자가 아래 중 하나를 언급하면 자동 발동:

- **"개발표준정의서 만들어줘"**
- **"dev standards 문서 생성"**
- **"DEV_STANDARDS.md 작성"**
- **"표준 문서화해줘"**
- 신규 프로젝트 초기 문서화 번들 요청
- 대상 리포에 PRD/SCOPE/ARCH 중 하나 이상 있으나 `docs/DEV_STANDARDS.md` 가 없는 상태

## 산출물

| 파일 | 포맷 | 필수 |
|---|---|---|
| `docs/DEV_STANDARDS.md` | Markdown | ✅ |
| `docs/raw-specs/` (수집 로그) | Markdown | 선택 |

## 사용 예시

```
User: "개발표준정의서 만들어줘. docs 다 읽고."

Claude: [스킬 로드]
  Phase 1 Discovery  — docs/ 38개 파일 스캔, 4개 카테고리로 분류
  Phase 2 Extraction — 슬롯 54개 중 41개 추출 (evidence 포함)
  Phase 3 Interview  — 누락 13개 중 7개 Bundle 형식으로 질문
  Phase 4 Synthesis  — 12장 초안 작성
  Phase 5 Gate       — 품질 체크리스트 검증
  Phase 6 Handoff    — docs/DEV_STANDARDS.md 저장 + 렌더러 URL 안내
```

## 렌더러 연동

생성된 Markdown은 별도 배포된 **임패커스 렌더러 앱**에 업로드하면 아이콘·Pretendard·브랜드 컬러가 적용된 화면/DOCX/PDF 로 내보낼 수 있습니다. (URL은 환경변수 `IMPAKERS_RENDERER_URL` 또는 CLAUDE.md 로부터 읽음)

## 원본

원본 스킬 정의는 [`impakers/workflow`](https://github.com/impakers/workflow) 의 `docs/SKILLS.md` 에 있으며, 본 repo의 `SKILL.md` 는 그 사본입니다.
