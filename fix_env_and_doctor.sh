#!/usr/bin/env bash
# fix_env_and_doctor.sh
# One‑shot helper to:
#   1. Ensure Python 3.11 takes PATH precedence
#   2. Disable Conda base auto‑activation (if present)
#   3. Update ~/.zshrc accordingly
#   4. Execute scripts/doctor.sh with the corrected environment

set -euo pipefail

PY311_DIR="/opt/homebrew/opt/python@3.11/bin"
PY311_BIN="$PY311_DIR/python3.11"
ZSHRC="$HOME/.zshrc"
DOCTOR_SCRIPT="scripts/doctor.sh"

echo "🔧  Fixing environment…"

# 0. sanity
if [[ ! -x "$PY311_BIN" ]]; then
  echo "❌  Python 3.11 binary not found at $PY311_BIN"
  echo "    Install with: brew install python@3.11"
  exit 1
fi

# 1. disable conda auto‑activation, if conda exists
if command -v conda >/dev/null 2>&1; then
  conda config --set auto_activate_base false || true
fi

# 2. ensure PATH export exists and is last (so it wins after conda)
if grep -q 'python@3\.11/bin' "$ZSHRC"; then
  # move any existing line to the bottom
  grep -v 'python@3\.11/bin' "$ZSHRC" > "${ZSHRC}.tmp"
  printf '\nexport PATH="%s:$PATH"\n' "$PY311_DIR" >> "${ZSHRC}.tmp"
  mv "${ZSHRC}.tmp" "$ZSHRC"
else
  printf '\n# THUNDERBIRD.ESQ — python precedence\nexport PATH="%s:$PATH"\n' "$PY311_DIR" >> "$ZSHRC"
fi

echo "✅  ~/.zshrc updated."

# 3. update PATH for this script execution
export PATH="$PY311_DIR:$PATH"
hash -r
echo "PATH now: $PATH"

# 4. run doctor
if [[ ! -x "$DOCTOR_SCRIPT" ]]; then
  echo "❌  $DOCTOR_SCRIPT not executable or missing."
  exit 1
fi

echo "🚑  Running doctor.sh …"
"$DOCTOR_SCRIPT"
