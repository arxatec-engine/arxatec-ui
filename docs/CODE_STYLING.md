# Code styling — arxatec-ui

Reglas de estilo y arquitectura para la **librería de componentes** (React + TypeScript).
Cada regla tiene un número estable para poder citarla en revisiones y en PRs:
_"esto rompe R6"_, _"esto rompe L3"_.

Dos series de numeración:

- **`R1`–`R48`** — reglas compartidas con `arxatec-lawyer-platform`. **El número significa
  lo mismo en los dos repos**, así que una revisión puede citarlas sin ambigüedad. Verás
  huecos (`R29`–`R43`, `R47`, `R49`, `R50`): son las reglas de aplicación que aquí no
  aplican, y están listadas al final en _Qué no está aquí_.
- **`L1`–`L13`** — propias de este repo. No existen en la platform.

Las reglas describen el objetivo, no un ritual. Cuando una regla y la legibilidad del
código entren en conflicto, gana la legibilidad — pero hay que justificarlo en el PR.

---

## 1. Componentes

### R1 — Un componente por archivo

Cada archivo `.tsx` exporta **un único componente principal**. Si hay dos componentes en
el mismo archivo, uno de los dos está en el sitio equivocado.

La excepción clásica —los subcomponentes de un _compound component_ (`Card` /
`CardHeader` / `CardContent`) viviendo juntos— **no aplica en este repo**: L13 la retira.
La familia se sigue exportando como familia, pero desde un barrel, con cada parte en su
carpeta.

### R2 — Máximo 30 líneas de lógica propia

Un componente no debe contener más de **30 líneas de lógica propia** (todo lo que no es
JSX ni imports: estado, efectos, handlers, derivaciones, condiciones).

| Tipo de lógica                           | Destino                          |
| ---------------------------------------- | -------------------------------- |
| Estado + efectos + suscripciones         | `hooks/`                         |
| Transformación o formateo de datos puros | `utilities/`                     |
| Bloque de UI con su propia lógica        | componente hijo en `components/` |

### R3 — Una carpeta de componente no acumula `.tsx` hermanos

El único `.tsx` directo de una carpeta de componente es su entrypoint (`index.tsx`). En
cuanto aparece un segundo componente, baja a `components/`.

**Excepción única: `*.stories.tsx`.** Storybook exige la story al lado del componente, y
es el patrón en los 93 archivos de stories del repo. Un `.tsx` hermano que **no** sea una
story sí incumple la regla — hoy hay 12, como `mention_list/mention_list.tsx`.

**Mal:**

```
componente/
├── index.tsx
└── componente_dos.tsx   ← ¿es hijo? ¿es hermano? ¿quién lo usa?
```

**Bien:**

```
componente/
├── index.tsx
├── componente.stories.tsx    ← permitido
└── components/
    ├── index.ts
    └── componente_dos/
        └── index.tsx
```

### R4 — Estructura recomendada cuando hay lógica o hijos

```
componente_uno/
├── index.tsx                    # entrypoint: composición, poco más
├── componente_uno.stories.tsx
├── components/
│   ├── index.ts                 # barrel
│   └── hijo_componente/
│       └── index.tsx
├── hooks/
│   ├── index.ts                 # barrel
│   └── use_hook_uno/
│       └── index.ts
├── utilities/
│   ├── index.ts                 # barrel
│   └── utility_uno/
│       └── index.ts
├── types/
│   └── index.ts                 # tipos del componente (L13)
└── constants/
    └── index.ts                 # constantes y variantes cva (L13)
```

**Ojo:** en este repo la carpeta se llama `utilities/`, no `utils/`. No es cosmético:
`src/utilities/` es **ruta de export público** (`export * from "./utilities"` en
`src/index.ts`), así que renombrarla rompe a los consumidores. La platform usa `utils/`;
son dos repos distintos y cada uno mantiene el suyo.

Las carpetas `components/`, `hooks/`, `utilities/`, `types/` y `constants/` **se crean
cuando hacen falta**, no por adelantado (ver R20).

### R5 — El entrypoint se lee, no se estudia

`index.tsx` es donde se entiende **qué** hace el componente y **de qué piezas** está
compuesto. Si para saber qué renderiza hay que leer 180 líneas, el entrypoint no está
haciendo su trabajo.

