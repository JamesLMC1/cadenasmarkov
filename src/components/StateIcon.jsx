// @ts-check
import { stateTheme } from '../theme.js'

/**
 * Icono de estado dibujado en SVG. Cuando acompaña a un texto visible se oculta
 * a los lectores de pantalla; cuando va solo expone un nombre accesible.
 *
 * @param {{
 *   state: string,
 *   size?: number,
 *   standalone?: boolean
 * }} props
 */
export default function StateIcon({ state, size = 20, standalone = false }) {
  const theme = stateTheme(state)
  const accessibility = standalone
    ? { role: 'img', 'aria-label': theme.label }
    : { 'aria-hidden': true }

  return (
    <svg
      className="mc-state-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: theme.textColor }}
      {...accessibility}
    >
      {theme.id === 'sunny' && <SunGlyph />}
      {theme.id === 'cloudy' && <CloudGlyph />}
      {theme.id === 'rainy' && <RainGlyph />}
    </svg>
  )
}

function SunGlyph() {
  return (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </>
  )
}

function CloudGlyph() {
  return (
    <path d="M6.5 17.5h10a3.5 3.5 0 0 0 .4-6.98A5 5 0 0 0 7.2 9.6a3.8 3.8 0 0 0-.7 7.9z" />
  )
}

function RainGlyph() {
  return (
    <>
      <path d="M6.5 14.5h10a3.5 3.5 0 0 0 .4-6.98A5 5 0 0 0 7.2 6.6a3.8 3.8 0 0 0-.7 7.9z" />
      <path d="M8 18l-1 2M12 18l-1 2M16 18l-1 2" />
    </>
  )
}
