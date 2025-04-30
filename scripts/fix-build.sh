#!/usr/bin/env bash
# scripts/fix-build.sh
# One‑shot Phase‑3 finisher:
#   • ensures system.css + Apple logo asset
#   • rewrites Boot.vue to reference the asset in /public
#   • runs npm run build and reports status

set -euo pipefail

root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$root"

echo "🔧  Phase‑3 fixer starting…"

### 1. system.css ----------------------------------------------------------
if [[ ! -f src/styles/system.css ]]; then
  echo "⬇  Fetching system.css"
  curl -sS https://raw.githubusercontent.com/kg8m/system.css/main/dist/system.css         -o src/styles/system.css
fi

### 2. Apple logo asset ----------------------------------------------------
mkdir -p public
if [[ ! -f public/apple.svg ]]; then
  echo "⬇  Fetching apple.svg"
  curl -sS https://raw.githubusercontent.com/kg8m/system.css/main/assets/apple.svg         -o public/apple.svg
fi

### 3. Patch Boot.vue path -------------------------------------------------
boot_view=src/views/Boot.vue
if grep -q 'assets/icons/apple.svg' "$boot_view"; then
  echo "✏️  Rewriting image src in Boot.vue"
  sed -i '' 's@/assets/icons/apple.svg@/apple.svg@' "$boot_view"
fi

### 4. Build ---------------------------------------------------------------
echo "🏗️  Running production build…"
if npm run build; then
  echo "✅  Build succeeded!"
  exit 0
else
  echo "❌  Build failed."
  exit 1
fi
