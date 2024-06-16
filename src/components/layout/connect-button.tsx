import {
  lightTheme,
  ConnectButton as TwConnectButton,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from 'thirdweb/react';
import { baseSepolia } from 'thirdweb/chains';
import { createWallet, walletConnect } from 'thirdweb/wallets';

import { thirdwebClient } from '@/lib/thirdweb';
import { doLogin, doLogout, getLoginPayload, isLoggedIn } from '@/lib/api';
import { Button } from '@/components';
import { queryClient } from '@/lib/queryClient';

const wallets = [
  createWallet('com.coinbase.wallet'),
  createWallet('io.metamask'),
  walletConnect(),
];

export const ConnectButton = () => {
  const chainId = useActiveWalletChain()?.id;
  const switchChain = useSwitchActiveWalletChain();

  return (
    <div className="tw-connect-wrapper">
      {chainId && chainId !== baseSepolia.id ? (
        <Button
          className="bg-red-500"
          onClick={() => {
            switchChain(baseSepolia);
          }}
        >
          Switch Network
        </Button>
      ) : (
        <TwConnectButton
          client={thirdwebClient}
          wallets={wallets}
          theme={lightTheme({
            colors: { primaryButtonBg: '#2563EB' },
          })}
          connectModal={{
            size: 'compact',
            title: 'Connect to BBA',
            titleIcon: '/logo.jpg',
          }}
          auth={{
            getLoginPayload,
            doLogin: async (params) => {
              await doLogin(params);
              await queryClient.invalidateQueries({ queryKey: ['user'] });
            },
            isLoggedIn,
            doLogout,
          }}
        />
      )}
    </div>
  );
};
