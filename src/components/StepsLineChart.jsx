// @ts-check
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { formatPercent } from '../lib/format.js'
import { STATE_LABELS } from '../lib/markov.js'
import { toChartSeries } from '../lib/series.js'

/** @type {Record<string, string>} */
const STATE_COLORS = {
  Soleado: '#d97706',
  Nublado: '#64748b',
  Lluvioso: '#2563eb'
}

/**
 * Evolución de la probabilidad de cada estado a lo largo de los pasos.
 * Usa medidas explícitas para que el SVG también se renderice en pruebas.
 *
 * @param {{
 *   steps: Record<number, number[]>,
 *   initial: number[]
 * }} props
 */
export default function StepsLineChart({ steps, initial }) {
  const data = toChartSeries(steps, STATE_LABELS, initial)
  const stepsShown = data.map((point) => point.step).join(', ')

  return (
    <figure className="chart">
      <h3>Evolución de la probabilidad</h3>
      <p className="hint">
        Probabilidad de cada estado en los pasos {stepsShown}. El paso 0 es el
        clima de hoy.
      </p>
      <LineChart width={640} height={320} data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ec" />
        <XAxis
          dataKey="step"
          label={{ value: 'Paso (días)', position: 'insideBottom', offset: -4 }}
        />
        <YAxis
          domain={[0, 1]}
          tickFormatter={(value) => formatPercent(Number(value), 0)}
          label={{ value: 'Probabilidad', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip formatter={(value) => formatPercent(Number(value))} />
        <Legend />
        {STATE_LABELS.map((label) => (
          <Line
            key={label}
            type="monotone"
            dataKey={label}
            stroke={STATE_COLORS[label]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </figure>
  )
}
