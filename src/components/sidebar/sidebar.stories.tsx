import type { Meta, StoryObj } from '@storybook/react-vite'
import { Home, Inbox } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './index'

type SidebarStoryArgs = {
  tituloCabecera?: string
  etiquetaGrupo?: string
  item1?: string
  item2?: string
  textoPrincipal?: string
  textoSecundario?: string
}

const meta = {
  title: 'Components/Sidebar',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    tituloCabecera: { control: 'text', name: 'Título cabecera' },
    etiquetaGrupo: { control: 'text', name: 'Etiqueta grupo' },
    item1: { control: 'text', name: 'Ítem 1' },
    item2: { control: 'text', name: 'Ítem 2' },
    textoPrincipal: { control: 'text', name: 'Texto zona principal' },
    textoSecundario: { control: 'text', name: 'Párrafo contenido' },
  },
} satisfies Meta<SidebarStoryArgs>

export default meta

type Story = StoryObj<SidebarStoryArgs>

export const Default: Story = {
  args: {
    tituloCabecera: 'Menú',
    etiquetaGrupo: 'Navegación',
    item1: 'Inicio',
    item2: 'Mensajes',
    textoPrincipal: 'Contenido principal',
    textoSecundario: 'Área junto a la barra lateral.',
  },
  render: ({
    tituloCabecera,
    etiquetaGrupo,
    item1,
    item2,
    textoPrincipal,
    textoSecundario,
  }) => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-sidebar-border border-b px-2 py-2">
          <span className="text-sm font-medium">{tituloCabecera}</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{etiquetaGrupo}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#" className="flex items-center gap-2">
                      <Home className="size-4" />
                      <span>{item1}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#" className="flex items-center gap-2">
                      <Inbox className="size-4" />
                      <span>{item2}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="text-muted-foreground text-sm">{textoPrincipal}</span>
        </header>
        <main className="p-4">
          <p className="text-muted-foreground text-sm">{textoSecundario}</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
}
