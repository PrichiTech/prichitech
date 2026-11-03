import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/andika/400.css'
import '@fontsource/andika/700.css'
import './styles/global.css'
import './ui/ui.css'
import { App } from './core/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
