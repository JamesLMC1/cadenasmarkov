// @ts-check
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StepsLineChart from '../../src/components/StepsLineChart.jsx'
import {
  DEFAULT_INITIAL,
  DEFAULT_MATRIX,
  computeSteps
} from '../../src/lib/markov.js'

const STEPS = computeSteps(DEFAULT_INITIAL, DEFAULT_MATRIX)

describe('StepsLineChart', () => {
  it('tiene un título visible', () => {
    render(<StepsLineChart steps={STEPS} initial={DEFAULT_INITIAL} />)

    expect(
      screen.getByRole('heading', { name: 'Evolución de la probabilidad' })
    ).toBeInTheDocument()
  })

  it('describe los pasos que muestra, incluido el paso 0', () => {
    render(<StepsLineChart steps={STEPS} initial={DEFAULT_INITIAL} />)

    expect(screen.getByText(/pasos 0, 1, 3, 5, 10/)).toBeInTheDocument()
  })

  it('identifica las tres series por su estado', () => {
    render(<StepsLineChart steps={STEPS} initial={DEFAULT_INITIAL} />)

    expect(screen.getAllByText(/^(Soleado|Nublado|Lluvioso)$/)).toHaveLength(3)
  })

  it('renderiza un svg con medidas explícitas', () => {
    const { container } = render(
      <StepsLineChart steps={STEPS} initial={DEFAULT_INITIAL} />
    )

    const widths = Array.from(container.querySelectorAll('svg')).map((svg) =>
      svg.getAttribute('width')
    )

    expect(widths).toContain('640')
  })
})
