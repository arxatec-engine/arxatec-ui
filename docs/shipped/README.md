# Shipped

What was delivered. One file per ISO week, one `##` section per task.

```text
docs/shipped/2026_W44.md
```

The owner requests direct work on `main`. Do not create a feature branch or a PR
unless explicitly asked. The delivery entry travels with the implementation on
`main`, so its intent is recorded with the change.

## Delivery

1. Implement on `main` and verify the change.
2. Add the week's delivery entry before closing the feature.
3. Commit the change and deliver to `main` when the owner requests a remote push.
4. Publish only from clean `main` after reviewing the candidate tarball.
5. Update consumers from npm after publication.

`date +%G_W%V` gives the ISO week. Do not create a session, investigation or
status snapshot document.

## Entry template

```markdown
## Title of what was delivered

> **Branch:** `main` · **PR:** none (direct main) · **Candidate:** `0.1.77` · **Published:** pending

**Intent.** The user problem and why the change was made.

**What changed.** The resulting behavior and the relevant implementation.

**How it was verified.** Actual stories, tests, type checks, lint and builds.
Declare the published version checked when describing a consumer.

**Publication steps.** State which ran: delivery on main, npm publication,
and registry consumer update. A temporary tarball is only a validation fixture.

**What is still open.** Required activation or remaining limitations. Live bugs
also belong in their detection week's known_issues file.
```

Intent cannot be reconstructed from `git log`. Keep it concrete. Do not report a
publication or consumer update until it has actually happened.
