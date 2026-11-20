# AGENTS.md

Instrucciones para agentes de IA que trabajen en este repositorio. Este archivo manda sobre
cualquier preferencia por defecto del agente. Si algo aquí contradice una suposición tuya,
gana este archivo.

---

## 1. Contexto del proyecto

**MarkovClima** es una aplicación web que predice la evolución del clima mediante una cadena de
Markov de 3 estados. Es un proyecto académico; el objetivo es demostrar correctitud matemática,
calidad de aplicación web, proceso SDD y pruebas automatizadas, en ese orden de prioridad.

- **Estados:** `Soleado`, `Nublado`, `Lluvioso` (índices 0, 1, 2)
- **Entrada:** matriz de transición `P` (3×3) y distribución inicial `π₀` (3 valores)
- **Salida:** `πₙ = π₀ · Pⁿ` para `n ∈ {1, 3, 5, 10}`, más la distribución estacionaria
- **Idioma de la UI:** español
- **Idioma del código:** identificadores, nombres de archivo y mensajes de commit en inglés;
  comentarios y textos visibles al usuario en español

### Fuera de alcance (no lo implementes sin pedirlo)

- Persistencia, base de datos, cuentas de usuario, backend
- Más de 3 estados o cadenas de Markov de orden superior
- Series temporales reales o scraping del clima
- Internacionalización, temas oscuros/claros, PWA

---

## 2. Stack: decisiones cerradas

No propongas alternativas ni instales nada que no esté en esta tabla sin autorización explícita
del usuario. Si crees que algo aquí es un error, dilo y espera respuesta; no lo cambies por tu
cuenta.

| Área | Decisión | Por qué |
|---|---|---|
| Lenguaje | JavaScript ES2022 + JSX | Se mantiene JS (no TS) por decisión del usuario; JSX solo para la capa de UI |
| Tipos | JSDoc + `// @ts-check` en cada archivo de `src/` | Tipado verificable sin escribir TypeScript |
| Bundler / dev server | Vite | Estándar de facto para React, sin configuración |
| UI | React 19 (componentes función + hooks) | Pedido explícito del usuario; el editor de matriz y las gráficas se benefician del render declarativo |
| Estado | `useState` / `useReducer` locales | La app tiene un solo formulario; no hay estado que compartir entre ramas del árbol |
| Gráficas | Recharts | Declarativo, renderiza SVG real (testeable con jsdom) y resuelve ejes y leyendas sin código propio |
| Tests | Vitest + jsdom + `@testing-library/react` + `@testing-library/jest-dom` + `@testing-library/user-event` | Un runner para matemática y componentes; se testea por rol/etiqueta, no por clase CSS |
| Estilos | CSS plano en `src/styles.css` | Sin preprocesadores ni Tailwind |
| Gestor de paquetes | npm | — |

**Regla dura:** nada de TypeScript, Next.js, Remix, Vue, Svelte, Redux, Zustand, MobX, Tailwind,
Chart.js, D3, jQuery, react-router ni librerías de componentes (MUI, shadcn, Chakra). Si algo
"necesita" una dependencia nueva, primero pregunta.

> En Windows PowerShell `npm` está bloqueado por la política de ejecución: usa siempre
> `npm.cmd` en los comandos, o pide al usuario ejecutar
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

---

## 3. SDD y OpenSpec: el orden no se negocia

Este proyecto usa Spec-Driven Development. La fuente de verdad son los artefactos de OpenSpec,
no este archivo y no el código existente.

**Orden obligatorio para cualquier cambio de comportamiento:**

1. **Spec** — se modifica o crea el delta en `openspec/`
2. **Test** — se escriben las pruebas que fallan contra el comportamiento especificado
3. **Código** — se implementa hasta que las pruebas pasan
4. **Archive** — se archiva el cambio cuando todo está verde

Reglas:

- **No implementes una feature que no esté en `openspec/`.** Si la petición del usuario no está
  cubierta, propón primero el cambio OpenSpec y espera aprobación.
- Cada `Requirement` y cada `Scenario` del spec debe mapear a al menos una prueba. Si un
  escenario no tiene test, la tarea no está terminada.
- No edites `openspec/changes/archive/` a mano; eso lo hace `openspec archive`.
- No inventes requisitos nuevos "porque quedan bien". La spec se negocia con el usuario.
- Al proponer un cambio, usa `/opsx-propose`. Al implementar, `/opsx-apply`. Al cerrar,
  `/opsx-archive`. No mezcles las tres fases en una sola respuesta.

---

## 4. Estructura del proyecto

