#!/usr/bin/env bash
# scripts/gen-desktop.sh
# Phase 3 – lay down entrypoint, Vue root, boot screen, desktop shell,
# Tailwind config, and base CSS. Safe to rerun (won't overwrite non‑empty files).
set -euo pipefail

root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$root"

## 1. Tailwind + PostCSS configurations -----------------------------------
cat > tailwind.config.js <<'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        macbg: '#c3c7cb'
      },
      fontFamily: {
        chicago: ['ChicagoFLF', 'sans‑serif']
      }
    }
  },
  corePlugins: {
    preflight: false
  }
}
EOF

cat > postcss.config.js <<'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    cssnano: { preset: 'default' }
  }
}
EOF

## 2. Base CSS with system.css import -------------------------------------
mkdir -p src/styles
cat > src/styles/base.css <<'EOF'
@import './system.css';       /* local copy of system.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body { @apply bg-macbg text-black font-chicago; }
EOF

## 3. index.html -----------------------------------------------------------
cat > index.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>THUNDERBIRD.ESQ System‑6</title>
  <link rel="stylesheet" href="/src/styles/base.css" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
EOF

## 4. vite.config.ts -------------------------------------------------------
cat > vite.config.ts <<'EOF'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/',
  build: { target: 'es2019' }
});
EOF

## 5. Vue entry + components ----------------------------------------------
mkdir -p src
cat > src/main.ts <<'EOF'
import { createApp } from 'vue';
import Boot from './views/Boot.vue';
import Desktop from './views/Desktop.vue';

const app = createApp(Boot);

// after 3s, replace Boot with Desktop
setTimeout(() => {
  app.component('Boot', Desktop);
}, 3000);

app.mount('#app');
EOF

mkdir -p src/views

cat > src/views/Boot.vue <<'EOF'
<template>
  <div class="flex items-center justify-center h-screen bg-macbg">
    <img src="/assets/icons/apple.svg" alt="Apple Logo" class="w-16 h-16 mb-4"/>
    <p class="text-black">Welcome to THUNDERBIRD.ESQ</p>
  </div>
</template>
<script setup lang="ts"></script>
EOF

cat > src/views/Desktop.vue <<'EOF'
<template>
  <div class="h-screen w-screen bg-macbg">
    <!-- Placeholder desktop until window manager implemented -->
    <h1 class="p-4">Desktop Shell – Phase 3 stub</h1>
  </div>
</template>
<script setup lang="ts"></script>
EOF

echo "🖥️  Phase 3 files generated."
