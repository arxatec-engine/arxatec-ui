# Warnings `Invalid DOM property` en consola — SVG kebab-case en `GoogleIsotype`

> Escrito 2026-08-11 · verificado contra `3fcfe44` (rama `fix/svg-camelcase-google-isotype`).
> Versión local en `package.json` al empezar: **0.1.58**; esta rama la sube a **0.1.60** (§6).
> Versión **publicada en npm que consume la plataforma**: **0.1.59**
> (`arxatec-lawyer-platform/package.json` → `"arxatec-ui": "^0.1.59"`).
> ⚠️ `main` **no contiene** todo lo que hay en `0.1.59`: ver §7 antes de publicar.
> Método: rastreo del código real y del `dist` instalado en la plataforma, no de documentación previa.
> Cada afirmación cita `archivo:línea` para poder reverificarla sin rastrear de nuevo.

## 1. El síntoma

Consola del navegador con la plataforma del abogado en `dev`, tres errores rojos
repetidos, todos con el mismo origen (`react-dom-client.development.js:2992`):

```text
Invalid DOM property `stop-color`. Did you mean `stopColor`?
Invalid DOM property `color-interpolation-filters`. Did you mean `colorInterpolationFilters`?
Invalid DOM property `clip-path`. Did you mean `clipPath`?
```

No son errores de la plataforma: es React avisando de que un componente le está
pasando atributos SVG en la forma del **DOM** (kebab-case) donde JSX espera la
forma de **propiedad** (camelCase). React no reconoce la prop, **no la aplica**, y
lo reporta como error.

## 2. Dónde estaba

Un único fichero, y no en la plataforma sino en esta librería:

`src/components/icons/components/google_isotype/index.tsx`

| Atributo | Ocurrencias | Líneas |
| --- | --- | --- |
| `stop-color` | 54 | 14–81, dentro de los 8 `<linearGradient>`/`<radialGradient>` de `<defs>` |
| `color-interpolation-filters` | 2 | 175, 185 (los dos `<filter>` de desenfoque) |
| `clip-path` | 1 | 197 (el `<g>` que envuelve todos los `<path>`) |

El resto del SVG **ya estaba convertido**: `xmlnsXlink` (:4), `xmlSpace` (:9),
`xlinkHref` (:84 y siguientes), `clipPathUnits` (:189), `stdDeviation` (:177,
:187), `gradientUnits`, `gradientTransform`. Es una conversión de SVG a JSX
hecha a mano que se dejó tres atributos por el camino, no un problema de diseño.

## 3. Por qué se puede afirmar que era ese fichero y no otro

Dos comprobaciones independientes:

1. **Barrido del `src` de esta librería.** Inventario de todos los atributos JSX
   en kebab-case (`grep -oE "[[:space:]]([a-z]+(-[a-z]+)+)=[\"{]"` sobre
   `*.tsx`/`*.jsx`): salen `data-*` (272) y `aria-*` (75) —**válidos en React,
   se pasan tal cual al DOM**— y exactamente estos tres inválidos. Ningún otro.
2. **Recuento contra el `dist` que la plataforma tiene instalado.**
   En `arxatec-lawyer-platform/node_modules/arxatec-ui/dist/index.js` (v0.1.59):
   `stop-color` **54**, `color-interpolation-filters` **2**, `clip-path` **1**.
   Coincidencia exacta con la tabla de arriba: el bundle que produce los warnings
   contiene este componente y solo este.

Se comprobó también que el `src` de `arxatec-lawyer-platform` **no tiene ningún**
atributo SVG en kebab-case, así que no hay un segundo foco que arreglar allí.

## 4. Qué se cambió

Sustitución 1:1 en `google_isotype/index.tsx`, sin tocar valores ni geometría:

- `stop-color=` → `stopColor=` (×54)
- `color-interpolation-filters=` → `colorInterpolationFilters=` (×2)
- `clip-path=` → `clipPath=` (×1)

Efecto visual esperado: el isotipo de Google **pasa a renderizarse bien**. Hasta
ahora React descartaba esas props, así que los degradados salían sin color, los
filtros sin `sRGB` y el grupo sin recorte. El arreglo no es solo silenciar la
consola.

> No se tocan `public/icons.svg` ni `public/favicon.svg`: son ficheros `.svg`
> servidos como estáticos, no JSX. Ahí el kebab-case es **lo correcto** y
> convertirlos los rompería.

## 5. Verificación

