# Known issues

**Live** problems in this repo: unfixed bugs and traps that compile, pass the
lint and pass the tests, but break at runtime.

One file per **week**, one `##` section per problem inside.

```text
docs/known_issues/2026_W34.md
```

The name is `YYYY_W<ISO week>.md`. The command gives you the week, not your head:

```bash
date +%G_W%V                                  # this week
date -j -f "%Y-%m-%d" "2026-08-22" +%G_W%V    # a specific date
```

The file's week is the week of **detection** and never changes. Re-verifying a
problem updates its header, not the file it lives in — so at a glance you can see
what has gone untouched for months.

When **every** problem in a week is fixed, the file is deleted whole. A
`known_issues/` that only grows is lying.

## What belongs here

- A live bug that is not fixed yet.
- A trap no gate catches.
- A tool that lies.
- A partial fix: "works in 1 place, still broken in 3".

And what does not:

- A fixed bug → `shipped/`.
- "What I did this session" → nowhere; it does not go in a `.md`.
- Audits and status snapshots → nowhere either.
- Ideas and pending features → `../BACKLOG.md`.

## No tables

One person writes these entries by hand. A markdown table with its pipes is a punishment
to write and impossible to keep aligned as it grows. Lists, always — a bullet with
sub-bullets says the same thing and survives being edited.

Three questions before writing a section: **will it still be true in a month?**
If not, drop it. **Can a test catch it?** Then write the test, not the `.md`.
**Is it already in the PR?** Then it is already documented.

## Every problem declares what it was verified against

Mandatory header, right under the `##`:

```markdown
> **Live** · 3 call sites · measured in Chrome, not reproducible in tests
> **Detected:** 2026-08-22 · **Last verified:** 2026-08-27 against `8ce0d042`
```

Without a commit a known issue is an opinion. With one, anyone can `git checkout`
and check it.
