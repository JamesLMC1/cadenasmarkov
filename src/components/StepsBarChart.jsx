// @ts-check
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import useReducedMotion from '../hooks/useReducedMotion.js'
import { formatPercent } from '../lib/format.js'
import { STATE_LABELS } from '../lib/markov.js'
import { toChartSeries } from '../lib/series.js'
import { stateTheme } from '../theme.js'
import ChartTooltip from './ChartTooltip.jsx'

const CHART_WIDTH = 640
const CHART_HEIGHT = 320
const MIN_LABEL_VALUE = 0.06

/**
 * Etiqueta de porcentaje sobre cada barra, solo si hay espacio suficiente.
 *
 * @param {string} color
 * @returns {(props: any) => any}
 */
function makeBarLabel(color) {
  return (props) => {
    const value = Number(props.value)

    if (!Number.isFinite(value) || value < MIN_LABEL_VALUE) {
      return null
    }

    return (
      <text
        x={props.x + props.width / 2}
        y={props.y - 6}
        textAnchor="middle"
        fill={color}
        fontSize={10}
        fontWeight={600}
      >
        {formatPercent(value, 0)}
      </text>
    )
  }
}

/**
 * Comparación de las probabilidades de los tres estados en cada paso.
 *
 * @param {{ steps: Record<number, number[]> }} props
 */
export default function StepsBarChart({ steps }) {
  const reducedMotion = useReducedMotion()
  const canAnimate = !reducedMotion && import.meta.env.MODE !== 'test'
  const data = toChartSeries(steps, STATE_LABELS, [0, 0, 0]).filter(
    (point) => point.step !== 0
  )
  const stepsShown = data.map((point) => point.step).join(', ')
  const chartLabel = `Gráfica de barras que compara la probabilidad de Soleado, Nublado y Lluvioso en los pasos ${stepsShown}`

  return (
    <figure className="mc-chart">
      <h3>Comparación por paso</h3>
      <p className="mc-hint">
        Las probabilidades de los tres estados en los pasos {stepsShown}, para
        comparar dentro de cada horizonte.
      </p>
      <div className="mc-chart-canvas" role="img" aria-label={chartLabel}>
        <BarChart
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          data={data}
          margin={{ top: 16, right: 8, bottom: 8, left: 0 }}
          barGap={2}
          barCategoryGap="26%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eceafa" vertical={false} />
          <XAxis
            dataKey="step"
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
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.06)' }} />
          <Legend
            verticalAlign="top"
            align="right"
            height={24}
            iconType="square"
            wrapperStyle={{ fontSize: 12 }}
          />
          {STATE_LABELS.map((label) => {
            const theme = stateTheme(label)

            return (
              <Bar
                key={label}
                dataKey={label}
                fill={theme.color}
                radius={[4, 4, 0, 0]}
                isAnimationActive={canAnimate}
                animationDuration={600}
              >
                <LabelList dataKey={label} content={makeBarLabel(theme.textColor)} />
              </Bar>
            )
          })}
        </BarChart>
      </div>
    </figure>
  )
}
