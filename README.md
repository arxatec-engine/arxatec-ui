# arxatec-ui

React component kit for **Arxatec** products: primitives built on **Radix UI**, styling with **Tailwind CSS v4**, animations, and ready-made pieces for forms, data, maps, and more.

## Requirements

- **React** 18 or 19 (`react` and `react-dom` are _peer dependencies_).
- A bundler that supports **ESM** (recommended: **Vite**).
- **Tailwind CSS v4** and the **`@tailwindcss/vite`** plugin (or an equivalent pipeline that processes the library stylesheet).

## Installation

```bash
npm install arxatec-ui
```

Make sure React is installed in your app:

```bash
npm install react react-dom
```

## Global styles

The package exposes a single stylesheet (theme tokens, Tailwind, shadcn-style utilities):

```ts
// e.g. in main.tsx or App.tsx
import "arxatec-ui/styles.css";
```

That CSS uses Tailwind v4 features (`@import "tailwindcss"`, `@theme`, etc.). Your build **must process** it with Tailwind (serving the raw file without compiling is not enough).

The same stylesheet **also appends** CSS extracted from the library build (TipTap / `RichTextEditor`, hashed classes from **CSS modules** such as `DescriptionMarkdownEditor`, etc.). You do **not** import those files separately; `arxatec-ui/styles.css` is the one entry for consumers.

### Vite + Tailwind v4

1. Install Tailwind, the official Vite plugin and the typography plugin used by
   the library stylesheet:

   ```bash
   npm install tailwindcss @tailwindcss/vite @tailwindcss/typography
   ```

2. In `vite.config.ts`:

   ```ts
   import tailwindcss from "@tailwindcss/vite";
   import { defineConfig } from "vite";

   export default defineConfig({
     plugins: [tailwindcss()],
   });
   ```

3. If production builds **drop classes** that only appear inside `node_modules/arxatec-ui`, point Tailwind at the library’s compiled JS, for example in your entry CSS (Tailwind v4):

   ```css
   @source "../../node_modules/arxatec-ui/dist/**/*.js";
   ```

   Adjust the path relative to your CSS file.

### Dark mode

The theme expects a **`.dark`** ancestor (e.g. `className="dark"` on `<html>`).

## Basic usage

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from "arxatec-ui";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Action</Button>
      </CardContent>
    </Card>
  );
}
```

Patterns follow **shadcn**-style APIs (compound components with named exports).

## Package exports

Import general components, hooks, prop types and utilities with named imports
from `arxatec-ui`. The grouped component entries are optional. The library
preserves modules and declares side effects so compatible bundlers can discard
unused exports in production builds.

### Components (overview)

- **Forms & text:** `Button`, `Input`, `Textarea`, `Label`, `Checkbox`, `RadioGroup`, `Select`, `Slider`, `Toggle`, `InputOTP`, `FileDropZone`, `LocationInput`, `DateRangePicker`, `Calendar`, `AsyncSelect`, `DescriptionMarkdownEditor`, `RichTextEditor`, and more.
- **Surfaces & navigation:** `Card`, `Dialog`, `Sheet`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu`, `ContextMenu`, `Tabs`, `Breadcrumb`, `Pagination`, `PaginationController`, `Sidebar`, `Command`, `Collapsible`, and more.
- **Data & feedback:** `Table`, `Badge`, `Skeleton`, `Progress`, `StatusMessage`, `AsyncBoundary`, `AsyncCommandList`, `Chart`, `Carousel`, and more.
- **Maps:** `MapView`, `MapPicker`.
- **Extras:** `Toaster` (Sonner), `Logo`, `IconPicker`, `EmojiPicker`, brand icons, animated icons, etc.

`Logo` in source candidate `0.1.74` accepts
`variant="arxatec" | "academy" | "management" | "design"`. The `design` variant
is pending publication; the npm registry reports `0.1.72`, reverified on
2026-10-17. Omitting `variant` renders the original Arxatec logo. All four inline
SVGs preserve their proportions and inherit their color through `currentColor`:

