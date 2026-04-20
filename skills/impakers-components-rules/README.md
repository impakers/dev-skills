# impakers-components-rules

임패커스 UI 컴포넌트 개발 규칙 (shadcn/ui + Tailwind 기반) Claude Code 스킬.

## 내용

`.tsx`/`.jsx` 편집 시 Claude가 아래 규칙을 자동 참조:

- **§0 핵심 원칙** — Depth 최소화, shadcn 기본 사용
- **§1 Table** — 헤더 필터, 통합 검색, 페이지네이션, 행/다중 액션
- **§2 Modal (Dialog)** — 2개 이하 액션, sticky footer, 닫힘 방지, **2.11 invalidate/revalidate**
- **§3 Card** — 통계에 지양, 그룹화에 사용
- **§4 Form** — react-hook-form + zod, 제출 상태 UX
- **§5 Toast (Sonner)** — 메시지 작성법, 중복 병합
- **§6 Selection** — Select / Combobox / Dropdown 분기
- **§7 Button** — variant 의미 고정
- **§8 Badge / Skeleton**
- **§9 Tooltip / Popover / HoverCard**
- **§10 Loading / Empty / Error**
- **§11 접근성**
- **§12 반응형**

## 설치

```bash
# 권장: Vercel의 표준 skills CLI
npx skills add https://github.com/impakers/dev-skills --skill impakers-components-rules

# 대체: 자체 CLI
npx -y github:impakers/dev-skills add components-rules
```

## 트리거

Claude가 아래를 감지하면 이 스킬을 자동 추천:

- `.tsx`/`.jsx` 파일 편집/생성
- `Dialog`, `AlertDialog`, `Sheet`, `Drawer`, `Popover`
- `react-hook-form` + `zodResolver`
- `DataTable`, TanStack Table
- `toast`, `sonner`
- `invalidateQueries`, `revalidatePath`
- 발화: "모달", "다이얼로그", "컴포넌트 규칙", "UI 규칙"

## 원본

규칙 원본은 [`impakers/workflow`](https://github.com/impakers/workflow) 의 `docs/brand/COMPONENTS_RULES.md`.
이 스킬의 `SKILL.md` 는 해당 원본과 자동 동기화.
