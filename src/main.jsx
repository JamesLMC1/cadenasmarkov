// @ts-check
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const container = document.getElementById('app')

if (!container) {
  throw new Error('No se encontró el contenedor #app en index.html')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
)
