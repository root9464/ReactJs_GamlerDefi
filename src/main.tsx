import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RefferalPage from './pages/refferal'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RefferalPage />
  </StrictMode>,
)
