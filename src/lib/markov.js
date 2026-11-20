// @ts-check

/**
 * @typedef {number[][]} Matrix
 * @typedef {number[]} Vector
 * @typedef {{ ok: boolean, errors: string[] }} ValidationResult
 * @typedef {{ tolerance?: number }} ValidationOptions
 */

export const STATE_COUNT = 3
export const DEFAULT_TOLERANCE = 1e-9

/** Etiquetas de los estados, en el orden de la matriz. */
export const STATE_LABELS = ['Soleado', 'Nublado', 'Lluvioso']

/** @type {Matrix} */
export const DEFAULT_MATRIX = [
  [0.7, 0.2, 0.1],
  [0.3, 0.5, 0.2],
  [0.2, 0.3, 0.5]
]

/** @type {Vector} */
export const DEFAULT_INITIAL = [0.5, 0.3, 0.2]

/**
 * Comprueba que la matriz sea de 3×3, estocástica por filas y con probabilidades válidas.
 * No lanza: devuelve el resultado para que la interfaz pinte los mensajes.
 *
 * @param {unknown} matrix
 * @param {ValidationOptions} [options]
 * @returns {ValidationResult}
 */
export function validateMatrix(matrix, { tolerance = DEFAULT_TOLERANCE } = {}) {
  if (!isMatrixShape(matrix)) {
    return { ok: false, errors: ['La matriz de transición debe ser de 3×3.'] }
  }

  /** @type {string[]} */
  const errors = []

  matrix.forEach((row, rowIndex) => {
    let rowSum = 0
    let rowHasInvalidValue = false

    row.forEach((value, columnIndex) => {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        errors.push(
          `El valor de la fila ${rowIndex + 1}, columna ${columnIndex + 1} debe ser numérico.`
        )
        rowHasInvalidValue = true
        return
      }

      if (value < 0 || value > 1) {
        errors.push(
          `La probabilidad de la fila ${rowIndex + 1}, columna ${columnIndex + 1} debe estar entre 0 y 1.`
        )
        rowHasInvalidValue = true
        return
      }

      rowSum += value
    })

    if (!rowHasInvalidValue && Math.abs(rowSum - 1) > tolerance) {
      errors.push(`La fila ${rowIndex + 1} debe sumar 1.`)
    }
  })

  return { ok: errors.length === 0, errors }
}

/**
 * Comprueba que la distribución inicial tenga 3 probabilidades finitas que sumen 1.
 * No lanza: devuelve el resultado para que la interfaz pinte los mensajes.
 *
 * @param {unknown} vector
 * @param {ValidationOptions} [options]
 * @returns {ValidationResult}
 */
export function validateVector(vector, { tolerance = DEFAULT_TOLERANCE } = {}) {
  if (!Array.isArray(vector) || vector.length !== STATE_COUNT) {
    return { ok: false, errors: ['La distribución inicial debe tener 3 valores.'] }
  }

  /** @type {string[]} */
  const errors = []
  let sum = 0
  let hasInvalidValue = false
  let reportedNonNumeric = false

  vector.forEach((value, index) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      if (!reportedNonNumeric) {
        errors.push('Todos los valores de la distribución inicial deben ser numéricos.')
        reportedNonNumeric = true
      }
      hasInvalidValue = true
      return
    }

    if (value < 0 || value > 1) {
      errors.push(
        `La probabilidad del estado ${index + 1} debe estar entre 0 y 1.`
      )
      hasInvalidValue = true
      return
    }

    sum += value
  })

  if (!hasInvalidValue && Math.abs(sum - 1) > tolerance) {
    errors.push('La distribución inicial debe sumar 1.')
  }

  return { ok: errors.length === 0, errors }
}

/**
 * Multiplica dos matrices cuadradas o compatibles.
 *
 * @param {Matrix} a
 * @param {Matrix} b
 * @returns {Matrix}
 */
