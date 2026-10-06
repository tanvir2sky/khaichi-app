import '@fontsource/hind-siliguri/400.css'
import '@fontsource/hind-siliguri/700.css'
import '@fontsource/tiro-bangla/400.css'
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// #root holds prerendered static content for crawlers; React replaces it.
const root = document.getElementById('root')!
root.innerHTML = ''
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
