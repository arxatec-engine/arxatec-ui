# Deuda abierta de este repo — inventario al 2026-08-04

> Escrito 2026-08-04 · verificado contra `d972655` (rama `docs/registro-sesiones`),
> versión publicada en npm **0.1.55** (`package.json`).
> Método: `npx eslint .` ejecutado y leído entero, más lectura del código de cada
> punto citado. Cada afirmación lleva `archivo:línea` o el nombre de la regla.
>
> Leyenda: 🟡 abierto · ⏸ a decisión del owner.

---

## Lo urgente, en 30 segundos

Nada de esto rompe en una fecha conocida. Es el primer inventario de un repo que
hasta hoy no tenía **ninguna** documentación interna, así que el valor está en
que exista la línea base, no en que haya urgencias.

| # | Deuda | Estado | Dónde |
| --- | --- | --- | --- |
| **D-1** | 16 problemas de lint (14 errores) sin resolver | 🟡 abierto | 13 archivos de `src/` |
| **D-2** | `pnpm lint` **revienta**: el repo es npm pero tiene los dos lockfiles | 🟡 abierto | `package-lock.json` + `pnpm-lock.yaml` |
| **D-3** | El visor no honra la página de destino (`initialPage`) | 🟡 abierto | `src/components/file_view/components/` |
| **D-4** | Sin `CLAUDE.md` ni convenciones escritas | ✅ **resuelto 2026-08-15** | `CLAUDE.md` en la raíz |

---

## D-1 🟡 · Los 16 problemas de lint

`npx eslint .` devuelve **16 problemas (14 errores, 2 avisos)** en 13 archivos.
Por regla:

| Regla | Nº | Qué señala |
| --- | --- | --- |
| `react-hooks/set-state-in-effect` | 8 | `setState` síncrono dentro de un efecto → renders en cascada |
| `react-hooks/immutability` | 2 | mutación de algo que debería tratarse como inmutable |
| `react-refresh/only-export-components` | 1 | export no-componente en un módulo de componente (rompe HMR) |
| `react-hooks/rules-of-hooks` | 1 | hook llamado fuera de las reglas |
| `react-hooks/refs` | 1 | uso indebido de una ref |
| `react-hooks/purity` | 1 | **`Math.random()` durante el render** |
| `react-hooks/incompatible-library` | 1 | librería incompatible con el compilador de React |
| `react-hooks/exhaustive-deps` | 1 | dependencias incompletas |

Archivos afectados: `avatar_input`, `button_group`, `carousel`,
`date_range_picker/components/date_panel`,
`file_view/components/file_preview_playground`, `icon_picker`, `image`,
`location_input/location_input.stories`, `map_picker`,
`rich_text_editor/ui/floating-element`, `scroll_area`, `sidebar`, y
`hooks/use_media_query`.

Dos merecen mirarse antes que los demás porque **son bugs, no estilo**:

- **`src/components/sidebar/index.tsx:622`** — `Math.floor(Math.random() * 40) + 50`
  dentro de un `useMemo`. Es el ancho aleatorio de un *skeleton*. Funciona hoy,
  pero produce resultados inestables si el componente se re-renderiza en un
  momento que React no garantiza, y rompe cualquier render en servidor o
  snapshot: el mismo componente da un valor distinto cada vez.
- **`src/hooks/use_media_query/index.ts:9`** — `setMatches` síncrono en el cuerpo
  del efecto. Es un hook compartido, así que la cascada de renders se paga en
  cada consumidor.

**Esto es una librería publicada en npm**, lo que cambia el cálculo: un defecto
aquí no se arregla desplegando, se arregla publicando una versión y esperando a
que la plataforma actualice.

## D-2 🟡 · El gestor de paquetes está sin decidir

`pnpm lint` no llega a ejecutar eslint: aborta en la comprobación de dependencias
de pnpm.

