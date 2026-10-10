# arxatec-ui operational guide

This is the shared React component library, published as `arxatec-ui`. It has no
application routes or business APIs. Check package source, stories and the actual
published version before assuming what a consumer uses.

## Install and verify

Install with `pnpm install --frozen-lockfile`. Loose Tiptap ranges and exact core
peers make `npm ci` unreliable; do not replace the lockfile to resolve a consumer
update. Build and publish scripts retain their documented npm interface.

| Command                                | Purpose                                                           |
| -------------------------------------- | ----------------------------------------------------------------- |
| `npm run build:lib`                    | Published modules, declarations, stylesheet and fonts             |
| `npm run build-storybook`              | Build the visual safety net                                       |
| `npm run storybook`                    | Inspect stories on port 6006                                      |
| `pnpm exec tsc -b tsconfig.build.json` | Typecheck the library                                             |
| `npm run lint`                         | All-source ESLint; existing failures are recorded in known issues |
| `npm pack`                             | Reviewable tarball for an isolated consumer checkout              |

There are no unit test files; visual changes need Storybook inspection and
consumer tests. Keep `src/pages` and stories out of the published declarations.

## Entry points and shared peers

`src/exports` and `package.json#exports` define public surfaces. General components
remain at `arxatec-ui`, sidebar at `/sidebar`, and legacy `/file-view` remains
compatible. New `/file-view/core` provides a lightweight shell, MIME routing,
contexts, types and worker configuration. Engines have independent `/pdf`,
`/image`, `/office`, `/code`, `/template`, `/docx`, `/xlsx`, `/audio`, `/video`,
`/summary` and `/transcription` entries under `/file-view`; `/lazy` supplies the
deferred loading wrapper without added controls. Import engines dynamically when opening that format.
Never connect the startup barrel to a viewer engine.

`react`, `react-dom`, React Query, `react-hook-form`, `@tiptap/core` and
`@tiptap/react` are shared peers. Consumers must resolve one coherent Tiptap core
version and one form context. Duplicate copies break editor types and forms.
The package preserves modules and marks CSS and PDF-worker setup as side effects;
removing the setup exception silently restores the default worker in consumers.

## Version and publication

Every publishable change bumps `package.json#version` in the same commit. Keep the
existing exports and default behavior compatible. On 2026-10-04 the npm registry
and local `main` both report **0.1.68**; recheck before publishing a new number.
Reverified on 2026-10-09: the registry still reports **0.1.68**, while base
`main` (`563c36d`) is **0.1.70** and includes the lazy file-view engines and Apple
icon. The Logo variants change prepares **0.1.71**. These source additions are
pending publication; validate a candidate tarball before a consumer update.

1. Open a PR on an own branch. **The owner merges; never push directly to main.**
2. Publish only from a clean, merged `main`, after comparing `npm view arxatec-ui
version` with source and reviewing the tarball.
3. Update consumers after publication. Platform uses `pnpm update arxatec-ui` and
   **seven days** of release age (`minimumReleaseAge: 10080`), not 24 hours. Do not
   bypass this policy. Preserve other root dependency pins.

Use an isolated temporary tarball checkout to validate a consumer before merge
and publication. A tarball `file:` dependency is a validation fixture and must
not reach the production consumer. State exactly which publication steps ran in
`docs/shipped/YYYY_Wnn.md`.

## Working conventions

Read [AGENTS.md](AGENTS.md) for documentation rules and weekly delivery entries.
Living consumer documentation is [README.md](README.md); rewrite it when the
contract changes. Record unresolved defects in their detection week's known
issues file, with the verified commit and evidence. Do not create session logs.

Source components live under `src/components/<snake_case>`, with their stories.
Avoid re-exporting a heavy file-view barrel from the main package. Verify the
actual consumer and the `PanelesDiferidos` story when changing file panels,
workers, loading propagation, fonts or editor state.

`gh` is available in this workspace. Authentication and repository permission
must be checked at the time of PR creation; availability alone is not permission
to merge or publish.
