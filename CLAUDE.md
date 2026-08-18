# CLAUDE.md — arxatec-ui

Librería de componentes React compartida del workspace. **Se publica en npm como
`arxatec-ui`** y la consume `arxatec-lawyer-platform` (>600 imports), que la trae
por versión: `"arxatec-ui": "^0.1.59"`. No es una app: aquí no hay rutas, ni
llamadas a la API, ni estado de negocio.

Esto la hace distinta de los otros cuatro repos: **un cambio aquí no llega a nadie
hasta que se publica una versión**, y publicar mal revierte código ajeno. Lee
[Publicar](#publicar-lee-esto-entero-antes-de-npm-publish) antes de tocar la
versión.

## Antes de nada: esto NO es un proyecto pnpm

Los otros cuatro repos del workspace son pnpm. **Este es npm** — el `README.md`
documenta `npm run …` y `prepublishOnly` corre con npm.

Hoy conviven `package-lock.json` **y** `pnpm-lock.yaml`, que es deuda abierta
(D-2 de [`docs/registro/2026-08-04/DEUDA_ABIERTA.md`](docs/registro/2026-08-04/DEUDA_ABIERTA.md)):
cada lockfile puede resolver un árbol distinto. **Mientras no se decida, usa npm.**

> Corregido el 2026-08-15: ese registro dice que `pnpm lint` «revienta» antes de
> llegar a eslint. Ya no: hoy ejecuta y falla solo por los 16 problemas de lint
> reales. La deuda de los dos lockfiles sigue en pie; la de que el comando no
> corriera, no.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Vite en modo app (la `src/pages/` es un banco de pruebas, no se publica) |
| `npm run lint` | `eslint .` — **hoy 16 problemas (14 errores)**, ver D-1 |
| `npm run build:lib` | El build que se publica: `vite.lib.config.ts` + `merge-lib-styles.mjs` + `copy-fonts.mjs` |
| `npm run storybook` | Storybook en :6006 — **la única verificación real que hay** |
| `npm run build` | Build de la app de pruebas, no del paquete |

**No hay tests.** Cero archivos `*.test.*`; hay **93 stories**. La red de seguridad
de este repo es Storybook y el ojo, así que un cambio visual se mira ahí antes de
publicar.

## Estructura

```
src/
├── components/<snake_case>/index.tsx   ← 68 componentes, uno por carpeta
│                        └── *.stories.tsx (opcional, y muy recomendable)
├── hooks/  types/  utilities/          ← se reexportan enteros
├── styles/                             ← tokens.light/dark, theme, fonts, prose…
├── exports/                            ← los tres puntos de entrada del paquete
└── pages/  main.tsx                    ← banco de pruebas local; NO se publica
```

`src/index.ts` es el barril: cada componente nuevo se añade ahí a mano, o no
existe para quien consume la librería.

### Tres puntos de entrada, no uno

`package.json → exports` publica **tres** superficies, y la distinción importa:

| Import | Para qué |
| --- | --- |
| `arxatec-ui` | Todo lo general: `Button`, `Dialog`, `FormInput`, `AsyncBoundary`… |
| `arxatec-ui/sidebar` | El sidebar, aparte |
| `arxatec-ui/file-view` | Visores de archivo — **arrastra `react-pdf` y su CSS** |
| `arxatec-ui/styles.css` | La hoja de estilos compilada |

⚠️ **`file-view` es pesado y contagioso.** En la platform, importarlo desde un
barril hacía reventar suites enteras de tests con `Unknown file extension ".css"`.
No lo re-exportes desde el barril principal.

## Publicar (lee esto entero antes de `npm publish`)

**🔴 `main` va por detrás de npm.** Está documentado en
[`docs/registro/2026-08-11/SVG_CAMELCASE_GOOGLE_ISOTYPE.md`](docs/registro/2026-08-11/SVG_CAMELCASE_GOOGLE_ISOTYPE.md) §7:

`0.1.59` se publicó **desde un working tree que nunca se commiteó**. Ese paquete
contiene `file_view/utilities/transcription_pages` —la paginación de
transcripciones— que **no existe en el `src` de este repo**.

Consecuencia: `package.json` está hoy en `0.1.60`, y **publicar desde `main` tal
cual borra esa funcionalidad del paquete**. La platform pide `^0.1.59`, así que
resolvería a `0.1.60` y el visor perdería la paginación sin que nada avise.

**Antes de publicar hay que recuperar ese código a git.** La pista está en el
`dist/file-view.js.map` de `0.1.59`, que sí lleva sourcemap.

Y la regla que ya costó una versión: **no reutilices un número publicado**. npm no
deja sobrescribir; por eso se saltó de `0.1.58` a `0.1.60`.

## Contrato con la platform: lo que rompe en silencio

Un cambio aquí no rompe ningún test de este repo —no hay— pero sí puede romper la
platform. Dos casos ya pagados:

- **`useAnimatedIcon`** (`components/animated_icons/hooks/use_animated_icon/`)
  invoca un handle imperativo. Los iconos de `lucide-react` **no lo exponen**, así
  que cada hover lanzaba `startAnimation is not a function`. Lo sufrió el sidebar
  de la platform (su registro del 2026-08-10); se arregló allí con un hook propio,
  pero la causa vive aquí.
- **Atributos SVG en camelCase.** React exige `clipRule`, no `clip-rule`. Un SVG
  pegado tal cual del diseño compila, no rompe lint, y se ve mal en runtime — el
  arreglo de `GoogleIsotype` del 2026-08-11 fue exactamente eso.

Regla práctica: si tocas un componente que la platform usa, dilo en el PR y avisa
de si hace falta publicar.

## Deuda abierta

Está inventariada en [`docs/registro/2026-08-04/DEUDA_ABIERTA.md`](docs/registro/2026-08-04/DEUDA_ABIERTA.md):

- **D-1** · 16 problemas de lint (14 errores). Ocho son
  `react-hooks/set-state-in-effect` —`setState` síncrono dentro de un efecto, o
  sea renders en cascada— y **dos son bugs reales, no estilo**.
- **D-2** · Los dos lockfiles.
- **D-3** · El visor no honra `initialPage`: cuando el chat cita un documento y
  dice la página, abrirlo no te lleva ahí.

## Registro de sesión y la regla que lo gobierna

**Nunca asumas que la documentación de este repo está actualizada — tampoco este
archivo.** Compruébala contra el código antes de apoyarte en ella, y corrige lo
desfasado en el mismo cambio. Este archivo nació el 2026-08-15 y ya corrige una
afirmación del registro del 04/08 (la de `pnpm lint`).

Todo hallazgo, auditoría o decisión va a `docs/registro/<YYYY-MM-DD>/`, una carpeta
por día, con la fecha **leída del sistema** (`date +%F`), cabecera declarando contra
qué commit se verificó, y su fila en el índice de
[`docs/registro/README.md`](docs/registro/README.md) en la misma sesión.

## Git

Rama por unidad de trabajo + PR; **el owner mergea, nunca push directo a `main`**.
`gh` no está instalado: los PR se crean en la web
(`github.com/arxatec-engine/arxatec-ui/pull/new/<rama>`).
