// @ts-check

/**
 * Formatea una probabilidad como porcentaje sin redondear el valor original.
 *
 * @param {number} value Probabilidad entre 0 y 1.
 * @param {number} [decimals]
 * @returns {string}
 */
export function formatPercent(value, decimals = 1) {
  if (!Number.isFinite(value)) {
    return '—'
  }

  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Formatea una diferencia de probabilidad como puntos porcentuales con signo.
 *
 * @param {number} value Diferencia entre dos probabilidades.
 * @param {number} [decimals]
 * @returns {string}
 */
export function formatDelta(value, decimals = 1) {
  if (!Number.isFinite(value)) {
    return '—'
  }

  const points = value * 100

  if (Math.abs(points) < 0.05) {
    return `±${Math.abs(points).toFixed(decimals)} pp`
  }

  const sign = points > 0 ? '+' : '-'

  return `${sign}${Math.abs(points).toFixed(decimals)} pp`
}