```
index.html
src/
├── main.jsx                    # createRoot + StrictMode
├── App.jsx                     # layout, estado del formulario, orquestación
├── lib/
│   ├── markov.js               # TODO el cálculo. Puro. Cero React. Cero DOM.
│   ├── format.js               # formato de porcentajes y números
│   └── series.js               # transforma steps -> datos para Recharts
├── components/
│   ├── MatrixEditor.jsx        # matriz 3×3 controlada + validación en vivo
│   ├── InitialVector.jsx       # π₀ (inputs numéricos, sincronizados)
│   ├── ResultsTable.jsx        # π₁, π₃, π₅, π₁₀
│   ├── StepsLineChart.jsx      # evolución por paso
│   ├── StepsBarChart.jsx       # comparación por paso
│   ├── StationaryCard.jsx      # distribución estacionaria
│   ├── Interpretation.jsx      # resumen en lenguaje natural
│   └── ErrorList.jsx           # mensajes de validación
└── styles.css
tests/
├── setup.js                    # jest-dom + cleanup
├── lib/
│   ├── markov.test.js
│   └── series.test.js
└── components/
    └── *.test.jsx
```

**Regla de dependencias:** `src/lib/*` no importa React ni toca `document`. Los componentes no
contienen matemática: reciben números ya calculados por props y solo los presentan.

---

## 5. Contrato del motor (`src/lib/markov.js`)

Estas firmas son el contrato entre matemática y UI. Si necesitas cambiarlas, actualiza primero
`design.md` del cambio OpenSpec.

```js
/** @typedef {number[][]} Matrix */
/** @typedef {number[]} Vector */

/** @returns {{ ok: boolean, errors: string[] }} */
export function validateMatrix(matrix, { tolerance = 1e-9 } = {}) {}

/** @returns {{ ok: boolean, errors: string[] }} */
export function validateVector(vector, { tolerance = 1e-9 } = {}) {}

/** @returns {Matrix} */
export function multiplyMatrix(a, b) {}

/** @returns {Vector} */
export function multiplyVectorMatrix(v, m) {}

/** @returns {Matrix} */
export function matrixPower(m, n) {}

/** @returns {Record<number, Vector>} */
export function computeSteps(initial, matrix, steps = [1, 3, 5, 10]) {}

/** @returns {Vector} */
export function stationaryDistribution(matrix, { tolerance = 1e-10, maxIterations = 1000 } = {}) {}
```

`src/lib/series.js` expone la única función que conoce el formato de Recharts:

```js
/** @returns {Array<{ step: number, [state: string]: number }>} */
export function toChartSeries(stepsByN, stateLabels) {}
```

### Convenciones matemáticas (no las cambies)

- La matriz es **estocástica por filas**: `P[i][j]` = probabilidad de pasar de `i` a `j`.
  Cada fila debe sumar 1.
- El cálculo es **vector fila × matriz**: `πₙ = π₀ · Pⁿ`. **Nunca** uses la transpuesta.
- **No redondees dentro del cálculo.** Se redondea solo al mostrar (1 decimal en porcentajes).
  Redondear en cada paso hace que `π₁₀` deje de sumar 1 y rompe las pruebas.
- Tolerancia de validación: `1e-9`. Compara con `Math.abs(x - y) < tolerance`, nunca con `===`.
- Toda función del motor es **pura**: no muta sus argumentos y devuelve valores nuevos.
  Hay un test que lo verifica; no lo rompas.

### Semántica de errores

`validateMatrix` / `validateVector` **no lanzan**. Devuelven `{ ok, errors }` con mensajes en
español, listos para pintar en la UI. `computeSteps` sí lanza `Error` si la entrada es inválida,
porque llamarla con datos inválidos es un bug del llamador, no una condición de usuario.

---

## 6. Convenciones de código

**React**

- Componentes como `function Component() {}` exportados con `export default`. Un componente por archivo.
- Props documentadas con JSDoc justo encima del componente; nada de `PropTypes` (ya lo cubre `tsc`).
- **No derives estado con `useEffect`.** Si un valor se calcula a partir de props o de otro estado,
  hazlo en el render (con `useMemo` solo si el cálculo es caro: aquí lo es, la matriz elevada a 10).
- Los inputs son **controlados**: `value` + `onChange`, sin `ref` para leer valores.
- Los valores de `<input>` son **strings**: conviértelos con `Number.parseFloat` y valida
  `Number.isFinite` en el handler antes de guardarlos en el estado.
- `key` siempre estable (índice de estado o nombre), nunca `Math.random()`.
- No hay `useEffect` para sincronizar la matriz con el vector inicial: son estados independientes.
- Nada de `dangerouslySetInnerHTML`.

**General**

- Un módulo = una responsabilidad. Si un archivo pasa de ~200 líneas, probablemente hace dos cosas.
- Nombres en inglés, textos de UI en español, sin abreviaturas crípticas (`m`, `v`, `p` solos
  no; `matrix`, `vector`, `transition` sí).
- Cada archivo de `src/` empieza con `// @ts-check`.
- No dejes `console.log` en el código final. Para errores reales, renderiza el mensaje en la UI.
- Sin `var`. Sin callbacks anidados profundos. Prefiere funciones pequeñas y `return` temprano.

---

## 7. Reglas de pruebas

