export const GUIDE_SECTIONS = [
  { id: "fundamentos", label: "Fundamentos", number: "01" },
  { id: "acciones", label: "Acciones", number: "02" },
  { id: "formularios", label: "Formularios", number: "03" },
  { id: "estados", label: "Identidad y estados", number: "04" },
  { id: "navegacion", label: "Navegación", number: "05" },
  { id: "datos", label: "Datos y composición", number: "06" },
  { id: "media", label: "Media y ubicación", number: "07" },
  { id: "tablas", label: "Tablas y paginación", number: "08" },
];

export const DEMO_PROJECTS = [
  { id: "design", name: "Sistema de diseño" },
  { id: "website", name: "Sitio web" },
  { id: "product", name: "Nuevo producto" },
];

export const CHART_DATA = [
  { month: "Ene", total: 120 },
  { month: "Feb", total: 220 },
  { month: "Mar", total: 160 },
  { month: "Abr", total: 280 },
  { month: "May", total: 230 },
];

// Local fixture so image cropping uses the same origin as the demo.
// Source: https://images.unsplash.com/photo-1470770841072-f978cf4d019e
export const DEMO_IMAGE = "/style-guide-landscape.jpg";

export const TABLE_PROJECTS = [
  {
    name: "Sistema de diseño",
    owner: "María García",
    status: "Activo",
    variant: "default",
  },
  {
    name: "Sitio web",
    owner: "Carlos Ruiz",
    status: "En revisión",
    variant: "secondary",
  },
  {
    name: "Nuevo producto",
    owner: "Ana Torres",
    status: "Borrador",
    variant: "outline",
  },
  {
    name: "Biblioteca de recursos",
    owner: "Luis Vargas",
    status: "Activo",
    variant: "default",
  },
  {
    name: "Centro de ayuda",
    owner: "María García",
    status: "Borrador",
    variant: "outline",
  },
  {
    name: "Portal del equipo",
    owner: "Ana Torres",
    status: "En revisión",
    variant: "secondary",
  },
  {
    name: "Guía de marca",
    owner: "Carlos Ruiz",
    status: "Activo",
    variant: "default",
  },
  {
    name: "Panel de actividad",
    owner: "Luis Vargas",
    status: "En revisión",
    variant: "secondary",
  },
  {
    name: "Página de contacto",
    owner: "María García",
    status: "Borrador",
    variant: "outline",
  },
] as const;
