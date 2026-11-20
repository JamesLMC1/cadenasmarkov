// @ts-check
import { formatPercent } from '../lib/format.js'
import { STATE_LABELS } from '../lib/markov.js'

/**
 * Tabla de probabilidades: una fila por paso, una columna por estado.
 *
 * @param {{ steps: Record<number, number[]> }} props
 */
export default function ResultsTable({ steps }) {
  const stepNumbers = Object.keys(steps)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <div className="results-table">
      <table>
        <caption>Probabilidad de cada estado según el número de pasos</caption>
        <thead>
          <tr>
            <th scope="col">Paso</th>
            {STATE_LABELS.map((label) => (
              <th key={label} scope="col">
                {label}
              </th>
            ))}
            <th scope="col">Suma</th>
          </tr>
        </thead>
        <tbody>
          {stepNumbers.map((step) => {
            const values = steps[step]
            const total = values.reduce((sum, value) => sum + value, 0)

            return (
              <tr key={step}>
                <th scope="row">{step}</th>
                {values.map((value, index) => (
                  <td key={STATE_LABELS[index]}>{formatPercent(value)}</td>
                ))}
                <td className="row-total">{formatPercent(total)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
