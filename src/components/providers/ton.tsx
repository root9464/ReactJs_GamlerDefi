import { TonConnectUIProvider } from '@tonconnect/ui-react';
import type { ReactNode } from 'react';

export const TonProvider = ({ children }: { children: Readonly<ReactNode> }) => (
  <TonConnectUIProvider manifestUrl='https://taiga-labs.github.io/soxominter.json'>{children}</TonConnectUIProvider>
);
