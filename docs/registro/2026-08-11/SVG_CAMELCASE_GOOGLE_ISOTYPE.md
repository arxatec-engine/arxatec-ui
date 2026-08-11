# Warnings `Invalid DOM property` en consola — SVG kebab-case en `GoogleIsotype`

> Escrito 2026-08-11 · verificado contra `3fcfe44` (rama `fix/svg-camelcase-google-isotype`).
> Versión local en `package.json`: **0.1.58**. Versión **publicada en npm que consume
> la plataforma**: **0.1.59** (`arxatec-lawyer-platform/package.json` → `"arxatec-ui": "^0.1.59"`).
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

## 6. Lo que queda abierto

- **El arreglo no llega a la plataforma hasta que se publique.** La plataforma
  consume `arxatec-ui@^0.1.59` desde npm, no el working tree. Mientras no salga
  una versión con este cambio, los warnings siguen en la consola del abogado.
  Publicar es decisión del owner (`npm run build:lib` + `npm publish`, ver
  `prepublishOnly` en `package.json`).
- **La versión local (`0.1.58`) va por detrás de la publicada (`0.1.59`).** El
  `main` de este repo no contiene lo que hay en npm, o el bump no se commiteó.
  Merece una comprobación aparte antes del siguiente publish, porque afecta a
  cualquier registro que compare "código" contra "lo que consume la plataforma".
- **No hay red que impida la reincidencia.** No existe regla de ESLint que
  rechace atributos DOM inválidos en JSX; el fallo pasó `lint` y `build` sin
  ruido durante todas las versiones anteriores. `react/no-unknown-property`
  (de `eslint-plugin-react`, no instalado) lo cazaría al vuelo. Sin decisión.

## Registro de cambios

| Fecha | Qué cambió |
| --- | --- |
| 2026-08-11 | Documento inicial: diagnóstico, arreglo de los 57 atributos y verificación. |
