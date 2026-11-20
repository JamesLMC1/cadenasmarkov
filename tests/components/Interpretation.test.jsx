// @ts-check
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Interpretation from '../../src/components/Interpretation.jsx'
import {
  DEFAULT_INITIAL,
  DEFAULT_MATRIX,
  computeSteps,
  stationaryDistribution
} from '../../src/lib/markov.js'

const STEPS = computeSteps(DEFAULT_INITIAL, DEFAULT_MATRIX)
const STATIONARY = stationaryDistribution(DEFAULT_MATRIX)

describe('Interpretation', () => {
  it('menciona el paso 10 y el largo plazo', () => {
    render(<Interpretation steps={STEPS} stationary={STATIONARY} />)

    expect(screen.getByText(/En 10 pasos/)).toBeInTheDocument()
    expect(screen.getByText(/A largo plazo/)).toBeInTheDocument()
  })

  it('nombra el estado más probable en 10 pasos con su porcentaje', () => {
    render(<Interpretation steps={STEPS} stationary={STATIONARY} />)

    expect(screen.getAllByText('Soleado').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/46\.3%/).length).toBeGreaterThan(0)
  })

  it('cambia la frase cuando cambia la matriz', () => {
    const otherMatrix = [
      [0.1, 0.8, 0.1],
      [0.1, 0.8, 0.1],
      [0.1, 0.8, 0.1]
    ]
    const otherSteps = computeSteps(DEFAULT_INITIAL, otherMatrix)
    const otherStationary = stationaryDistribution(otherMatrix)

    const { container: first } = render(
      <Interpretation steps={STEPS} stationary={STATIONARY} />
    )
    const firstText = first.textContent

    const { container: second } = render(
      <Interpretation steps={otherSteps} stationary={otherStationary} />
    )

    expect(second.textContent).not.toBe(firstText)
    expect(second.textContent).toContain('Nublado')
  })
})
