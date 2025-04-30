#!/usr/bin/env bash
# scripts/doctor.sh
# THUNDERBIRD.ESQ environment diagnostic
# Exit 0 if all checks pass, 1 otherwise.

set -euo pipefail

RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
RESET="\033[0m"

fail=false

say() { printf "%b\n" "$1"; }

check_version() {
  local name="$1" cmd="$2" pattern="$3" expect="$4"
  local ver
  if ! ver=$( $cmd 2>/dev/null ); then
    say "${RED}✗ $name not found ($cmd)${RESET}"; fail=true; return
  fi
  if echo "$ver" | grep -E -q "$pattern"; then
    say "${GREEN}✓ $name OK — $(echo $ver | head -n1)${RESET}"
  else
    say "${YELLOW}⚠ $name version mismatch (found: $(echo $ver | head -n1); expected: $expect)${RESET}"
    fail=true
  fi
}

say "🔍  THUNDERBIRD.ESQ doctor running…"

# macOS check
if sw_vers >/dev/null 2>&1; then
  macver=$(sw_vers -productVersion)
  major="${macver%%.*}"
  if (( major >= 11 )); then
    say "${GREEN}✓ macOS $macver${RESET}"
  else
    say "${YELLOW}⚠ macOS $macver — require ≥ 11.0${RESET}"; fail=true
  fi
else
  say "${RED}✗ Not macOS — script designed for macOS${RESET}"; fail=true
fi

check_version "Node.js" "node -v" "^v20\.14" "v20.14.x"
check_version "pnpm" "pnpm -v" "^8\.15" "8.15.x"
check_version "Python" "python3 --version" "^Python 3\.11" "3.11.x"
check_version "Git" "git --version" "^git version 2\.[4-9]" "≥ 2.40"
check_version "VS Code CLI" "code -v" "^[1-9]" "1.x"

# NVM
if command -v nvm >/dev/null 2>&1 || [ -s "$HOME/.nvm/nvm.sh" ]; then
  say "${GREEN}✓ NVM present${RESET}"
else
  say "${YELLOW}⚠ NVM not detected (recommended)${RESET}"
fi

# Homebrew
if command -v brew >/dev/null 2>&1; then
  say "${GREEN}✓ Homebrew present${RESET}"
else
  say "${YELLOW}⚠ Homebrew missing — optional but useful${RESET}"
fi

if [ "$fail" = true ]; then
  say "${RED}❌ Environment check FAILED${RESET}"
  exit 1
else
  say "${GREEN}✅ All green — environment ready!${RESET}"
fi
