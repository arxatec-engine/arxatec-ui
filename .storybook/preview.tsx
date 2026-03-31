import type { Preview } from '@storybook/react-vite'

import '../src/styles/index.css'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Tema de la interfaz (variables `:root` / `.dark` en index.css)',
      defaultValue: 'light',
      toolbar: {
        title: 'Tema',
        items: [
          { value: 'light', title: 'Claro' },
          { value: 'dark', title: 'Oscuro' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as string
      const isDark = theme === 'dark'
      return (
        <div className={isDark ? 'dark' : ''}>
          <div className="min-h-screen w-full bg-background text-foreground antialiased">
            <Story />
          </div>
        </div>
      )
    },
  ],
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
