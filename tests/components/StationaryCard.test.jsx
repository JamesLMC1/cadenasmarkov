// @ts-check
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StationaryCard from '../../src/components/StationaryCard.jsx'
import {
  DEFAULT_MATRIX,
  stationaryDistribution
} from '../../src/lib/markov.js'

const STATIONARY = stationaryDistribution(DEFAULT_MATRIX)

describe('StationaryCard', () => {
  it('explica que es el comportamiento a largo plazo', () => {
    render(<StationaryCard stationary={STATIONARY} />)

    expect(
      screen.getByRole('heading', { name: 'Comportamiento a largo plazo' })
    ).toBeInTheDocument()
    expect(screen.getByText(/crece sin límite/)).toBeInTheDocument()
  })

  it('muestra los tres valores y suman 100% con margen de 0.1', () => {
    render(<StationaryCard stationary={STATIONARY} />)

    const list = screen.getByRole('list')
    const items = within(list).getAllByRole('listitem')
    const total = items.reduce(
      (sum, item) =>
        sum + Number.parseFloat(String(item.querySelector('strong')?.textContent)),
      0
    )

    expect(items).toHaveLength(3)
    expect(Math.abs(total - 100)).toBeLessThanOrEqual(0.1)
  })
})
