import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { Header } from './header';
import { Footer } from './footer';
import {
  NewMatchDialog,
  PlayerDialog,
  TeamDialog,
  TraitsDialog,
} from './dialogs';

export const Wrapper = ({ children }) => {
  const { pathname } = useLocation();

  const isCenteredContent = !['/team', '/matches'].some((path) =>
    pathname.includes(path)
  );

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
      <NewMatchDialog />
      <PlayerDialog />

      <Toaster />
    </>
  );
};
