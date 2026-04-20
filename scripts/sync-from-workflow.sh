#!/usr/bin/env bash
# impakers/workflow repo 로부터 components-rules SKILL.md 동기화
#
# 사용:
#   ./scripts/sync-from-workflow.sh [WORKFLOW_REPO_PATH]
#
# WORKFLOW_REPO_PATH 생략 시 ../workflow 기본 시도.

set -euo pipefail

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
WORKFLOW_REPO="${1:-$REPO_ROOT/../workflow}"

SRC_SKILL="$WORKFLOW_REPO/skills/impakers-components-rules/SKILL.md"
DST_SKILL="$REPO_ROOT/skills/impakers-components-rules/SKILL.md"

if [[ ! -f "$SRC_SKILL" ]]; then
  echo "❌ workflow repo의 SKILL.md 경로를 찾을 수 없음:" >&2
  echo "   $SRC_SKILL" >&2
  echo "사용법: $0 [workflow_repo_path]" >&2
  exit 1
fi

cp "$SRC_SKILL" "$DST_SKILL"
echo "✅ 동기화 완료"
echo "   원본: $SRC_SKILL"
echo "   대상: $DST_SKILL"
echo
echo "다음 단계: git add -A && git commit -m 'sync: components-rules' && git push"
