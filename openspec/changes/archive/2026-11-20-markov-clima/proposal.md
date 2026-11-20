# Proposal: MarkovClima

## Why

Predecir la evolución de un fenómeno con estados discretos (el clima) exige multiplicar
repetidamente una matriz de transición, algo que a mano es lento, propenso a errores y no
permite comparar escenarios. No existe en el proyecto ninguna herramienta que haga ese cálculo,
lo explique y lo muestre visualmente.

Esta aplicación resuelve el caso concreto de una cadena de Markov de 3 estados sobre el clima,
que es además el caso de estudio con el que se puede verificar el modelo a mano.

## What Changes

- Se crea una aplicación web de una sola página (sin backend) para predecir el clima con una
  cadena de Markov de 3 estados: `Soleado`, `Nublado`, `Lluvioso`.
- Se implementa un motor de cálculo puro, independiente de la interfaz, que valida la matriz y
  calcula `πₙ = π₀ · Pⁿ` para `n ∈ {1, 3, 5, 10}` y la distribución estacionaria.
- Se ofrece un editor de la matriz de transición 3×3 y de la distribución inicial, con
  validación en vivo y mensajes de error en español.
- Se presentan los resultados como tabla de probabilidades, gráfica de líneas de la evolución,
  gráfica de barras comparativa y un resumen en lenguaje natural.
- Se añaden pruebas automatizadas del motor y de los componentes, con umbrales de cobertura.
- El proyecto se gestiona con OpenSpec (este cambio) y control de versiones Git.

Fuera de alcance: backend, persistencia, autenticación, más de 3 estados, cadenas de orden
superior, datos climáticos reales o scraping, internacionalización y temas visuales.

## Capabilities

### New Capabilities

- `markov-engine`: validación de la matriz estocástica y del vector inicial, y cálculo de las
  distribuciones de probabilidad en n pasos y en el límite estacionario. Es la capa pura,
  sin dependencias de interfaz.
- `transition-configuration`: edición de la matriz de transición y de la distribución inicial
  desde la interfaz, con validación en vivo y retroalimentación de errores.
- `prediction-visualization`: presentación de resultados en 1, 3, 5 y 10 pasos mediante tabla,
  gráficas de líneas y de barras, distribución estacionaria e interpretación en lenguaje natural.

### Modified Capabilities

Ninguna. `openspec/specs/` está vacío: este cambio introduce las tres capacidades iniciales.

## Impact

- **Código nuevo:** `src/lib/` (motor y formateo), `src/components/` (interfaz), `src/App.jsx`,
  `tests/`.
- **Dependencias:** React 19, Vite, Recharts (solo presentación) y Vitest con Testing Library
  (solo desarrollo). Ninguna dependencia en el motor de cálculo.
- **Sin impacto** en sistemas externos: la aplicación no consume red ni almacena datos.
- **Riesgo principal:** que el redondeo en la presentación rompa el invariante de que cada
  distribución suma 1; se mitiga manteniendo el cálculo sin redondeo y redondeando solo al
  formatear.
