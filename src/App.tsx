import { RouterProvider } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { ThirdwebProvider } from 'thirdweb/react';

import { router } from './routes/router';
import { wagmiConfig } from './lib/wagmi';
import { queryClient } from './lib/queryClient';
import { APP_VIEM_CHAIN } from './lib/utils';

export const App = () => {
  return (
    <ThirdwebProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <OnchainKitProvider chain={APP_VIEM_CHAIN}>
            <RouterProvider router={router} />
          </OnchainKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </ThirdwebProvider>
  );
};
