import { RouterProvider } from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { baseSepolia } from 'wagmi/chains';
import { QueryClientProvider } from '@tanstack/react-query';

import { router } from './routes/router';
import { wagmiConfig } from './lib/wagmi';
import { queryClient } from './lib/queryClient';

export const App = () => {
  return (
    <PrivyProvider
      appId="clwbddny60fywhx6crbennn3y"
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: '/logo.jpg',
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <RouterProvider router={router} />
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};
