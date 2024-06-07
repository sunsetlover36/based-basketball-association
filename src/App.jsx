import { useState, useEffect } from 'react';

import { useDialog } from '@/store';
import { Button } from '@/components';
import { TeamDialog, TraitsDialog } from '@/components/dialogs';

export const App = () => {
  const { toggle: toggleTeamDialog } = useDialog('teamDialog');
  const { toggle: toggleTraitsDialog } = useDialog('traitsDialog');

  const paragraphClassName =
    'text-sm sm:text-base lg:text-lg 2xl:text-xl w-[90%] sm:w-[75%] lg:w-[60%] 2xl:w-[55%] mx-auto mt-2 !leading-5 2xl:!leading-7';

  const [currentPlayer, setCurrentPlayer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlayer((currentPlayer) => (currentPlayer + 1) % 7);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="w-full min-h-screen border-[1rem] md:border-[2rem] border-blue-600 flex flex-col p-4 md:p-8 items-center justify-center relative">
        <div className="text-center uppercase">
          <img
            src={`/player${currentPlayer}.gif`}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 2xl:w-auto 2xl:h-80 mx-auto mb-2"
          />
          <h1 className="px-8 leading-6 text-2xl sm:text-3xl md:text-4xl 2xl:text-6xl text-blue-600">
            Based Basketball Association
          </h1>
          <p className={paragraphClassName}>
            Based Basketball Association is a basketball coach career simulator.
          </p>
          <p className={paragraphClassName}>
            Build your dream team, starting from your hood, to&nbsp;dominate the
            street courts and then take over the whole basketball world.
          </p>
          <p className={paragraphClassName}>
            Each player will receive <span className="text-blue-600">1</span>{' '}
            random pack out of&nbsp;
            <span className="text-blue-600">3333</span>, containing{' '}
            <span className="text-blue-600">3</span>&nbsp;basketball enthusiasts
            from your hood, whom you&rsquo;ll gather for the upcoming games.
          </p>
          <p className={paragraphClassName}>
            Lead your squad to&nbsp;the title of&nbsp;the best team in&nbsp;the
            world in&nbsp;the thrilling gameplay of&nbsp;Based Basketball.
          </p>
        </div>

        <div className="flex justify-center items-center mt-4">
          <Button onClick={() => window.open('/BBA_Based_Paper.pdf', '_blank')}>
            Based Paper
          </Button>
          <Button onClick={() => toggleTraitsDialog(true)} className="mx-4">
            Traits
          </Button>
          <Button onClick={() => toggleTeamDialog(true)}>Team</Button>
        </div>

        <footer className="flex items-center justify-center w-full mt-4 md:mt-8">
          <h2 className="text-center text-lg sm:text-xl md:text-2xl uppercase">
            Exclusively on <span className="text-blue-600">Base</span> soon!
          </h2>
        </footer>
      </div>

      <TeamDialog />
      <TraitsDialog />
    </>
  );
};
