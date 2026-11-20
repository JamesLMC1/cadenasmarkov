// @ts-check
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../../src/App.jsx'

const RESULTS_TABLE = {
  name: 'Probabilidad de cada estado según el número de pasos'
}

describe('App · recorrido completo', () => {
  it('muestra cuatro pasos y dos gráficas con una matriz válida', () => {
    render(<App />)

    expect(screen.getByRole('table', RESULTS_TABLE)).toBeInTheDocument()

    for (const step of ['1', '3', '5', '10']) {
      expect(screen.getByRole('rowheader', { name: step })).toBeInTheDocument()
    }

    expect(
      screen.getByRole('heading', { name: 'Evolución de la probabilidad' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Comparación por paso' })
    ).toBeInTheDocument()
  })

  it('oculta resultados y muestra el error cuando una fila deja de sumar 1, y se recupera al corregir', async () => {
    const user = userEvent.setup()
    render(<App />)

    const cell = screen.getByLabelText('Probabilidad de Nublado a Lluvioso')

    await user.clear(cell)
    await user.type(cell, '0.9')

    expect(screen.getByText(/Debe sumar 1/)).toBeInTheDocument()
    expect(screen.queryByRole('table', RESULTS_TABLE)).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Evolución de la probabilidad' })
    ).not.toBeInTheDocument()
    expect(screen.getByText(/No hay resultados/)).toBeInTheDocument()

    await user.clear(cell)
    await user.type(cell, '0.2')

    expect(screen.queryByText(/Debe sumar 1/)).not.toBeInTheDocument()
    expect(screen.getByRole('table', RESULTS_TABLE)).toBeInTheDocument()
  })
})
