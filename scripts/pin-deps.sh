#!/usr/bin/env bash
# scripts/pin-deps.sh  (v2)
# 1) copies package.template.json ➜ package.json
# 2) generates pnpm-lock.yaml
# 3) installs deterministically with --frozen-lockfile

set -euo pipefail
root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# Copy template
cp "$root/package.template.json" "$root/package.json"

cd "$root"

# Generate lockfile first pass
pnpm install --lockfile-only --no-frozen-lockfile

# Deterministic install
pnpm install --frozen-lockfile

echo "📦  Dependencies installed and lockfile generated."
