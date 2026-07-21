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
| 3 | Construir los 4 componentes atados a variables | ✅ Completo |
| 4 | Página showcase | ✅ Completo |
| 5 | Prueba de fuego end-to-end | ✅ Completo |
| 6 | Publicar en Figma Community | ✅ Completo |
| 7 | Documentar el flujo para la demo | ⬜ Pendiente |
| + | Sección de instrucciones dentro de la app (extra) | ✅ Completo |
| + | Integración Railway + PostgreSQL (guardado + historial) | ✅ Completo |

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
**Estado:** ✅ Completo · **Fecha:** 20 de julio 2026

### Qué se hizo
Se construyeron los 4 componentes desde cero en Figma, atando cada propiedad visual a su variable (ningún valor pintado a mano):

| Componente | Fondo | Texto | Tamaño texto | Radius |
|---|---|---|---|---|
| **Button** | `color/primary` | `color/on-primary` | `typography/scale/body` | `radius/button` |
| **Input** | `color/surface` | `color/neutral/400` (placeholder) | `typography/scale/body` | `radius/input` |
| **Card** | `color/surface` | título `color/on-surface` · secundario `color/neutral/500` | título `title` · secundario `body` | `radius/card` |
| **Badge** | `color/secondary` | `color/on-secondary` | `typography/scale/label` | `radius/badge` (pill 999) |

- Los 4 quedaron convertidos en componentes de Figma (Create component)
- Input lleva además un **stroke** atado a `color/neutral/300`
- Card lleva una sombra sutil (Effects, cosmética, no atada a variable)

### Hallazgo clave — la tipografía SÍ se puede atar a variables
Durante la construcción surgió la duda de si los tamaños de texto podían enchufarse a las variables numéricas (como los colores y el radius). Respuesta: **SÍ se puede**, pero el gesto es distinto:

- No se hace con el iconito de variables al lado del campo (como en fill/radius)
- Se hace desde la sección **Typography** del panel derecho, con el texto seleccionado como objeto (no en modo edición), abriendo el panel de variables de tamaño de fuente
- Ahí se elige del grupo `typography/scale/` (display, headline, title, body, label)

**Consecuencia positiva:** el template re-tematiza TODO con el JSON — colores, radius Y tamaños tipográficos. Queda más completo de lo planeado. El único token que no se ata sigue siendo `fontFamily` (el nombre de la fuente), que se maneja aparte con la fuente aplicada directamente.

### Registro de avance
- [x] Button
- [x] Input
- [x] Card
- [x] Badge
- [x] Convertir cada uno en componente
- [ ] (Opcional, pendiente) Variantes: primary/secondary, hover, disabled

---

## Paso 4 · Página showcase
**Estado:** ✅ Completo · **Fecha:** 20 de julio 2026

### Qué se hizo
Se armó una página "Foundations/Showcase" que muestra el sistema completo en un solo lugar:

- **Paleta de colores** en swatches, organizada en 3 grupos: Brand (7 roles), Semantic (success/warning/error) y Neutral (100–500). Cada swatch con fill atado a su variable y etiqueta con el nombre.
- **Escala tipográfica** con los 5 niveles (Display, Headline, Title, Body, Label), cada uno con texto de muestra representativo de su uso y su valor de referencia (56px, 32px, 20px, 16px, 14px). Tamaños atados a las variables `typography/scale/`.
- **Los 4 componentes** (Button, Input, Card, Badge) colocados como instancias en el canvas.

Esta página es la que va a "cambiar de piel" en vivo durante la demo → el momento wow.

### Pendiente cosmético opcional
- Agregar un título de sección "Components" arriba del grupo de componentes (para hacer juego con las otras secciones). No bloqueante.

---

## Paso 5 · Prueba de fuego end-to-end
**Estado:** ✅ Completo · **Fecha:** 20 de julio 2026

