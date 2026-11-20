// @ts-check
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../../src/App.jsx'

describe('App', () => {
  it('actualiza la suma de la distribución inicial al cambiar un valor', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByLabelText('Soleado')
    await user.clear(input)
    await user.type(input, '0.6')

    expect(screen.getByText('110.0%')).toBeInTheDocument()
    expect(screen.getByText(/debe sumar 1/)).toBeInTheDocument()
  })

  it('muestra el error de fila y lo retira al corregir la matriz', async () => {
    const user = userEvent.setup()
    render(<App />)

    const cell = screen.getByLabelText('Probabilidad de Soleado a Lluvioso')
    await user.clear(cell)
    await user.type(cell, '0.5')

    expect(screen.getByText(/Debe sumar 1/)).toBeInTheDocument()

    await user.clear(cell)
    await user.type(cell, '0.1')

    expect(screen.queryByText(/Debe sumar 1/)).not.toBeInTheDocument()
  })

  it('oculta los resultados cuando la entrada deja de ser válida', async () => {
    const user = userEvent.setup()
    render(<App />)

    const resultsTable = () =>
      screen.queryByRole('table', {
        name: 'Probabilidad de cada estado según el número de pasos'
      })

    expect(resultsTable()).toBeInTheDocument()

    const cell = screen.getByLabelText('Probabilidad de Nublado a Soleado')
    await user.clear(cell)
    await user.type(cell, '0.9')

    expect(resultsTable()).not.toBeInTheDocument()
    expect(screen.getByText(/No hay resultados/)).toBeInTheDocument()
  })

  it('restablece la matriz y la distribución inicial a los valores de ejemplo', async () => {
    const user = userEvent.setup()
    render(<App />)

    const cell = screen.getByLabelText('Probabilidad de Lluvioso a Lluvioso')
    await user.clear(cell)
    await user.type(cell, '0.9')

    await user.click(
      screen.getByRole('button', { name: 'Restablecer valores de ejemplo' })
    )

    expect(screen.getByLabelText('Probabilidad de Lluvioso a Lluvioso')).toHaveValue(
      0.5
    )
    expect(
      within(screen.getByRole('region', { name: 'Clima de hoy' })).getByText('100.0%')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('table', {
        name: 'Probabilidad de cada estado según el número de pasos'
      })
    ).toBeInTheDocument()
  })
})
