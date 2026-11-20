// @ts-check
import { describe, expect, it } from 'vitest'
import {
  computeSteps,
  matrixPower,
  multiplyMatrix,
  multiplyVectorMatrix,
  stationaryDistribution,
  validateMatrix,
  validateVector
} from '../../src/lib/markov.js'

/** Matriz por defecto del modelo: estocástica por filas. */
const DEFAULT_MATRIX = [
  [0.7, 0.2, 0.1],
  [0.3, 0.5, 0.2],
  [0.2, 0.3, 0.5]
]

describe('validateMatrix', () => {
  it('acepta una matriz cuyas filas suman 1 con tolerancia 1e-9', () => {
    const result = validateMatrix(DEFAULT_MATRIX)

    expect(result.ok).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('rechaza una matriz cuya segunda fila no suma 1', () => {
    const result = validateMatrix([
      [0.7, 0.2, 0.1],
      [0.5, 0.3, 0.1],
      [0.2, 0.3, 0.5]
    ])

    expect(result.ok).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors.join(' ')).toContain('fila 2')
  })

  it('rechaza valores fuera del rango [0, 1]', () => {
    const negative = validateMatrix([
      [-0.1, 0.6, 0.5],
      [0.3, 0.5, 0.2],
      [0.2, 0.3, 0.5]
    ])
    const tooBig = validateMatrix([
      [1.2, -0.1, -0.1],
      [0.3, 0.5, 0.2],
      [0.2, 0.3, 0.5]
    ])

    expect(negative.ok).toBe(false)
    expect(negative.errors.join(' ')).toContain('entre 0 y 1')
    expect(tooBig.ok).toBe(false)
    expect(tooBig.errors.join(' ')).toContain('entre 0 y 1')
  })

  it('rechaza dimensiones distintas de 3x3', () => {
    const twoByTwo = validateMatrix([
      [0.5, 0.5],
      [0.5, 0.5]
    ])
    const threeByFour = validateMatrix([
      [0.25, 0.25, 0.25, 0.25],
      [0.25, 0.25, 0.25, 0.25],
      [0.25, 0.25, 0.25, 0.25]
    ])

    expect(twoByTwo.ok).toBe(false)
    expect(twoByTwo.errors.join(' ')).toContain('3×3')
    expect(threeByFour.ok).toBe(false)
    expect(threeByFour.errors.join(' ')).toContain('3×3')
  })
})

describe('validateVector', () => {
  it('acepta una distribución inicial que suma 1', () => {
    const result = validateVector([0.5, 0.3, 0.2])

    expect(result.ok).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('rechaza una distribución inicial que suma 0.95', () => {
    const result = validateVector([0.5, 0.3, 0.15])

    expect(result.ok).toBe(false)
    expect(result.errors.join(' ')).toContain('sumar 1')
  })

  it('rechaza valores no numéricos', () => {
    const result = validateVector([0.5, Number.NaN, 0.5])

    expect(result.ok).toBe(false)
    expect(result.errors.join(' ')).toContain('numéricos')
  })

  it('rechaza una cantidad de valores distinta de 3', () => {
    const result = validateVector([0.5, 0.5])

    expect(result.ok).toBe(false)
    expect(result.errors.join(' ')).toContain('3 valores')
  })
})

describe('multiplyMatrix', () => {
  it('multiplica dos matrices de 2x2 verificadas a mano', () => {
    const product = multiplyMatrix(
      [
        [1, 2],
        [3, 4]
      ],
      [
        [5, 6],
        [7, 8]
      ]
    )

    expect(product).toEqual([
      [19, 22],
      [43, 50]
    ])
  })
})

describe('multiplyVectorMatrix', () => {
  it('multiplica un vector fila por una matriz de 2x2', () => {
    const product = multiplyVectorMatrix(
      [1, 2],
      [
        [1, 2],
        [3, 4]
      ]
    )

    expect(product).toEqual([7, 10])
  })

  it('respeta la convención de filas con la matriz por defecto', () => {
    const oneStep = multiplyVectorMatrix([0.5, 0.3, 0.2], DEFAULT_MATRIX)

    expect(oneStep[0]).toBeCloseTo(0.48, 12)
    expect(oneStep[1]).toBeCloseTo(0.31, 12)
    expect(oneStep[2]).toBeCloseTo(0.21, 12)
  })
})

describe('matrixPower', () => {
  it('eleva al cuadrado una matriz de 2x2', () => {
    const squared = matrixPower(
      [
        [1, 2],
        [3, 4]
      ],
      2
    )

    expect(squared).toEqual([
      [7, 10],
      [15, 22]
    ])
  })

  it('devuelve la identidad al elevar a 0', () => {
    const identity = matrixPower(
      [
        [1, 2],
        [3, 4]
      ],
      0
    )

    expect(identity).toEqual([
      [1, 0],
      [0, 1]
    ])
  })

  it('devuelve una copia de la matriz al elevar a 1', () => {
    const power = matrixPower(DEFAULT_MATRIX, 1)

    expect(power).toEqual(DEFAULT_MATRIX)
    expect(power).not.toBe(DEFAULT_MATRIX)
  })
})

describe('computeSteps', () => {
  const IDENTITY = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]

  it('calcula π₁ como el producto de la distribución inicial por la matriz', () => {
    const steps = computeSteps([0.5, 0.3, 0.2], DEFAULT_MATRIX)

    expect(steps[1][0]).toBeCloseTo(0.48, 12)
    expect(steps[1][1]).toBeCloseTo(0.31, 12)
    expect(steps[1][2]).toBeCloseTo(0.21, 12)
  })

  it('conserva la masa en los pasos 1, 3, 5 y 10', () => {
    const steps = computeSteps([0.5, 0.3, 0.2], DEFAULT_MATRIX)

    for (const step of [1, 3, 5, 10]) {
      const total = steps[step].reduce((sum, value) => sum + value, 0)
      expect(Math.abs(total - 1)).toBeLessThan(1e-9)
    }
  })

  it('devuelve exactamente las claves 1, 3, 5 y 10', () => {
    const steps = computeSteps([0.5, 0.3, 0.2], DEFAULT_MATRIX)

    expect(Object.keys(steps)).toEqual(['1', '3', '5', '10'])
    expect(steps).toHaveProperty('1')
    expect(steps).toHaveProperty('3')
    expect(steps).toHaveProperty('5')
    expect(steps).toHaveProperty('10')
  })

  it('deja la distribución inicial intacta con la matriz identidad', () => {
    const initial = [0.5, 0.3, 0.2]
    const steps = computeSteps(initial, IDENTITY)

    for (const step of [1, 3, 5, 10]) {
      expect(steps[step][0]).toBeCloseTo(0.5, 12)
      expect(steps[step][1]).toBeCloseTo(0.3, 12)
      expect(steps[step][2]).toBeCloseTo(0.2, 12)
    }
  })

  it('lanza un error cuando la matriz no es válida', () => {
    const invalid = [
      [0.7, 0.2, 0.1],
      [0.5, 0.3, 0.1],
      [0.2, 0.3, 0.5]
    ]

    expect(() => computeSteps([0.5, 0.3, 0.2], invalid)).toThrow(/matriz/i)
  })

  it('lanza un error cuando la distribución inicial no es válida', () => {
    expect(() => computeSteps([0.5, 0.3, 0.1], DEFAULT_MATRIX)).toThrow(
      /distribución inicial/i
    )
  })
})

describe('stationaryDistribution', () => {
  it('converge a una distribución que suma 1', () => {
    const stationary = stationaryDistribution(DEFAULT_MATRIX)
    const total = stationary.reduce((sum, value) => sum + value, 0)

    expect(stationary).toHaveLength(3)
    expect(Math.abs(total - 1)).toBeLessThan(1e-9)
  })

  it('es un punto fijo de la matriz', () => {
    const stationary = stationaryDistribution(DEFAULT_MATRIX)
    const next = multiplyVectorMatrix(stationary, DEFAULT_MATRIX)

    for (let index = 0; index < 3; index += 1) {
      expect(Math.abs(next[index] - stationary[index])).toBeLessThan(1e-10)
    }
  })

  it('devuelve la distribución uniforme para la matriz identidad', () => {
    const stationary = stationaryDistribution([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ])

    for (const value of stationary) {
      expect(value).toBeCloseTo(1 / 3, 12)
    }
  })
})

describe('pureza del cálculo', () => {
  it('no modifica la matriz ni la distribución inicial recibidas', () => {
    const matrix = DEFAULT_MATRIX.map((row) => [...row])
    const initial = [0.5, 0.3, 0.2]
    const matrixCopy = matrix.map((row) => [...row])
    const initialCopy = [...initial]

    computeSteps(initial, matrix)
    stationaryDistribution(matrix)

    expect(matrix).toEqual(matrixCopy)
    expect(initial).toEqual(initialCopy)
  })
})
