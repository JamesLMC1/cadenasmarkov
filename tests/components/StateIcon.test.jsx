// @ts-check
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StateIcon from '../../src/components/StateIcon.jsx'

describe('StateIcon', () => {
  it('expone un nombre accesible cuando va solo', () => {
    render(<StateIcon state="Soleado" standalone />)

    expect(screen.getByRole('img', { name: 'Soleado' })).toBeInTheDocument()
  })

  it('se oculta a los lectores de pantalla cuando acompaña a un texto', () => {
    const { container } = render(
      <p>
        <StateIcon state="Lluvioso" /> Lluvioso
      </p>
    )

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('usa el color de texto del estado', () => {
    const { container } = render(<StateIcon state="Nublado" />)

    expect(container.querySelector('svg')?.style.color).toBe('rgb(71, 85, 105)')
  })
})