Runner: Vitest. DOM con jsdom. Cobertura con `@vitest/coverage-v8`.

**Obligatorio:**

- `tests/lib/markov.test.js` cubre, como mínimo: matriz identidad, fila que no suma 1,
  valores negativos o > 1, vector inicial inválido, `π₁` verificado a mano, suma de cada `πₙ`
  igual a 1 para los cuatro pasos, no-mutación de los argumentos, y las claves exactas
  `{1, 3, 5, 10}`.
- Cada escenario del spec de OpenSpec tiene su test, con el nombre del escenario en el `it()`.
- Los tests de componentes usan `@testing-library/react` y consultan por **rol, etiqueta o texto**
  (`getByRole`, `getByLabelText`), nunca por clase CSS ni por estructura del DOM.
- Interacción con `user-event`, no con `fireEvent`.
- **Gráficas:** los componentes de Recharts se montan con `width` y `height` explícitos
  (nunca `ResponsiveContainer`, que mide 0 en jsdom). Se verifica que el SVG contiene un punto
  o barra por paso y estado, y que `toChartSeries` produce los valores correctos.
- Cobertura mínima: **90% en `src/lib/`**, **80% global**.

**Prohibido:**

- Tests que solo verifiquen que "algo se renderiza" sin comprobar valores.
- Snapshot tests como única verificación de un cálculo.
- `act()` manual envolviendo todo: RTL ya lo hace.
- Tests con `setTimeout`/esperas artificiales.
- Marcar tests como `skip` para que pase la suite.

Al terminar cualquier cambio de código, ejecuta la suite completa y reporta el resultado real.
Si un test falla, no lo comentes ni lo borres: arréglalo o explica por qué el test estaba mal.

---

## 8. Comandos

```powershell
npm.cmd install
npm.cmd run dev          # servidor de desarrollo
npm.cmd run build        # build de producción
npm.cmd run test         # vitest en modo watch
npm.cmd run test:run     # vitest una vez (CI)
npm.cmd run coverage     # vitest + cobertura
npm.cmd run typecheck    # tsc --noEmit con checkJs
openspec validate <change> --strict
openspec status --change <change>
```

No ejecutes `openspec init` (el proyecto ya está inicializado). No ejecutes
`openspec archive` sin confirmación explícita del usuario.

---

## 9. Git

- Conventional Commits en inglés, con scope: `feat(engine):`, `fix(ui):`, `test(lib):`,
  `docs(spec):`, `chore:`, `refactor:`.
- Escritura en presente, imperativo y minúscula: `add matrix validation`, no `Added matrix validation`.
- Un commit = un cambio coherente. No mezcles spec, tests y feature en el mismo commit.
- **El commit de specs va antes del primer commit de código.** Es la evidencia del proceso SDD.
- Nunca commitees `node_modules/`, `dist/`, `coverage/`, `.env` ni archivos de editor.
- No hagas `push --force` ni reescribas historia sin pedirlo.

---

## 10. Guardrails para el agente

- **Pregunta antes de:** añadir una dependencia, cambiar el contrato del motor, alterar la
  convención fila/columna, modificar `openspec/config.yaml`, o ampliar el alcance.
- **No introduzcas estado global** ni `Context` mientras el árbol tenga un solo nivel de
  consumidores. Los props bastan.
- **No inventes datos climáticos** presentados como reales. Si necesitas justificar la matriz,
  etiquétala como "valores de ejemplo" o "estimados" en la UI y en el README.
- **No redondees dentro del motor.** No uses `toFixed` fuera de `format.js`.
- **No importes React desde `src/lib/`** ni escribas en el DOM desde ahí.
- **No implementes la fase de `apply` durante un `propose`.** Son pasos separados.
- Si el usuario pide algo que contradice este archivo, señálalo en una línea y pregunta;
  no lo hagas en silencio.
- Si el usuario pide algo que no está en la spec, propón el cambio OpenSpec antes de codificar.
- Respuestas cortas. Sin resúmenes épicos de lo que acabas de hacer: di qué cambió, qué
  comandos corriste y qué resultado dieron.

---

## 11. Definición de "terminado"

Un cambio está terminado cuando:

- [ ] Existe un cambio OpenSpec con `proposal.md`, `design.md`, `specs/**/spec.md` y `tasks.md`
- [ ] `openspec validate <change> --strict` pasa sin errores
- [ ] Cada escenario del spec tiene al menos un test que lo nombra
- [ ] `npm.cmd run test:run` pasa en verde
- [ ] `npm.cmd run coverage` cumple los umbrales (90% `src/lib/`, 80% global)
- [ ] `npm.cmd run typecheck` sin errores
- [ ] La app funciona a mano: matriz válida → 4 resultados + 2 gráficas; matriz inválida → error
- [ ] `tasks.md` tiene todas las casillas marcadas
- [ ] El README refleja el estado real
- [ ] Los commits están separados por fase (spec / test / feat / docs)
