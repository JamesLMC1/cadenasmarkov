// @ts-check
import { formatDelta, formatPercent } from '../lib/format.js'
import { STATE_LABELS } from '../lib/markov.js'
import { indexOfMax } from '../lib/stats.js'
import { stateTheme } from '../theme.js'
import StateIcon from './StateIcon.jsx'

/**
 * Cuatro tarjetas de resumen a 10 pasos, con la diferencia respecto al clima de
 * hoy en puntos porcentuales.
 *
 * @param {{
 *   steps: Record<number, number[]>,
 *   initial: number[]
 * }} props
 */
export default function KpiGrid({ steps, initial }) {
  const last = steps[10]
  const dominant = indexOfMax(last)
  const dominantLabel = STATE_LABELS[dominant]

  return (
    <section className="mc-kpi-section" aria-labelledby="kpi-title">
      <h3 id="kpi-title">Resumen a 10 pasos</h3>
      <ul className="mc-kpi-grid">
        <li className="mc-kpi mc-kpi-feature">
          <span className="mc-kpi-label">Estado más probable</span>
          <span className="mc-kpi-state">
            <StateIcon state={dominantLabel} size={28} />
            {dominantLabel}
          </span>
          <span className="mc-kpi-value">{formatPercent(last[dominant])}</span>
          <span className="mc-kpi-delta">
            {formatDelta(last[dominant] - initial[dominant])} respecto a hoy
          </span>
        </li>

        {STATE_LABELS.map((label, index) => {
          const theme = stateTheme(label)

          return (
            <li className="mc-kpi" key={label}>
              <span className="mc-kpi-label">
                <StateIcon state={label} size={14} />
                {label}
              </span>
              <span className="mc-kpi-value">{formatPercent(last[index])}</span>
              <span className="mc-kpi-bar" aria-hidden="true">
                <span
                  style={{
                    width: formatPercent(last[index], 1),
                    backgroundColor: theme.color
                  }}
                />
              </span>
              <span className="mc-kpi-delta">
                {formatDelta(last[index] - initial[index])} respecto a hoy
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
