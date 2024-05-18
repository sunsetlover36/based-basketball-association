import { usePrivy, useWallets } from '@privy-io/react-auth';
import { baseSepolia } from 'viem/chains';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components';

export const Header = () => {
  const navigate = useNavigate();
  const { ready: privyReady, authenticated, login, logout } = usePrivy();
  const { ready: walletsReady, wallets } = useWallets();

  if (!walletsReady) {
    return null;
  }

  let isChainSupported = false;
  if (wallets && wallets.length > 0) {
    const wallet = wallets[0];
    isChainSupported = +wallet.chainId.split(':')[1] === baseSepolia.id;
  }

  return (
    <header className="min-h-[10vh] px-4 md:px-8 flex items-center justify-end">
      <div className="flex items-center">
        <Button className="mr-4" onClick={() => navigate('/')}>
          About
        </Button>
        {isChainSupported || !authenticated ? (
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
        )}
      </div>
    </header>
  );
};