```tsx
import { Logo } from "arxatec-ui";

<Logo className="h-8 w-auto text-foreground" />;
<Logo variant="academy" className="h-8 w-auto text-foreground" />;
<Logo variant="management" className="h-8 w-auto text-foreground" />;
<Logo variant="design" className="h-8 w-auto text-foreground" />;
```

`AppleIsotype` is an inline SVG with a transparent background. It inherits its
color through `currentColor` and accepts SVG props, including `className` and
ARIA attributes:

```tsx
import { AppleIsotype } from "arxatec-ui";

<AppleIsotype className="size-4 text-foreground" aria-hidden="true" />;
```

The full list matches the `export *` entries in [`src/index.ts`](./src/index.ts).

### Editable fields (0.1.72)

Import property rows, inline editing, table cells, color selection and save
feedback from `arxatec-ui`. The optional `/editable-fields` entry groups the same
APIs. These components receive values and callbacks; the application owns
validation, persistence and retry logic.

| Component               | Source                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `PropertyRow`           | [`src/components/property_row/index.tsx`](./src/components/property_row/index.tsx)                                                           |
| `InlineEditableText`    | [`src/components/inline_editable_text/index.tsx`](./src/components/inline_editable_text/index.tsx)                                           |
| `InlineOptionField`     | [`src/components/inline_option_field/index.tsx`](./src/components/inline_option_field/index.tsx)                                             |
| `InlineDateField`       | [`src/components/inline_date_field/index.tsx`](./src/components/inline_date_field/index.tsx)                                                 |
| `InlineMarkdownField`   | [`src/components/inline_markdown_field/index.tsx`](./src/components/inline_markdown_field/index.tsx)                                         |
| `InlineDurationField`   | [`src/components/inline_duration_field/index.tsx`](./src/components/inline_duration_field/index.tsx)                                         |
| `TableDateField`        | [`src/components/table_date_field/index.tsx`](./src/components/table_date_field/index.tsx)                                                   |
| `TableOptionField`      | [`src/components/table_option_field/index.tsx`](./src/components/table_option_field/index.tsx)                                               |
| `AutosaveStatus`        | [`src/components/autosave_status/index.tsx`](./src/components/autosave_status/index.tsx)                                                     |
| `AutosaveFieldStatus`   | [`src/components/autosave_field_status/index.tsx`](./src/components/autosave_field_status/index.tsx)                                         |
| `SelectTableHeader`     | [`src/components/select_table_header/index.tsx`](./src/components/select_table_header/index.tsx)                                             |
| `HexColorPickerContent` | [`src/components/hex_color_picker/hex_color_picker_content/index.tsx`](./src/components/hex_color_picker/hex_color_picker_content/index.tsx) |
| `HexColorPickerPopover` | [`src/components/hex_color_picker/hex_color_picker_popover/index.tsx`](./src/components/hex_color_picker/hex_color_picker_popover/index.tsx) |

Configure shared copy, date-fns locale, date formats and swatches with
`EditableFieldsProvider`. A partial configuration inherits the nearest provider;
the default copy and date locale are Spanish. Supply all shared labels when
switching the whole interface to another language. Field-specific labels such as
`ariaLabel`, `emptyText` and `clearLabel` remain component props.

```tsx
import { useState } from "react";
import { enUS } from "date-fns/locale";
import { FileText } from "lucide-react";
import {
  EditableFieldsProvider,
  InlineEditableText,
  PropertyRow,
} from "arxatec-ui";

export function DocumentName() {
  const [name, setName] = useState("Shared document");
  return (
    <EditableFieldsProvider
      locale={enUS}
      dateFormat="MMMM d, yyyy"
      tableDateFormat="MMM d, yyyy"
      labels={{
        empty: "Add…",
        hint: "Enter to save · Esc to cancel",
        hours: "Hours",
        minutes: "Minutes",
        saving: "Saving…",
        saved: "Saved",
        savedAgo: "Saved a moment ago",
        offline: "Offline · changes will save when connected",
        genericError: "Could not save. Check your connection.",
        retry: "Retry",
        acceptColor: "Accept",
        clearColor: "Clear color",
        selectColor: "Select color",
        changeColor: "Change color",
        currentColor: "current",
      }}
    >
      <PropertyRow icon={FileText} label="Name">
        <InlineEditableText
          value={name}
          onCommit={setName}
          ariaLabel="Document name"
        />
      </PropertyRow>
    </EditableFieldsProvider>
  );
}
```

