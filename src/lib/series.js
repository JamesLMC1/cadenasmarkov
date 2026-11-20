// @ts-check

/**
 * @typedef {number[]} Vector
 * @typedef {Record<number, Vector>} StepsByN
 */

/**
 * Convierte los resultados del motor en filas listas para Recharts, incluyendo
 * el paso 0 con la distribución inicial.
 *
 * @param {StepsByN} stepsByN
 * @param {string[]} stateLabels
 * @param {Vector} initial
 * @returns {Array<Record<string, number>>}
 */
export function toChartSeries(stepsByN, stateLabels, initial) {
  const steps = Array.from(
    new Set([0, ...Object.keys(stepsByN).map(Number)])
  ).sort((a, b) => a - b)

  return steps.map((step) => {
    const values = step === 0 ? initial : stepsByN[step]

    /** @type {Record<string, number>} */
    const point = { step }

    stateLabels.forEach((label, index) => {
      point[label] = values[index]
    })

    return point
  })
}
