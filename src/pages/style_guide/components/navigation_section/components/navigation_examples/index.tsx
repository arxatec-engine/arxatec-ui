import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";

import { ComponentPreview } from "../../../component_preview";

export const NavigationExamples = () => (
  <>
    <ComponentPreview
      title="Breadcrumb"
      description="Muestra dónde estás dentro de una jerarquía y ofrece un camino directo para volver a los niveles anteriores."
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#fundamentos">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#navegacion">Componentes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Guía</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </ComponentPreview>
    <ComponentPreview
      title="Tabs"
      description="Alterna entre vistas del mismo contexto. Úsalo para contenido relacionado que no necesita verse al mismo tiempo."
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>
        <TabsContent
          value="overview"
          className="rounded-lg border bg-background p-5 text-sm text-muted-foreground"
        >
          Todo lo esencial de tu proyecto, en una vista.
        </TabsContent>
        <TabsContent
          value="activity"
          className="rounded-lg border bg-background p-5 text-sm text-muted-foreground"
        >
          María actualizó el proyecto hace 5 minutos.
        </TabsContent>
      </Tabs>
    </ComponentPreview>
  </>
);
