# Design: MarkovClima

## Context

Proyecto nuevo: el repositorio solo contiene `openspec/` y `AGENTS.md`. No hay código, ni
dependencias instaladas, ni historial Git. La motivación está en `proposal.md`; los requisitos
observables, en `openspec/changes/markov-clima/specs/`.

Restricciones que moldean el diseño:

- Sin backend ni red: todo ocurre en el navegador.
- `AGENTS.md` fija el stack (React 19 + Vite + Recharts, JavaScript con JSDoc y `// @ts-check`)
  y prohíbe TypeScript, librerías de estado y de componentes.
- El cálculo debe poder verificarse a mano; el caso de 3 estados lo permite.

## Goals / Non-Goals

**Goals**

- Aislar la matemática en módulos puros sin React, para que el motor se pruebe sin DOM.
- Un único punto de conversión entre resultados y formato de gráfica.
- Estado de entrada en un solo lugar (`App`), con los resultados derivados en el render.
- Errores de validación como datos, no como excepciones, para poder pintarlos.

**Non-Goals**

- Optimizar para matrices grandes: la exponenciación es directa, sin exponenciación rápida.
- Persistir el escenario del usuario entre sesiones.
- Soportar más de 3 estados o estados configurables por el usuario.

## Decisions

### D1. El motor no conoce React

`src/lib/markov.js` exporta funciones puras que reciben arrays de números. La UI las importa; el
motor nunca importa componentes ni toca `document`.

**Rationale:** el 30% del modelo y buena parte del 20% de pruebas se resuelven probando un módulo
sin DOM. Además, si mañana cambia la UI, el motor se reutiliza.
**Alternativa descartada:** calcular dentro de componentes con `useMemo`. Mezcla dominio y
presentación, y obliga a montar React para probar una multiplicación.

### D2. Vector fila × matriz, estocástica por filas

`P[i][j]` es la probabilidad de pasar de `i` a `j`; cada fila suma 1. El cálculo es
`πₙ = π₀ · Pⁿ`.

**Rationale:** es la convención que se usa en clase y la que hace legible la matriz en pantalla
(cada fila se lee "si hoy estoy en el estado i…").
**Alternativa descartada:** convención por columnas. Ahorra una transpuesta en el código, pero
hace que la matriz mostrada no coincida con la que el usuario lee.

**Consecuencia:** `multiplyVectorMatrix(v, m)` devuelve `out[j] = Σᵢ v[i]·m[i][j]`.

### D3. Validación que devuelve datos

`validateMatrix` y `validateVector` devuelven `{ ok, errors }` con mensajes en español.
`computeSteps` lanza `Error` si la entrada es inválida.

**Rationale:** una fila que suma 0.9 es una condición esperada de usuario, no una excepción.
Llamar a `computeSteps` con datos inválidos, en cambio, es un bug del llamador.
**Alternativa descartada:** lanzar siempre y capturar en el componente. Convierte el flujo normal
en `try/catch` y pierde los mensajes por campo.

### D4. Resultados derivados, no almacenados

`App` guarda solo `matrix` y `initial` en el estado. Los resultados se obtienen con:
`useMemo(() => computeSteps(...), [matrix, initial])`, y devuelven `null` cuando la validación
falla.

**Rationale:** elimina la clase de bugs "resultados viejos con matriz nueva". No hay
`useEffect` que sincronice nada.
**Alternativa descartada:** estado `results` actualizado en un `onChange`. Duplica la fuente de
verdad y se desincroniza al corregir un campo.

### D5. Recharts con dimensiones explícitas

Las gráficas usan `LineChart`/`BarChart` con `width` y `height` numéricos, no
`ResponsiveContainer`.

**Rationale:** `ResponsiveContainer` mide 0 en jsdom y deja el SVG vacío, lo que haría
inverificable la gráfica. Con medidas fijas, el SVG se renderiza también en test.
**Alternativa descartada:** SVG propio. Da control total y cero dependencias, pero obliga a
reimplementar ejes, escalas y leyendas; el presupuesto del proyecto no lo justifica.

### D6. Una sola función conoce el formato de Recharts

`src/lib/series.js` → `toChartSeries(stepsByN, stateLabels, initial)` convierte
`{1: [...], 3: [...]}` en `[{ step: 0, ... }, { step: 1, ... }, ...]`, incluyendo el paso 0 con
la distribución inicial.

