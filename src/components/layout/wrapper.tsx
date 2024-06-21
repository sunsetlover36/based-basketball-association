import { useEffect, type FC, type ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Tooltip } from 'react-tooltip';
import { useActiveWalletChain } from 'thirdweb/react';

import { APP_THIRDWEB_CHAIN, cn, isValidChain } from '@/lib/utils';
import { useStore } from '@/store';

import { Header } from './header';
import { Footer } from './footer';
import {
  ConfirmTeamDialog,
  ConfirmTrainingDialog,
  TeamDialog,
  TraitsDialog,
} from './dialogs';

interface WrapperProps {
  children: ReactNode;
}
export const Wrapper: FC<WrapperProps> = ({ children }) => {
  const { pathname } = useLocation();
  const windowSize = useWindowSize();
  const chainId = useActiveWalletChain()?.id;
  const { isConfettiVisible } = useStore();

  const isCenteredContent = !['/team', '/leaderboard', '/invite'].some((path) =>
    pathname.includes(path)
  );

  useEffect(() => {
    if (chainId && !isValidChain(chainId)) {
      toast.error(`Please switch to ${APP_THIRDWEB_CHAIN.name} network!`, {
        id: 'wrong-network-error',
        icon: '⛓️',
      });
    }
  }, [chainId]);

  return (
    <>
      <div className="w-full min-h-screen border-[1rem] md:border-[2rem] border-blue-600 relative">
        <Header />

        <main
          className={cn(
            'py-8 px-4 md:px-8 min-h-[75vh]',
            isCenteredContent && 'flex flex-col items-center justify-center'
          )}
        >
          {children}
        </main>

        <Footer />
      </div>

      <TeamDialog />
      <TraitsDialog />
      <ConfirmTrainingDialog />
      <ConfirmTeamDialog />

      <Toaster />
      <Tooltip id="cheer" />

      {isConfettiVisible && (
        <Confetti
          width={windowSize.width * 0.9}
          height={windowSize.height * 0.95}
          numberOfPieces={500}
          recycle={false}
          className="mx-auto"
        />
      )}
    </>
  );
};
