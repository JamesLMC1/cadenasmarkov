// @ts-check
import { formatPercent } from '../lib/format.js'
import { STATE_LABELS } from '../lib/markov.js'
import { stateTheme } from '../theme.js'
import StateIcon from './StateIcon.jsx'

/**
 * Distribución estacionaria: el comportamiento del clima a largo plazo.
 *
 * @param {{ stationary: number[] }} props
 */
export default function StationaryCard({ stationary }) {
  return (
    <section className="mc-stationary" aria-labelledby="stationary-title">
      <h3 id="stationary-title">Comportamiento a largo plazo</h3>
      <p className="mc-hint">
        Distribución estacionaria: cuando el número de días crece sin límite, el
        clima tiende a estabilizarse en estos valores. No corresponde a un paso
        concreto.
      </p>
      <ul className="mc-stationary-list">
        {stationary.map((value, index) => {
          const label = STATE_LABELS[index]
          const theme = stateTheme(label)

          return (
            <li className="mc-stationary-item" key={label}>
              <span className="mc-stationary-name">
                <StateIcon state={label} size={16} />
                {label}
              </span>
              <span className="mc-stationary-track" aria-hidden="true">
                <span
                  className="mc-stationary-fill"
                  style={{
                    width: formatPercent(value, 1),
                    backgroundColor: theme.color
                  }}
                />
              </span>
              <strong className="mc-stationary-value">
                {formatPercent(value)}
              </strong>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
