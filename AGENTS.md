# AGENTS.md — arxatec-ui

**Scope of this file: the rule, and where what you find goes.** It is deliberately
short. The operational guide —package manager, entry points, the version rule,
publishing, the contract with the platform— lives in
[`CLAUDE.md`](./CLAUDE.md), and that is the single source for it.

`arxatec-ui` is Arxatec's React component kit (Radix + Tailwind v4), published to
npm. The `README.md` documents the library for whoever consumes it (installation,
styles, Tailwind v4, components); the real conventions are read off the code and
the stories.

---

## The rule: never assume the documentation is current

This file included. A `.md` describes the code at the moment someone wrote it; the
code moved on. Before basing a decision on a documented claim —a path, a
`file:line`, a prop, an "it is already done"— **check it**. If it fails, fixing it
is part of the work in hand, not a ticket for later.

It is not paranoia. Until 2026-08-04, another repo's documentation took for granted
that the legal library screen would be built **here**; it was built in
`arxatec-lawyer-platform`, and there is nothing legal in `arxatec-ui`. A document
that was correct in July sent people to work in the wrong repo in August.

And this repo has a second edge the others do not: **it is published to npm**, so a
claim about "what the platform consumes" may refer to a different version from the
one on `main`. When you write one, declare the **published version** you are
looking at, not just the commit.

**The output of a previous session is evidence, not truth.** Cite it, re-verify it,
and record the result of the re-verification.

## Where each thing goes

`docs/` has two halves. One **describes the system** and is rewritten when the
system changes (`README.md`, `docs/CODE_STYLING.md`). The other **records the
work** and accumulates by week. They never mix.

All four record sites name their files the same way: `YYYY_Wnn.md`, with the ISO
week from `date +%G_W%V`.

| Where | What | Who writes it |
| --- | --- | --- |
| [`docs/BACKLOG.md`](./docs/BACKLOG.md) | Ideas from the whole team and everything missing. One line, no formatting, no priority. | Anyone, whenever |
| [`docs/focus/`](./docs/focus/) | **One** priority per week, its actions (one per day) and the action that unblocks each dependency. | The CEO, on Monday |
| [`docs/shipped/`](./docs/shipped/) | What was delivered: intent, branch, PR, what changed, how it was verified, **and which of the three publishing steps ran**. | **The agent, on closing the feature, inside the same PR** |
| [`docs/known_issues/`](./docs/known_issues/) | Live bugs and traps no gate catches. One `##` section per problem. | Whoever detects it |

The cycle runs one way: idea → `BACKLOG.md` → the week's priority in `focus/` →
`shipped/` when the PR lands. Whatever breaks along the way falls into
`known_issues/`, and goes back to `BACKLOG.md` if fixing it is work.

In `known_issues/`, the file's week is the week of **detection** and does not
change: re-verifying updates the problem's header, not the file it lives in. When a
problem is fixed **its section is deleted**, and when a week runs out of sections
the whole file is deleted: only true things live there.

**The rule that still stands:** do not create a `.md` to leave a record of a
session, an investigation or a status snapshot. The `shipped/` entry is not that —
it is the record of a **delivery**, it travels inside the PR that delivers it, and
it exists because **intent is the only thing that cannot be reconstructed from
`git log`**.

There is no test here to fall back on (0 test files, 93 stories), so the usual
advice —"before writing a known issue, check whether a test can catch it"— has a
local answer: **check whether a story can show it**. If it can, write the story.

`docs/registro/` was **removed** on 2026-09-08 and is in `.gitignore`. Its content
is still in history and is cited, never restored:
`git show 046f7d2:docs/registro/README.md`.

## Git

Branch per unit of work + PR; the owner merges. **Never push straight to main.**
