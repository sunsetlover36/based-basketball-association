import { RouterProvider } from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';

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
          <OnchainKitProvider chain={base}>
            <RouterProvider router={router} />
          </OnchainKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};
