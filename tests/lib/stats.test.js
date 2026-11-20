// @ts-check
import { describe, expect, it } from 'vitest'
import { indexOfMax } from '../../src/lib/stats.js'

describe('indexOfMax', () => {
  it('devuelve el índice del valor más alto', () => {
    expect(indexOfMax([0.1, 0.5, 0.4])).toBe(1)
  })

  it('devuelve 0 cuando el máximo está al inicio', () => {
    expect(indexOfMax([0.9, 0.05, 0.05])).toBe(0)
  })

  it('devuelve el último índice cuando el máximo está al final', () => {
    expect(indexOfMax([0.1, 0.2, 0.7])).toBe(2)
  })

  it('en caso de empate devuelve el primero', () => {
    expect(indexOfMax([0.4, 0.4, 0.2])).toBe(0)
  })

  it('devuelve -1 para una lista vacía', () => {
    expect(indexOfMax([])).toBe(-1)
  })
})
