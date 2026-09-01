# `npm install` no funciona en este repo, y la versión del lockfile iba nueve por detrás

> Escrito 2026-09-01 · verificado contra `main` (`a6d0c29`). Método: ejecutar
> `npm ci`, `npm install` y `pnpm install --frozen-lockfile`, y comparar
> `package.json` con `package-lock.json` y con lo publicado en npm.
> Fecha contrastada con `date` y con la cabecera HTTP de google.com.

## Por qué se miró

El owner notó que el repo se había actualizado hacía dos horas —`package.json` a
`0.1.64`— **pero el `package-lock.json` seguía en una versión antigua**. Al
mirarlo aparecieron dos cosas, y la segunda es más grave que la primera.

## 1. El `version` del lockfile iba nueve versiones por detrás

| | Versión |
| --- | ---: |
| `package.json` | **0.1.64** |
| `package-lock.json` | **0.1.55** |

Tres meses de desfase. **Corregido en este cambio**, editando solo los dos campos
`version` del propio paquete: cero cambios en resoluciones de dependencias.

Por sí solo era cosmético —el `version` de la raíz no altera el árbol— pero es el
síntoma de que **nadie regenera ese lockfile desde hace meses**. Y hay un motivo.

## 2. El motivo: `npm` no puede instalar este proyecto

```text
$ npm ci
npm error code ERESOLVE
npm error While resolving: @tiptap/extension-table@3.22.5
npm error Found: @tiptap/core@3.22.4
npm error Could not resolve dependency:
npm error   peer @tiptap/core@"3.22.5" from @tiptap/extension-table@3.22.5

$ npm install     → el mismo ERESOLVE
$ pnpm install --frozen-lockfile
Lockfile is up to date, resolution step is skipped   ✅
```

**El conflicto está en `package.json`, no solo en el lockfile.** Los 28 paquetes
de tiptap se declaran con rangos sueltos (`^3.14.0`, `^3.22.4`), y los
sub-paquetes de tiptap fijan el peer de `@tiptap/core` **a una versión exacta**.
npm elige el más nuevo de cada paquete por su cuenta, los descuadra, y ya no hay
árbol que satisfaga los peers.

pnpm no cae en eso porque su lockfile ya tiene un árbol coherente resuelto
(`@tiptap/core@3.22.4` para todo), y `--frozen-lockfile` lo reinstala tal cual.

### Lo que esto significa para la documentación

El `CLAUDE.md` decía: *«mientras no se decida, usa npm»*. **Era falso.**
Corregido en el mismo cambio: para **instalar** se usa `pnpm`; el resto —los
scripts del README, `prepublishOnly`, `npm publish`— sigue siendo npm.

### Y lo que significa para D-2

D-2 ([`2026-08-04/DEUDA_ABIERTA.md`](../2026-08-04/DEUDA_ABIERTA.md)) es «conviven
dos lockfiles y cada uno puede resolver un árbol distinto». **Ya no es simétrico:
uno de los dos está roto.** Mantener el que no funciona no protege de nada.

Retirar `package-lock.json` es decisión del owner, y por eso no se ha hecho aquí.
Pero la elección ya no es entre dos opciones equivalentes.

## 3. La regla de versionado, que faltaba

También la pidió el owner, y venía al caso: **todo cambio publicable sube
`version` en el mismo commit**. Está escrita en el
[`CLAUDE.md`](../../../CLAUDE.md), con el detalle que se olvida:

**Publicar no basta.** Los dos consumidores piden un rango contra npm, y su
lockfile clava la versión aunque el rango permita subir. Medido hoy:

| | Versión |
| --- | ---: |
| `main` de este repo | 0.1.64 |
| npm | 0.1.64 |
| Lo que **declara** la platform | `^0.1.60` |
| Lo que la platform **tenía instalado** | **0.1.60** |

Cuatro versiones por detrás, incluida `0.1.61`, la que recuperó la paginación de
transcripciones. Nadie corrió el tercer paso: `pnpm update arxatec-ui`.

### Un detalle operativo que costó descubrir

**No se puede publicar y actualizar el mismo día.** La platform tiene
`minimumReleaseAge` de 24 h, y rechaza cualquier versión más nueva:

```text
[ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION]
arxatec-ui@0.1.64 was published at 2026-09-01T17:55:13Z,
within the minimumReleaseAge cutoff (2026-08-31T19:20Z)
```

Y **añadirla a `minimumReleaseAgeExclude` no sirve**: `pnpm install` sigue
fallando la verificación del lockfile, así que CI saldría rojo igual. Comprobado
hoy. Por eso la platform se quedó en **0.1.63**, que es la última con más de 24 h.

## 4. Dos versiones existen en git y no en npm

`0.1.61` y `0.1.62` **nunca se publicaron**: el registro salta de `0.1.60` a
`0.1.63`. No se pierde nada —los cambios van acumulados en `0.1.63`— pero explica
por qué un `npm view arxatec-ui versions` no cuadra con el historial de commits.

## Lo que NO se hizo

- **No se tocaron las dependencias.** Arreglar el descuadre de tiptap significa
  fijar los 28 paquetes a una versión coherente, y eso cambia el árbol de una
  librería sin tests. Es un trabajo aparte y con Storybook delante.
- **No se borró `package-lock.json`.** Es la decisión de D-2 y es del owner.
