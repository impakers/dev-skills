# dev-skills

임패커스 AI 에이전트 스킬 모음. **npx 한 줄**로 `~/.claude/skills/`에 설치되어, Claude Code / Cursor / Codex / Windsurf 등 여러 에이전트 환경에서 임패커스 프로젝트 규칙을 자동 주입합니다.

## 설치

### 권장: `npx skills` 사용 (Vercel의 표준 스킬 CLI)

```bash
npx skills add https://github.com/impakers/dev-skills --skill impakers-components-rules
```

이 방식은 [vercel-labs/skills](https://github.com/vercel-labs/skills) 의 범용 installer를 사용합니다. Claude Code / Cursor / Codex / Windsurf 등 46+ 에이전트 환경에 동일하게 설치됩니다.

**여러 스킬 동시 설치** (`--skill` 반복):

```bash
npx skills add https://github.com/impakers/dev-skills \
  --skill impakers-components-rules \
  --skill impakers-dev-standards \
  --skill impakers-bz-logic-spec \
  --skill impakers-intent-planning
```

**기타 명령**:

```bash
npx skills list                                      # 설치된 스킬 목록
npx skills update                                    # 업데이트
npx skills remove impakers-components-rules          # 제거
npx skills find <keyword>                            # 검색
```

### 대체: 자체 CLI 사용 (런타임 의존성 0, Node stdlib만)

`skills` 패키지 설치를 원치 않을 때. 배포 CLI 자체는 Node stdlib만 사용하며, repo 개발/검증용 lint·typecheck devDependencies는 별도로 둡니다.

```bash
npx -y github:impakers/dev-skills add components-rules
npx -y github:impakers/dev-skills add dev-standards
npx -y github:impakers/dev-skills add bz-logic-spec
npx -y github:impakers/dev-skills add intent-planning
npx -y github:impakers/dev-skills list
npx -y github:impakers/dev-skills add components-rules --force    # 업데이트
npx -y github:impakers/dev-skills remove components-rules
```

**프로젝트 로컬 설치** (특정 repo에만):

```bash
cd <target-project>
npx -y github:impakers/dev-skills add bz-logic-spec --project
# → <target-project>/.claude/skills/impakers-bz-logic-spec/
```

## 포함된 스킬

| 이름 | 쓰임새 | 주요 산출물/규칙 | 대표 트리거 |
|---|---|---|---|
| [`impakers-intent-planning`](skills/impakers-intent-planning/) | Maker의 발화를 의도 중심 기획/개발 설계 초안으로 변환 | Raw Requirement, Core Intent, Mission/Soul Statement, User Story, Workflow, UI Flow, Development Design Draft, QA-as-Requirement | "기획서 작성", "요구사항에서 의도 도출", "유저 스토리화", "워크플로우 설계", "Agent 개발 기획서" |
| [`impakers-components-rules`](skills/impakers-components-rules/) | 임패커스 프론트엔드 UI 컴포넌트 개발 규칙 | shadcn/ui + Tailwind 기반 Dialog, Sheet, Form, Table, Toast, Query invalidate/revalidate, 접근성/반응형 규칙 | `.tsx`/`.jsx` 편집, "모달", "Dialog", "폼", "toast", "임패커스 UI 규칙" |
| [`impakers-dev-standards`](skills/impakers-dev-standards/) | 프로젝트 문서와 대표 소스 구조를 스캔해 개발표준정의서를 만드는 인터뷰형 제너레이터 | `docs/DEV_STANDARDS.md` 12장 Markdown, Next.js+TypeScript+FSD+typia 기본 profile, 리소스 기반 슬롯/질문/게이트 | "개발표준정의서 만들어줘", "DEV_STANDARDS.md 작성", "표준 문서화" |
| [`impakers-bz-logic-spec`](skills/impakers-bz-logic-spec/) | 클라이언트 요구사항과 원본 자료를 비즈니스 로직 중심의 표준 docs 구조로 정리 | `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `docs/raw-specs/`, `docs/product-specs/`, `docs/design-docs/`, `docs/exec-plans/` 스캐폴드와 문서 라우팅 규칙 | "프로젝트 스펙 정리", "docs 셋업", "raw-specs 정리", "PRD 정리", "회의록/엑셀 스펙 정리", "레거시 코드 분석" |

## 어떤 스킬을 설치할까

- Maker 발화, 신규 서비스 아이디어, 기능 요청을 의도 중심 기획서로 먼저 풀어야 하는 경우: `impakers-intent-planning`
- 프론트엔드 UI를 자주 수정하는 프로젝트: `impakers-components-rules`
- 신규/기존 프로젝트의 개발표준정의서가 필요한 경우: `impakers-dev-standards`
- 클라이언트 자료, 회의록, PRD, 엑셀, 레거시 로직을 구현 가능한 스펙 체계로 정리해야 하는 경우: `impakers-bz-logic-spec`
- 신규 프로젝트 킥오프라면 네 스킬을 모두 설치하는 것을 권장합니다.

## 추가 예정/검토 후보

아래 항목은 아직 이 repo에 포함된 스킬이 아닙니다. 추가 시 `skills/<skill-name>/` 디렉토리와 README 표를 함께 갱신합니다.

- `impakers-agentation`: Agentation 피드백 도구 설치/사용 규칙
- `impakers-api-contract-rules`: API 계약, 응답 포맷, OpenAPI/DTO 규칙
- `impakers-qa-fixtures`: product spec 수용 기준을 QA 시나리오와 fixture로 변환하는 규칙

## 구조

```
dev-skills/
├── package.json              npx 진입점 (자체 CLI)
├── bin/cli.mjs               add/remove/list, Node stdlib only at runtime
├── eslint.config.mjs         repo lint gate
├── tsconfig.json             repo typecheck gate
├── skills/
│   ├── impakers-intent-planning/
│   │   ├── SKILL.md
│   │   ├── README.md
│   │   └── resources/
│   │       ├── feedback-gates.md
│   │       ├── output-template.md
│   │       ├── qa-as-requirement.md
│   │       ├── skill-connection-map.md
│   │       └── stage-catalog.md
│   ├── impakers-components-rules/
│   │   ├── SKILL.md           에이전트가 로드
│   │   └── README.md
│   ├── impakers-dev-standards/
│   │   ├── SKILL.md
│   │   ├── README.md
│   │   ├── scripts/
│   │   │   ├── dev-standards.contract.example.json
│   │   │   ├── dev-standards.schema.json
│   │   │   ├── validate-dev-standards.mjs
│   │   │   ├── validate-fsd-structure.mjs
│   │   │   └── validate-typia-runtime-policy.mjs
│   │   └── resources/
│   │       ├── gate-checklist.md
│   │       ├── interview-bundles.md
│   │       ├── slot-catalog.md
│   │       └── synthesis-template.md
│   └── impakers-bz-logic-spec/
│       ├── SKILL.md
│       ├── README.md
│       ├── scripts/create_standard_docs.py
│       └── templates/standard-docs/
├── scripts/
│   └── sync-from-workflow.sh  workflow repo로부터 최신 SKILL.md 당겨오기
└── README.md
```

`skills/` 하위 디렉토리는 [vercel-labs/skills 규약](https://github.com/vercel-labs/skills) 의 표준 경로이므로, `npx skills add` CLI가 자동으로 스캔합니다.

## 검증 명령

```bash
npm run lint                         # ESLint flat config 기반 repo lint
npm run typecheck                    # TypeScript project gate
npm run validate                     # impakers-dev-standards skill/schema/fixture 검증
npm run validate:dev-standards       # DEV_STANDARDS.md 없으면 경고만 출력
npm run validate:dev-standards:strict # 실제 docs/DEV_STANDARDS.md까지 엄격 검증
```

`impakers-dev-standards` 스킬에는 대상 프로젝트가 가져다 쓸 수 있는 검증 스크립트도 포함됩니다. 특히 `validate-dev-standards.mjs`는 `--skill <SKILL.md>` 옵션으로 설치된 스킬 본문과 `resources/`까지 함께 읽어 v0.4 슬롯·FSD·typia marker를 검증합니다.

## 스킬 트리거 예시

### impakers-intent-planning

아래 상황에서 Maker 발화를 의도 중심 기획 산출물로 변환합니다.

**자연어 프롬프트**
- "**기획서 작성**해줘"
- "이 요구사항에서 **핵심 의도 도출**해줘"
- "**유저 스토리화**하고 워크플로우 잡아줘"
- "**Agent 개발 기획서**로 정리해줘"
- "이 기능 아이디어를 Mission/Soul/QA 기준까지 풀어줘"

**자료 유형**
- Maker 구두 발화, 채팅 메모, 기능 요청, UX 불편, 신규 서비스 아이디어, 문제 상황 설명

### impakers-components-rules

아래 상황에서 UI 컴포넌트 규칙을 자동 참조합니다.

**자연어 프롬프트**
- "trusflow에 환자 추가 **모달** 만들어줘"
- "이 **Dialog**에서 저장 후 테이블이 새로고침되게"
- "**Sonner toast**로 성공 메시지"
- "**임패커스 UI 규칙**대로 리뷰해줘"
- "삭제 **확인창** 추가해" → AlertDialog 가이드

**파일 편집 감지**
- `.tsx`/`.jsx` 편집 시 `<Dialog>`, `<Sheet>`, `useForm`, `toast.success`, `invalidateQueries` 등 키워드 등장

### impakers-dev-standards

아래 상황에서 대상 repo의 문서와 대표 소스 구조를 스캔하고 `docs/DEV_STANDARDS.md` 초안 생성을 돕습니다. 기본 profile은 Next.js + TypeScript + FSD + typia runtime schema이며, 비해당 프로젝트는 증거 기반 override를 남깁니다.

**자연어 프롬프트**
- "**개발표준정의서** 만들어줘"
- "**DEV_STANDARDS.md** 작성해줘"
- "프로젝트 docs 읽고 **표준 문서화**해줘"
- "신규 프로젝트 초기 문서화 번들 만들어줘"

**파일/문서 감지**
- `docs/`, `README.md`, `CLAUDE.md`, `AGENTS.md`, `PRD`, `SCOPE`, `ARCH`, `ADR`, API 문서가 있고 개발표준정의서가 없거나 재작성 요청이 있는 경우

### impakers-bz-logic-spec

아래 상황에서 원본 자료와 정규화된 스펙을 분리하고, Harness/에이전트가 읽기 좋은 문서 구조를 만듭니다.

**자연어 프롬프트**
- "클라이언트 **요구사항을 프로젝트 스펙으로 정리**해줘"
- "**docs 셋업**하고 raw-specs/product-specs/design-docs 구조 잡아줘"
- "회의록, 엑셀, 화면기획서 기준으로 **비즈니스 로직 문서화**해줘"
- "레거시 Python/Apps Script/VBA 로직을 새 프로젝트 스펙으로 번역해줘"

**자료 유형**
- PRD, 회의록, 화면기획서, 엑셀 기능정의서, API/ERP 문서, 출력 템플릿, 샘플 데이터, 레거시 자동화 코드

## 동작 원리

1. `npx skills add https://github.com/impakers/dev-skills --skill <skill-name>` 실행
2. `skills` CLI가 repo tarball을 가져와 `skills/<skill-name>/` 디렉토리를 식별
3. `~/.claude/skills/<skill-name>/` 로 `SKILL.md`와 부속 파일을 설치
4. 에이전트 세션 시작 시 설치된 스킬을 로드
5. `SKILL.md` frontmatter의 `description`과 사용자 프롬프트/편집 파일이 매칭되면 해당 스킬이 자동 주입


### impakers-bz-logic-spec 스캐폴드 생성

신규 프로젝트에서 표준 문서 구조를 먼저 만들 때 사용합니다.

```bash
python3 ~/.claude/skills/impakers-bz-logic-spec/scripts/create_standard_docs.py \
  --target /path/to/project \
  --project-name "프로젝트명" \
  --client-name "클라이언트명"
```

기본 생성물:

```text
AGENTS.md
CLAUDE.md
README.md
ARCHITECTURE.md
docs/PRODUCT_SENSE.md
docs/PLANS.md
docs/raw-specs/README.md
docs/references/index.md
docs/product-specs/index.md
docs/product-specs/_feature-template.md
docs/design-docs/index.md
docs/design-docs/_adr-template.md
docs/design-docs/_intent-mission-template.md
docs/design-docs/_workflow-design-template.md
docs/generated/.gitkeep
docs/exec-plans/active/.gitkeep
docs/exec-plans/completed/.gitkeep
docs/test-plans/.gitkeep
docs/test-plans/_qa-as-requirement-template.md
docs/exec-plans/active/_vertical-slice-template.md
```

`docs/raw-specs/` 원본 파일명은 `yy-mm-dd-[purpose]-raw-file.{ext}` 규칙을 사용합니다. 예: `26-04-03-kickoff-meeting-raw-file.md`, `26-04-08-feature-spec-raw-file.xlsx`.

## 관리자: 새 스킬 추가

1. `skills/<skill-name>/SKILL.md` 작성 (frontmatter 필수: `name`, `description`)
2. `skills/<skill-name>/README.md` 작성 (선택)
3. README의 "포함된 스킬", "스킬 트리거 예시", 필요 시 "어떤 스킬을 설치할까"에 항목 추가
4. 자체 CLI에서 인식되는지 확인: `node bin/cli.mjs list`
5. commit + push

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
