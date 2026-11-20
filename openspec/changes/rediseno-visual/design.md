# Design: Rediseño visual de MarkovClima

## Context

La aplicación funciona y tiene 68 pruebas verdes. `src/styles.css` es un único archivo con tokens
básicos, y los componentes de `src/components/` construyen el layout con un grid de dos columnas.
Recharts ya está instalado.

Restricciones que moldean el diseño:

- El brief prohíbe tocar cálculo, validaciones, tipos y pruebas existentes.
- Las pruebas consultan por **nombre accesible**, no por clases. Cualquier título, caption o
  etiqueta que se renombre rompe la suite.
- `AGENTS.md` prohíbe dependencias nuevas sin autorización y exige que `src/lib/*` no importe
  React.

## Goals / Non-Goals

**Goals**

- Un sistema visual mínimo y centralizado: color, icono, tipografía, espaciado y radios en un solo
  lugar, consumible desde CSS y desde Recharts.
- Que los seis bloques del brief queden en un grid de 12 columnas que colapsa sin scroll
  horizontal.
- Que cada gráfica siga siendo identificable por nombre accesible y verificable con Testing
  Library.

**Non-Goals**

- No se cambia la estructura de datos, `computeSteps`, la estacionaria ni `toChartSeries`.
- No se introduce CSS Modules, Tailwind, fuente descargada ni librería de iconos.
- No se rediseñan los textos: se conservan los actuales.

## Decisions

### D1. Tokens en `src/theme.js` y en variables CSS

`src/theme.js` exporta `STATE_THEME` (color de marca, color de texto accesible, icono y etiqueta
por estado), `BRAND` (índigo) y la escala de espaciado. `styles.css` declara las mismas variables
en `:root`.

**Rationale:** Recharts necesita colores como strings en JS; CSS los necesita como variables. Con
un archivo JS como fuente y un bloque `:root` espejo se evita repetir hex en diez componentes.
**Alternativa descartada:** leer variables CSS con `getComputedStyle`. Añade acoplamiento al DOM y
complica las pruebas.
**Trade-off:** el hex vive en dos archivos; se marcan ambos con un comentario que obliga a
cambiarlos juntos.

### D2. Dos tonos por estado: marca y texto

`#f59e0b` (ámbar) sobre blanco no alcanza contraste AA para texto pequeño. Por eso cada estado
tiene:

| Estado | Marca (barras, líneas, fondos tenues) | Texto (AA sobre blanco) |
|---|---|---|
| Soleado | `#f59e0b` | `#b45309` |
| Nublado | `#64748b` | `#475569` |
| Lluvioso | `#3b82f6` | `#2563eb` |

**Rationale:** cumple "color con significado" sin sacrificar legibilidad. Las marcas grandes y las
barras usan el tono de marca; los porcentajes y etiquetas pequeñas usan el tono de texto.

### D3. CSS con clases prefijadas, no CSS Modules

Todas las clases nuevas usan el prefijo `mc-` dentro de `src/styles.css`, y se eliminan las clases
sueltas que ya no se usen.

**Rationale:** el brief admite "módulos CSS o clases prefijadas". Los módulos obligan a renombrar
clases en nueve componentes y a tocar `className` en cada uno, con riesgo de romper estilos sin
beneficio verificable. El prefijo da el mismo aislamiento con un solo archivo.
**Alternativa descartada:** CSS Modules. Más churn que valor en un proyecto de una sola pantalla.

### D4. Iconos propios en SVG, sin librería

`src/components/StateIcon.jsx` dibuja un sol, una nube y gotas de lluvia con `currentColor` y
tamaño por prop.

**Rationale:** tres iconos no justifican una dependencia (y `AGENTS.md` exige preguntar antes de
añadir una). `currentColor` permite heredar el color del contexto.
**Accesibilidad:** el icono es decorativo (`aria-hidden`) cuando hay texto al lado; expone
`role="img"` y `aria-label` cuando aparece solo (KPI principal).

### D5. Grid de 12 columnas con spans explícitos

`App.jsx` usa `.mc-layout` con `grid-template-columns: repeat(12, 1fr)` y cada bloque declara su
span: entradas 8/4, KPIs 12, gráficas 6/6, tabla 7/5.

**Rationale:** el brief pide 12 columnas con proporciones concretas. Grid con spans expresa eso
directamente y colapsa con dos `@media` (1024 px y 640 px).
**Alternativa descartada:** Flexbox con anchos porcentuales. Peor control de spans y saltos.

### D6. Eje X proporcional en Recharts

La gráfica de líneas pasa a `<XAxis type="number" dataKey="step" domain={[0, 10]}
ticks={[0, 1, 3, 5, 10]} />`. Los datos siguen saliendo de `toChartSeries`.

**Rationale:** con `type="category"` (actual) los pasos se reparten a intervalos iguales, lo que
miente sobre la distancia temporal. `type="number"` usa la escala real sin tocar los datos.
**Riesgo:** las etiquetas del eje se solapan en móvil; se mitiga con `minTickGap` y altura de eje.

### D7. Líneas de referencia y etiquetas finales

