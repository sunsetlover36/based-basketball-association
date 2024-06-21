import { createConfig, http } from 'wagmi';
import { APP_VIEM_CHAIN } from './utils';

export const wagmiConfig = createConfig({
  chains: [APP_VIEM_CHAIN],
  transports: {
    [APP_VIEM_CHAIN.id]: http(),
  } as any,
});
