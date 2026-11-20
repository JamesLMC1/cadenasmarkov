// @ts-check
import { formatPercent } from '../lib/format.js'
import { STATE_LABELS } from '../lib/markov.js'
import StateIcon from './StateIcon.jsx'

const ROW_TOLERANCE = 1e-9

/**
 * Tabla editable de la matriz de transición. Los valores llegan como texto para
 * no perder lo que el usuario está escribiendo; la conversión a número ocurre
 * en `App`.
 *
 * @param {{
 *   matrix: string[][],
 *   onChangeCell: (row: number, column: number, value: string) => void
 * }} props
 */
export default function MatrixEditor({ matrix, onChangeCell }) {
  return (
    <div className="mc-matrix">
      <table>
        <caption>
          Probabilidad de pasar de un estado (fila) a otro (columna)
        </caption>
        <thead>
          <tr>
            <th scope="col">De \ A</th>
            {STATE_LABELS.map((label) => (
              <th key={label} scope="col">
                <span className="mc-state-label">
                  <StateIcon state={label} size={16} />
                  {label}
                </span>
              </th>
            ))}
            <th scope="col">Suma</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIndex) => {
            const parsed = row.map((value) => Number.parseFloat(value))
            const hasNonNumeric = parsed.some((value) => !Number.isFinite(value))
            const total = parsed.reduce(
              (sum, value) => sum + (Number.isFinite(value) ? value : 0),
              0
            )
            const rowOk = !hasNonNumeric && Math.abs(total - 1) <= ROW_TOLERANCE

            return (
              <tr key={STATE_LABELS[rowIndex]}>
                <th scope="row">
                  <span className="mc-state-label">
                    <StateIcon state={STATE_LABELS[rowIndex]} size={16} />
                    {STATE_LABELS[rowIndex]}
                  </span>
                </th>
                {row.map((value, columnIndex) => {
                  const cellValue = Number.parseFloat(value)
                  const cellOk = Number.isFinite(cellValue)

                  return (
                    <td key={`${rowIndex}-${columnIndex}`}>
                      <input
                        className="mc-input"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        inputMode="decimal"
                        value={value}
                        aria-label={`Probabilidad de ${STATE_LABELS[rowIndex]} a ${STATE_LABELS[columnIndex]}`}
                        aria-invalid={cellOk && rowOk ? undefined : true}
                        onChange={(event) =>
                          onChangeCell(rowIndex, columnIndex, event.target.value)
                        }
                      />
                    </td>
                  )
                })}
                <td className="mc-row-total">
                  {rowOk ? (
                    <span className="mc-badge mc-badge-ok">
                      Σ {formatPercent(total)}
                    </span>
                  ) : (
                    <span className="mc-badge mc-badge-bad" role="alert">
                      {hasNonNumeric
                        ? 'Valor numérico requerido'
                        : `Debe sumar 1 (Σ ${formatPercent(total)})`}
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
