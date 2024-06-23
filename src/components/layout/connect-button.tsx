import {
  lightTheme,
  ConnectButton as TwConnectButton,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from 'thirdweb/react';
import { createWallet, walletConnect } from 'thirdweb/wallets';

import { thirdwebClient } from '@/lib/thirdweb';
import { doLogin, doLogout, getLoginPayload, isLoggedIn } from '@/lib/api';
import { Button } from '@/components';
import { queryClient } from '@/lib/queryClient';
import { APP_THIRDWEB_CHAIN } from '@/lib/utils';

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
      {chainId && chainId !== APP_THIRDWEB_CHAIN.id ? (
        <Button
          className="bg-red-500"
          onClick={() => {
            switchChain(APP_THIRDWEB_CHAIN);
          }}
        >
          Switch Network
        </Button>
      ) : (
        <TwConnectButton
          client={thirdwebClient}
          accountAbstraction={{
            chain: APP_THIRDWEB_CHAIN,
            sponsorGas: true,
            factoryAddress: '0x3e2bC5fBB09D698447e0cF70Fa2e42Ba56bCC5eB',
          }}
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