### Qué se hizo
Se generaron varias marcas distintas en Design Gen y se importaron sobre el template para validar que todo se re-tematiza solo. Marca de prueba principal: primario terracota `#af360d`, secundario violeta `#65057f`, fuente Plus Jakarta Sans, preset Full Round (button 999, input 16, card 20).

### Resultado
✅ **FUNCIONA.** Al reimportar, se re-tematizaron solos: paleta completa, los 4 componentes (Button terracota con forma píldora, Badge violeta, Card con esquinas redondeadas), tamaños tipográficos y el showcase entero. Validado con múltiples marcas distintas — no fue casualidad.

### Aprendizajes clave (CRÍTICOS para la demo)
1. **No borrar las variables antes de reimportar.** Si se borra la colección, los componentes pierden el vínculo y no se re-tematizan. El flujo correcto es reimportar SOBRE la colección existente: el plugin pisa los valores viejos con los nuevos y los componentes (que siguen atados a esas variables) cambian solos.
2. **El plugin matchea la colección por nombre.** Para que un import actualice la colección existente (en vez de crear una nueva duplicada), el nombre tiene que coincidir. Solución aplicada: renombrar la colección en el panel de variables de Figma para que matchee, y así los imports sucesivos actualizan correctamente.
3. **El nombre del archivo descargado:** el código de la app (`page.tsx`) ya descarga como `design-tokens.json` (nombre limpio, sin número). El sufijo `(1)(2)(3)` lo agrega el navegador cuando ya existe un archivo con ese nombre en Descargas. Fix de higiene: borrar los JSON viejos de Descargas antes de la demo para que cada descarga salga limpia. No requiere cambio de código.

### Pendiente cosmético detectado
- En el showcase, los textos de muestra de tipografía (Display, Headline) están atados a `on-primary`, que en marcas con `on-primary` claro quedan poco legibles sobre fondo claro. Conviene atarlos a `on-surface` para que se lean en cualquier marca. No bloqueante.

---

## Paso 6 · Publicar en Figma Community
**Estado:** ✅ Completo · **Fecha:** 20 de julio 2026

### Qué se hizo
Se publicó el template en Figma Community como "Design file", categoría Design tools → Import & export. Thumbnail: el frame del showcase (paleta + tipografía + componentes).

- **Link del template publicado:** https://www.figma.com/community/file/1661151496205629619
- **Plugin de import:** https://www.figma.com/community/plugin/1263743870981744253/design-tokens-manager

### Conexión con la app
Se completaron los dos links `href="#"` que habían quedado pendientes en la sección de instrucciones de la app (`page.tsx`):
- Paso 2 "Abrir template en Figma Community" → link del template
- Paso 3 "Ver plugin" → link del plugin

Ambas piezas (app + template) quedan conectadas: desde la app el usuario llega directo al template y al plugin.

### Aprendizaje
- Para publicar, el showcase debía estar dentro de un **Frame** (no un Group) para poder usar "Set as thumbnail". Se resolvió con "Frame selection".
- El template se puede actualizar más adelante con "Publish update" sin romper el link ni afectar copias ya duplicadas por usuarios.

---

## Paso 7 · Documentar el flujo para la demo
**Estado:** ⬜ Pendiente

*(a completar)*

---

## Extra · Sección de instrucciones dentro de la app
**Estado:** ✅ Completo · **Fecha:** 20 de julio 2026

### Qué se hizo
Se agregó a la pantalla de resultados de Design Gen (`src/app/page.tsx`) una sección de guía siempre visible, para que el usuario sepa cómo llevar su JSON a Figma sin depender de documentación externa.

- Botón **"Instrucciones"** junto a "Exportar JSON" que hace scroll suave hasta la sección
- Sección "Cómo llevar tu design system a Figma" con 4 pasos en tarjetas: descargar JSON, abrir template en Community, instalar plugin, importar JSON
- Recuadro de advertencia (ámbar) sobre el nombre del archivo `design-tokens.json` y el sufijo `(2)` que agrega el navegador
- Respeta el diseño existente (violeta `#4648D4`, Plus Jakarta Sans, tarjetas con glassmorphism). Implementado con el agente de Antigravity en modo Review; compiló sin errores.