### R6 — Límite de tamaño de archivo

Un archivo `.tsx` **no debería superar las 150 líneas**, excluyendo imports.

- 150 líneas → objetivo.
- Hasta 200 líneas → excepcional y justificado en el PR.
- Más de 200 líneas → requiere refactorización, sin discusión.

**Deuda conocida:** hay cinco archivos muy por encima del límite — `template_viewer`
(886), `annotation_konva_layer` (866), `sidebar` (737), `annotation_item` (585) y
`icon_picker` (521). No se parten de golpe; la regla aplica a **todo archivo que un PR
toque**, y ninguno de esos cinco debería crecer más.

### R7 — Si necesita demasiado para renderizar, se divide

Si un componente necesita múltiples condiciones, transformaciones de datos o
responsabilidades diferentes para poder renderizarse, **debe dividirse**.

### R8 — Una responsabilidad clara

Un componente hace una cosa y se puede describir en una frase sin usar "y".

### R9 — Máximo 5 props sin justificación

Si el número crece, evaluar si existe una abstracción mejor: un objeto de dominio,
composición (`children`, slots), o variantes agrupadas (ver L2).

En una librería esta regla pesa el doble: cada prop es API pública y quitarla después
cuesta una versión mayor (L1).

### R10 — Sin nesting de árbol genealógico

Si el JSX empieza a parecer un árbol genealógico, toca extraer componentes.

---

## 2. Hooks, utilities y abstracciones

### R11 — Los hooks no son un truco para bajar el contador de líneas

Mover 40 líneas a `use_component_logic()` que solo usa ese componente **no resuelve
nada**: la complejidad es la misma, ahora repartida en dos archivos. Un hook se justifica
cuando encapsula estado/efectos con una responsabilidad propia y nombrable.

### R12 — No todo es un custom hook

Si no hay estado, ni efectos, ni otros hooks dentro, **es una función**.

```ts
// Mal
const name = useFormatUserName(user);

// Bien
const name = formatUserName(user);
```

### R13 — `useMemo` / `useCallback` no son escondites de lógica

Son herramientas de rendimiento con un coste concreto; envolver un bloque complejo en un
`useMemo` no lo simplifica, solo lo camufla. Si el cuerpo es largo, el problema es el
cuerpo → `utilities/`.

### R14 — Crear abstracciones solo cuando aportan valor

Un botón es un botón: `button/index.tsx`. No hace falta rodearlo de `hooks/` y
`utilities/` vacíos.

---

## 3. Estado y contexto

### R15 — Context no es un atajo para no pasar props

Si la alternativa era pasar una prop dos niveles, pasa la prop.

**Matiz de librería:** el Context **interno** de un _compound component_ sí es legítimo —
es como `Select` comunica su estado a `SelectItem` sin obligar al consumidor a cablear
nada. Ese context no sale del componente: no se exporta.

### R16 — El estado vive donde se usa

Lo más cerca posible de donde se utiliza, y sin duplicar: una misma verdad en dos
`useState` acaba desincronizándose siempre.

**Matiz de librería:** un componente con estado propio debe aceptar ser **controlado**.
El patrón es `value` + `onValueChange` (o `open` + `onOpenChange`), con estado interno
solo cuando el consumidor no pasa el valor. Un componente que únicamente funciona
descontrolado es inutilizable dentro de un formulario.

---

## 4. Imports y dependencias

### R17 — Sin dependencias circulares

La dirección dentro de un componente es de una sola vía:

```
index.tsx  →  components/  →  hooks/  →  utilities/
```

Prohibido en sentido contrario:

```
utilities/ → components/   ❌
utilities/ → hooks/        ❌
```

Las `utilities/` son funciones puras: no conocen React, ni componentes, ni hooks.

Dentro de `src` se usa el alias `@/` (`@/utilities/index`), configurado en
`tsconfig.app.json`.

### R18 — Los barrels solo exportan

Los barrel exports (`index.ts`) solo contienen **exportaciones**. Nunca lógica,
constantes calculadas, side effects ni inicializaciones.

### R19 — Evitar `export *` … salvo en el barrel público

Dentro de un componente, exports explícitos: `export *` oculta qué expone realmente un
módulo y facilita colisiones.

