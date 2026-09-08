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

- **The two lint problems that are bugs**, separated from the other 14: the
  `Math.random()` during render in `sidebar/index.tsx:622` and the synchronous
  `setMatches` in `hooks/use_media_query/index.ts:9`. Both are in
  [`known_issues/2026_W32.md`](known_issues/2026_W32.md); fixing them is a small,
  publishable change.

#### One session

- **The remaining 14 lint problems.** Mostly `set-state-in-effect`. Worth doing in
  one pass so `npm run lint` can become a real gate instead of a known count.
- **Decide D-2: remove `package-lock.json`.** Owner's call. Keeping two lockfiles
  when one of them cannot install is worse than keeping one — see
  [`known_issues/2026_W32.md`](known_issues/2026_W32.md).

#### Larger, with a known trigger

- **`initialPage` in the viewer.** The chat cites a page and the viewer opens on
  page 1. Crosses in from the assistant's source-traceability work. **Trigger:**
  any work on citations in the platform will surface it again.
- **Pin the 28 tiptap packages to a coherent version.** It is what makes `npm`
  installable again, and it changes the dependency tree of a library **with no
  tests** — do it with Storybook in front of you, and publish it alone.

#### Structural, not urgent

- **This repo has no tests** (0 test files, 93 stories). The safety net is
  Storybook and the eye. Deciding whether that stays the answer is a real
  decision, not an oversight to fix in passing.
