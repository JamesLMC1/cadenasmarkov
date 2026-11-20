// @ts-check
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StepsBarChart from '../../src/components/StepsBarChart.jsx'
import {
  DEFAULT_INITIAL,
  DEFAULT_MATRIX,
  computeSteps
} from '../../src/lib/markov.js'

const STEPS = computeSteps(DEFAULT_INITIAL, DEFAULT_MATRIX)

describe('StepsBarChart', () => {
  it('tiene un título visible', () => {
    render(<StepsBarChart steps={STEPS} />)

    expect(
      screen.getByRole('heading', { name: 'Comparación por paso' })
    ).toBeInTheDocument()
  })

  it('usa los mismos pasos que la tabla, sin el paso 0', () => {
    render(<StepsBarChart steps={STEPS} />)

    expect(screen.getByText(/en los pasos 1, 3, 5, 10/)).toBeInTheDocument()
    expect(screen.queryByText(/pasos 0, 1, 3, 5, 10/)).not.toBeInTheDocument()
  })

  it('identifica las tres series por su estado', () => {
    render(<StepsBarChart steps={STEPS} />)

    expect(screen.getAllByText(/^(Soleado|Nublado|Lluvioso)$/)).toHaveLength(3)
  })

  it('renderiza un svg con medidas explícitas', () => {
    const { container } = render(<StepsBarChart steps={STEPS} />)

    const widths = Array.from(container.querySelectorAll('svg')).map((svg) =>
      svg.getAttribute('width')
    )

    expect(widths).toContain('640')
  })
})
