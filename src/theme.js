// @ts-check

/**
 * Tokens visuales compartidos por CSS y por Recharts.
 *
 * IMPORTANTE: este archivo es la fuente de verdad de los colores. Las variables
 * equivalentes de `src/styles.css` deben cambiarse junto con estos valores.
 *
 * `textColor` es el tono accesible (AA sobre blanco) para textos pequeños; `color`
 * es el tono de marca para barras, líneas y fondos tenues.
 */
export const BRAND = {
  accent: '#4f46e5',
  accentStrong: '#4338ca',
  accentSoft: '#eef2ff'
}

/**
 * @typedef {{
 *   id: 'sunny' | 'cloudy' | 'rainy',
 *   label: string,
 *   color: string,
 *   textColor: string,
 *   soft: string
 * }} StateTheme
 */

/** @type {StateTheme[]} */
export const STATE_THEME = [
  {
    id: 'sunny',
    label: 'Soleado',
    color: '#f59e0b',
    textColor: '#b45309',
    soft: '#fef3c7'
  },
  {
    id: 'cloudy',
    label: 'Nublado',
    color: '#64748b',
    textColor: '#475569',
    soft: '#f1f5f9'
  },
  {
    id: 'rainy',
    label: 'Lluvioso',
    color: '#3b82f6',
    textColor: '#2563eb',
    soft: '#dbeafe'
  }
]

/** Espaciado en píxeles, múltiplos de 4. */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
}

/**
 * @param {string} label
 * @returns {StateTheme}
 */
export function stateTheme(label) {
  const found = STATE_THEME.find((state) => state.label === label)
  if (!found) {
    throw new Error(`Estado desconocido: ${label}`)
  }
  return found
}

/** @type {Record<string, string>} */
export const STATE_COLORS = Object.fromEntries(
  STATE_THEME.map((state) => [state.label, state.color])
)

/** @type {Record<string, string>} */
export const STATE_TEXT_COLORS = Object.fromEntries(
  STATE_THEME.map((state) => [state.label, state.textColor])
)