`InlineEditableText` commits on Enter or blur, cancels with Escape and accepts a
`validate` callback. Multiline text commits with Ctrl/⌘ + Enter.
`InlineDurationField` receives seconds; `InlineDateField` receives `Date` values;
`TableDateField` receives and emits ISO strings or `null`. Table fields preserve
focus and stop click/key events inside their popovers from activating their row.

`InlineFieldTrigger` supplies the shared button style for application-specific
selectors and forwards its ref. `useEditableFields`, configuration and component
prop types, `AutosaveFieldState`, `AutosaveStatusValue`, `normalizeHexColor`,
`hexColorOrFallback`, `HEX_COLOR_SWATCHES` and `HEX_COLOR_PICKER_FALLBACK` are also
exported from `arxatec-ui` and the optional `/editable-fields` entry.

### Provider icons (0.1.72)

Import the multicolor integration SVGs from `arxatec-ui`. The optional
`/provider-icons` entry exposes the same components:

| Component                | Source                                                                                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `GoogleCalendarIsotype`  | [`src/components/icons/components/google_calendar_isotype/index.tsx`](./src/components/icons/components/google_calendar_isotype/index.tsx)   |
| `GoogleDriveIsotype`     | [`src/components/icons/components/google_drive_isotype/index.tsx`](./src/components/icons/components/google_drive_isotype/index.tsx)         |
| `OneDriveIsotype`        | [`src/components/icons/components/onedrive_isotype/index.tsx`](./src/components/icons/components/onedrive_isotype/index.tsx)                 |
| `OutlookCalendarIsotype` | [`src/components/icons/components/outlook_calendar_isotype/index.tsx`](./src/components/icons/components/outlook_calendar_isotype/index.tsx) |

```tsx
import { GoogleDriveIsotype } from "arxatec-ui";

<GoogleDriveIsotype className="size-5" aria-hidden="true" />;
```

The icons accept standard SVG props and namespace their internal definitions per
instance. The existing `GoogleDriveIcon` and `OneDriveIcon` keep their outline
appearance.

### Animated text, connectivity and icon/emoji selection (0.1.72)

Use named imports from `arxatec-ui` for these components. Individual entries are
also available as optional APIs:

| Optional entry                 | Components                                    | Source                                                                                     |
| ------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `arxatec-ui/shiny-text`        | `ShinyText`                                   | [`src/components/shiny_text/index.tsx`](./src/components/shiny_text/index.tsx)             |
| `arxatec-ui/offline-banner`    | `OfflineBanner`                               | [`src/components/offline_banner/index.tsx`](./src/components/offline_banner/index.tsx)     |
| `arxatec-ui/icon-emoji-picker` | `IconEmoji`, `IconEmojiPicker`, `isEmojiIcon` | [`src/components/icon_emoji_picker/index.ts`](./src/components/icon_emoji_picker/index.ts) |

`ShinyText` accepts children, `className` for its wrapper and `textClassName` for
its visible text. Its animated overlay is hidden from assistive technology.
The animation CSS is included in the existing `arxatec-ui/styles.css` import.

```tsx
import { OfflineBanner, ShinyText } from "arxatec-ui";

<ShinyText>Preparing response…</ShinyText>;
<OfflineBanner
  isOnline={isOnline}
  labels={{
    offline: "You have no internet connection",
    reconnected: "You're back online",
    close: "Close",
  }}
/>;
```

`OfflineBanner` receives connectivity from the application. It renders offline
feedback with a dismiss button, then shows a reconnect message for three seconds
after an offline-to-online transition. `reconnectedDurationMs` adjusts that time.
Translated copy and `className` are optional; defaults preserve the Spanish UI.

