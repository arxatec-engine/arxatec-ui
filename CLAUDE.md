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
| `pnpm test:components`                 | Editable-field unit tests with Vitest and JSDOM                   |
| `npm pack`                             | Reviewable tarball for an isolated consumer checkout              |

Component unit tests live beside their components. Visual changes also need
Storybook inspection. Keep `src/pages`, stories, unit tests and test setup out of
the published declarations.

## Entry points and shared peers

`src/exports` and `package.json#exports` define public surfaces. Use named imports
from `arxatec-ui` for general components, including sidebar, editable fields,
provider icons, animated text, connectivity feedback and icon/emoji selection.
Their grouped entries remain optional. Legacy `/file-view` remains
compatible. New `/file-view/core` provides a lightweight shell, MIME routing,
contexts, types and worker configuration. Engines have independent `/pdf`,
`/image`, `/office`, `/code`, `/template`, `/docx`, `/xlsx`, `/audio`, `/video`,
`/summary` and `/transcription` entries under `/file-view`; `/lazy` supplies the
deferred loading wrapper without added controls. Import engines dynamically when opening that format.
Never connect the startup barrel to a viewer engine. `/editable-fields` exports
generic editing controls and `EditableFieldsProvider`; `/provider-icons` exports
the multicolor Google Calendar, Google Drive, OneDrive and Outlook Calendar SVGs.
`/shiny-text`, `/offline-banner` and `/icon-emoji-picker` export animated text,
connectivity feedback and combined icon/emoji selection. Connectivity, copy and
locale arrive from the consumer through props.
Applications supply persistence and translated copy through callbacks and props.

File and folder presentation also comes from the main package: `FileTypeIcon`,
`FolderIcon`, `FileThumbnail` and the `Explorer*` surfaces/actions. They receive
MIME types, thumbnail sources and callbacks, without document services or router
dependencies. Do not connect thumbnail presentation to PDF preview generation;
the consumer supplies the generated source through props.

`react`, `react-dom`, React Query, `react-hook-form`, `@tiptap/core` and
`@tiptap/react` are shared peers. Consumers must resolve one coherent Tiptap core
version and one form context. Duplicate copies break editor types and forms.
The package preserves modules and marks CSS and PDF-worker setup as side effects;
removing the setup exception silently restores the default worker in consumers.

## Version and publication

Every publishable change bumps `package.json#version` in the same commit. Keep the
existing exports and default behavior compatible. Reverified on 2026-10-12 with
`npm view arxatec-ui version`: the registry reports **0.1.71**, matching base
`main` (`426fd0a`). The editable-fields and provider-icons migration prepares
**0.1.72**, pending publication. Validate a candidate tarball before a registry
consumer update.

1. Open a PR on an own branch. **The owner merges; never push directly to main.**
2. Publish only from a clean, merged `main`, after comparing `npm view arxatec-ui
version` with source and reviewing the tarball.
3. Update consumers after publication. Platform uses `pnpm update arxatec-ui` and
   **seven days** of release age (`minimumReleaseAge: 10080`) for external
   dependencies. Its `minimumReleaseAgeExclude` explicitly exempts all versions
   of `arxatec-ui`. Preserve other root dependency pins.

Use an isolated temporary tarball checkout to validate a consumer before merge
and publication. A tarball `file:` dependency is a validation fixture and must
not reach the production consumer. State exactly which publication steps ran in
`docs/shipped/YYYY_Wnn.md`.

The editable-fields migration is connected locally with
`file:../../arxatec-ui` in the platform, as requested for sibling-repository work.
Build the library, then refresh it with `pnpm update arxatec-ui --ignore-scripts`.
Switch the consumer manifest to the registry release before production delivery.

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
