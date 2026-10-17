# Backlog

Ideas from the whole team, and everything that is missing. **From everyone**: if
you think of something, you write it here and that is it.

## How to use it

One line. No formatting, no priority, no estimate, no asking permission:

```markdown
- The viewer should honour the page the chat cites — Harvey · 2026-09-08
```

Free text, who wrote it and the date. Nothing else. This file is a dumping ground
on purpose: the moment adding an idea costs more than having it, people stop using
it and ideas go back to dying in the head of whoever had them.

What you do **not** do here: sort, decide, or mark urgencies. That happens once a
week, when the single priority that goes to [`focus/`](focus/) comes out of this
file. An idea can live here for months without that being a failure — that is the
point.

When something gets executed, it is deleted from here and appears in
[`shipped/`](shipped/).

| Goes here | Does not go here |
| --- | --- |
| A half-formed idea | A live bug → [`known_issues/`](known_issues/) |
| A feature someone asked for | The week's priority → [`focus/`](focus/) |
| Technical debt that annoys you | Already delivered → [`shipped/`](shipped/) |
| "This looks wrong and I don't know why" | Nothing. When in doubt, write it |

---

## Ideas

_Undefined. Anyone adds a line at the end._

- 

---

## What is missing

Work already identified, with its origin. It moves to `focus/` when its turn comes.

### Harvested from `registro/` (now deleted) — 2026-09-08

#### Cheap — minutes or half an hour

- **The two lint problems that are bugs**, separated from the other 11: the
  `Math.random()` during render in `sidebar/index.tsx:622` and the synchronous
  `setMatches` in `hooks/use_media_query/index.ts:9`. Both are in
  [`known_issues/2026_W32.md`](known_issues/2026_W32.md); fixing them is a small,
  publishable change.

#### One session

- **The remaining 10 lint errors and one warning.** Mostly `set-state-in-effect`. Worth doing in
  one pass so `npm run lint` can become a real gate instead of a known count.
- **Decide D-2: remove `package-lock.json`.** Owner's call. Keeping two lockfiles
  when one of them cannot install is worse than keeping one — see
  [`known_issues/2026_W32.md`](known_issues/2026_W32.md).

#### Larger, with a known trigger

- **`initialPage` in the viewer.** The chat cites a page and the viewer opens on
  page 1. Crosses in from the assistant's source-traceability work. **Trigger:**
  any work on citations in the platform will surface it again.
- **Pin the 28 tiptap packages to a coherent version.** It is what makes `npm`
  installable again, and it changes editor dependencies whose behavior is covered
  mainly by Storybook — validate the editor stories and publish it alone.

#### Documentation

- **`docs/CODE_STYLING.md` is still in Spanish** (637 lines, rules `R1`–`R48` and
  `L1`–`L13`). Everything else at repo level is in English as of 2026-09-08. It was
  left out on purpose: it is a normative document whose rule numbers are shared with
  `arxatec-lawyer-platform`, and translating it in passing risks changing what a rule
  says. Do it as its own PR, with the platform's numbering side by side.

#### Structural, not urgent

- **There is no CI.** Reverified 2026-10-16: this repo has no `.github/`
  directory. Component tests, builds and dependency audits run locally;
  no GitHub workflow runs them on a PR. Add a workflow that installs with the
  frozen pnpm lock and runs these checks before a package reaches consumers.
- **There is no `.nvmrc`.** The Node version this repo builds with is not written
  down anywhere. It matters here more than elsewhere because the artefact is
  published: a different Node produces a different `dist/`.
- Resolver los avisos adicionales de dependencias detectados el 2026-10-16 (XLSX, Tiptap y herramientas de desarrollo); evidencia en docs/known_issues/2026_W42.md — Codex · 2026-10-16
