// @ts-check
import { formatPercent } from '../lib/format.js'
import { STATE_LABELS } from '../lib/markov.js'
import StateIcon from './StateIcon.jsx'

const SUM_TOLERANCE = 1e-9

/**
 * Campos de la distribución inicial (el clima de hoy) con la suma actual.
 *
 * @param {{
 *   initial: string[],
 *   onChangeValue: (index: number, value: string) => void
 * }} props
 */
export default function InitialVector({ initial, onChangeValue }) {
  const parsed = initial.map((value) => Number.parseFloat(value))
  const hasNonNumeric = parsed.some((value) => !Number.isFinite(value))
  const total = parsed.reduce(
    (sum, value) => sum + (Number.isFinite(value) ? value : 0),
    0
  )
  const sumOk = !hasNonNumeric && Math.abs(total - 1) <= SUM_TOLERANCE

  return (
    <div className="mc-initial">
      <div className="mc-field-list">
        {initial.map((value, index) => (
          <label className="mc-field" key={STATE_LABELS[index]}>
            <span className="mc-field-label">
              <StateIcon state={STATE_LABELS[index]} size={14} />
              {STATE_LABELS[index]}
            </span>
            <input
              className="mc-input"
              type="number"
              min="0"
              max="1"
              step="0.01"
              inputMode="decimal"
              value={value}
              aria-invalid={sumOk ? undefined : true}
              onChange={(event) => onChangeValue(index, event.target.value)}
            />
          </label>
        ))}
      </div>

      <p className="mc-sum">
        Suma actual: <strong>{hasNonNumeric ? '—' : formatPercent(total)}</strong>
      </p>

      {!sumOk && (
        <p role="alert" className="mc-error">
          {hasNonNumeric
            ? 'Todos los valores deben ser numéricos.'
            : `La distribución inicial debe sumar 1 (suma actual: ${formatPercent(total)}).`}
        </p>
      )}
    </div>
  )
}
