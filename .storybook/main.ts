import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
  ],
  framework: "@storybook/react-vite",
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      resolve: {
        alias: {
          "@": path.resolve(dirname, "../src"),
        },
      },
      optimizeDeps: {
        include: [
          "yjs",
          "lib0",
          "y-protocols/awareness",
          "@tiptap/y-tiptap",
          "@tiptap/extension-collaboration",
          "@tiptap/extension-node-range",
          "@tiptap/extension-drag-handle",
          "@tiptap/extension-drag-handle-react",
        ],
      },
    });
  },
};

export default config;
