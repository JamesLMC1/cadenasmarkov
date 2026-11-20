// @ts-check
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ResultsTable from '../../src/components/ResultsTable.jsx'
import {
  DEFAULT_INITIAL,
  DEFAULT_MATRIX,
  computeSteps
} from '../../src/lib/markov.js'

const STEPS = computeSteps(DEFAULT_INITIAL, DEFAULT_MATRIX)

describe('ResultsTable', () => {
  it('muestra los pasos 1, 3, 5 y 10', () => {
    render(<ResultsTable steps={STEPS} />)

    for (const step of ['1', '3', '5', '10']) {
      expect(screen.getByRole('rowheader', { name: step })).toBeInTheDocument()
    }
  })

  it('muestra los tres estados como columnas', () => {
    render(<ResultsTable steps={STEPS} />)

    expect(screen.getByRole('columnheader', { name: 'Soleado' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Nublado' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Lluvioso' })).toBeInTheDocument()
  })

  it('muestra cada probabilidad con un decimal', () => {
    render(<ResultsTable steps={STEPS} />)

    const firstRow = screen.getByRole('rowheader', { name: '1' }).closest('tr')
    const cells = within(/** @type {HTMLElement} */ (firstRow)).getAllByRole('cell')

    for (const cell of cells) {
      expect(cell.textContent).toMatch(/^\d+\.\d%$/)
    }
  })

  it('hace que cada paso sume 100% con margen de 0.1', () => {
    render(<ResultsTable steps={STEPS} />)

    const bodyRows = screen.getAllByRole('row').slice(1)

    for (const row of bodyRows) {
      const cells = within(row).getAllByRole('cell')
      const total = cells
        .slice(0, 3)
        .reduce((sum, cell) => sum + Number.parseFloat(String(cell.textContent)), 0)

      expect(Math.abs(total - 100)).toBeLessThanOrEqual(0.1)
    }
  })
})
