# Tasks

## 1. Sistema visual

- [x] 1.1 Crear `src/theme.js` con `STATE_THEME` (color de marca, color de texto AA, icono y etiqueta por estado), `BRAND` y la escala de espaciado; verificar que `npm.cmd run build` compila y que ningún componente importa hex propios nuevos
- [x] 1.2 Crear `src/lib/stats.js` con `indexOfMax` y `tests/lib/stats.test.js` con casos de empate, máximo al inicio y máximo al final; verificar que `npm.cmd run test:run` pasa
- [x] 1.3 Crear `src/components/StateIcon.jsx` con los tres iconos en SVG y `tests/components/StateIcon.test.jsx` que compruebe `aria-hidden` junto a texto y `role="img"` con nombre accesible cuando va solo; verificar que las pruebas pasan
- [x] 1.4 Reescribir el bloque `:root` de `src/styles.css` con los tokens del rediseño (fondo `#f4f3fb`, borde `#e6e4f2`, radio 16px, escala de 4px) y una base tipográfica de 28/18/14/12 px; verificar que la app arranca con `npm.cmd run dev` sin errores de consola

## 2. Layout y cabecera

- [x] 2.1 Reemplazar el layout de `App.jsx` por un contenedor `.mc-page` de 1200 px y un grid `.mc-layout` de 12 columnas con spans explícitos (8/4 entradas, 12 KPIs, 6/6 gráficas, 7/5 cierre); verificar a 1440 px que no hay scroll horizontal
- [x] 2.2 Mantener la cabecera con el nombre y la descripción actuales, sin navegación adicional, y verificar con `npm.cmd run test:run` que las pruebas de `App` siguen pasando

## 3. Entradas

- [x] 3.1 Adaptar `MatrixEditor` a la cuadrícula visual del brief: encabezados con `StateIcon` y color de estado, campos amplios y centrados, y badge de suma por fila en verde o rojo; verificar que las pruebas existentes de los 9 campos y las etiquetas siguen pasando
- [x] 3.2 Adaptar `InitialVector` con icono por estado, suma actual destacada y botón secundario; verificar que las pruebas de suma y de error siguen pasando
- [x] 3.3 Convertir `ErrorList` en el mensaje dentro de la tarjeta de resultados, conservando el texto exacto `No hay resultados: corrige los valores marcados para calcular.`; verificar que la prueba de integración sigue pasando

## 4. Tarjetas de indicadores

- [x] 4.1 Crear `src/components/KpiGrid.jsx` con cuatro tarjetas: estado más probable a 10 pasos y probabilidad por estado, cada una con barra fina y diferencia respecto al clima de hoy calculada con `formatDelta`; verificar que el componente renderiza con los datos por defecto
- [x] 4.2 Escribir `tests/components/KpiGrid.test.jsx` que compruebe las cuatro tarjetas, el signo de la diferencia y el caso de diferencia despreciable (`±0.0 pp`); verificar que las pruebas pasan
- [x] 4.3 Integrar `KpiGrid` en `App` entre las entradas y las gráficas, y verificar que la suite completa sigue en verde

## 5. Gráficas

- [x] 5.1 Rehacer `StepsLineChart` con eje X numérico y proporcional (`domain={[0, 10]}`, ticks 0/1/3/5/10), eje Y en porcentaje, cuadrícula tenue, tres `ReferenceLine` punteadas con la estacionaria, etiqueta directa al final de cada serie, subtítulo, `role="img"` y `aria-label`; verificar que sus pruebas actuales de leyenda y medidas siguen pasando
- [x] 5.2 Rehacer `StepsBarChart` con barras agrupadas, etiquetas de porcentaje sobre las barras cuando el valor sea ≥ 6%, tooltip propio con los tres estados, subtítulo y nombre accesible; verificar que sus pruebas actuales de pasos y series siguen pasando
- [x] 5.3 Crear `src/hooks/useReducedMotion.js` con `matchMedia`, conectar `isAnimationActive` en ambas gráficas (animación única de 600 ms como máximo) y envolver las transiciones CSS en `prefers-reduced-motion`; verificar que con la preferencia activada el atributo de animación queda desactivado
- [x] 5.4 Escribir `tests/components/charts.a11y.test.jsx` que compruebe el nombre accesible de cada gráfica, la presencia de las tres líneas de referencia y las etiquetas de valor de las barras; verificar que pasa

## 6. Tabla y largo plazo

- [x] 6.1 Adaptar `ResultsTable` con cabeceras de estado que incluyen icono, números alineados a la derecha, columna de suma y resaltado tenue de la celda más probable de cada fila; verificar que las pruebas de cuatro pasos, decimales y suma 100% ± 0.1 siguen pasando
- [x] 6.2 Convertir `StationaryCard` en tres barras horizontales con porcentaje destacado y nota de texto, conservando el título y la aclaración de largo plazo; verificar que su prueba de suma sigue pasando
- [x] 6.3 Usar `indexOfMax` de `src/lib/stats.js` en `Interpretation` y dar estilo de nota al bloque, conservando la frase y sus pruebas; verificar que las pruebas de interpretación siguen pasando

## 7. Verificación

- [x] 7.1 Ejecutar `npm.cmd run test:run` y verificar 0 fallos, incluidos los 68 tests previos sin modificaciones
- [x] 7.2 Ejecutar `npm.cmd run coverage` y verificar 90% en `src/lib/` y 80% global
- [x] 7.3 Ejecutar `npm.cmd run typecheck` y verificar que no hay errores de tipos
- [x] 7.4 Revisar la app en el navegador a 1440, 1024, 768 y 390 px, y verificar: sin scroll horizontal, sin solapamientos, sin errores de consola y matriz 3×3 en cuadrícula en móvil
- [x] 7.5 Comprobar foco visible con teclado, contraste AA de los textos de estado y que `prefers-reduced-motion` desactiva animaciones y transiciones
- [x] 7.6 Actualizar el `README.md` con una sección de interfaz (sistema visual, colores por estado, capturas pendientes) y verificar que los comandos documentados siguen funcionando
- [x] 7.7 Ejecutar `openspec.cmd validate rediseno-visual --strict` y verificar que no reporta errores

## Workflow follow-up

- Archivar el cambio con `/opsx-archive` cuando la verificación esté completa.
- Commit por grupo, con mensajes en inglés y prefijo `style(ui):` o `feat(ui):`.
