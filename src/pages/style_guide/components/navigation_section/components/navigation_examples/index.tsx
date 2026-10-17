import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";

import { ComponentPreview } from "../../../component_preview";

export const NavigationExamples = () => (
  <ComponentPreview
    title="Tabs"
    description="Alterna entre vistas relacionadas que no necesitan mostrarse al mismo tiempo."
  >
    <Tabs defaultValue="overview" className="w-full max-w-sm">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="activity">Actividad</TabsTrigger>
      </TabsList>
      <TabsContent
        value="overview"
        className="rounded-md border bg-background p-5 text-sm text-muted-foreground"
      >
        Todo lo esencial de tu proyecto, en una vista.
      </TabsContent>
      <TabsContent
        value="activity"
        className="rounded-md border bg-background p-5 text-sm text-muted-foreground"
      >
        María actualizó el proyecto hace 5 minutos.
      </TabsContent>
    </Tabs>
  </ComponentPreview>
);