### Pendiente
- Completar los links `href="#"` del template de Community y del plugin una vez publicado (Paso 6)
- Ajuste cosmético: pasar los 4 pasos de grid 2×2 a una sola columna (orden 1-2-3-4 vertical) para lectura más fluida

---

## Extra · Integración Railway + PostgreSQL
**Estado:** ✅ Completo (guardado + historial) · **Fecha:** 21 de julio 2026

### Qué se hizo
Se conectó la app con una base de datos PostgreSQL en Railway para persistir los design systems generados (guardado manual con nombre puesto por el usuario).

- **Base de datos:** PostgreSQL en Railway (plan de prueba, crédito $5). Estado Online.
- **Tabla `design_systems`:** una sola tabla con `id` (serial), `created_at` (timestamp automático), `project_name` (text), `brand_inputs` (JSONB), `tokens` (JSONB).
- **Decisión de arquitectura clave:** `brand_inputs` y `tokens` se guardan como bloques JSONB completos, NO en columnas separadas. Así, cuando la app crezca (más componentes, colores, fuentes), la tabla NO necesita cambiar.
- **Conexión:** `src/lib/db.ts` con connection pool de la librería `pg` y SSL (`rejectUnauthorized: false`, requerido por Railway para conexión externa). La `DATABASE_URL` va en `.env.local` (protegida por `.gitignore`) y deberá cargarse también en Vercel.
- **API route:** `src/app/api/save-project/route.ts` — recibe POST con nombre + inputs + tokens, valida, e inserta con query parametrizada (`$1, $2, $3`).
- **UI:** botón "Guardar proyecto" en la pantalla de resultados → modal para nombrar → POST → mensaje de confirmación.

### Resultado
✅ Probado end-to-end en local: se generó un sistema, se guardó con nombre "prueba", y la fila apareció en la tabla de Railway (id 1, con brand_inputs y tokens como JSON). La persistencia funciona.

### Pendientes
- Cargar `DATABASE_URL` en las variables de entorno de Vercel (para que funcione en producción, no solo en local)
- Sin login: el historial es global (todos los datos en una tabla, sin separación por usuario). Aceptable para la demo; separación por usuario queda como evolución futura.
- ✅ HECHO: sección de historial que lista los proyectos guardados en tarjetas (nombre + swatches de colores + botón exportar JSON de cada uno). Se agregó API GET /api/projects que lee de la base. Botón "Historial" en la barra de resultados. Sin fecha ni botón de eliminar (el borrado se hace desde Railway). Se corrigió también el wrap de texto en los botones de la barra.

---

## Registro de cambios del documento

| Fecha | Actualización |
|---|---|
| 20 jul 2026 | Creación del documento. Pasos 1 y 2 registrados como completos. |
| 20 jul 2026 | Paso 3 completo: 4 componentes construidos y atados a variables. Hallazgo: la tipografía SÍ se puede atar a variables de tamaño. |
| 20 jul 2026 | Paso 4 completo: página showcase con paleta, escala tipográfica y los 4 componentes. |
| 20 jul 2026 | Paso 5 completo: prueba end-to-end exitosa. El template se re-tematiza solo con distintas marcas. Aprendizajes clave sobre el flujo de reimport documentados. |
| 20 jul 2026 | Extra: sección de instrucciones agregada dentro de la app (pantalla de resultados). Paso 6 marcado en curso. |
| 20 jul 2026 | Paso 6 completo: template publicado en Figma Community. Links reales del template y del plugin agregados a la app. App y template conectados. |
| 21 jul 2026 | Integración Railway + PostgreSQL: base de datos creada, tabla design_systems, guardado manual de proyectos funcionando end-to-end (probado en local). Spec y guía de terminal actualizados. |
| 21 jul 2026 | Sección de historial de proyectos guardados: API GET /api/projects, lista en tarjetas con swatches y export por proyecto, botón "Historial". Fix del wrap de texto en los botones de la barra. |
