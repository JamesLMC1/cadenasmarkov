// @ts-check
import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Indica si el usuario pidió reducir el movimiento. Fuera del navegador (o en
 * entornos que no implementan matchMedia) devuelve `false`.
 *
 * @returns {boolean}
 */
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false
    }
    return window.matchMedia(QUERY).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const media = window.matchMedia(QUERY)
    /** @param {MediaQueryListEvent} event */
    const handleChange = (event) => setReduced(event.matches)

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  return reduced
}