**Rationale:** si Recharts cambia de API o se reemplaza, se reescribe un archivo de 20 líneas y
los tests del motor siguen intactos.
**Alternativa descartada:** transformar los datos dentro de cada componente de gráfica. Duplica
la lógica y la hace divergir entre la gráfica de líneas y la de barras.

### D7. Distribución estacionaria por iteración de potencias

Se parte de la distribución uniforme `[1/3, 1/3, 1/3]` y se aplica `π ← πP` hasta que la
diferencia en norma L1 sea menor que `1e-10`, con un máximo de 1000 iteraciones. Si no converge,
se devuelve la última distribución y la UI la muestra igualmente, marcada como estimación.

**Rationale:** 3 estados y 1000 iteraciones sobran para cualquier matriz de este tamaño; resolver
el sistema lineal añadiría código y errores numéricos sin beneficio.
**Alternativa descartada:** resolver `π(P − I) = 0` con sustitución. Más exacto en teoría, mucho
más código y más frágil ante matrices mal condicionadas.

### D8. Redondeo solo en presentación

El motor devuelve números con toda la precisión de `Number`. `src/lib/format.js` concentra
`formatPercent(value, decimals = 1)` y `formatDelta`.

**Rationale:** redondear en cada paso acumula error y puede romper el invariante de suma 1 que
verifican las pruebas. Por eso el margen de 0.1 que admiten las specs de presentación.

### D9. Estructura de componentes

```
App
├── MatrixEditor        (matriz 3×3, errores por fila)
├── InitialVector       (π₀ + suma actual)
├── ErrorList           (errores globales)
├── ResultsTable        (pasos 1, 3, 5, 10)
├── StepsLineChart      (pasos 0, 1, 3, 5, 10)
├── StepsBarChart       (pasos 1, 3, 5, 10)
├── StationaryCard      (largo plazo)
└── Interpretation      (frase en español)
```

`App` es el único que importa `computeSteps`. Los hijos reciben números ya calculados.

### D10. Datos de ejemplo

Matriz por defecto (estocástica por filas):

```
             Soleado  Nublado  Lluvioso
Soleado  [    0.70     0.20     0.10   ]
Nublado  [    0.30     0.50     0.20   ]
Lluvioso [    0.20     0.30     0.50   ]
```

Distribución inicial: `[0.50, 0.30, 0.20]`.

**Rationale:** son valores plausibles y redondos, fáciles de recalcular a mano en la defensa. La
UI y el README los etiquetan como **valores de ejemplo**, no como datos meteorológicos reales.

### D11. Pruebas: qué se prueba dónde

- `tests/lib/markov.test.js` — motor: validación, potencias, suma 1, no mutación, claves exactas,
  estacionaria.
- `tests/lib/series.test.js` — inclusión del paso 0 y forma de los datos.
- `tests/components/*.test.jsx` — comportamiento por rol/etiqueta: errores visibles, cuatro pasos
  en la tabla, tres series identificables, restablecer.

**Rationale:** cada escenario de las specs debe tener al menos un test que lo nombre; los tests de
gráficas verifican datos y etiquetas, no la geometría interna de Recharts.

## Risks / Trade-offs

- **Recharts no renderiza en jsdom sin medidas** → componentes con `width`/`height` explícitos y
  un test que monta la gráfica y verifica que hay contenido; nunca `ResponsiveContainer`.
- **El redondeo hace que los porcentajes mostrados no sumen exactamente 100** → margen de 0.1 en
  las specs, y el motor nunca redondea.
- **Arrastre de coma flotante en `P¹⁰`** → tolerancias de 1e-9/1e-10 y comparaciones por
  diferencia absoluta, nunca `===`.
- **El usuario puede escribir valores no numéricos en los inputs** → parseo con
  `Number.parseFloat` + `Number.isFinite` en el handler; el estado guarda `null` y la validación
  lo reporta.
- **Riesgo de scope creep** (más estados, datos reales, backend) → declarado fuera de alcance en
  `proposal.md`; cualquier ampliación requiere un cambio OpenSpec nuevo.

## Migration Plan

Proyecto nuevo, sin migración de datos ni de código existente.

1. Scaffold de Vite + React y dependencias de desarrollo.
2. Motor y pruebas del motor (spec `markov-engine`).
3. Componentes de entrada (spec `transition-configuration`).
4. Componentes de resultados (spec `prediction-visualization`).
5. README, capturas y archive del cambio.

Rollback: el trabajo vive en una rama; si algo no cierra, se descarta la rama sin afectar `main`.
