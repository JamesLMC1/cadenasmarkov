// @ts-check
import { describe, expect, it } from 'vitest'
import { formatDelta, formatPercent } from '../../src/lib/format.js'

describe('formatPercent', () => {
  it('formatea los límites 0 y 1', () => {
    expect(formatPercent(0)).toBe('0.0%')
    expect(formatPercent(1)).toBe('100.0%')
  })

  it('redondea a un decimal sin tocar el valor original', () => {
    const value = 0.1234

    expect(formatPercent(value)).toBe('12.3%')
    expect(value).toBe(0.1234)
  })

  it('respeta la cantidad de decimales pedida', () => {
    expect(formatPercent(0.1234, 2)).toBe('12.34%')
    expect(formatPercent(0.1234, 0)).toBe('12%')
  })

  it('devuelve un guion cuando el valor no es finito', () => {
    expect(formatPercent(Number.NaN)).toBe('—')
  })
})

describe('formatDelta', () => {
  it('marca las diferencias positivas con signo más', () => {
    expect(formatDelta(0.0234)).toBe('+2.3 pp')
  })

  it('marca las diferencias negativas con signo menos', () => {
    expect(formatDelta(-0.05)).toBe('-5.0 pp')
  })

  it('usa ± cuando la diferencia es despreciable', () => {
    expect(formatDelta(0.0001)).toBe('±0.0 pp')
    expect(formatDelta(0)).toBe('±0.0 pp')
  })

  it('devuelve un guion cuando el valor no es finito', () => {
    expect(formatDelta(Number.POSITIVE_INFINITY)).toBe('—')
  })
})
