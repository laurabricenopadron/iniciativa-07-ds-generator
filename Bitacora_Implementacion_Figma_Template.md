# Iniciativa 07 — Design Gen
## Bitácora de Implementación · Etapa Template de Figma + Import de JSON

**Laura Briceño Padrón · Programa AI — DxD · Baufest**
**Objetivo de la etapa:** que la propuesta funcione end-to-end — generar en Design Gen → descargar JSON → duplicar template de Figma Community → importar JSON con plugin → los componentes se re-tematizan solos.

**Cómo se usa este documento:** cada paso queda registrado con qué se hizo, cómo se resolvió y qué se aprendió. Se actualiza a medida que avanzamos.

---

## Estado general

| Paso | Descripción | Estado |
|---|---|---|
| 1 | Descubrir el formato exacto (probar plugins) | ✅ Completo |
| 2 | Crear las variables en Figma | ✅ Completo (lo hizo el plugin) |
| 3 | Construir los 4 componentes atados a variables | 🔜 En curso |
| 4 | Página showcase | ⬜ Pendiente |
| 5 | Prueba de fuego end-to-end | ⬜ Pendiente |
| 6 | Publicar en Figma Community | ⬜ Pendiente |
| 7 | Documentar el flujo para la demo | ⬜ Pendiente |

---

## Paso 1 · Descubrir el formato exacto
**Estado:** ✅ Completo · **Fecha:** 20 de julio 2026

### Qué se hizo
- Se generó un JSON real desde Design Gen con una marca de prueba (primario verde lima `#c2db00`, secundario azul `#051a7f`, fuente Poppins, preset Soft)
- Se probó el import en el plugin **Design Tokens Manager** (de Wenju Li · 19.1k usuarios)

### Resultado
El plugin importó **24 de 25 tokens** sin fricción. Resumen:

| Tipo de token | Cantidad | Resultado |
|---|---|---|
| Colores | 15/15 | ✅ Importados correctamente |
| Radius | 4/4 | ✅ Importados como NÚMERO (no como texto) |
| Tipografía — escala | 5/5 | ✅ Importados como NÚMERO |
| Tipografía — fontFamily | 0/1 | ⚠️ No soportado como variable (esperado) |

### Hallazgos clave
1. **El plugin elegido es Design Tokens Manager.** Lee el formato W3C DTCG (`$value`, `$type`) sin problemas. No hace falta probar más plugins.
2. **Los nombres se crean con `/` y respetan la jerarquía del JSON:** `color/primary`, `color/neutral/100`, `radius/button`, `typography/scale/display`, etc. Coinciden 1 a 1 con lo que genera la app.
3. **PENDIENTE RESUELTO — Purismo DTCG:** existía la duda de si exportar dimensiones como string (`"6px"`) en vez de objeto `{value, unit}` daría problemas. Respuesta empírica: **no da problemas**. El plugin le saca el "px" solo y las importa como variables numéricas correctas (`radius/button` = `6`, `typography/scale/body` = `16`). El JSON actual NO requiere cambios.
4. **fontFamily:** el nombre de la fuente (`Poppins`) no entra como variable. Es cosmético y se resuelve con text styles en el template (Paso 3). No es bloqueante.

### Decisión
- Plugin definitivo para el flujo: **Design Tokens Manager**
- El JSON que genera la app se queda como está (no se toca la estructura)

---

## Paso 2 · Crear las variables en Figma
**Estado:** ✅ Completo (resuelto automáticamente en el Paso 1) · **Fecha:** 20 de julio 2026

### Qué se hizo
No hubo que crear las variables a mano: al importar el JSON en el Paso 1, el plugin **creó automáticamente las 24 variables** en una colección llamada `design-tokens (2).json`, ya organizadas en grupos.

### Diccionario de variables confirmado
Estos son los nombres exactos que existen en el archivo (a usar como referencia al atar los componentes en el Paso 3):

**Colores (15)**
```
color/primary              color/on-primary         color/primary-container
color/secondary            color/on-secondary       color/surface
color/on-surface           color/success            color/warning
color/error                color/neutral/100        color/neutral/200
color/neutral/300          color/neutral/400        color/neutral/500
```

**Radius (4)**
```
radius/button   radius/input   radius/card   radius/badge
```

**Tipografía — escala (5)**
```
typography/scale/display    typography/scale/headline    typography/scale/title
typography/scale/body       typography/scale/label
```

### Nota
- Conviene renombrar la colección de `design-tokens (2).json` a algo más claro como **"Design Gen Tokens"** (opcional, cosmético).

---

## Paso 3 · Construir los 4 componentes atados a variables
**Estado:** 🔜 En curso · **Fecha inicio:** —

### Plan
Construir Button, Input, Card y Badge, atando cada propiedad a su variable (sin valores fijos):

- **Button** — fondo → `color/primary` · texto → `color/on-primary` · radius → `radius/button`
- **Input** — fondo → `color/surface` · borde → neutro · radius → `radius/input`
- **Card** — fondo → `color/surface` · título → `color/on-surface` · radius → `radius/card`
- **Badge** — fondo → `color/secondary` · radius → `radius/badge`

### Registro de avance
*(pendiente de completar a medida que se construye cada componente)*

- [ ] Button
- [ ] Input
- [ ] Card
- [ ] Badge
- [ ] Convertir cada uno en componente
- [ ] (Opcional) Variantes: primary/secondary, hover, disabled

---

## Paso 4 · Página showcase
**Estado:** ⬜ Pendiente

*(a completar)*

---

## Paso 5 · Prueba de fuego end-to-end
**Estado:** ⬜ Pendiente

*(a completar)*

---

## Paso 6 · Publicar en Figma Community
**Estado:** ⬜ Pendiente

*(a completar)*

---

## Paso 7 · Documentar el flujo para la demo
**Estado:** ⬜ Pendiente

*(a completar)*

---

## Registro de cambios del documento

| Fecha | Actualización |
|---|---|
| 20 jul 2026 | Creación del documento. Pasos 1 y 2 registrados como completos. |
