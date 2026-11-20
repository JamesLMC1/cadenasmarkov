// @ts-check
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import MatrixEditor from '../../src/components/MatrixEditor.jsx'
import { DEFAULT_MATRIX } from '../../src/lib/markov.js'

const VALID_MATRIX = DEFAULT_MATRIX.map((row) => row.map((value) => String(value)))

describe('MatrixEditor', () => {
  it('muestra nueve campos con etiqueta de origen y destino', () => {
    render(<MatrixEditor matrix={VALID_MATRIX} onChangeCell={() => {}} />)

    expect(screen.getAllByRole('spinbutton')).toHaveLength(9)
    expect(
      screen.getByLabelText('Probabilidad de Soleado a Lluvioso')
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText('Probabilidad de Lluvioso a Soleado')
    ).toBeInTheDocument()
  })

  it('informa que cada fila suma 100% cuando la matriz es válida', () => {
    render(<MatrixEditor matrix={VALID_MATRIX} onChangeCell={() => {}} />)

    expect(screen.getAllByText(/Σ 100\.0%/)).toHaveLength(3)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('marca junto a la fila el error cuando no suma 1', () => {
    const invalid = [
      ['0.7', '0.2', '0.1'],
      ['0.5', '0.3', '0.1'],
      ['0.2', '0.3', '0.5']
    ]

    render(<MatrixEditor matrix={invalid} onChangeCell={() => {}} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Debe sumar 1')
    expect(alert).toHaveTextContent('Σ 90.0%')
  })

  it('avisa cuando una celda no es numérica', () => {
    const invalid = [
      ['0.7', '0.2', '0.1'],
      ['', '0.5', '0.5'],
      ['0.2', '0.3', '0.5']
    ]

    render(<MatrixEditor matrix={invalid} onChangeCell={() => {}} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Valor numérico requerido')
  })

  it('propaga el cambio de una celda con su fila y columna', async () => {
    const user = userEvent.setup()

    function Harness() {
      const [matrix, setMatrix] = useState(VALID_MATRIX)

      return (
        <MatrixEditor
          matrix={matrix}
          onChangeCell={(row, column, value) =>
            setMatrix((current) =>
              current.map((currentRow, rowIndex) =>
                rowIndex === row
                  ? currentRow.map((cell, columnIndex) =>
                      columnIndex === column ? value : cell
                    )
                  : currentRow
              )
            )
          }
        />
      )
    }

    render(<Harness />)

    const input = screen.getByLabelText('Probabilidad de Soleado a Nublado')
    await user.clear(input)
    await user.type(input, '0.5')

    expect(input).toHaveValue(0.5)
  })
})
