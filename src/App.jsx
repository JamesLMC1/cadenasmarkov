// @ts-check
import { useMemo, useState } from 'react'
import ErrorList from './components/ErrorList.jsx'
import InitialVector from './components/InitialVector.jsx'
import Interpretation from './components/Interpretation.jsx'
import MatrixEditor from './components/MatrixEditor.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import StationaryCard from './components/StationaryCard.jsx'
import StepsBarChart from './components/StepsBarChart.jsx'
import StepsLineChart from './components/StepsLineChart.jsx'
import {
  DEFAULT_INITIAL,
  DEFAULT_MATRIX,
  computeSteps,
  stationaryDistribution,
  validateMatrix,
  validateVector
} from './lib/markov.js'

/**
 * Convierte el texto de un campo en número. Un campo vacío o no numérico se
 * representa como NaN para que la validación lo reporte.
 *
 * @param {string} text
 * @returns {number}
 */
function toProbability(text) {
  const parsed = Number.parseFloat(text)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

/**
 * @param {number[][]} matrix
 * @returns {string[][]}
 */
function matrixToText(matrix) {
  return matrix.map((row) => row.map((value) => String(value)))
}

/**
 * @param {number[]} vector
 * @returns {string[]}
 */
function vectorToText(vector) {
  return vector.map((value) => String(value))
}

export default function App() {
  // El estado guarda el texto de los campos para no perder lo que el usuario
  // escribe (por ejemplo "0."). La conversión a número ocurre en los memos.
  const [matrixText, setMatrixText] = useState(() => matrixToText(DEFAULT_MATRIX))
  const [initialText, setInitialText] = useState(() => vectorToText(DEFAULT_INITIAL))

  const matrix = useMemo(
    () => matrixText.map((row) => row.map(toProbability)),
    [matrixText]
  )
  const initial = useMemo(() => initialText.map(toProbability), [initialText])

  const matrixValidation = useMemo(() => validateMatrix(matrix), [matrix])
  const vectorValidation = useMemo(() => validateVector(initial), [initial])
  const isValid = matrixValidation.ok && vectorValidation.ok

  const results = useMemo(
    () => (isValid ? computeSteps(initial, matrix) : null),
    [isValid, initial, matrix]
  )
  const stationary = useMemo(
    () => (isValid ? stationaryDistribution(matrix) : null),
    [isValid, matrix]
  )

  /**
   * @param {number} row
   * @param {number} column
   * @param {string} value
   */
  function handleCellChange(row, column, value) {
    setMatrixText((current) =>
      current.map((currentRow, rowIndex) =>
        rowIndex === row
          ? currentRow.map((cell, columnIndex) =>
              columnIndex === column ? value : cell
            )
          : currentRow
      )
    )
  }

  /**
   * @param {number} index
   * @param {string} value
   */
  function handleInitialChange(index, value) {
    setInitialText((current) =>
      current.map((cell, cellIndex) => (cellIndex === index ? value : cell))
    )
  }

  function handleReset() {
    setMatrixText(matrixToText(DEFAULT_MATRIX))
    setInitialText(vectorToText(DEFAULT_INITIAL))
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>MarkovClima</h1>
        <p>
          Predicción del clima con una cadena de Markov de tres estados. Ajusta la
          matriz de transición y el clima de hoy para ver cómo evolucionan las
          probabilidades.
        </p>
      </header>

      <div className="layout">
        <section className="panel" aria-labelledby="matrix-title">
          <h2 id="matrix-title">Matriz de transición</h2>
          <MatrixEditor matrix={matrixText} onChangeCell={handleCellChange} />
        </section>

        <section className="panel" aria-labelledby="initial-title">
          <h2 id="initial-title">Clima de hoy</h2>
          <InitialVector initial={initialText} onChangeValue={handleInitialChange} />
          <button type="button" className="button-secondary" onClick={handleReset}>
            Restablecer valores de ejemplo
          </button>
        </section>
      </div>

      <section className="panel" aria-labelledby="results-title">
        <h2 id="results-title">Resultados</h2>
        {results && stationary ? (
          <>
            <ResultsTable steps={results} />
            <div className="charts">
              <StepsLineChart steps={results} initial={initial} />
              <StepsBarChart steps={results} />
            </div>
            <StationaryCard stationary={stationary} />
            <Interpretation steps={results} stationary={stationary} />
          </>
        ) : (
          <ErrorList message="No hay resultados: corrige los valores marcados para calcular." />
        )}
      </section>
    </main>
  )
}
