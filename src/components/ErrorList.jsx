// @ts-check

/**
 * Mensaje de estado cuando no se pueden mostrar resultados.
 *
 * @param {{ message: string }} props
 */
export default function ErrorList({ message }) {
  return (
    <p role="alert" className="error">
      {message}
    </p>
  )
}
