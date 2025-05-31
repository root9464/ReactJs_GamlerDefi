import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TanstackProvider } from './components/providers/tanstack';
import { TonProvider } from './components/providers/ton';
import './index.css';
import RefferalPage from './pages/refferal';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TanstackProvider>
      <TonProvider>
        <RefferalPage />
      </TonProvider>
    </TanstackProvider>
  </StrictMode>,
);