export function multiplyMatrix(a, b) {
  const rows = a.length
  const inner = b.length
  const columns = b[0].length
  /** @type {Matrix} */
  const product = []

  for (let row = 0; row < rows; row += 1) {
    /** @type {Vector} */
    const resultRow = []

    for (let column = 0; column < columns; column += 1) {
      let sum = 0

      for (let k = 0; k < inner; k += 1) {
        sum += a[row][k] * b[k][column]
      }

      resultRow.push(sum)
    }

    product.push(resultRow)
  }

  return product
}

/**
 * Multiplica un vector fila por una matriz: `out[j] = Σ v[i] · m[i][j]`.
 *
 * @param {Vector} vector
 * @param {Matrix} matrix
 * @returns {Vector}
 */
export function multiplyVectorMatrix(vector, matrix) {
  const columns = matrix[0].length
  /** @type {Vector} */
  const product = []

  for (let column = 0; column < columns; column += 1) {
    let sum = 0

    for (let row = 0; row < vector.length; row += 1) {
      sum += vector[row] * matrix[row][column]
    }

    product.push(sum)
  }

  return product
}

/**
 * Eleva una matriz a un exponente entero no negativo.
 *
 * @param {Matrix} matrix
 * @param {number} exponent
 * @returns {Matrix}
 */
export function matrixPower(matrix, exponent) {
  if (!Number.isInteger(exponent) || exponent < 0) {
    throw new Error('El exponente de la matriz debe ser un entero no negativo.')
  }

  /** @type {Matrix} */
  let result = matrix.map((row, rowIndex) =>
    row.map((_, columnIndex) => (rowIndex === columnIndex ? 1 : 0))
  )

  for (let step = 0; step < exponent; step += 1) {
    result = multiplyMatrix(result, matrix)
  }

  return result
}

/** Pasos que la aplicación calcula por defecto. */
export const DEFAULT_STEPS = [1, 3, 5, 10]

/**
 * Calcula πₙ = π₀ · Pⁿ para cada paso solicitado, sin redondear los resultados.
 *
 * @param {Vector} initial
 * @param {Matrix} matrix
 * @param {number[]} [steps]
 * @returns {Record<number, Vector>}
 */
export function computeSteps(initial, matrix, steps = DEFAULT_STEPS) {
  const matrixValidation = validateMatrix(matrix)
  if (!matrixValidation.ok) {
    throw new Error(
      `Matriz de transición inválida: ${matrixValidation.errors.join(' ')}`
    )
  }

  const vectorValidation = validateVector(initial)
  if (!vectorValidation.ok) {
    throw new Error(
      `Distribución inicial inválida: ${vectorValidation.errors.join(' ')}`
    )
  }

  /** @type {Record<number, Vector>} */
  const results = {}

  for (const step of steps) {
    if (!Number.isInteger(step) || step < 0) {
      throw new Error('Los pasos deben ser enteros no negativos.')
    }

    results[step] = multiplyVectorMatrix(initial, matrixPower(matrix, step))
  }

  return results
}

/**
 * Estima la distribución estacionaria iterando desde la uniforme hasta que la
 * diferencia en norma L1 cae por debajo de la tolerancia.
 *
 * @param {Matrix} matrix
 * @param {{ tolerance?: number, maxIterations?: number }} [options]
 * @returns {Vector}
 */
export function stationaryDistribution(
  matrix,
  { tolerance = 1e-10, maxIterations = 1000 } = {}
) {
  const validation = validateMatrix(matrix)
  if (!validation.ok) {
    throw new Error(
      `Matriz de transición inválida: ${validation.errors.join(' ')}`
    )
  }

  /** @type {Vector} */
  let current = [1 / STATE_COUNT, 1 / STATE_COUNT, 1 / STATE_COUNT]

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    const next = multiplyVectorMatrix(current, matrix)
    const delta = next.reduce(
      (sum, value, index) => sum + Math.abs(value - current[index]),
      0
    )

    current = next

    if (delta < tolerance) {
      break
    }
  }

  return current
}

/**
 * @param {unknown} matrix
 * @returns {matrix is Matrix}
 */
function isMatrixShape(matrix) {
  if (!Array.isArray(matrix) || matrix.length !== STATE_COUNT) {
    return false
  }

  return matrix.every(
    (row) => Array.isArray(row) && row.length === STATE_COUNT
  )
}
