# MarkovClima

Aplicación web que predice la evolución del clima mediante una **cadena de Markov de tres
estados**. A partir de una matriz de transición y del clima de hoy, calcula la probabilidad de
cada estado en 1, 3, 5 y 10 pasos, muestra la evolución en gráficas y explica el resultado en
lenguaje natural.

Proyecto individual de la asignatura: modelo de Markov, aplicación web, SDD con OpenSpec y
pruebas automatizadas.

| | |
|---|---|
| Modelo | Cadena de Markov de 3 estados, matriz estocástica por filas |
| Stack | React 19 + Vite + Recharts, JavaScript con JSDoc |
| Pruebas | 68 pruebas, Vitest + Testing Library |
| Cobertura | 96% de líneas (94% en el motor de cálculo) |
| Especificación | OpenSpec, cambio `markov-clima` |

---

## Cómo ejecutar

Requisitos: Node.js 20 o superior y npm.

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`).

Otros comandos:

```bash
npm run build      # build de producción
npm run preview    # sirve el build
npm run test       # Vitest en modo watch
npm run test:run   # Vitest una vez
npm run coverage   # pruebas + cobertura
npm run typecheck  # tsc --noEmit con checkJs
```

> En Windows, si PowerShell bloquea `npm`, usa `npm.cmd` o ejecuta
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

---

## El modelo

### Estados

| Índice | Estado |
|---|---|
| 0 | Soleado |
| 1 | Nublado |
| 2 | Lluvioso |

### Matriz de transición

`P[i][j]` es la probabilidad de pasar del estado `i` al estado `j` en un día. Cada **fila** suma
1 (matriz estocástica por filas), de modo que la tabla se lee "si hoy está…".

| De \ A | Soleado | Nublado | Lluvioso |
|---|---|---|---|
| **Soleado** | 0.70 | 0.20 | 0.10 |
| **Nublado** | 0.30 | 0.50 | 0.20 |
| **Lluvioso** | 0.20 | 0.30 | 0.50 |

### Distribución inicial

Clima de hoy: `π₀ = [0.50, 0.30, 0.20]`.

### Cálculo

Se usa la convención de **vector fila**:

```
πₙ = π₀ · Pⁿ
```

Es decir, `π₁ = π₀ · P`, `π₃ = π₀ · P³`, etc. El motor no redondea en ningún paso intermedio:
solo se formatea al mostrar, para que cada distribución siga sumando 1.

### Resultados con los valores de ejemplo

| Paso | Soleado | Nublado | Lluvioso |
|---|---|---|---|
| 1 | 48.0% | 31.0% | 21.0% |
| 3 | 46.7% | 31.6% | 21.7% |
| 5 | 46.4% | 31.7% | 21.9% |
| 10 | 46.3% | 31.7% | 22.0% |
| Largo plazo | 46.3% | 31.7% | 22.0% |

La **distribución estacionaria** (46.3% / 31.7% / 22.0%) es el punto fijo `π = π·P`: el clima
tiende a ese reparto cuando el número de días crece sin límite. Se estima iterando desde la
distribución uniforme hasta que la diferencia en norma L1 es menor que `1e-10`.

> Los valores de la matriz son **valores de ejemplo**, no datos meteorológicos reales.

---

## Uso

1. Ajusta la **matriz de transición**. Cada fila muestra su suma; si no suma 1, aparece el error
   junto a esa fila y la celda se marca en rojo.
2. Ajusta el **clima de hoy** (`π₀`). La interfaz muestra la suma actual en porcentaje.
3. Los resultados se recalculan al instante: tabla por paso, gráfica de evolución, gráfica
   comparativa, distribución estacionaria y una frase que resume el resultado.
4. **Restablecer valores de ejemplo** devuelve todo al estado inicial.

Si la entrada deja de ser válida, los resultados se ocultan y se explica por qué, en lugar de
mostrar números calculados con datos incorrectos.

---

## Pruebas

```bash
npm run test:run
npm run coverage
```

68 pruebas en 12 archivos:

| Archivo | Qué cubre |
|---|---|
| `tests/lib/markov.test.js` | Validaciones, producto vector-matriz, potencias, `computeSteps`, estacionaria, pureza |
| `tests/lib/format.test.js` | Porcentajes y diferencias en puntos porcentuales, valores límite |
| `tests/lib/series.test.js` | Datos para las gráficas, paso 0, orden y forma |
| `tests/components/MatrixEditor.test.jsx` | 9 campos etiquetados, suma por fila, errores |
| `tests/components/InitialVector.test.jsx` | Suma en porcentaje, errores |
| `tests/components/ResultsTable.test.jsx` | Cuatro pasos, tres estados, un decimal, suma 100% ± 0.1 |
| `tests/components/StepsLineChart.test.jsx` | Tres series, paso 0, medidas explícitas |
| `tests/components/StepsBarChart.test.jsx` | Pasos de la tabla, tres series |
| `tests/components/StationaryCard.test.jsx` | Valores a largo plazo y suma 100% |
| `tests/components/Interpretation.test.jsx` | Estados dominantes y cambio al cambiar la matriz |
| `tests/components/App.test.jsx` | Suma reactiva, errores que aparecen y desaparecen, restablecer |
| `tests/components/App.integration.test.jsx` | Recorrido completo: válido → resultados; inválido → error y resultados ocultos |

Umbrales configurados en `vite.config.js`: **90% en `src/lib/`** y **80% global**. Estado actual:
96% global, 94% en `markov.js`.

Las gráficas se prueban con `width` y `height` explícitos porque `ResponsiveContainer` mide 0 en
jsdom; se verifica el contenido y las etiquetas, no la geometría interna de Recharts.

---

## Proceso SDD con OpenSpec

El sistema se especificó **antes** de escribir código. El cambio vive en
`openspec/changes/markov-clima/`:

```
openspec/changes/markov-clima/
├── proposal.md                      # qué y por qué
├── design.md                        # decisiones técnicas y alternativas descartadas
├── specs/
│   ├── markov-engine/spec.md        # validación, cálculo y estacionaria
│   ├── transition-configuration/    # edición y validación de la entrada
│   └── prediction-visualization/    # tabla, gráficas e interpretación
└── tasks.md                         # 39 tareas con su criterio de verificación
```

Orden de trabajo: **spec → test → código**. Cada escenario de las specs tiene al menos un test
que lo nombra; por ejemplo el escenario "conservación de la masa" corresponde a la prueba de que
las cuatro distribuciones suman 1.

Comandos:

```bash
openspec validate markov-clima --strict
openspec status --change markov-clima
```

Las decisiones de diseño (convención fila/columna, semántica de errores, por qué Recharts con
medidas fijas, por qué el motor no conoce React) están en `design.md`. Las convenciones que debe
seguir cualquier agente están en `AGENTS.md`.

---

## Uso del agente de IA

El repositorio incluye `AGENTS.md`, que fija stack, convenciones y límites para el agente. El
proceso fue:

1. El agente generó el cambio OpenSpec completo (`proposal`, `design`, tres delta specs,
   `tasks`).
2. Se validó la especificación con `openspec validate --strict` antes de escribir código.
3. Cada grupo de tareas se implementó en pares **prueba primero / implementación después**,
   ejecutando la suite en cada paso.
4. Las pruebas destaparon dos decisiones que se corrigieron en los artefactos:
   - `toChartSeries` necesita la distribución inicial para construir el paso 0.
   - El estado de los campos guarda el texto, no el número, para no romper la escritura de
     decimales.
5. Se descartaron dependencias no aprobadas (TypeScript, librerías de estado, Tailwind) y se
   mantuvo el motor sin React.

---

## Estructura

```
src/
├── main.jsx                  # createRoot + StrictMode
├── App.jsx                   # estado de entrada y derivación de resultados
├── lib/
│   ├── markov.js             # motor puro: validación, potencias, estacionaria
│   ├── format.js             # porcentajes y deltas
│   └── series.js             # resultados → datos de Recharts
├── components/
│   ├── MatrixEditor.jsx      # matriz 3×3 controlada
│   ├── InitialVector.jsx     # π₀ y suma actual
│   ├── ResultsTable.jsx      # 1, 3, 5, 10 pasos
│   ├── StepsLineChart.jsx    # evolución
│   ├── StepsBarChart.jsx     # comparación por paso
│   ├── StationaryCard.jsx    # largo plazo
│   ├── Interpretation.jsx    # frase en lenguaje natural
│   └── ErrorList.jsx         # mensaje cuando no hay resultados
└── styles.css
tests/
├── setup.js
├── lib/                      # motor y utilidades
└── components/               # interfaz e integración
```

Regla de dependencias: `src/lib/*` no importa React ni toca el DOM; los componentes no contienen
matemática de Markov, reciben números ya calculados.

---

## Capturas

Para generar la captura de pantalla: `npm run dev`, abre la aplicación y captura la vista
completa. Se recomienda guardarla en `docs/captura.png` y enlazarla aquí.

---

## Limitaciones y trabajo futuro

- Solo tres estados fijos; el modelo no permite que el usuario los defina.
- La matriz se introduce a mano: no se importan datos históricos.
- No hay persistencia: al recargar se vuelve a los valores de ejemplo.
- La distribución estacionaria se estima por iteración; para matrices con convergencia muy lenta
  haría falta un método directo o más iteraciones.
- Posibles ampliaciones: cadenas de orden 2, comparación de escenarios, exportación de resultados
  y carga de matrices desde CSV.

---

## Licencia

Proyecto académico. Uso educativo.
