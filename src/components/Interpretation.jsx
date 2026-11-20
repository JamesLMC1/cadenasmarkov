// @ts-check
import { formatDelta, formatPercent } from '../lib/format.js'
import { STATE_LABELS } from '../lib/markov.js'

/**
 * @param {number[]} values
 * @returns {number} Índice del valor más alto.
 */
function indexOfMax(values) {
  return values.reduce(
    (bestIndex, value, index) => (value > values[bestIndex] ? index : bestIndex),
    0
  )
}

/**
 * Traduce los resultados a una frase en español.
 *
 * @param {{
 *   steps: Record<number, number[]>,
 *   stationary: number[]
 * }} props
 */
export default function Interpretation({ steps, stationary }) {
  const last = steps[10]
  const stepBest = indexOfMax(last)
  const longBest = indexOfMax(stationary)

  const stepLabel = STATE_LABELS[stepBest]
  const longLabel = STATE_LABELS[longBest]
  const sameState = stepBest === longBest

  return (
    <p className="interpretation">
      En 10 pasos el estado más probable es <strong>{stepLabel}</strong> con{' '}
      {formatPercent(last[stepBest])}. A largo plazo el clima tiende a{' '}
      <strong>{longLabel}</strong> con {formatPercent(stationary[longBest])}
      {sameState
        ? `, ${formatDelta(stationary[longBest] - last[stepBest])} respecto al paso 10.`
        : '.'}
    </p>
  )
}
