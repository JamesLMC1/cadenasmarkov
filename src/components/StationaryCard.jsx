// @ts-check
import { formatPercent } from '../lib/format.js'
import { STATE_LABELS } from '../lib/markov.js'

/**
 * Distribución estacionaria: el comportamiento del clima a largo plazo.
 *
 * @param {{ stationary: number[] }} props
 */
export default function StationaryCard({ stationary }) {
  return (
    <section className="stationary-card" aria-labelledby="stationary-title">
      <h3 id="stationary-title">Comportamiento a largo plazo</h3>
      <p className="hint">
        Distribución estacionaria: cuando el número de días crece sin límite, el
        clima tiende a estabilizarse en estos valores. No corresponde a un paso
        concreto.
      </p>
      <ul className="stationary-list">
        {stationary.map((value, index) => (
          <li key={STATE_LABELS[index]}>
            <span>{STATE_LABELS[index]}</span>
            <strong>{formatPercent(value)}</strong>
          </li>
        ))}
      </ul>
    </section>
  )
}