| Gate | Comando | Resultado |
| --- | --- | --- |
| Lint | `npx eslint src/components/icons/components/google_isotype/index.tsx` | ✅ sin salida |
| Typecheck / build | `npx tsc -b tsconfig.build.json` | ✅ sin errores |
| Residual | `grep -rnE "[[:space:]](stop-color\|color-interpolation-filters\|clip-path)=" src` | ✅ 0 coincidencias |

Este repo **no tiene** `test` ni `typecheck` en `package.json`; los gates reales
son `lint` y `build` (:scripts). Y es un proyecto **npm**: `pnpm lint` revienta
(ver `2026-08-04/DEUDA_ABIERTA.md`, D-2).

## 6. Versión: se sube a `0.1.60`, y por qué no a `0.1.59`

`package.json` pasa de `0.1.58` a **`0.1.60`**. No a `0.1.59` porque **ese número
ya está publicado**: `npm view arxatec-ui dist-tags` → `latest: 0.1.59`, y npm no
permite reutilizar una versión.

## 7. 🔴 Hallazgo colateral: `main` va por detrás de npm y publicar desde aquí revierte código

Al elegir el número salió un problema que no tiene que ver con este arreglo pero
que **bloquea el publish**. Verificado descargando los dos tarballs
(`npm pack arxatec-ui@0.1.58` y `@0.1.59`) y comparándolos:

`0.1.59` introduce un módulo que **no existe en el `src` de este repo**:

```text
dist/components/file_view/utilities/transcription_pages.d.ts   (solo en 0.1.59)
```

Exporta `TRANSCRIPTION_PAGE_BREAK` (`"\f"`), `splitTranscriptionPages` y
`toPlainTranscription` — el contrato de paginación de transcripciones, con las
páginas separadas por *form feed* al estilo `pdftotext`. Y **está cableado**: los
tres símbolos aparecen en `dist/file-view.js` de `0.1.59` y en ninguno de
`0.1.58` (bundle 159 003 B → 160 286 B).

En este repo, a fecha de hoy:

- `find src -name "*transcription_pages*"` → **nada**
- `grep -rn "transcription_pages\|transcriptionPages" src` → **nada**
- `src/components/file_view/utilities/index.ts` exporta 7 módulos, **ninguno es
  ese**

Conclusión: **`0.1.59` se publicó desde un working tree que nunca se commiteó.**
No es que falte el bump de versión; falta el código.

**Consecuencia práctica:** publicar `0.1.60` desde `main` tal y como está ahora
**borra esa funcionalidad del paquete**. La plataforma pide `^0.1.59`, así que
resolvería a `0.1.60` y el visor de documentos perdería la paginación de
transcripciones. Sería una regresión silenciosa: compila, pasa lint, y falla en
runtime o degrada la vista.

Antes de publicar hay que recuperar el trabajo de `0.1.59` a git. Dónde mirar:
otro working tree o rama sin subir de quien publicó, o reconstruirlo desde
`dist/file-view.js.map` de `0.1.59`, que sí lleva sourcemap.

> Nota: `0.1.55` tampoco figura en npm (la lista salta de `0.1.54` a `0.1.56`),
> pero sí hay un commit `d972655` titulado `0.1.55`. Es el mismo tipo de deriva
> entre git y el registro de npm, de signo contrario. No se investigó.

## 8. Lo que queda abierto

- **El arreglo no llega a la plataforma hasta que se publique.** La plataforma
  consume `arxatec-ui@^0.1.59` desde npm, no el working tree. Mientras no salga
  una versión con este cambio, los warnings siguen en la consola del abogado.
  Publicar es decisión del owner (`npm run build:lib` + `npm publish`, ver
  `prepublishOnly` en `package.json`) — **y está condicionado a resolver el §7**.
- **Recuperar a git lo que se publicó como `0.1.59`** (§7). Bloqueante para el
  publish. No se toca en esta rama: es trabajo ajeno a este arreglo y hace falta
  saber del owner dónde quedó.
- **No hay red que impida la reincidencia.** No existe regla de ESLint que
  rechace atributos DOM inválidos en JSX; el fallo pasó `lint` y `build` sin
  ruido durante todas las versiones anteriores. `react/no-unknown-property`
  (de `eslint-plugin-react`, no instalado) lo cazaría al vuelo. Sin decisión.
- **Tampoco hay red contra el publish sin commit**, que es la causa del §7. Un
  `npm version patch` (que commitea y taguea) en vez del bump a mano lo evitaría.
  Sin decisión.

## Registro de cambios

| Fecha | Qué cambió |
| --- | --- |
| 2026-08-11 | Documento inicial: diagnóstico, arreglo de los 57 atributos y verificación. |