**Excepción deliberada:** `src/index.ts` y `src/exports/*` son la **API pública del
paquete** y sí usan `export *` por componente. Ahí la lista explícita se desincroniza a
la primera y el barrel es justamente el sitio donde exportarlo todo es la intención.

---

## 5. Abstracciones prematuras y comentarios

### R20 — Primero la responsabilidad, después la abstracción

La estructura de R4 es el destino cuando el componente crece, no un formulario que
rellenar al crear el archivo.

### R21 — No comentar lo obvio

Los comentarios se reservan para el **porqué**: una decisión no obvia, un workaround, una
restricción externa.

```ts
// Mal
// incrementa el contador
setCount(count + 1);
```

---

## 6. Nomenclatura

| #   | Elemento               | Convención                      | Ejemplo                  |
| --- | ---------------------- | ------------------------------- | ------------------------ |
| R22 | Directorios y archivos | `snake_case`                    | `async_select/index.tsx` |
| R23 | Componentes React      | `PascalCase`                    | `AsyncSelect`            |
| R24 | Hooks                  | `camelCase` con prefijo `use`   | `useDebounce`            |
| R25 | Funciones y utilities  | `camelCase`                     | `cn`, `formatFileSize`   |
| R26 | Variables              | `camelCase`                     | `activeItem`             |
| R27 | Constantes             | `UPPER_SNAKE_CASE`              | `MAX_FILE_SIZE`          |
| R28 | Types e interfaces     | `PascalCase`                    | `Props`, `ButtonProps`   |

Los directorios van en `snake_case` aunque el componente que exportan sea `PascalCase`:
el nombre del archivo y el nombre del símbolo son cosas distintas.

```
async_select/index.tsx  →  export function AsyncSelect() { … }
use_debounce/index.ts   →  export const useDebounce = () => { … }
```

La interfaz de props se llama `Props` a secas cuando es local (50 archivos lo hacen). Si
se exporta —porque el consumidor la necesita para tipar— entonces lleva nombre propio:
`ButtonProps`, `AsyncBoundaryProps`.

---

## 7. Estilos

### R44 — Los hacks de Tailwind: constante nombrada y porqué

Un selector arbitrario largo es ilegible dentro del `className`. Va en una constante
`UPPER_SNAKE_CASE` **y con un comentario que explique qué está peleando** — el nombre
solo mueve el misterio, no lo resuelve.

Los selectores arbitrarios cortos y locales de una variante `cva` (`[&_svg]:size-4`) se
quedan donde están: ahí el contexto ya lo da la variante.

Esa constante vive en `constants/`, no en el `.tsx` (L13).

### L9 — Solo tokens semánticos, nunca la paleta cruda

`bg-primary`, `text-muted-foreground`, `border-input`. Nunca `bg-blue-500` ni
`text-zinc-400`: la paleta cruda ignora el tema del consumidor y rompe el modo oscuro.

Ya es la convención de facto — 786 usos de tokens semánticos contra 7 de paleta cruda.
Y esos 7 incluyen la prueba de por qué importa: `text-gray-11` aparece 3 veces en
`rich_text_editor` y **no existe en la escala de Tailwind**, así que no pinta nada. Un
token inválido falla en silencio; el build no dice ni una palabra.

---

## 8. Declaración y tipos

### R45 — Nada de `React.FC`

Los componentes se declaran como funciones que tipan sus props. `React.FC` no aporta
nada, estorba con genéricos y React ya no lo recomienda.

```tsx
// Mal
export const Badge: React.FC<Props> = ({ children }) => { … };

// Bien
export const Badge = ({ children }: Props) => { … };
```

Lo que R45 prohíbe es el `React.FC`; que la forma sea flecha lo fija L13.

Hay ~65 archivos con `React.FC`: es deuda, no precedente. Se migra el archivo que se toque.

### R46 — La interfaz de props se llama `Props`

Local al archivo y sin exportar, salvo que el consumidor la necesite (ver R28). Es el
único tipo que puede vivir en el `.tsx`; cualquier otro baja a `types/` (L13).

Para componentes que envuelven un elemento nativo, prefiere derivar el tipo en vez de
enumerar props a mano — así heredas `disabled`, `aria-*`, `onClick` y todo lo demás:

