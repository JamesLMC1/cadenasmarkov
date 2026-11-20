// @ts-check
import { formatPercent } from '../lib/format.js'
import { STATE_LABELS } from '../lib/markov.js'
import { stateTheme } from '../theme.js'
import StateIcon from './StateIcon.jsx'

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
    <div className="mc-table-wrap">
      <table className="mc-table">
        <caption>Probabilidad de cada estado según el número de pasos</caption>
        <thead>
          <tr>
            <th scope="col">Paso</th>
            {STATE_LABELS.map((label) => (
              <th key={label} scope="col">
                <span className="mc-state-label">
                  <StateIcon state={label} size={14} />
                  {label}
                </span>
              </th>
            ))}
            <th scope="col">Suma</th>
          </tr>
        </thead>
        <tbody>
          {stepNumbers.map((step) => {
            const values = steps[step]
            const total = values.reduce((sum, value) => sum + value, 0)
            const maxValue = Math.max(...values)

            return (
              <tr key={step}>
                <th scope="row">{step}</th>
                {values.map((value, index) => {
                  const isMax = value === maxValue
                  const theme = stateTheme(STATE_LABELS[index])

                  return (
                    <td
                      key={STATE_LABELS[index]}
                      className={isMax ? 'mc-cell-max' : undefined}
                      style={
                        isMax
                          ? {
                              backgroundColor: theme.soft,
                              color: theme.textColor
                            }
                          : undefined
                      }
                    >
                      {formatPercent(value)}
                    </td>
                  )
                })}
                <td>{formatPercent(total)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
