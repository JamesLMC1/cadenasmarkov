// @ts-check
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import useReducedMotion from '../hooks/useReducedMotion.js'
import { formatPercent } from '../lib/format.js'
import { STATE_LABELS } from '../lib/markov.js'
import { toChartSeries } from '../lib/series.js'
import { STATE_COLORS, STATE_TEXT_COLORS, stateTheme } from '../theme.js'
import ChartTooltip from './ChartTooltip.jsx'

const CHART_WIDTH = 640
const CHART_HEIGHT = 320

/**
 * Etiqueta directa al final de una serie; se omite en el resto de los puntos.
 *
 * @param {string} label
 * @param {string} color
 * @param {number} lastIndex
 * @returns {(props: any) => any}
 */
function makeEndLabel(label, color, lastIndex) {
  return (props) => {
    if (props.index !== lastIndex) {
      return null
    }

    return (
      <text
        x={props.x + 8}
        y={props.y}
        fill={color}
        fontSize={11}
        fontWeight={600}
        dominantBaseline="middle"
      >
        {`${label} ${formatPercent(Number(props.value), 0)}`}
      </text>
    )
  }
}

/**
 * Evolución de la probabilidad de cada estado a lo largo de los pasos.
 * Usa medidas explícitas para que el SVG también se renderice en pruebas.
 *
 * @param {{
 *   steps: Record<number, number[]>,
 *   initial: number[],
 *   stationary?: number[]
 * }} props
 */
export default function StepsLineChart({ steps, initial, stationary }) {
  const reducedMotion = useReducedMotion()
  const canAnimate = !reducedMotion && import.meta.env.MODE !== 'test'
  const data = toChartSeries(steps, STATE_LABELS, initial)
  const lastIndex = data.length - 1
  const stepsShown = data.map((point) => point.step).join(', ')
  const chartLabel = `Gráfica de evolución de la probabilidad de Soleado, Nublado y Lluvioso en los pasos ${stepsShown}`

  return (
    <figure className="mc-chart">
      <h3>Evolución de la probabilidad</h3>
      <p className="mc-hint">
        Probabilidad de cada estado en los pasos {stepsShown}. El paso 0 es el
        clima de hoy y las líneas punteadas marcan el largo plazo.
      </p>
      <div className="mc-chart-canvas" role="img" aria-label={chartLabel}>
        <LineChart
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          data={data}
          margin={{ top: 8, right: 64, bottom: 8, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eceafa" />
          <XAxis
            type="number"
            dataKey="step"
            domain={[0, 10]}
            ticks={[0, 1, 3, 5, 10]}
            allowDecimals={false}
            height={44}
            tick={{ fontSize: 12 }}
            label={{
              value: 'Paso (días)',
              position: 'insideBottom',
              offset: -6,
              style: { fontSize: 12 }
            }}
          />
          <YAxis
            domain={[0, 1]}
            ticks={[0, 0.25, 0.5, 0.75, 1]}
            width={58}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatPercent(Number(value), 0)}
            label={{
              value: 'Probabilidad (%)',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 12, textAnchor: 'middle' }
            }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#d7d4ea' }} />
          <Legend
            verticalAlign="top"
            align="right"
            height={24}
            iconType="plainline"
            wrapperStyle={{ fontSize: 12 }}
          />
          {stationary?.map((value, index) => {
            const label = STATE_LABELS[index]

            return (
              <ReferenceLine
                key={`reference-${label}`}
                y={value}
                stroke={STATE_COLORS[label]}
                strokeDasharray="4 4"
                strokeOpacity={0.55}
              />
            )
          })}
          {STATE_LABELS.map((label) => {
            const theme = stateTheme(label)

            return (
              <Line
                key={label}
                type="monotone"
                dataKey={label}
                stroke={theme.color}
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2, fill: '#ffffff' }}
                activeDot={{ r: 5 }}
                isAnimationActive={canAnimate}
                animationDuration={600}
                label={makeEndLabel(label, theme.textColor, lastIndex)}
              />
            )
          })}
        </LineChart>
      </div>
    </figure>
  )
}
