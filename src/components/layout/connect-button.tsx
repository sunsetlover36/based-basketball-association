import { lightTheme, ConnectButton as TwConnectButton } from 'thirdweb/react';

import { thirdwebClient } from '@/lib/thirdweb';
import { doLogin, doLogout, getLoginPayload, isLoggedIn } from '@/lib/api';

export const ConnectButton = () => {
  return (
    <div className="tw-connect-wrapper">
      <TwConnectButton
        client={thirdwebClient}
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
          doLogin,
          isLoggedIn,
          doLogout,
        }}
      />
    </div>
  );
};