```tsx
type Props = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;
```

### L13 — El `.tsx`: un componente flecha y su interfaz de props

Un archivo `.tsx` contiene **dos declaraciones y ninguna más**: el componente, como
función flecha, y la interfaz de sus props. Nada de constantes de módulo, funciones
sueltas ni tipos auxiliares haciéndoles compañía.

Una sola `interface`, y es la de props. En cuanto aparece un segundo tipo —un `Handle`,
un union de modos, la forma de un item— ese tipo baja a `types/`, aunque solo lo use
este archivo.

| Lo que hoy convive con el componente     | Dónde va                |
| ---------------------------------------- | ----------------------- |
| La interfaz de props                      | se queda (R46)          |
| Cualquier otro `type` o `interface`       | `types/`                |
| Constantes de módulo y variantes `cva`    | `constants/` (R44, L2)  |
| Funciones puras: formateo, mapeos         | `utilities/` (R2)       |
| Bloques de UI con lógica propia           | `components/` (R2, R3)  |

**Mal** — cinco declaraciones, y hay que leerlas todas para llegar al componente:

```tsx
interface Props {
  items: Item[];
  mode: Mode;
}

type Mode = "compact" | "full";

const MAX_VISIBLE = 5;

const formatLabel = (item: Item) => `${item.name} (${item.count})`;

const ItemList = ({ items, mode }: Props) => { … };
```

**Bien** — los imports dicen de qué se compone; el archivo declara el componente y sus
props:

```tsx
import { MAX_VISIBLE } from "./constants";
import type { Mode } from "./types";
import { formatLabel } from "./utilities";

interface Props {
  items: Item[];
  mode: Mode;
}

export const ItemList = ({ items, mode }: Props) => { … };
```

La forma es flecha (`const X = () => …`), no `function X()`. No es gusto: fija una sola
manera de declarar un componente, y es la que ya usan 110 de los 167 componentes del
repo. `forwardRef` no es una excepción — `const X = forwardRef<…>((props, ref) => …)`
sigue siendo la forma flecha, envuelta.

**Un componente, no una familia.** Un `.tsx` con `Card`, `CardHeader` y `CardContent`
dentro son tres archivos, no uno. El módulo se convierte en una carpeta con `components/`
y un `index.ts` de barrel, que es como ya están `file_view` y `animated_icons`:

```
card/
├── index.ts                     # barrel: solo exporta (R18)
└── components/
    ├── index.ts
    ├── card/
    │   └── index.tsx
    └── card_header/
        └── index.tsx
```

La familia se sigue exportando como familia y el consumidor no nota nada: el barrel
mantiene los mismos nombres. Esto **retira la excepción de compound de R1** para este
repo.

**Única excepción: `*.stories.tsx`**, igual que en R3. Storybook exige el `meta`, los
`argTypes` y los componentes de demo en el mismo archivo; separarlos rompe la story.

**Deuda conocida:** de los 191 `.tsx` del repo, 158 ya cumplen la parte de tipos (74 sin
ninguno, 84 solo con su interfaz de props) y **33 declaran tipos de más**. Peor está la
parte de constantes: **49 declaran constantes o helpers a nivel de módulo**, y 57 usan
`function` en vez de flecha. Y **34 declaran más de un componente** —`context_menu` tiene
15, `command` 9—: son los que más trabajo dan, porque cada parte se lleva su carpeta. No se migran de golpe: como en R6 y R45, la regla aplica a
**todo archivo que un PR toque**.

Cuidado con un caso concreto: las siete variantes `cva` (`badgeVariants` y compañía) son
API pública exportada hoy desde el `.tsx`. Al bajarlas a `constants/` hay que reexportarlas
desde el `index.tsx` (`export { badgeVariants } from "./constants";`) o se rompe a los
consumidores (L1).

---

### R48 — Orden de imports

Tres grupos, separados por línea en blanco:

```tsx
import * as React from "react"; // 1. externos
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/utilities/index"; // 2. alias @/

import { ItemRow } from "./components"; // 3. relativos
```

`eslint-plugin-import` no está configurado en este repo; hoy la regla es humana.

---

## 9. Reglas de librería

