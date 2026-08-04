# AGENTS.md — arxatec-ui

**Alcance de este archivo: una sola regla.** Es deliberadamente corto.

`arxatec-ui` es el kit de componentes React de Arxatec (Radix + Tailwind v4),
publicado en npm. A diferencia de los otros cuatro repos del workspace, **no
tiene todavía una guía de arquitectura ni convenciones escritas**: no hay
`CLAUDE.md`, y este archivo no pretende serlo. Escribir esa guía es un encargo
aparte, pendiente de decisión del owner — no la improvises.

Para trabajar aquí: el `README.md` documenta la librería para quien la consume
(instalación, estilos, Tailwind v4, componentes), y las convenciones reales se
deducen del código y de las *stories*. Léelos antes de asumir nada.

---

## La regla: nunca asumas que la documentación está actualizada

Incluido este archivo. Un `.md` describe el código del momento en que alguien lo
escribió; el código siguió. Antes de apoyar una decisión en una afirmación
documentada —una ruta, un `archivo:línea`, una prop, un "ya está hecho"—,
**compruébala contra el código**. Si falla, corregirla es parte del trabajo en
curso, no un ticket para después.

No es paranoia. Hasta el 2026-08-04, la documentación de otro repo daba por hecho
que la pantalla de biblioteca jurídica se construiría **aquí**; se construyó en
`arxatec-lawyer-platform`, y en `arxatec-ui` no hay nada legal. Un documento
correcto en julio mandaba a trabajar al repo equivocado en agosto.

**La salida de una sesión anterior es evidencia, no verdad.** Cítala,
reverifícala y anota el resultado de la reverificación.

## Dónde va lo que averiguas

Todo hallazgo, auditoría o decisión con consecuencias va a
`docs/registro/<YYYY-MM-DD>/<TEMA>.md`, con la fecha en que se escribe. Las
cuatro reglas y el índice, en
[`docs/registro/README.md`](./docs/registro/README.md) — **esa es la fuente
única**, aquí no se replican:

1. **Documento nuevo = carpeta nueva** con la fecha de creación.
2. **Cambio sobre un registro existente = se anota en la carpeta de ese
   registro**, con fila nueva en su *Registro de cambios*.
3. **Cabecera obligatoria** con fecha, commit verificado y método. Aquí, además,
   la **versión publicada en npm** que estás mirando: `main` y lo que consume la
   plataforma pueden no ser lo mismo.
4. **Nunca asumas que la documentación está actualizada** — la regla de arriba.

Higiene: **añadir un registro incluye añadir su fila al índice**, en la misma
sesión.

## Git

Rama por unidad de trabajo + PR; el owner mergea. **Nunca push directo a main.**
