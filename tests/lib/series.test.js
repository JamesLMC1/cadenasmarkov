// @ts-check
import { describe, expect, it } from 'vitest'
import { toChartSeries } from '../../src/lib/series.js'

const LABELS = ['Soleado', 'Nublado', 'Lluvioso']
const INITIAL = [0.5, 0.3, 0.2]
const STEPS = {
  1: [0.48, 0.31, 0.21],
  3: [0.45, 0.32, 0.23],
  5: [0.43, 0.33, 0.24],
  10: [0.42, 0.33, 0.25]
}

describe('toChartSeries', () => {
  it('incluye el paso 0 con la distribución inicial', () => {
    const series = toChartSeries(STEPS, LABELS, INITIAL)

    expect(series[0]).toEqual({
      step: 0,
      Soleado: 0.5,
      Nublado: 0.3,
      Lluvioso: 0.2
    })
  })

  it('devuelve cinco puntos ordenados por paso', () => {
    const series = toChartSeries(STEPS, LABELS, INITIAL)

    expect(series).toHaveLength(5)
    expect(series.map((point) => point.step)).toEqual([0, 1, 3, 5, 10])
  })

  it('asigna cada probabilidad a su etiqueta de estado', () => {
    const series = toChartSeries(STEPS, LABELS, INITIAL)
    const last = series[series.length - 1]

    expect(last.Soleado).toBe(0.42)
    expect(last.Nublado).toBe(0.33)
    expect(last.Lluvioso).toBe(0.25)
  })

  it('no duplica el paso 0 cuando ya viene en los resultados', () => {
    const series = toChartSeries(
      { 0: INITIAL, 1: [0.48, 0.31, 0.21] },
      LABELS,
      INITIAL
    )

    expect(series.map((point) => point.step)).toEqual([0, 1])
  })
})
