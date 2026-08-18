# Registro — memoria de sesión de este repo

> **Sobre el idioma:** el `README.md` de este repo está en inglés porque es la
> documentación de una librería publicada en npm, y así se queda. Esta carpeta es
> interna —memoria de trabajo del equipo— y va en español, como la de los otros
> cuatro repos del workspace. No las unifiques: son dos audiencias distintas.

Aquí vive lo que **se averiguó**, no lo que el repo **es**:

- `README.md` documenta la librería para quien la consume (instalación, estilos,
  componentes) y se **reescribe** cuando la librería cambia.
- `docs/registro/<fecha>/` guarda el resultado de una investigación, auditoría o
  decisión hecha **ese día**: qué se rastreó, contra qué commit, qué se concluyó
  y qué quedó abierto. Se **acumula**, no se reescribe.

Un registro es un testigo fechado. Sin la fecha y el commit no vale nada, porque
el código de debajo se mueve.

La carpeta iba a nacer vacía. No hizo falta: el primer registro es el inventario
de deuda del repo, que hasta hoy no existía en ninguna parte.

---

## Las cuatro reglas

### 1. Un documento nuevo abre una carpeta con la fecha en que se escribe

```text
docs/registro/2026-08-04/AUDITORIA_DE_ALGO.md
```

Formato `YYYY-MM-DD`, fecha de **creación** del documento, no la del hallazgo que
describe. Si en un mismo día nacen dos registros de temas distintos, comparten
carpeta.

### 2. Un cambio sobre un registro existente se anota en la carpeta de ese registro

No se crea una carpeta nueva para actualizar algo que ya existe. La nota va donde
vive el documento, con una fila nueva en su **Registro de cambios**. La carpeta
conserva la fecha de nacimiento; el changelog interno lleva la cronología.

Se abre carpeta nueva solo cuando el tema es nuevo. Regla práctica: si necesitas
un título distinto, es un registro nuevo; si solo necesitas un párrafo distinto,
es una edición del anterior.

### 3. Todo registro declara contra qué lo verificaste

Cabecera obligatoria, antes de cualquier contenido:

```markdown
> Escrito 2026-08-04 · verificado contra `d972655` (rama `docs/registro-sesiones`).
> Método: rastreo del código real, no de documentación previa.
> Cada afirmación cita `archivo:línea` para poder reverificarla sin rastrear de nuevo.
```

Sin commit, un registro es una opinión. Con commit, es reproducible: cualquiera
puede hacer `git checkout <commit>` y comprobar las citas.

Este repo tiene una particularidad: **se publica en npm**, así que una afirmación
sobre "lo que consume la plataforma" puede referirse a una versión distinta de la
que está en `main`. Declara también la **versión publicada** que estás mirando
(hoy `0.1.55`, en `package.json`).

### 4. Nunca asumas que la documentación está actualizada — tampoco esta

Esta es la regla que las otras tres sirven. Antes de apoyarte en cualquier
afirmación de un `.md` —de este repo o de otro—, **compruébala contra el código**.
Si la comprobación falla, corregir el documento es parte del trabajo, no una tarea
aparte.

No es una precaución teórica, y el ejemplo toca justo a este repo: hasta el
2026-08-04, un documento de `arxatec-scrapping` daba por hecho que la pantalla de
**biblioteca jurídica** había que construirla **aquí**. Se construyó en
`arxatec-lawyer-platform`, y en `arxatec-ui` no hay ni ha habido nada legal. Un
documento correcto en julio mandaba a trabajar al repo equivocado en agosto.
Queda anotado en su cabecera:
`arxatec-scrapping/docs/registro/2026-07-21/estado-integracion-legal.md`.

Corolario para agentes: la salida de una sesión anterior es **evidencia**, no
**verdad**. Cítala, reverifícala y anota el resultado de la reverificación.

---

## Índice

| Fecha | Documento | Qué es | Estado | Última verificación |
| --- | --- | --- | --- | --- |
| 2026-08-04 | [DEUDA_ABIERTA.md](2026-08-04/DEUDA_ABIERTA.md) | Primer inventario de deuda de este repo: 16 problemas de lint (dos son bugs, no estilo), el conflicto npm/pnpm que impide correr `pnpm lint`, `initialPage` sin implementar y la guía de arquitectura aparcada. | 🟡 D-1, D-2, D-3 · ✅ **D-4 cerrado el 15/08** (se escribió el `CLAUDE.md`) | 2026-08-15 · `5136134` · npm 0.1.60 · eslint reejecutado: siguen los 16 problemas |
| 2026-08-11 | [SVG_CAMELCASE_GOOGLE_ISOTYPE.md](2026-08-11/SVG_CAMELCASE_GOOGLE_ISOTYPE.md) | Los tres `Invalid DOM property` de la consola de la plataforma salían de `GoogleIsotype`: 57 atributos SVG en kebab-case que React descartaba (el isotipo se renderizaba sin degradados ni recorte). Arreglado, versión a 0.1.60. Y de paso (§7) **`main` va por detrás de npm**: `0.1.59` se publicó sin commitear y publicar desde `main` revertiría la paginación de transcripciones. | ✅ arreglado · 🔴 §7 bloquea el publish | 2026-08-11 · `3fcfe44` · npm 0.1.59 vs local 0.1.58→0.1.60 · lint + `tsc -b` en verde · tarballs 0.1.58/0.1.59 descargados y comparados |

Añadir un registro = una fila aquí, en la misma sesión que lo crea. Un registro
sin fila en el índice es un registro que nadie va a encontrar.

---

## Qué NO va aquí

- **Documentación de la librería para quien la consume** → `README.md`
  (instalación, estilos globales, Tailwind v4, componentes). En inglés.
- **Ejemplos de uso de un componente** → sus *stories* de Storybook.

Este repo **no tiene** `CLAUDE.md` ni convenciones escritas de arquitectura, a
diferencia de los otros cuatro. Es una decisión pendiente del owner, no un olvido
que debas subsanar por tu cuenta: escribir esa guía es un encargo aparte. Ver
`AGENTS.md`.

---

## Un pendiente abierto que cruza desde otro repo

`arxatec-lawyer-assistant/docs/registro/2026-07-24/TRAZABILIDAD_FUENTES.md` §12
dejó anotado un pendiente menor en este repo: que el visor honre la página de
destino (`initialPage`) al abrir un documento en una página concreta.
**Verificado el 2026-08-04 sobre `d972655`: `initialPage` no aparece en `src/`**,
así que sigue abierto. Los visores viven en `src/components/file_view/components/`.
