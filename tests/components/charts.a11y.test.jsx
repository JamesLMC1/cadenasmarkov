// @ts-check
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StepsBarChart from '../../src/components/StepsBarChart.jsx'
import StepsLineChart from '../../src/components/StepsLineChart.jsx'
import {
  DEFAULT_INITIAL,
  DEFAULT_MATRIX,
  computeSteps,
  stationaryDistribution
} from '../../src/lib/markov.js'

const STEPS = computeSteps(DEFAULT_INITIAL, DEFAULT_MATRIX)
const STATIONARY = stationaryDistribution(DEFAULT_MATRIX)

describe('Gráfica de evolución · accesibilidad y referencias', () => {
  it('expone un nombre accesible', () => {
    render(
      <StepsLineChart
        steps={STEPS}
        initial={DEFAULT_INITIAL}
        stationary={STATIONARY}
      />
    )

    expect(
      screen.getByRole('img', { name: /Gráfica de evolución/ })
    ).toBeInTheDocument()
  })

  it('dibuja una línea punteada por estado con la estacionaria', () => {
    const { container } = render(
      <StepsLineChart
        steps={STEPS}
        initial={DEFAULT_INITIAL}
        stationary={STATIONARY}
      />
    )

    const dashed = container.querySelectorAll('line[stroke-dasharray="4 4"]')
    expect(dashed).toHaveLength(3)
  })

  it('etiqueta el final de cada serie con el nombre del estado', () => {
    const { container } = render(
      <StepsLineChart
        steps={STEPS}
        initial={DEFAULT_INITIAL}
        stationary={STATIONARY}
      />
    )

    const labels = Array.from(container.querySelectorAll('text')).filter((node) =>
      /^(Soleado|Nublado|Lluvioso) \d+%$/.test(node.textContent ?? '')
    )

    expect(labels).toHaveLength(3)
  })
})

describe('Gráfica comparativa · accesibilidad y valores', () => {
  it('expone un nombre accesible', () => {
    render(<StepsBarChart steps={STEPS} />)

    expect(
      screen.getByRole('img', { name: /Gráfica de barras/ })
    ).toBeInTheDocument()
  })

  it('escribe el porcentaje sobre las barras', () => {
    render(<StepsBarChart steps={STEPS} />)

    expect(screen.getAllByText('46%').length).toBeGreaterThan(0)
  })
})
