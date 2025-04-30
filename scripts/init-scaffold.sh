#!/usr/bin/env bash
# scripts/init-scaffold.sh
# THUNDERBIRD.ESQ Phase 1 – repo scaffold generator
# Creates the standard folder tree and seed documents.
# Safe to rerun; it will not overwrite existing non‑empty files.

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
echo "📁  Initialising scaffold in $ROOT_DIR"

# Directories to create
dirs=(
  "apps"
  "assets/audio"
  "assets/fonts"
  "assets/icons"
  "docs"
  "rules"
  "scripts"
  "src"
)

for d in "${dirs[@]}"; do
  mkdir -p "$ROOT_DIR/$d"
done

# Seed files with templated skeletons — created only if missing or empty
create_if_empty() {
  local file="$1"
  local content="$2"
  if [[ ! -s "$file" ]]; then
    echo "$content" > "$file"
    echo "✚  $file"
  fi
}

year=$(date +%Y)
today=$(date +%F)

create_if_empty "$ROOT_DIR/README.md" "# THUNDERBIRD.ESQ – System‑6 Construct

Experimental, offline‑first emulation of Apple System 6 inside the browser.
Built with Vite + Vue 3 + Tailwind. No external CDNs.
"

create_if_empty "$ROOT_DIR/.gitignore" "# Node
node_modules
.pnpm-store

# macOS
.DS_Store

# VS Code
.vscode

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
"

create_if_empty "$ROOT_DIR/DEVLOG.md" "# Dev Log

## $today
* Bootstrap scaffold generated.

"

create_if_empty "$ROOT_DIR/docs/PRD.md" "# Product Requirements Document

*Last updated: $today*

## Vision
Emulate System 6 experience in modern browsers, fully self‑contained.

## Core Goals
1. Zero external network calls.
2. Pixel‑perfect UI per Apple HIG 1992.
3. Modular micro‑apps (Chiptune, BIG GIFS, Sprite Slicer).
"

create_if_empty "$ROOT_DIR/rules/conventions.md" "# Contribution Conventions

*No placeholders. No external CDNs. Pull Requests must:*

1. Build via \`npm run build\` without warnings.
2. Include tests or validation scripts.
3. Respect folder structure defined in init‑scaffold.sh.
"

echo "✅  Scaffold complete."
