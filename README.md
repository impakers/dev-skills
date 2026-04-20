# dev-skills

임패커스 Claude Code 스킬 모음. **npx 한 줄**로 `~/.claude/skills/`에 설치되어, 모든 임패커스 프로젝트에서 자동 주입됩니다.

## 설치

### 권장: `npx skills` 사용 (Vercel의 표준 스킬 CLI)

```bash
npx skills add https://github.com/impakers/dev-skills --skill impakers-components-rules
```

이 방식은 [vercel-labs/skills](https://github.com/vercel-labs/skills) 의 범용 installer를 사용합니다. Claude Code / Cursor / Codex / Windsurf 등 46+ 에이전트 환경에 동일하게 설치됩니다.

**여러 스킬 동시 설치** (`--skill` 반복):

```bash
npx skills add https://github.com/impakers/dev-skills \
  --skill impakers-components-rules
# 추가 스킬이 생기면:
#   --skill impakers-dev-standards \
#   --skill impakers-agentation
```

**기타 명령**:

```bash
npx skills list                                      # 설치된 스킬 목록
npx skills update                                    # 업데이트
npx skills remove impakers-components-rules          # 제거
npx skills find <keyword>                            # 검색
```

### 대체: 자체 CLI 사용 (의존성 0, Node stdlib만)

`skills` 패키지 설치를 원치 않을 때:

```bash
npx -y github:impakers/dev-skills add components-rules
npx -y github:impakers/dev-skills list
npx -y github:impakers/dev-skills add components-rules --force    # 업데이트
npx -y github:impakers/dev-skills remove components-rules
```

**프로젝트 로컬 설치** (특정 repo에만):

```bash
cd <target-project>
npx -y github:impakers/dev-skills add components-rules --project
# → <target-project>/.claude/skills/impakers-components-rules/
```

## 포함된 스킬

| 이름 | 설명 |
|---|---|
| [`impakers-components-rules`](skills/impakers-components-rules/) | 임패커스 UI 컴포넌트 개발 규칙 (shadcn/ui + Tailwind). .tsx 편집 시 자동 주입. |

추가 예정:
- `impakers-dev-standards` (개발표준정의서 제너레이터)
- `impakers-agentation` (Agentation 피드백 도구)

## 구조

```
dev-skills/
├── package.json              npx 진입점 (자체 CLI)
├── bin/cli.mjs               add/remove/list, Node stdlib only, 의존성 0
├── skills/
│   └── impakers-components-rules/
│       ├── SKILL.md           Claude가 로드
│       └── README.md
├── scripts/
│   └── sync-from-workflow.sh  workflow repo로부터 최신 SKILL.md 당겨오기
└── README.md
```

`skills/` 하위 디렉토리는 [vercel-labs/skills 규약](https://github.com/vercel-labs/skills) 의 표준 경로이므로, `npx skills add` CLI가 자동으로 스캔합니다.

## 스킬 트리거 예시

`impakers-components-rules` 스킬은 아래 상황에서 자동 발동:

**자연어 프롬프트**
- "trusflow에 환자 추가 **모달** 만들어줘"
- "이 **Dialog**에서 저장 후 테이블이 새로고침되게"
- "**Sonner toast**로 성공 메시지"
- "**임패커스 UI 규칙**대로 리뷰해줘"
- "삭제 **확인창** 추가해" → AlertDialog 가이드

**파일 편집 감지**
- `.tsx`/`.jsx` 편집 시 `<Dialog>`, `<Sheet>`, `useForm`, `toast.success`, `invalidateQueries` 등 키워드 등장

## 동작 원리

1. `npx skills add https://github.com/impakers/dev-skills --skill impakers-components-rules` 실행
2. `skills` CLI가 repo tarball을 가져와 `skills/impakers-components-rules/` 디렉토리를 식별
3. `~/.claude/skills/impakers-components-rules/` 로 SKILL.md + 부속 파일 설치
4. Claude Code 세션 시작 시 스킬 자동 로드
5. `.tsx` 편집 시 description 매칭으로 자동 주입

## 관리자: 새 스킬 추가

1. `skills/<skill-name>/SKILL.md` 작성 (frontmatter 필수: `name`, `description`)
2. `skills/<skill-name>/README.md` 작성 (선택)
3. README 맨 위의 "포함된 스킬" 표에 항목 추가
4. commit + push

## 관리자: components-rules 원본 동기화

규칙 정본은 [`impakers/workflow`](https://github.com/impakers/workflow) 의 `docs/brand/COMPONENTS_RULES.md`.
이를 이 repo로 가져오려면:

```bash
# workflow repo가 로컬에 체크아웃되어 있을 때
./scripts/sync-from-workflow.sh /path/to/workflow
git add -A && git commit -m "sync: components-rules" && git push
```

또는 `workflow` repo 에 GitHub Actions 를 추가해 자동 푸시.

## 라이선스

UNLICENSED · Internal use (impakers)
