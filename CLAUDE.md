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
| `pnpm test:components`                 | Component regression tests with Vitest and JSDOM                   |
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
`/image`, `/office`, `/code`, `/template`, `/docx`, `/xlsx`, `/pptx`, `/audio`, `/video`,
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

The main package keeps shared explorer filters/selection/view mode, general
controlled dialogs and small status/loading primitives. Browser-selection and
visibility/loading hooks are generic. FilePublicPreviewRender stays in
`/file-view/core` and dynamically loads PDF/image/Office engines. Direct main
imports of FileViewLoadingState, ViewerFloatingBar, FileDocumentExportDialog and
loading propagation hooks must remain independent of viewer engines.

Contact and calendar product compositions belong to Lawyer Platform
in `src/modules/<module>/shared/presentation`. Document product components,
types and helpers belong to `src/modules/documents/components`.
Documents owns move/conflict dialogs, sharing/credential fields, versions, detail
and AI panels, public-file layouts, account/quota bars and transfers/toasts.
Keep FileTypeIcon, FolderIcon, FileThumbnail, shared explorer primitives and
generic file viewers in this kit. Promote further behavior only with independent
consumers and a stable shared contract. Routine screen changes should be
delivered from the application alone. Brand and generic feedback tokens stay in this
kit; workspace-tinted product palettes, business statuses and chart mappings
belong to Lawyer Platform.

`react`, `react-dom`, React Query, `react-hook-form`, `@tiptap/core` and
`@tiptap/react` are shared peers. Consumers must resolve one coherent Tiptap core
version and one form context. Duplicate copies break editor types and forms.
The package preserves modules and marks CSS and PDF-worker setup as side effects;
removing the setup exception silently restores the default worker in consumers.

## Version and publication

Every publishable change bumps `package.json#version` in the same commit. Keep the
existing exports and default behavior compatible. Reverified on 2026-11-14 with
`npm view arxatec-ui version`: the registry reports **0.1.81**. Source includes
unified local and remote Word and Excel previews, with consumer-owned DOC/ODT
and XLS conversion. XLSX is parsed in a deferred, self-contained worker; XLS
without a converter retains a basic view in the same grid. Excel includes empty
rows/columns beyond the populated range and expands near the scroll edges.
Neutral cell colors follow the light/dark theme; document accents are preserved.
Excel supports rectangular cell selection with mouse, touch and keyboard, plus
native Ctrl/Cmd+C and a copy button. Clipboard text/HTML comes from the model,
including selected cells outside the viewport, without editing the workbook.
Candidate **0.1.96**
also renders PPTX and binary PPT in the browser through `/file-view/pptx`, with
a custom slide surface, thumbnails, navigation, zoom and original download.
Slide changes use a short directional transition, honor reduced motion and
retain the previous slide until the next one is ready.
The thumbnail strip starts collapsed and uses a short responsive size/fade
transition when toggled, respecting reduced motion. Presentation mode fits the slide and requests
browser fullscreen, preserving the current slide, zoom and thumbnail preference
on exit. Presentation uses the full slide area with controls overlaid at the top,
no reserved footer and centered letterboxing. Controls hide after 2.5 seconds of
inactivity and reappear with pointer, touch or keyboard input; hover/focus keeps
them available. Without fullscreen permission it
uses the same layout in the viewer.
Office, local, URL and public adapters select it without an Office iframe. Word and PDF pages
use the theme border and `rounded-md` corners
without page shadows. Both viewers use the kit's `ScrollArea` for vertical and
horizontal scrolling. The current color work keeps brand and generic feedback colors in
the kit and moves Lawyer product tokens and workspace-tinted palettes into the platform. Contact,
calendar and document product compositions are maintained in the platform.
Menus, select lists, command lists and floating controls use solid surfaces without
backdrop blur. Sheets float with an 8 px viewport inset, `rounded-md` corners and
a border on all four edges.
Video and source previews share `ViewerFloatingBar`. Video keeps the full frame without a filename badge,
with playback, seeking, volume, download and fullscreen in the floating controls.
Video controls, tooltips and the central play button fade after 2.5 seconds
without user input, including while paused. Pointer, touch, focus and keyboard
activity reveal them; held gestures keep controls visible until release.
Source preview shows code and line numbers without a header or gutter divider,
using regular text weight. It follows the theme and uses `ScrollArea`, with text
zoom, wrapping, copy and download. Both engines accept optional labels and `className`; source
also accepts a download callback.
Source numbering extends to at least 100 lines and 20 empty lines after the file,
and fills taller viewports at the current text size. Extra rows are visual only;
copy and download use the original content.
Validate a candidate tarball before a registry consumer update.

1. Work directly on `main`, as requested by the owner. Do not create branches
   or PRs unless explicitly requested; deliver remote changes directly to `main`.
2. Publish only from a clean `main`, after comparing `npm view arxatec-ui
version` with source and reviewing the tarball.
3. Update consumers after publication. Platform uses `pnpm update arxatec-ui` and
   **seven days** of release age (`minimumReleaseAge: 10080`) for external
   dependencies. Its `minimumReleaseAgeExclude` explicitly exempts all versions
   of `arxatec-ui`. Preserve other root dependency pins.

Use an isolated temporary tarball checkout to validate a consumer before publication. A tarball `file:` dependency is a validation fixture and must
not reach the production consumer. State exactly which publication steps ran in
`docs/shipped/YYYY_Wnn.md`.

Reverified on 2026-11-14: Lawyer Platform's working tree declares and locks
registry **0.1.81**. Candidate tarballs are validated in isolated copies; the
weekly delivery entries identify each validation baseline. A tarball fixture
does not update a registry consumer.
Earlier local migration links are historical.
Validate changes with a candidate tarball in an isolated consumer copy, then
update the real consumer from the registry after publication from clean `main`.

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