Se añade una `<ReferenceLine y={estacionaria[i]} strokeDasharray="4 4" />` por estado y una
etiqueta directa al final de cada serie mediante el renderer `label` de `Line`, que devuelve `null`
salvo en el último punto.

**Rationale:** muestra visualmente la convergencia sin añadir series ni datos nuevos.
**Alternativa descartada:** una segunda serie de puntos para la estacionaria. Ensucia la leyenda y
duplica entradas.

### D8. Tooltip propio y etiquetas de barra

`StepsBarChart` usa `<LabelList>` con `formatter` de porcentaje y solo dibuja la etiqueta si el
valor es ≥ 0.06 (si no cabe, se omite). El tooltip se reemplaza por un componente propio que
lista los tres estados con su icono y porcentaje.

**Rationale:** el tooltip por defecto muestra números crudos; el brief pide porcentajes y los tres
valores del punto.

### D9. Movimiento reducido con un hook

`src/hooks/useReducedMotion.js` expone `useReducedMotion()` basado en `matchMedia`. Las gráficas
reciben `isAnimationActive={!reduced}`; CSS envuelve transiciones en
`@media (prefers-reduced-motion: no-preference)`.

**Rationale:** una sola fuente de verdad para JS y CSS, sin dependencias. En el entorno de
pruebas (`MODE === 'test'`) la animación se desactiva para que las etiquetas de valor se rendericen
de inmediato y las aserciones sean deterministas.

### D10. Selección del estado dominante fuera de los componentes

`src/lib/stats.js` exporta `indexOfMax(values)`. Lo usan `Interpretation` (que hoy lo tiene
inline) y la tarjeta KPI del estado más probable. Se añade `tests/lib/stats.test.js`.

**Rationale:** evita duplicar el mismo `reduce` en dos componentes y no toca el cálculo de Markov
(`markov.js` queda intacto). Es lógica de presentación, no del modelo.
**Alternativa descartada:** exportar `indexOfMax` desde `markov.js`. Acoplaría presentación al
motor y obligaría a tocar un archivo que el brief pide no modificar.

### D11. Preservar el contrato accesible existente

Estos nombres **no cambian**, porque las pruebas los usan:

- Títulos: `Evolución de la probabilidad`, `Comparación por paso`, `Comportamiento a largo plazo`.
- Captions: `Probabilidad de pasar de un estado (fila) a otro (columna)` y
  `Probabilidad de cada estado según el número de pasos`.
- Etiquetas: `Probabilidad de {origen} a {destino}`, nombres de estado en el clima de hoy,
  `Restablecer valores de ejemplo`, `Suma actual:`.
- `role="rowheader"` con `1`, `3`, `5` y `10` en la tabla.

**Rationale:** cumple "los tests existentes siguen pasando" sin reescribir pruebas.

## Risks / Trade-offs

- **Los KPIs duplican porcentajes que ya están en la tabla** → los tests de tabla consultan por
  rol y fila, no por texto global; los nuevos tests de KPI acotan con `within`.
- **`role="img"` oculta el contenido interno a lectores de pantalla** → se aplica solo al
  contenedor de la gráfica, y la tabla sigue siendo la alternativa textual completa.
- **Etiquetas finales de línea se salen del área de dibujo** → margen derecho de 32 px y
  `position="right"`, con ancho fijo de 640 px y `max-width: 100%` en CSS.
- **Ámbar como color de texto no cumple AA** → se separan tono de marca y tono de texto (D2).
- **Cambiar clases rompe estilos de forma silenciosa** → la verificación visual en cuatro anchos
  es una tarea explícita, no una comprobación opcional.
- **La suite actual es el contrato**: cualquier fallo tras el rediseño se trata como regresión, no
  como "test desactualizado".

## Migration Plan

Por grupos, ejecutando las pruebas al final de cada uno:

1. Tokens, `stats.js`, `StateIcon` y variables CSS.
2. Layout de 12 columnas y cabecera.
3. Entradas y KPIs.
4. Gráficas.
5. Tabla y largo plazo.
6. Verificación responsive, accesible y de movimiento.

Rollback: el trabajo vive en una rama; si un grupo rompe la suite, se revierte ese grupo sin
tocar los anteriores.

## Archivos que se tocarán

**Nuevos**

- `src/theme.js`
- `src/lib/stats.js`
- `src/hooks/useReducedMotion.js`
- `src/components/StateIcon.jsx`
- `src/components/KpiGrid.jsx`
- `src/components/ChartTooltip.jsx`
- `src/vite-env.d.ts`
- `tests/lib/stats.test.js`
- `tests/components/KpiGrid.test.jsx`
- `tests/components/StateIcon.test.jsx`
- `tests/components/charts.a11y.test.jsx`

**Modificados**

- `src/App.jsx`
- `src/styles.css`
- `src/components/MatrixEditor.jsx`
- `src/components/InitialVector.jsx`
- `src/components/ResultsTable.jsx`
- `src/components/StepsLineChart.jsx`
- `src/components/StepsBarChart.jsx`
- `src/components/StationaryCard.jsx`
- `src/components/Interpretation.jsx`
- `src/components/ErrorList.jsx`

**Intactos:** `src/lib/markov.js`, `src/lib/format.js`, `src/lib/series.js`, `package.json` y las
pruebas existentes.
