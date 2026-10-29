#!/usr/bin/env bash
# PostToolUse (Edit/Write) and FileChanged hook: when a file changes, launch the code-reviewer
# subagent (.claude/agents/code-reviewer.md) in the background on the diff
# since the last review. Reviews land in .claude/reviews/<path>.md.
set -euo pipefail

# The headless reviewer loads this project's hooks too; don't let it recurse.
[[ -n "${CLAUDE_REVIEW_CHILD:-}" ]] && exit 0

input=$(cat)
# FileChanged sends .file_path; PostToolUse sends .tool_input.file_path.
file=$(jq -r '.file_path // .tool_input.file_path // empty' <<<"$input")
event=$(jq -r '.event // empty' <<<"$input")

[[ -z "$file" || "$event" == "unlink" || ! -f "$file" ]] && exit 0

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
rel="${file#"$project_dir"/}"

# Only review source/config files; skip build output and dependencies.
case "$rel" in
  */node_modules/*|*/dist/*|.claude/*|*.tsbuildinfo|*package-lock.json) exit 0 ;;
esac
case "$rel" in
  *.ts|*.tsx|*.js|*.jsx|*.css|*.html|*.json|*.yml|*.yaml|*.conf|*Dockerfile) ;;
  *) exit 0 ;;
esac

reviews_dir="$project_dir/.claude/reviews"
snapshot="$reviews_dir/.snapshots/$rel"
report="$reviews_dir/${rel//\//__}.md"
pidfile="$reviews_dir/.snapshots/$rel.pid"
mkdir -p "$(dirname "$snapshot")"

if [[ -f "$snapshot" ]]; then
  diff_text=$(diff -u --label "a/$rel" --label "b/$rel" "$snapshot" "$file" || true)
  # Editors often fire several events per save; nothing new means nothing to review.
  [[ -z "$diff_text" ]] && exit 0
  prompt="Review the changes to \`$rel\` (absolute path: $file). Diff since the last review:

\`\`\`diff
$diff_text
\`\`\`"
else
  prompt="Review \`$rel\` (absolute path: $file). This is the first review of this file, so there is no diff; review the whole file."
fi
cp "$file" "$snapshot"

# A newer save supersedes any review still running for this file.
if [[ -f "$pidfile" ]] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
  kill -- "-$(cat "$pidfile")" 2>/dev/null || true
fi

cd "$project_dir"
CLAUDE_REVIEW_CHILD=1 setsid nohup bash -c '
  claude -p --agent code-reviewer \
    --allowedTools Read Grep Glob \
    --permission-mode dontAsk \
    --no-session-persistence \
    "$1" > "$2.tmp" 2>&1 && mv "$2.tmp" "$2"
' _ "$prompt" "$report" >/dev/null 2>&1 &
echo $! > "$pidfile"

jq -n --arg msg "🔍 code-reviewer started for $rel → .claude/reviews/${rel//\//__}.md" \
  '{systemMessage: $msg}'
