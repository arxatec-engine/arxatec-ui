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
