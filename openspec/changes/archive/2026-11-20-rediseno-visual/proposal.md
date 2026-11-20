# Proposal: Rediseño visual de MarkovClima

## Why

La aplicación ya calcula y explica correctamente el modelo, pero su presentación es la de un
formulario con una tabla: los resultados exigen lectura, el color no comunica nada y en pantallas
pequeñas el formulario compite con las gráficas. Un rediseño de dashboard científico permite
entender el resultado de un vistazo sin tocar el cálculo.

## What Changes

- Se adopta un layout de dashboard de 12 columnas (máximo 1200 px) con cabecera, bloque de
  entradas en dos columnas, tarjetas de indicadores, gráficas en dos columnas y cierre de tabla
  más largo plazo.
- Se añade un bloque de **cuatro tarjetas KPI** con el estado más probable a 10 pasos y la
  probabilidad de cada estado, incluyendo la diferencia en puntos porcentuales respecto al clima
  de hoy.
- Se incorpora **codificación visual por estado**: un color fijo y un icono (sol, nube, lluvia)
  idénticos en tabla, gráficas, tarjetas y formularios, de modo que el color no sea el único
  portador de información.
- La gráfica de evolución pasa a eje X **proporcional** al número de pasos, eje Y en porcentaje,
  líneas punteadas con la distribución estacionaria y etiqueta directa al final de cada serie.
- La gráfica de barras añade etiquetas de valor sobre las barras y tooltip con los tres estados.
- La tabla resalta la celda más probable de cada fila con un fondo tenue del color de su estado.
- La distribución estacionaria se presenta como tres barras horizontales con porcentaje grande.
- Se unifican tokens visuales (color, tipografía, espaciado, radios, sombras) en un solo lugar,
  con clases prefijadas en lugar de clases globales nuevas.
- Se cubren responsive (1440/1024/768/390 px), foco visible, contraste AA, `prefers-reduced-motion`
  y descripción accesible de cada gráfica.

**No cambia** el motor de cálculo, las validaciones, los tipos ni las pruebas existentes. Los
nombres accesibles actuales (títulos, captions y etiquetas de campo) se conservan para no alterar
el contrato que ya verifican los tests.

## Capabilities

### New Capabilities

- `visual-system`: define los tokens visuales, la codificación de color e icono por estado y las
  reglas de adaptación responsive, accesibilidad y movimiento que comparten todas las vistas.

### Modified Capabilities

- `prediction-visualization`: la tabla, ambas gráficas y la distribución estacionaria cambian su
  presentación; se añade el resumen de indicadores y la descripción accesible de cada gráfica.
- `transition-configuration`: los encabezados de la matriz y del clima de hoy pasan a mostrar
  icono y color de estado, sin alterar la edición ni la validación.

## Impact

- **Código afectado:** `src/App.jsx` (layout y bloques), `src/styles.css` (reescritura de tokens y
  clases), todos los componentes de `src/components/` (presentación), y dos archivos nuevos:
  `src/theme.js` (color y orden de estados) y `src/components/StateIcon.jsx` (iconos en SVG).
- **Sin cambios** en `src/lib/*`, en `tests/*`, en dependencias ni en el contrato de datos.
- **Riesgo principal:** que un rediseño rompa los nombres accesibles que usan las pruebas; se
  mitiga manteniendo títulos, captions y etiquetas actuales y ejecutando la suite completa.
- **Fuera de alcance:** modo oscuro, cambio de tipografía con descarga externa, animaciones
  complejas, exportación de imágenes y cualquier cambio de cálculo o de estados del modelo.
