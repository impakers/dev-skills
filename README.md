# dev-skills

임패커스 Claude Code 스킬 모음. **npx 한 줄**로 `~/.claude/skills/`에 설치되어, 모든 임패커스 프로젝트에서 자동 주입됩니다.

## 설치

### 1. 단일 스킬 설치

```bash
npx -y github:impakers/dev-skills add impakers-components-rules
# 또는 접두어 생략:
npx -y github:impakers/dev-skills add components-rules
```

### 2. 목록 확인

```bash
npx -y github:impakers/dev-skills list
```

### 3. 업데이트

```bash
npx -y github:impakers/dev-skills add components-rules --force
```

### 4. 제거

```bash
npx -y github:impakers/dev-skills remove components-rules
```

### 5. 프로젝트 로컬 설치

특정 repo에만 적용하고 싶을 때:

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
- 등등

## 구조

```
dev-skills/
├── package.json              npx 진입점
├── bin/cli.mjs               add/remove/list CLI (Node stdlib only, 의존성 0)
├── skills/
│   └── impakers-components-rules/
│       ├── SKILL.md           Claude가 로드
│       └── README.md
├── scripts/
│   └── sync-from-workflow.sh  workflow repo로부터 최신 SKILL.md 당겨오기
└── README.md
```

## 동작 원리

1. `npx -y github:impakers/dev-skills add <skill>` 실행
2. npm이 GitHub tarball을 임시 디렉토리에 다운로드
3. `package.json`의 `bin.dev-skills` → `bin/cli.mjs` 실행
4. CLI가 `skills/<skill>/` 전체를 `~/.claude/skills/<skill>/` 로 복사
5. Claude Code 세션 시작 시 스킬 자동 로드

## 관리자: 새 스킬 추가

1. `skills/<skill-name>/SKILL.md` 작성 (frontmatter 필수: `name`, `description`)
2. `skills/<skill-name>/README.md` 작성 (선택)
3. README 맨 위의 "포함된 스킬" 표에 항목 추가
4. commit + push

## 관리자: 규칙 원본 동기화 (components-rules)

원본은 `impakers/workflow` repo의 `docs/brand/COMPONENTS_RULES.md`.
이를 이 repo로 가져오려면:

```bash
# 로컬에 workflow repo 체크아웃이 있을 때
./scripts/sync-from-workflow.sh /path/to/workflow
```

또는 `workflow` repo에 GitHub Actions를 추가하여 이 repo로 자동 푸시.

## 라이선스

UNLICENSED · Internal use (impakers)