`IconEmoji` renders either a Lucide name or an emoji glyph, with `folder` as the
empty-value fallback. `IconEmojiPicker` is a controlled picker with a custom
trigger, icon/emoji tabs, searchable icon pagination and `onValueChange`:

```tsx
import { IconEmoji, IconEmojiPicker } from "arxatec-ui";

<IconEmojiPicker
  value={icon}
  onValueChange={setIcon}
  locale="en"
  labels={{
    icons: "Icons",
    emojis: "Emojis",
    searchIcons: "Search an icon…",
    searchEmojis: "Search an emoji…",
    emptyIcons: "No icon found.",
    emptyEmojis: "No emoji found.",
    emojiHint: "Select an emoji…",
  }}
>
  <button type="button" aria-label="Choose icon or emoji">
    <IconEmoji value={icon} className="size-5" />
  </button>
</IconEmojiPicker>;
```

It also accepts `align`, `modal` and `disabled`. Copy and emoji-data locale default
to Spanish and can be configured independently. Prop, label and locale types are
exported with the components. The panel width follows text size to accommodate
its twelve columns, padding, scrollbar and borders. Existing `EmojiPickerContent` and
`EmojiPickerFooter` now accept `emptyLabel` to translate their empty state and
selection hint while keeping their previous defaults.
The emoji viewport's scrollbar styling is included in `arxatec-ui/styles.css`,
alongside the animated-text and connectivity-banner styles.

### Files, folders and explorer presentation (0.1.72)

Import these components by name from `arxatec-ui`:

```tsx
import {
  FileTypeIcon,
  FolderIcon,
  FileThumbnail,
  ExplorerGridCard,
} from "arxatec-ui";

<FileTypeIcon
  mimeType="application/pdf"
  fileName="Report.pdf"
  className="size-6"
/>;
<FolderIcon variant="shared" className="size-6" />;
<FileThumbnail
  source={thumbnailUrl}
  isLoading={isLoading}
  isError={isError}
  fallback={<FileTypeIcon mimeType="application/pdf" className="size-14" />}
/>;
```

`FileTypeIcon` is the file-shaped SVG previously named `IconType` in Lawyer
Platform. Its color follows the MIME family; its visible label prefers the
filename extension, then the MIME extension, then a family label such as `FILE`.
Labels are uppercase and limited to four characters. It covers PDF, office
documents, images, video, audio, archives, code, JSON, XML, fonts, databases,
binary files and native Google Workspace formats. Both it and `FolderIcon`
accept standard SVG props and are decorative by default. Pass accessible SVG
props when using an icon without adjacent text.

`FolderIcon` accepts `default`, `shared` and `drive` variants. `FOLDER_VARIANT`,
`FolderVariant`, `getFileKindStyle`, `getFileTypeLabel`, `FILE_KIND_STYLES`,
`FileKind` and `FileKindStyle` are exported from the main package too.

| Components                                                         | Source                                                                                                                       |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `FileTypeIcon`                                                     | [`src/components/file_type_icon/file_type_icon.tsx`](./src/components/file_type_icon/file_type_icon.tsx)                     |
| `FolderIcon`                                                       | [`src/components/folder_icon/index.tsx`](./src/components/folder_icon/index.tsx)                                             |
| `FileThumbnail`                                                    | [`src/components/file_thumbnail/index.tsx`](./src/components/file_thumbnail/index.tsx)                                       |
| `ExplorerGridCard`, `ExplorerRow`, `ExplorerNameCell`              | [`src/components/file_explorer/index.ts`](./src/components/file_explorer/index.ts)                                           |
| `ExplorerGrid`, `ExplorerTable`, `ExplorerPanel`                   | [`src/components/file_explorer/index.ts`](./src/components/file_explorer/index.ts)                                           |
| `ExplorerBreadcrumb`                                               | [`src/components/file_explorer/explorer_breadcrumb/index.tsx`](./src/components/file_explorer/explorer_breadcrumb/index.tsx) |
| `ExplorerEmptyState`, `ExplorerLoadingState`, `ExplorerErrorState` | [`src/components/file_explorer/index.ts`](./src/components/file_explorer/index.ts)                                           |
| `ItemActionsDropdown`, `ItemActionsContextContent`                 | [`src/components/file_explorer/item_actions/index.ts`](./src/components/file_explorer/item_actions/index.ts)                 |

