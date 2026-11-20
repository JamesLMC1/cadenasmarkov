// @ts-check

/**
 * Índice del valor más alto. En caso de empate devuelve el primero, y para una
 * lista vacía devuelve -1. Es una utilidad de presentación: no forma parte del
 * cálculo de la cadena de Markov.
 *
 * @param {number[]} values
 * @returns {number}
 */
export function indexOfMax(values) {
  if (values.length === 0) {
    return -1
  }

  return values.reduce(
    (bestIndex, value, index) => (value > values[bestIndex] ? index : bestIndex),
    0
  )
}