> **Corregido el 2026-08-15**: esto ya no pasa. `pnpm lint` **sí** ejecuta eslint
> hoy; falla, pero por los 16 problemas de D-1, no por la comprobación de pnpm.
> Lo que sigue abierto de este punto es lo de fondo —los dos lockfiles conviviendo—,
> no que el comando no arranque. El repo tiene **`package-lock.json` y `pnpm-lock.yaml` a la vez**, y su
`README.md` documenta `npm run lint`, `npm run build:lib` y
`npm publish --otp=...`.

Los otros cuatro repos del workspace son pnpm, y el `CLAUDE.md` de la raíz
prescribe pnpm. Aquí no funciona. Mientras tanto, el comando que sí corre es
`npx eslint .`.

Que haya dos lockfiles no es cosmético: cada uno puede resolver un árbol de
dependencias distinto, así que «funciona en mi máquina» depende de con cuál
instalaste.

## D-3 🟡 · `initialPage` en el visor

`arxatec-lawyer-assistant/docs/registro/2026-07-24/TRAZABILIDAD_FUENTES.md` §12
dejó anotado como pendiente menor que el visor honre la página de destino al
abrir un documento en una página concreta.

**Verificado el 2026-08-04: `initialPage` no aparece en `src/`.** Sigue abierto.
Los visores viven en `src/components/file_view/components/` (`document_viewer`,
`file_source_file_viewer`, `docx_preview_viewer`, `xlsx_preview_viewer`,
`image_viewer`, `summary_viewer`, `template_viewer`).

El efecto práctico: cuando el chat cita un documento y dice en qué página está,
el usuario abre el visor **en la página 1** y tiene que buscar. La cita es
correcta; el salto no ocurre.

## D-4 ✅ · Sin guía de arquitectura — escrita el 2026-08-15

Este repo no tiene `CLAUDE.md` ni convenciones escritas, a diferencia de los
otros cuatro. El 2026-08-04 el owner decidió que **escribirla es un encargo
aparte** y que esta sesión se limitara al harness de registro. Queda anotado
para que la próxima sesión no lo confunda con un olvido y se ponga a improvisar
una.

### Escrita el 2026-08-15

El owner levantó el encargo y el `CLAUDE.md` ya existe. Se redactó **rastreando el
repo**, no de memoria, y por eso corrige de paso una afirmación de este mismo
documento: **D-2 decía que `pnpm lint` «revienta» antes de llegar a eslint, y hoy
no es cierto** — ejecuta y falla solo por los 16 problemas de D-1. Lo que sigue en
pie de D-2 es que conviven los dos lockfiles.

Lo que el archivo fija, que es lo que un agente nuevo no puede deducir del código:

- Que esto es **npm**, no pnpm, a diferencia de los otros cuatro repos.
- Que hay **tres puntos de entrada** (`.`, `./sidebar`, `./file-view`) y que
  `file-view` arrastra `react-pdf` y su CSS — el mismo import que reventaba suites
  enteras en la platform.
- **El aviso de publicación**, que es el más caro: `main` va por detrás de npm y
  publicar `0.1.60` desde aquí borraría la paginación de transcripciones que
  `0.1.59` sí trae (§7 del registro del 2026-08-11).
- Que **no hay tests** (0 archivos) y que la red de seguridad son las 93 stories.
- Los dos contratos que rompen en silencio hacia la platform: el handle imperativo
  de `useAnimatedIcon` y los atributos SVG en camelCase.

---

## Registro de cambios

| Fecha | Cambio |
| --- | --- |
| 2026-08-15 | **D-4 cerrado**: se escribe el `CLAUDE.md` del repo, rastreando el código en vez de deducirlo. Al hacerlo se detecta que **la afirmación de D-2 sobre `pnpm lint` está desfasada**: ya no aborta, ejecuta y falla solo por los 16 problemas de D-1. D-1, D-2 y D-3 siguen abiertos. |
| 2026-08-04 | Nace, junto con `docs/registro/`. Primer inventario de deuda de este repo: 16 problemas de lint, el conflicto npm/pnpm, `initialPage` confirmado como pendiente y la guía de arquitectura como decisión aparcada. Nada se ha arreglado: es un registro de medición. |