`FileThumbnail` receives a thumbnail URL, loading/error state and a fallback. It
forwards its container ref, displays a skeleton while loading and falls back if
the image fails. A new source resets the image failure state. Fetching signed
URLs, generating PDF previews, cloud permissions and object-URL cleanup belong
to the consumer. These exports do not load PDF or office viewer engines.

Explorer rows and cards receive `id`, `type` (`file` or `folder`), `selected`,
`actions` and their content. `ExplorerAction` supplies the action key, translated
label, icon and callback; hidden actions are omitted. Cards also receive `name`,
`icon`, `preview`, optional path/metadata and pointer or drag handlers. Pass
`actionsLabel` to localize the action-menu trigger. Selection, opening, moving,
deleting and downloading are controlled by consumer callbacks.

`ExplorerBreadcrumb` receives `{ id, name }` items and `onNavigate`; its buttons
support keyboard navigation. `ExplorerTable` receives `ExplorerColumn` entries
and accepts `flow` for content-height tables. Grid, panel and table containers
retain selection/viewport refs, overlay and footer slots. `className` controls
container height and spacing. All component prop types and `EXPLORER_GRID_CLASS`
are also exported from `arxatec-ui`.

### Shared file controls (0.1.73)

Import general components, prop types and interaction hooks from `arxatec-ui`.
FileTypeIcon, FolderIcon, FileThumbnail and the base Explorer surfaces remain
shared presentation primitives. Explorer rows, tables, filters, selection and
empty states have consumers in Documents and Cases.

- ExplorerFilters, ExplorerFilterSelect, ExplorerSelectionBar, ExplorerViewModeToggle and ExplorerItemsLoading live in [file_explorer](./src/components/file_explorer/index.ts).
- ConfirmationDialog and NameInputDialog are controlled general dialogs. Consumers own validation and persistence.
- PanelStatus, InlineErrorMessage and ExplorerSection provide small presentation primitives.
- FileViewLoadingState, ViewerFloatingBar, FileDocumentExportDialog and useFileViewLoadingChange are main-package exports independent of viewer engines.

`ExplorerViewModeToggle` receives its value and callback; the consumer owns
preference storage. Filter options, action labels and search copy arrive through
props. ExplorerSelectionBar accepts actions and trailing content.

Generic root hooks include useFilePicker/useFolderPicker for native browser
selection, useAutomaticPages for scroll pagination, useLazyVisible for visibility
and useFileViewLoading for loading propagation.

The MIME renderer FilePublicPreviewRender and getFilePreviewMimeType stay in
`arxatec-ui/file-view/core`; PDF/image/Office engines load dynamically.

Documents product compositions live in Lawyer Platform at
`src/modules/documents/components`: move/conflict dialogs, versions,
sharing and credential fields, detail panels, summary/transcription panels,
public-file layouts, account/quota bars and transfer/toast surfaces. Their types
and support helpers are local too. They are not library exports.

See [shared controls stories](./src/components/documents_controls.stories.tsx)
for explorer, name and confirmation dialogs.

The local candidate is `0.1.73`; the registry check recorded on 2026-10-14
reported `0.1.72`. The sibling platform uses `file:../../arxatec-ui`. After
building this library, refresh it with `pnpm update arxatec-ui --ignore-scripts`.

### Hooks

- **`useDebounce`**

### Types

- **`PaginationState`**: `{ page, limit, total, total_pages }` (useful with `PaginationController`).

### Utilities

- **`cn`**: class merging (`clsx` + `tailwind-merge`).
- Image crop helpers for `ImageCropDialog`.
- **`classNameControl`**: optional **Storybook** control metadata.

## Toasts (Sonner)

Render **`Toaster`** once near the app root and call `toast(...)` per the **sonner** docs.

## Maps (Leaflet)

```ts
import "leaflet/dist/leaflet.css";
```

## Developing this repo