Lo que no aplica a una app y aquí es el trabajo entero: cada componente es un contrato
publicado en npm.

### L1 — Las props son API pública

Añadir una prop opcional es gratis. Renombrarla, quitarla o cambiar su tipo **rompe a los
consumidores** y cuesta una versión. Antes de exponer una prop, pregunta si el consumidor
la necesita de verdad o si es un detalle interno que se te escapó hacia fuera.

Corolario: nada de props que solo existen para un caso puntual de la platform. Eso es
composición (`children`, slots), no una prop nueva.

### L2 — Variantes con `cva`, no props booleanas

```tsx
// Mal — cuatro booleanas que pueden contradecirse entre sí
<Button isPrimary isSmall isDestructive isGhost />

// Bien
<Button variant="destructive" size="sm" />
```

`cva` centraliza las clases por variante, tipa los valores posibles y da
`defaultVariants`. El `Button` del repo es la referencia canónica.

### L3 — `className` siempre entra y siempre se mergea con `cn`

Un componente que ignora `className` es una cárcel: el consumidor no puede ajustar ni un
margen sin forkearlo. La prop se acepta **y** se pasa por `cn`, que resuelve los
conflictos de Tailwind a favor del consumidor.

```tsx
className={cn(buttonVariants({ variant, size, className }))}
```

Hoy 83 componentes aceptan `className` y 106 archivos usan `cn`. El que renderice algo
visible y no acepte `className`, es un bug de API.

### L4 — `data-slot` en cada parte targeteable

Cada raíz —y cada parte interna con identidad— lleva su `data-slot`. Es lo que permite al
consumidor apuntar a una pieza interna (`[&_[data-slot=scroll-area-viewport]]:…`) sin
depender de la estructura de divs, que puede cambiar en cualquier versión.

Presente en 40 componentes.

### L5 — `asChild` para no imponer el elemento

Un `Button` que renderiza siempre `<button>` no puede ser un enlace. Con `Slot` de Radix
el consumidor decide el elemento final:

```tsx
const Comp = asChild ? Slot : "button";
```

Ojo con el dato: `asChild` aparece en 69 archivos, pero solo **5 lo exponen** — en el
resto es la librería consumiéndolo de Radix. Así que esto es más objetivo que convención:
al tocar un componente que renderiza un interactivo, evalúa exponerlo.

### L6 — El `ref` tiene que llegar al DOM

Un componente cuyo `ref` no llega al nodo real no sirve para foco, medición ni
posicionamiento — y esos son casos de uso normales del consumidor.

Hoy conviven dos patrones: `forwardRef` (37 archivos) y la firma moderna con
`React.ComponentProps` (el `Button`).

> **Decisión pendiente:** `package.json` declara el peer como `react: ^18.0.0 || ^19.0.0`.
> El paso de `ref` como prop normal es de React 19: mientras el peer siga admitiendo 18,
> el patrón del `Button` **no reenvía el ref** en esos consumidores. O se sube el peer a
> React 19, o los componentes que necesiten ref usan `forwardRef`. Hasta que se decida,
> `forwardRef` es la opción segura.

### L7 — La librería no conoce a la app

Sin i18n, sin `axios`, sin rutas, sin stores de la platform. Un componente recibe datos y
callbacks; no los va a buscar.

La dependencia invertida (`arxatec-ui` importando de la platform) es imposible por
definición: la platform la consume desde npm.

Único punto sucio actual: `template_viewer` importa `@tanstack/react-query` —declarado
como peer dependency—. Es el único archivo del repo que lo hace, y no debería crecer esa
lista.

### L8 — Los textos visibles entran por props

Una librería no puede traducir: no sabe en qué idioma está la app que la monta. Todo
texto visible es una prop, con un default en inglés si hace falta.

```tsx
// Mal — el consumidor no puede traducirlo
<span>Página siguiente</span>

// Bien
<span>{nextLabel}</span>
```

Hoy hay copy en español incrustado en el visor y el editor (`Aumentar zoom`,
`Página siguiente`, `Negrita`, `Buscar`). Es deuda: cada uno de esos textos es una app en
inglés mostrando media interfaz en español.

### L10 — Cada componente tiene su `*.stories.tsx`

