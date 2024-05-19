import { usePrivy, useWallets } from '@privy-io/react-auth';
import { baseSepolia } from 'viem/chains';

import { Button, Loader } from '@/components';

export const ConnectButton = () => {
  const { ready: privyReady, authenticated, login, logout } = usePrivy();
  const { ready: walletsReady, wallets } = useWallets();

  if (!walletsReady) {
    return <Loader />;
  }

  let isChainSupported = false;
  if (wallets && wallets.length > 0) {
    const wallet = wallets[0];
    isChainSupported = +wallet.chainId.split(':')[1] === baseSepolia.id;
  }

  return isChainSupported || !authenticated ? (
    <Button
      disabled={!privyReady}
      onClick={() => (authenticated ? logout() : login())}
    >
      {authenticated ? 'Disconnect' : 'Connect'}
    </Button>
  ) : (
    <Button onClick={() => wallet.switchChain(baseSepolia.id)}>
      Switch to Base Sepolia
    </Button>
  );
};
