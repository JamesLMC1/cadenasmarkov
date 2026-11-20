// @ts-check
import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useReducedMotion from '../../src/hooks/useReducedMotion.js'

/**
 * @param {boolean} matches
 */
function stubMatchMedia(matches) {
  const listeners = new Set()

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query) => ({
      matches,
      media: query,
      addEventListener: (/** @type {string} */ _event, /** @type {Function} */ handler) =>
        listeners.add(handler),
      removeEventListener: (/** @type {string} */ _event, /** @type {Function} */ handler) =>
        listeners.delete(handler)
    }))
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useReducedMotion', () => {
  it('devuelve true cuando el sistema pide movimiento reducido', () => {
    stubMatchMedia(true)

    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(true)
  })

  it('devuelve false cuando no hay preferencia de movimiento reducido', () => {
    stubMatchMedia(false)

    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(false)
  })

  it('devuelve false cuando el entorno no implementa matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined)

    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(false)
  })
})
