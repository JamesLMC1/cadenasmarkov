// @ts-check
import { formatPercent } from '../lib/format.js'
import { STATE_COLORS } from '../theme.js'
import StateIcon from './StateIcon.jsx'

/**
 * Tooltip compartido por las dos gráficas: muestra los tres estados con su
 * icono y su porcentaje en el paso señalado.
 *
 * @param {{ active?: boolean, label?: string | number, payload?: any[] }} props
 */
export default function ChartTooltip({ active, label, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const entries = payload.filter((entry) => STATE_COLORS[entry.dataKey])

  if (entries.length === 0) {
    return null
  }

  return (
    <div className="mc-tooltip">
      <p className="mc-tooltip-title">Paso {label}</p>
      {entries.map((entry) => (
        <div className="mc-tooltip-row" key={entry.dataKey}>
          <span className="mc-tooltip-name">
            <StateIcon state={entry.dataKey} size={14} />
            {entry.dataKey}
          </span>
          <span className="mc-tooltip-value">
            {formatPercent(Number(entry.value))}
          </span>
        </div>
      ))}
    </div>
  )
}
