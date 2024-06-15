import { RouterProvider } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { ThirdwebProvider } from 'thirdweb/react';

import { router } from './routes/router';
import { wagmiConfig } from './lib/wagmi';
import { queryClient } from './lib/queryClient';

export const App = () => {
  return (
    <ThirdwebProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <OnchainKitProvider chain={base}>
            <RouterProvider router={router} />
          </OnchainKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </ThirdwebProvider>
  );
};
