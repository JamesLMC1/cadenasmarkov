// @ts-check
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import InitialVector from '../../src/components/InitialVector.jsx'

describe('InitialVector', () => {
  it('muestra un campo por estado', () => {
    render(<InitialVector initial={['0.5', '0.3', '0.2']} onChangeValue={() => {}} />)

    expect(screen.getAllByRole('spinbutton')).toHaveLength(3)
    expect(screen.getByLabelText('Soleado')).toBeInTheDocument()
    expect(screen.getByLabelText('Lluvioso')).toBeInTheDocument()
  })

  it('muestra la suma actual en porcentaje', () => {
    render(<InitialVector initial={['0.5', '0.3', '0.2']} onChangeValue={() => {}} />)

    expect(screen.getByText('100.0%')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('avisa cuando la suma no es 100%', () => {
    render(<InitialVector initial={['0.5', '0.3', '0.1']} onChangeValue={() => {}} />)

    expect(screen.getByText('90.0%')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('debe sumar 1')
  })

  it('avisa cuando un valor no es numérico', () => {
    render(<InitialVector initial={['0.5', '', '0.5']} onChangeValue={() => {}} />)

    expect(screen.getByRole('alert')).toHaveTextContent('numéricos')
  })
})
