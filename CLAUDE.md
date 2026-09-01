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
cada lockfile puede resolver un árbol distinto.

> ### ⚠️ Corregido el 2026-09-01: **usa `pnpm` para instalar, aquí decía npm**
>
> Este archivo decía «mientras no se decida, usa npm». **npm no funciona hoy**:
>
> ```text
> $ npm ci        → ERESOLVE
> $ npm install   → ERESOLVE
>   @tiptap/extension-table@3.22.5 exige @tiptap/core@3.22.5 exacto,
>   y el árbol resuelve @tiptap/core@3.22.4
> ```
>
> El conflicto **está en `package.json`**, no solo en el lockfile: los 28
> paquetes de tiptap se declaran con rangos `^3.14.0`/`^3.22.4` sueltos, y sus
> sub-paquetes fijan el peer de `core` **a una versión exacta**. npm elige el más
> nuevo de cada uno por su cuenta y los descuadra. `pnpm install --frozen-lockfile`
> sí resuelve, y es lo que hay que usar para instalar.
>
> Lo que **sigue siendo npm** es el resto: los scripts del `README.md`,
> `prepublishOnly`, y `npm publish`. Es solo la instalación la que no.
>
> **Esto inclina D-2**: el lockfile que funciona es el de pnpm. Retirar
> `package-lock.json` es decisión del owner, pero mantener dos cuando uno está
> roto es peor que tener uno.

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

## La regla de la versión: un cambio publicable = un `version` nuevo

**Todo cambio que altere lo que se publica sube `version` en `package.json`, en
el mismo commit que el cambio.** Publicable es todo lo que entra en el paquete:
`src/`, estilos, fuentes, y la configuración del build de librería. No lo son el
banco de pruebas de `src/pages/`, las stories, ni la documentación.

No es burocracia. Este paquete **no tiene tests** —su red es Storybook y el ojo—
y sus dos consumidores lo reciben por npm, no por git. Sin número nuevo:

- **npm no deja publicar.** Un número ya publicado es inmutable; por eso se saltó
  de `0.1.58` a `0.1.60`.
- **El cambio no llega a nadie.** `platform` y `public-web` piden un rango
  (`^0.1.x`) contra el registro. Tocar este repo **no cambia ni la web ni el
  producto** hasta que hay `npm publish`.

### Subir el número no basta: hay tres pasos, y el tercero se olvida

| # | Dónde | Qué |
| --- | --- | --- |
| 1 | Aquí | `version` en `package.json` **en el commit del cambio** |
| 2 | Aquí | `npm publish` desde `main` limpio |
| 3 | **En los consumidores** | `pnpm update arxatec-ui` (platform) · `npm install arxatec-ui@<v>` (public-web) |

El paso 3 es el que se olvida y produce la confusión de siempre: *«ya lo publiqué
y no se ve»*. El lockfile del consumidor clava la versión aunque el rango permita
subir. Medido el 2026-09-01: npm y `main` estaban los dos en `0.1.64` y **la
platform seguía instalando `0.1.60`** — cuatro versiones por detrás, incluida la
que recuperó la paginación de transcripciones.

> **Y ojo con publicar y actualizar el mismo día.** La platform tiene una
> política de cadena de suministro (`minimumReleaseAge`, 24 h) que **rechaza
> cualquier versión publicada hace menos de un día**: `pnpm install` falla la
> verificación del lockfile y CI sale rojo. Añadirla a
> `minimumReleaseAgeExclude` **no es suficiente**, comprobado el 2026-09-01 con
> `0.1.64`. Si publicas hoy, el consumidor la coge mañana.

### Antes de publicar, comprueba contra npm

```bash
npm view arxatec-ui version      # lo que hay publicado
grep '"version"' package.json    # lo que hay aquí
```

Esta comprobación ha estado equivocada **en las dos direcciones** —`main` por
detrás de npm en agosto, npm por detrás de `main` después—, así que no la des por
sabida: córrela.

## Publicar (lee esto entero antes de `npm publish`)

**✅ Recuperado el 2026-08-15.** `main` estuvo por detrás de npm: `0.1.59` se
publicó desde un working tree que nunca se commiteó, y llevaba
`file_view/utilities/transcription_pages` —la paginación de transcripciones— que
no existía en `src`. Publicar desde `main` la habría borrado del paquete.

Se recuperó del `dist/*.js.map` de `0.1.59`, que trae `sourcesContent`. Detalle y
verificación en
[`docs/registro/2026-08-11/SVG_CAMELCASE_GOOGLE_ISOTYPE.md`](docs/registro/2026-08-11/SVG_CAMELCASE_GOOGLE_ISOTYPE.md) §7.
**Hoy `main` está completo y `0.1.61` se puede publicar sin perder nada.**

La lección que deja, y por eso queda escrita: **publicar desde un árbol sin
commitear rompe el repo como fuente de verdad** y solo se nota meses después, al
comparar el paquete con el código. Publica siempre desde `main` limpio.

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
