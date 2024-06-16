import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useDialog } from '@/store';
import { Button } from '@/components';
import { useActiveAccount } from 'thirdweb/react';
import { DialogName } from '@/store/ui/types';
import { useUser } from '@/lib/queryClient';
import toast from 'react-hot-toast';

export const Main = () => {
  const navigate = useNavigate();
  const { toggle: toggleTeamDialog } = useDialog(DialogName.TEAM_DIALOG);
  const { toggle: toggleTraitsDialog } = useDialog(DialogName.TRAITS_DIALOG);

  const [currentPlayer, setCurrentPlayer] = useState(0);

  const { data: user } = useUser();
  const account = useActiveAccount();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlayer((currentPlayer) => (currentPlayer + 1) % 7);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const paragraphClassName =
    'text-sm sm:text-base lg:text-lg 2xl:text-xl w-[90%] sm:w-[75%] lg:w-[60%] 2xl:w-[50%] mx-auto mt-2 !leading-5 2xl:!leading-7';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
          Every coach will have the opportunity to&nbsp;create{' '}
          <span className="text-blue-600">1</span>&nbsp;team out of&nbsp;
          <span className="text-blue-600">3333</span> with their own{' '}
          <span className="text-blue-600">unique player</span>.
        </p>
        <p className={paragraphClassName}>
          Train your basketball player and get ready for the first season
          of&nbsp;the game in&nbsp;the association&rsquo;s training camp!
        </p>
        <p className={paragraphClassName}>
          Build your dream team, starting from your hood, to&nbsp;dominate the
          street courts and then lead your squad to&nbsp;the title of&nbsp;the
          best team in&nbsp;the world in&nbsp;the thrilling gameplay
          of&nbsp;Based Basketball.
        </p>
      </div>

      {(!account || !user?.team) && (
        <div className="flex justify-center items-center mt-8">
          <Button
            onClick={() =>
              !account
                ? toast.error('Please connect wallet first!', {
                    id: 'sign-in',
                    icon: '🚨',
                  })
                : navigate('/create-team')
            }
          >
            Create team
          </Button>
        </div>
      )}
      <div className="flex justify-center items-center mt-4">
        <Button
          variant="ghost"
          onClick={() => window.open('/BBA_Based_Paper.pdf', '_blank')}
        >
          Based Paper
        </Button>
        <Button
          variant="ghost"
          onClick={() => toggleTraitsDialog(true)}
          className="mx-4"
        >
          Traits
        </Button>
        <Button variant="ghost" onClick={() => toggleTeamDialog(true)}>
          Team
        </Button>
      </div>

      <div className="flex items-center justify-center mt-4">
        <img
          src="/x.png"
          className="w-[29px] rounded-lg mr-4 cursor-pointer"
          onClick={() => window.open('https://x.com/BasedBBA', '_blank')}
        />
        <img
          src="/warpcast.png"
          className="w-[36px] cursor-pointer"
          onClick={() => window.open('https://warpcast.com/basedbba', '_blank')}
        />
      </div>
    </motion.div>
  );
};