| Command                | Description                    |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Vite playground (style guide). |
| `npm run storybook`    | Storybook on port 6006.        |
| `npm run build:lib`    | Build `dist/` for npm.         |
| `npm run build`        | Playground production build.   |
| `npm run lint`         | ESLint.                        |
| `pnpm test:components` | Component unit tests.          |

For local development with `arxatec-lawyer-platform`, build this library first and
run `pnpm update arxatec-ui --ignore-scripts` in the platform. Its local migration
uses `file:../../arxatec-ui`, so rebuilding this repository requires refreshing the
consumer package. React, React Hook Form and Tiptap continue to resolve through
the consumer's peer dependencies.

This source prepares `0.1.73`; the registry check recorded on 2026-10-14
reported `0.1.72`. New exports reach npm after publication. Before production
delivery, replace the platform local `file:` dependency with the published release
and run `pnpm update arxatec-ui`.

Publishing to npm requires **2FA**; use `npm publish --otp=...` when prompted.

## License

MIT. See [LICENSE](./LICENSE).

## File-view engines on demand (0.1.69)

Existing `arxatec-ui/file-view` exports remain compatible. Applications that need
bounded startup downloads should use the lightweight shell and lazy engines:

```tsx
import {
  FileViewSheet,
  configureFileViewPdfWorker,
} from "arxatec-ui/file-view/core";
import { lazyFileViewer } from "arxatec-ui/file-view/lazy";
import type { FilePdfViewerProps } from "arxatec-ui/file-view/pdf";

configureFileViewPdfWorker(localHashedWorkerUrl);
const PdfViewer = lazyFileViewer<FilePdfViewerProps>(() =>
  import("arxatec-ui/file-view/pdf").then(({ FilePdfViewer }) => ({
    default: FilePdfViewer,
  })),
);
```

Engine entries under `/file-view/` are `pdf`, `image`, `office`, `code`, `template`,
`docx`, `xlsx`, `audio`, `video`, `summary` and `transcription`. The core does not
import PDF or another engine. HEIC conversion loads `heic2any` only for HEIC.
The wrapper loads without adding loading, error or retry controls. Loading
callbacks reach the existing parent sheet; a failed load ends its pending state.
Closing and reopening the sheet allows another load attempt.

`FileViewSheet` accepts `lazyPanels?: boolean`, default `false`. Set it to `true`
to mount only the initial panel and mount each other panel on its first visit.
Visited panels remain mounted, preserving edits, annotations and zoom, until
close or `fileKey` changes. `onActiveTabChange` reports the active panel. Render
callbacks receive `isActive`; query consumers should use it to pause summary and
transcription reads. Hidden-panel loading must not replace the active panel.

Configure a local hashed PDF worker before opening PDF. Configuration itself is
lightweight; deferred setup respects it and later configuration updates it. Match
the worker version exactly to `pdfjs-dist` resolved by this package's `react-pdf`.
The worker URL can use web/PWA origin or Electron `app://arxatec`. Build consumers
with the package's worker setup marked as a side effect. PDF and image viewers
forward `onLoadingChange` until their content is ready.

Import `arxatec-ui/styles.css` once. Font faces retain ArxatecSans,
Cormorant Garamond (300–700, normal/italic) and JetBrains Mono (100–800,
normal/italic), with local licensed assets and `font-display: swap`. They download
only when matching content uses them; omit fonts from PWA precache and cache
requested faces at runtime. Consumers share `react-hook-form`, `@tiptap/core` and
`@tiptap/react` as peers alongside React and React Query.

Publication requires owner PR merge and clean-main publish. The platform applies
a seven-day minimum release age to external dependencies and explicitly exempts
all versions of `arxatec-ui`; validate a tarball in isolation before a registry
consumer update.

## Product composition boundary

Contact and calendar product compositions belong to Lawyer Platform in
`src/modules/<module>/shared/presentation`. Document product components and their
supporting helpers belong to `src/modules/documents/components`.
They compose the general controls provided by this package, and their screen
changes are delivered with the application. Icons, thumbnail presentation, shared
explorer primitives and generic file viewers remain in this kit.
The `Calendar` date-picker primitive remains part of this kit.
