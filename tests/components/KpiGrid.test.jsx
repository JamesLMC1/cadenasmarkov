// @ts-check
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import KpiGrid from '../../src/components/KpiGrid.jsx'

describe('KpiGrid', () => {
  it('muestra cuatro tarjetas de resumen', () => {
    render(
      <KpiGrid
        steps={{ 10: [0.6, 0.3, 0.1] }}
        initial={[0.5, 0.3, 0.2]}
      />
    )

    expect(screen.getByRole('list').children).toHaveLength(4)
    expect(
      screen.getByRole('heading', { name: 'Resumen a 10 pasos' })
    ).toBeInTheDocument()
  })

  it('destaca el estado más probable con su porcentaje', () => {
    render(
      <KpiGrid
        steps={{ 10: [0.6, 0.3, 0.1] }}
        initial={[0.5, 0.3, 0.2]}
      />
    )

    const cards = screen.getByRole('list').children
    expect(cards[0]).toHaveTextContent('Estado más probable')
    expect(cards[0]).toHaveTextContent('Soleado')
    expect(cards[0]).toHaveTextContent('60.0%')
  })

  it('muestra la diferencia con signo respecto al clima de hoy', () => {
    render(
      <KpiGrid
        steps={{ 10: [0.6, 0.3, 0.1] }}
        initial={[0.5, 0.3, 0.2]}
      />
    )

    // La tarjeta del estado más probable repite el valor de Soleado.
    expect(screen.getAllByText(/\+10\.0 pp respecto a hoy/)).toHaveLength(2)
    expect(screen.getAllByText(/-10\.0 pp respecto a hoy/)).toHaveLength(1)
  })

  it('indica cuando la diferencia es prácticamente nula', () => {
    render(
      <KpiGrid
        steps={{ 10: [0.5, 0.3, 0.2] }}
        initial={[0.5, 0.3, 0.2]}
      />
    )

    expect(screen.getAllByText(/±0\.0 pp respecto a hoy/)).toHaveLength(4)
  })
})
