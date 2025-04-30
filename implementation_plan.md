# THUNDERBIRD.ESQ — System‑6 Construct

> **Purpose**  Build a fully self‑contained, browser‑based emulation of Apple System 6, complete with boot screen, desktop shell, pixel‑art utilities, and Gmail‑driven outreach automation. This plan breaks the work into atomic steps, each with precise technical actions, success criteria, and a mini troubleshooting guide.

---

## 🗺️ Roadmap Summary

| Phase | Goal | Output artifact |
|-------|------|-----------------|
| 0 | Environment sanity check | validated local toolchain report |
| 1 | Bootstrap repo scaffold | `system6-bootstrap` branch + baseline commit |
| 2 | Dependency pinning & build chain | lock‑file + `npm run build` green |
| 3 | Desktop shell & boot screen | rendered HTML/CSS on `localhost:5173` |
| 4 | Iconography & assets pipeline | optimized PNG/SVG, hashed to `assets/` |
| 5 | Utility apps (Chiptune, BIG GIFS, Sprite Slicer) | lazy‑loaded micro‑frontends |
| 6 | Automation wing (Gmail API) | serverless function + transcript DB |
| 7 | CI/CD & GitHub Pages deploy | `main` auto‑build + Pages URL live |
| 8 | Hardening & release tagging | v1.0.0 tag + CHANGELOG |

Each phase is atomic and capped at ≤300 LoC to enforce rapid review loops.

---

## Phase 0 – Environment Sanity Check

### Actions
1. Verify OS macOS ≥ 11.0: `sw_vers -productVersion`
2. Install Node 20 LTS: `nvm install 20.14.0 && nvm use 20.14.0`
3. Install PNPM 8: `corepack enable && corepack prepare pnpm@8.15.3 --activate`
4. Clone repo: `git clone git@github.com:your-org/thunderbird.esq.git && cd thunderbird.esq`
5. Run diagnostic: `scripts/doctor.sh` (checks Git, Node, PNPM, Python 3.11, VS Code)

### Success Criteria
* `doctor.sh` exits 0 and prints “All green”.

### Troubleshooting
| Symptom | Root cause | Fix |
|---------|------------|-----|
| `node: command not found` | nvm not sourced | add NVM lines to shell rc and reload |
| Unsupported pnpm version | corepack not activated | run corepack enable + prepare |

---

## Phase 1 – Bootstrap Repo Scaffold

### Actions
1. `git checkout -b system6-bootstrap`
2. `scripts/init-scaffold.sh` creates folders and seed docs
3. `git add . && git commit -m "feat: bootstrap scaffold"`

### Success Criteria
* Repo tree matches spec, push succeeds.

### Troubleshooting
| Symptom | Cause | Fix |
|---------|-------|-----|
| TODO tags remain | init interrupted | rerun script with `--force` |
| Push rejected | protected main | open PR |

---

## Phase 2 – Dependency Pinning & Build Chain

### Actions
1. Copy `package.template.json` ➜ `package.json`
2. Pin versions: vite 5.2.3, postcss 8.4.24, cssnano 6.0.1, tailwindcss 3.5.4
3. `pnpm install --frozen-lockfile`
4. `npm run build`
5. Commit lock‑file on success

### Troubleshooting
| Error | Cause | Resolution |
|-------|-------|------------|
| peer postcss mismatch | cssnano preset | add `.npmrc` legacy peer deps or upgrade postcss |
| vite not found | devDep missing | `pnpm add -D vite@5.2.3` |

---

## Phase 3 – Desktop Shell & Boot Screen

### Actions
1. Create `src/boot/Boot.vue` animation
2. Import `system.css` in `src/styles/base.css`
3. Build window manager in `src/desktop/Desktop.vue`
4. Route `/` ➜ Boot ➜ Desktop
5. `pnpm dev` and open browser

### Troubleshooting
| Symptom | Cause | Fix |
|---------|-------|-----|
| White screen | router path wrong | check router config |
| Missing Chicago font | path typo | verify font path |

---

## Phase 4 – Iconography & Assets Pipeline

### Actions
1. Place icons in `assets/icons/`
2. `scripts/optimize-assets.sh` (svgo + pngquant)
3. Import with `virtual:icons` plugin
4. Confirm hashed filenames in dist

### Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| Blurry icon | auto resize | add fixed w/h classes |
| Plugin not resolved | vite plugin absent | install vite-plugin-icons & update config |

---

## Phase 5 – Utility Apps Integration

### Actions
1. For each app scaffold with vite vue‑ts
2. Expose `mount` function
3. Lazy load via dynamic import
4. Validate chunk size < 200 kB

---

## Phase 6 – Automation Wing (Gmail API)

### Actions
1. Cloudflare Worker in `apps/automation`
2. KV for creds
3. `/outreach` endpoint sends “Sa, Du?” email
4. `/webhook` ingests replies

---

## Phase 7 – CI/CD & GitHub Pages

Add GH Actions `build.yml` to install, build, and deploy Pages artifact.

---

## Phase 8 – Hardening & Release Tagging

Run `bin/validate.sh --ci`, license audit, version bump, push tag `v1.0.0`.

---

## Rollback Strategy
Branch per phase, protected main, revert merge commit on failure.

---

## Command Quick‑Ref
```bash
pnpm install --frozen-lockfile
npm run build
pnpm dev
bin/validate.sh
npx lighthouse http://localhost:5173 --preset=desktop
```

---

*Implementation plan drafted 2025‑04‑30.*
