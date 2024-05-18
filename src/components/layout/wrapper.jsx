import { Header } from './header';
import { Footer } from './footer';
import { TeamDialog, TraitsDialog } from './dialogs';

export const Wrapper = ({ children }) => {
  return (
    <>
      <div className="w-full min-h-screen border-[1rem] md:border-[2rem] border-blue-600 relative">
        <Header />

        <main className="py-8 px-4 md:px-8 min-h-[75vh] flex flex-col items-center justify-center">
          {children}
        </main>

        <Footer />
      </div>

      <TeamDialog />
      <TraitsDialog />
    </>
  );
};
