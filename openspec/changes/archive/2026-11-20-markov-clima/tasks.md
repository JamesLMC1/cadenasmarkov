# Tasks

## 1. Preparación del proyecto

- [x] 1.1 Crear el scaffold de Vite con la plantilla React en JavaScript y verificar que `npm.cmd run dev` levanta la aplicación en el navegador
- [x] 1.2 Instalar `recharts` y las dependencias de desarrollo (`vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@vitest/coverage-v8`) y verificar que `npm.cmd ls --depth=0` las lista sin errores
- [x] 1.3 Configurar `vite.config.js` con el entorno `jsdom`, `setupFiles`, umbrales de cobertura (90% en `src/lib/`, 80% global) y scripts `test`, `test:run`, `coverage`, `typecheck`; verificar que `npm.cmd run test:run` termina sin errores de configuración
- [x] 1.4 Crear `tests/setup.js` con `@testing-library/jest-dom` y `cleanup` tras cada test, y verificar que se ejecuta al correr la primera prueba de la tarea 2.1
- [x] 1.5 Crear `.gitignore` (`node_modules/`, `dist/`, `coverage/`, `.env`) e inicializar el repositorio; verificar con `git status` que no aparecen archivos ignorados
- [x] 1.6 Hacer el primer commit solo con `openspec/`, `AGENTS.md` y `.gitignore`, y verificar con `git log --oneline` que el commit de specs existe antes de cualquier código

## 2. Motor de cálculo (`markov-engine`)

- [x] 2.1 Escribir las pruebas de `validateMatrix` para los cuatro escenarios de la spec (válida, fila que no suma 1, entrada fuera de rango, dimensión incorrecta) y verificar que fallan porque la función no existe
- [x] 2.2 Implementar `validateMatrix` con tolerancia 1e-9 y mensajes en español, y verificar que las pruebas de 2.1 pasan
- [x] 2.3 Escribir las pruebas de `validateVector` (válido, suma distinta de 1, valor no finito) y verificar que fallan
- [x] 2.4 Implementar `validateVector` y verificar que sus pruebas pasan
- [x] 2.5 Escribir las pruebas de `multiplyMatrix`, `multiplyVectorMatrix` y `matrixPower` con casos calculados a mano, y verificar que fallan
- [x] 2.6 Implementar las tres operaciones respetando la convención de vector fila y verificar que sus pruebas pasan
- [x] 2.7 Escribir las pruebas de `computeSteps` para los escenarios de la spec (π₁, suma 1 en los cuatro pasos, claves exactas `{1, 3, 5, 10}`, matriz identidad, entrada inválida que lanza) y verificar que fallan
- [x] 2.8 Implementar `computeSteps` sin redondeo interno y verificar que las pruebas de 2.7 pasan
- [x] 2.9 Escribir las pruebas de `stationaryDistribution` (convergencia y suma 1 con la matriz por defecto, matriz identidad) y verificar que fallan
- [x] 2.10 Implementar `stationaryDistribution` por iteración desde la uniforme con tolerancia 1e-10 y 1000 iteraciones, y verificar que sus pruebas pasan
- [x] 2.11 Añadir la prueba de pureza (la matriz y el vector inicial no cambian tras el cálculo) y verificar que pasa
- [x] 2.12 Ejecutar `npm.cmd run coverage` y verificar que `src/lib/markov.js` supera el 90% de cobertura

## 3. Formato y datos para gráficas

- [x] 3.1 Implementar `formatPercent` y `formatDelta` en `src/lib/format.js` con pruebas de valores límite (0, 1, redondeo a 1 decimal) y verificar que pasan
- [x] 3.2 Implementar `toChartSeries` en `src/lib/series.js` incluyendo el paso 0 con la distribución inicial, con pruebas de forma, orden y cantidad de puntos, y verificar que pasan

## 4. Configuración de entrada (`transition-configuration`)

- [x] 4.1 Implementar en `App.jsx` el estado de `matrix` y `initial`, los valores de ejemplo y el `useMemo` que deriva validación y resultados; verificar que `npm.cmd run dev` muestra el layout sin errores en consola
- [x] 4.2 Implementar `MatrixEditor` con 9 campos numéricos controlados y etiquetas accesibles de fila y columna, y verificar con un test que existen los 9 campos y que cada uno tiene etiqueta de origen y destino
- [x] 4.3 Implementar `InitialVector` con los tres campos y la suma actual en porcentaje, y verificar con un test que la suma se actualiza al cambiar un valor
- [x] 4.4 Mostrar los errores de validación junto a la fila o el vector que los origina, y verificar con tests que aparecen al invalidar y desaparecen al corregir
- [x] 4.5 Invalidar los resultados visibles cuando la entrada deja de ser válida, con mensaje explicativo, y verificar con un test que los resultados dejan de mostrarse
- [x] 4.6 Añadir la acción de restablecer a los valores de ejemplo y verificar con un test que la matriz y el vector vuelven a los valores iniciales
- [x] 4.7 Aplicar los estilos base (formulario, tabla, tarjetas) en `src/styles.css` y verificar visualmente que la app es usable a 1280 px y en móvil

## 5. Visualización de resultados (`prediction-visualization`)

- [x] 5.1 Implementar `ResultsTable` con los pasos 1, 3, 5 y 10 y un decimal por porcentaje, y verificar con un test que muestra los cuatro pasos, los tres estados y que cada paso suma 100% ± 0.1
- [x] 5.2 Implementar `StepsLineChart` con tres series y los pasos 0, 1, 3, 5 y 10, con `width`/`height` explícitos, y verificar con un test que se identifican las tres series y el título de la gráfica
- [x] 5.3 Implementar `StepsBarChart` con tres barras por paso, y verificar con un test que los pasos coinciden con los de la tabla
- [x] 5.4 Implementar `StationaryCard` indicando que es el comportamiento a largo plazo, y verificar con un test que los tres valores se muestran y suman 100% ± 0.1
- [x] 5.5 Implementar `Interpretation` con una frase que nombre el estado más probable a 10 pasos y el más probable a largo plazo, y verificar con tests que menciona ambos y que cambia al modificar la matriz
- [x] 5.6 Añadir títulos visibles y descripción textual a ambas gráficas, y verificar con un test que el texto alternativo existe

## 6. Integración y entrega

- [x] 6.1 Escribir un test de integración de `App` que cubra el recorrido completo: matriz válida → cuatro pasos y dos gráficas; fila inválida → error visible y resultados ocultos
- [x] 6.2 Ejecutar `npm.cmd run coverage` y verificar 90% en `src/lib/` y 80% global
- [x] 6.3 Ejecutar `npm.cmd run typecheck` y verificar que no hay errores de tipos
- [x] 6.4 Escribir el `README.md` con el modelo (estados, matriz, π₀, fórmula), cómo ejecutar, capturas, pruebas, proceso SDD y uso del agente, y verificar que los comandos documentados funcionan tal cual
- [x] 6.5 Verificar manualmente en el navegador el recorrido completo con la matriz por defecto y anotar los valores obtenidos
- [x] 6.6 Ejecutar `openspec.cmd validate markov-clima --strict` y verificar que no reporta errores ni advertencias

## Workflow follow-up

- Archivar el cambio con `/opsx-archive` cuando la verificación esté completa.
- Publicar en GitHub y comprobar que el historial de commits refleja el orden spec → test → código.
