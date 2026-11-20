// @ts-check
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
 * Comparación de las probabilidades de los tres estados en cada paso.
 *
 * @param {{ steps: Record<number, number[]> }} props
 */
export default function StepsBarChart({ steps }) {
  const data = toChartSeries(steps, STATE_LABELS, [0, 0, 0]).filter(
    (point) => point.step !== 0
  )
  const stepsShown = data.map((point) => point.step).join(', ')

  return (
    <figure className="chart">
      <h3>Comparación por paso</h3>
      <p className="hint">
        Las probabilidades de los tres estados en los pasos {stepsShown}, para
        comparar dentro de cada horizonte.
      </p>
      <BarChart width={640} height={320} data={data}>
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
          <Bar key={label} dataKey={label} fill={STATE_COLORS[label]} />
        ))}
      </BarChart>
    </figure>
  )
}
