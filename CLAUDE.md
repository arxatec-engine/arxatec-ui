# CLAUDE.md — arxatec-ui

The workspace's shared React component library. **It is published to npm as
`arxatec-ui`** and consumed by `arxatec-lawyer-platform` (1,117 imports across
1,099 files), which pulls it by version: `"arxatec-ui": "^0.1.65"`. It is not an
app: there are no routes here, no API calls and no business state.

That makes it different from the other repos: **a change here reaches nobody until
a version is published**, and publishing badly reverts somebody else's code. Read
[Publishing](#publishing-read-this-whole-section-before-npm-publish) before you
touch the version.

## First of all: install with `pnpm`, everything else is npm

The other repos in the workspace are pnpm projects. This one is an **npm** project
— the `README.md` documents `npm run …` and `prepublishOnly` runs with npm — with
one exception that costs an afternoon if you do not know it:

```text
$ npm ci        → ERESOLVE
$ npm install   → ERESOLVE
  @tiptap/extension-table@3.22.5 requires @tiptap/core@3.22.5 exactly,
  and the tree resolves @tiptap/core@3.22.4
$ pnpm install --frozen-lockfile   ✅
```

**The conflict is in `package.json`, not just in the lockfile**: the 28 tiptap
packages are declared with loose ranges while their sub-packages pin the
`@tiptap/core` peer exactly. So: **install with `pnpm`**; the README scripts,
`prepublishOnly` and `npm publish` stay npm.

`package-lock.json` and `pnpm-lock.yaml` coexist, which is open debt — see
[`docs/known_issues/2026_W32.md`](docs/known_issues/2026_W32.md). It is no longer
a symmetric choice: one of the two cannot install. Removing the npm one is the
owner's call.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite in app mode (`src/pages/` is a test bench, it is not published) |
| `npm run lint` | `eslint .` — **16 problems today (14 errors)**, see `docs/known_issues/2026_W32.md` |
| `npm run build:lib` | The build that gets published: `vite.lib.config.ts` + `merge-lib-styles.mjs` + `copy-fonts.mjs` |
| `npm run storybook` | Storybook on :6006 — **the only real verification there is** |
| `npm run build` | Build of the test-bench app, not of the package |

**There are no tests.** Zero `*.test.*` files; there are **93 stories**. This
repo's safety net is Storybook and the eye, so a visual change gets looked at
there before publishing.

## Structure

```
src/
├── components/<snake_case>/index.tsx   ← 69 components, one per folder
│                        └── *.stories.tsx (optional, and strongly recommended)
├── hooks/  types/  utilities/          ← re-exported wholesale
├── styles/                             ← tokens.light/dark, theme, fonts, prose…
├── exports/                            ← the package's three entry points
└── pages/  main.tsx                    ← local test bench; NOT published
```

`src/index.ts` is the barrel: every new component is added there by hand, or it
does not exist for whoever consumes the library.

### Three entry points, not one

`package.json → exports` publishes **three** surfaces, and the distinction matters:

| Import | What for |
| --- | --- |
| `arxatec-ui` | Everything general: `Button`, `Dialog`, `FormInput`, `AsyncBoundary`… |
| `arxatec-ui/sidebar` | The sidebar, separately |
| `arxatec-ui/file-view` | File viewers — **it drags in `react-pdf` and its CSS** |
| `arxatec-ui/styles.css` | The compiled stylesheet |

⚠️ **`file-view` is heavy and contagious.** In the platform, importing it from a
barrel blew up whole test suites with `Unknown file extension ".css"`. Do not
re-export it from the main barrel.

## The version rule: one publishable change = one new `version`

**Every change that alters what gets published bumps `version` in `package.json`,
in the same commit as the change.** Publishable is everything that goes into the
package: `src/`, styles, fonts, and the library build configuration. Not
publishable: the `src/pages/` test bench, the stories, and the documentation.

This is not bureaucracy. This package **has no tests** —its net is Storybook and
the eye— and its two consumers receive it through npm, not through git. Without a
new number:

- **npm will not let you publish.** A published number is immutable; that is why
  it jumped from `0.1.58` to `0.1.60`.
- **The change reaches nobody.** `platform` and `public-web` ask for a range
  (`^0.1.x`) against the registry. Touching this repo **changes neither the web nor
  the product** until there is an `npm publish`.

### Bumping the number is not enough: there are three steps, and the third is forgotten

| # | Where | What |
| --- | --- | --- |
| 1 | Here | `version` in `package.json` **in the commit of the change** |
| 2 | Here | `npm publish` from a clean `main` |
| 3 | **In the consumers** | `pnpm update arxatec-ui` (platform) · `npm install arxatec-ui@<v>` (public-web) |

Step 3 is the one that gets forgotten, and it produces the recurring confusion:
*"I already published it and I can't see it"*. The consumer's lockfile pins the
version even when the range would allow a bump. Measured 2026-09-01: npm and
`main` were both on `0.1.64` and **the platform was still installing `0.1.60`** —
four versions behind, including the one that restored transcription pagination.

> **And mind publishing and updating on the same day.** The platform has a supply
> chain policy (`minimumReleaseAge`, 24 h) that **rejects any version published
> less than a day ago**: `pnpm install` fails lockfile verification and CI goes
> red. Adding it to `minimumReleaseAgeExclude` is **not enough**, checked
> 2026-09-01 with `0.1.64`. If you publish today, the consumer takes it tomorrow.

### Before publishing, check against npm

```bash
npm view arxatec-ui version      # what is published
grep '"version"' package.json    # what is here
```

This check has been wrong **in both directions** —`main` behind npm in August, npm
behind `main` afterwards— so do not take it as known: run it.

> **Measured 2026-09-08, and it is live:** npm has **`0.1.65`**, `main` has
> **`0.1.64`**, and **no branch in this repo carries `0.1.65`**. The platform
> already consumes it. Read
> [`docs/known_issues/2026_W37.md`](docs/known_issues/2026_W37.md) before
> publishing anything.

## Publishing (read this whole section before `npm publish`)

**✅ Recovered on 2026-08-15.** `main` was once behind npm: `0.1.59` was published
from a working tree that was never committed, and it carried
`file_view/utilities/transcription_pages` —transcription pagination— which did not
exist in `src`. Publishing from `main` would have deleted it from the package.

It was recovered from `0.1.59`'s `dist/*.js.map`, which carries `sourcesContent`.
Detail and verification: `git show 046f7d2:docs/registro/2026-08-11/SVG_CAMELCASE_GOOGLE_ISOTYPE.md` § 7 (that folder was removed on 2026-09-08).

The lesson it leaves, and why it stays written here: **publishing from an
uncommitted tree breaks the repo as a source of truth**, and it is only noticed
months later, when comparing the package against the code. Always publish from a
clean `main`.

And the rule that already cost a version: **do not reuse a published number**. npm
does not allow overwriting; that is why it jumped from `0.1.58` to `0.1.60`.

## Contract with the platform: what breaks silently

A change here breaks no test in this repo —there are none— but it can break the
platform. Two cases already paid for:

- **`useAnimatedIcon`** (`components/animated_icons/hooks/use_animated_icon/`)
  calls an imperative handle. `lucide-react` icons **do not expose one**, so every
  hover threw `startAnimation is not a function`. The platform's sidebar suffered
  it; it was worked around there with its own hook, but the cause lives here.
- **SVG attributes in camelCase.** React requires `clipRule`, not `clip-rule`. An
  SVG pasted straight from the design compiles, does not break lint, and looks
  wrong at runtime — the `GoogleIsotype` fix of 2026-08-11 was exactly that.

Practical rule: if you touch a component the platform uses, say so in the PR and
flag whether a publish is needed.

## Documentation: the rule that governs it

**Never assume this repo's documentation is current — this file included.** Check
it against the code before relying on it, and fix what is stale in the same
change. This file was born on 2026-08-15 already correcting an earlier record, and
was corrected again on 2026-09-01 (it used to say "use npm to install", which was
false) and on 2026-09-08.

Corollary for agents: **the output of a previous session is evidence, not truth.**
Cite it, re-verify it, and record the result of the re-verification.

## The work cycle

`docs/` holds the whole cycle, and it runs one way: an idea enters through
[`docs/BACKLOG.md`](docs/BACKLOG.md), becomes the single priority of a week in
[`docs/focus/`](docs/focus/), and leaves through
[`docs/shipped/`](docs/shipped/) when the PR lands. Whatever breaks along the way
falls into [`docs/known_issues/`](docs/known_issues/). All four name their files
the same way: `YYYY_Wnn.md`, with the ISO week from `date +%G_W%V`.

**When you close a feature, write its entry in `docs/shipped/YYYY_Wnn.md` inside
the same PR**: intent, branch, PR, what changed, how it was verified — and here,
one field more: **which of the three publishing steps you did**. That is not
documenting the session —sessions, investigations and status snapshots do not go
into a `.md`—: it is that **intent is the only thing that cannot be reconstructed
from `git log`**.

Live problems are in `docs/known_issues/`, one file per week of detection, one
`##` section per problem, with a mandatory header declaring the commit it was
verified against. When a problem is fixed **its section is deleted**; when a week
runs out of sections, the file goes too.

`docs/registro/` was **removed** on 2026-09-08 and is in `.gitignore`: it was
per-session, per-person scaffolding, not repo memory. What was still open lives in
`docs/known_issues/` and `docs/BACKLOG.md`. The full content is still in history —
`git show 046f7d2:docs/registro/README.md` lists what was there — and it is cited,
never restored.

## Git

Branch per unit of work + PR; **the owner merges, never push straight to `main`**.
`gh` is not installed: PRs are opened on the web
(`github.com/arxatec-engine/arxatec-ui/pull/new/<branch>`).