La story es la documentación ejecutable y el único banco de pruebas del repo: **no hay
tests**. Un componente sin story no se puede revisar sin montar la platform entera.

La story vive al lado del `index.tsx` (excepción de R3) y cubre al menos las variantes
declaradas en `cva`.

### L11 — Accesibilidad: Radix primero

Para cualquier patrón con comportamiento (diálogo, menú, tabs, tooltip, select) se parte
del primitivo de Radix, que ya trae foco, teclado y ARIA. Reimplementarlo a mano es
garantizar que el foco y el `Escape` estarán mal.

Lo que se escriba a mano lleva su `aria-*` y su navegación por teclado, y se prueba con
el tabulador antes del PR.

### L12 — Todo export es nombrado

```ts
export { Button, buttonVariants };
```

Los exports nombrados son lo que hace grepeable el código y lo que permite el
tree-shaking del bundle publicado. **Única excepción:** el `export default meta` que
Storybook exige en los `*.stories.tsx`.

---

## Qué no está aquí

Estas reglas existen en `arxatec-lawyer-platform/docs/CODE_STYLING.md` y **no aplican a
esta librería**. Los números quedan libres a propósito: si algún día aplican, se
recuperan con el mismo significado.

| Reglas    | Tema                                      | Por qué no aplica                                                       |
| --------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| R29–R32   | Anatomía de feature, `pages`, params       | No hay `features/`, ni router, ni `useParams`                           |
| R33–R37   | `services/`, mutaciones, `queryKey`        | La librería no habla con ninguna API                                    |
| R38–R40   | i18n (`NS`, claves tipadas)                | La librería no traduce: los textos entran por props (L8)                |
| R41–R42   | `AsyncBoundary`, `toast.promise`           | `AsyncBoundary` **es** un componente de aquí; quién lo usa es la app     |
| R43       | "Los componentes salen de `arxatec-ui`"    | Circular: este repo **es** `arxatec-ui`                                 |
| R47       | `export default` solo en pages             | No hay rutas; aquí la regla es L12 (todo nombrado)                      |
| R49–R50   | `docs/README.md` por feature, test espejo  | No hay features. Sobre tests, ver la nota de gates                      |

---

## Gates

Hoy el único gate ejecutable del repo es:

```bash
pnpm lint     # eslint
```

**No hay** script `test`, `typecheck` ni `format`, y **no hay ningún archivo de test** en
`src`. Tampoco hay configuración de Prettier, así que el formato es convención, no
automatismo. Mientras siga así, la revisión humana y las stories (L10) son la única red.

---

## Checklist de revisión

Antes de abrir un PR:

- [ ] Un componente por `.tsx`, sin excepción de compound (R1, L13), y ≤ 150 líneas sin imports (R6).
- [ ] La carpeta no tiene `.tsx` hermanos sueltos que no sean stories (R3).
- [ ] La carpeta de funciones puras se llama `utilities/`, no `utils/` (R4).
- [ ] El `index.tsx` se lee de un vistazo (R5).
- [ ] Ningún componente con más de 5 props sin justificar (R9) — y cada prop es API (L1).
- [ ] Ningún hook que sea "el resto del componente" (R11) ni un `useAlgo()` sin hooks (R12).
- [ ] El componente acepta ser controlado (R16).
- [ ] Sin ciclos ni `utilities/ → hooks/` (R17); barrels sin lógica (R18).
- [ ] Nomenclatura según R22–R28; sin `React.FC` en los archivos tocados (R45).
- [ ] El `.tsx` solo declara el componente flecha y su interfaz de props (L13).
- [ ] Solo tokens semánticos, ninguna clase de la paleta cruda (L9).
- [ ] Variantes con `cva`, no booleanas sueltas (L2).
- [ ] `className` aceptado y mergeado con `cn` (L3).
- [ ] `data-slot` en las partes targeteables (L4) y `asChild` si renderiza un interactivo (L5).
- [ ] El `ref` llega al DOM (L6).
- [ ] Cero textos hardcodeados: entran por props (L8).
- [ ] El componente tiene su `*.stories.tsx` con las variantes cubiertas (L10).
- [ ] Teclado y foco probados con el tabulador (L11).
- [ ] Todos los exports nombrados (L12).
