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

1. Install Tailwind and the official Vite plugin:

   ```bash
   npm install tailwindcss @tailwindcss/vite
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

### Components (overview)

- **Forms & text:** `Button`, `Input`, `Textarea`, `Label`, `Checkbox`, `RadioGroup`, `Select`, `Slider`, `Toggle`, `InputOTP`, `FileDropZone`, `LocationInput`, `DateRangePicker`, `Calendar`, `AsyncSelect`, `DescriptionMarkdownEditor`, `RichTextEditor`, and more.
- **Surfaces & navigation:** `Card`, `Dialog`, `Sheet`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu`, `ContextMenu`, `Tabs`, `Breadcrumb`, `Pagination`, `PaginationController`, `Sidebar`, `Command`, `Collapsible`, and more.
- **Data & feedback:** `Table`, `Badge`, `Skeleton`, `Progress`, `StatusMessage`, `AsyncBoundary`, `AsyncCommandList`, `Chart`, `Carousel`, and more.
- **Maps:** `MapView`, `MapPicker`.
- **Extras:** `Toaster` (Sonner), `IconPicker`, `EmojiPicker`, brand icons, animated icons, etc.

The full list matches the `export *` entries in [`src/index.ts`](./src/index.ts).

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

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Vite playground (style guide). |
| `npm run storybook` | Storybook on port 6006.        |
| `npm run build:lib` | Build `dist/` for npm.         |
| `npm run build`     | Playground production build.   |
| `npm run lint`      | ESLint.                        |

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

Publication requires owner PR merge and clean-main publish. The platform's
minimum release age is seven days; validate a tarball in isolation before that
consumer update.
