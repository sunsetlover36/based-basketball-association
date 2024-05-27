import { useState } from 'react';
import { motion } from 'framer-motion';

import { useDialog } from '@/store';
import { cn } from '@/lib/utils';
import { useUser } from '@/lib/queryClient';
import { Button } from '@/components/button';
import { History } from './History';
import { Players } from './Players';
import { Tactics } from './Tactics';

export const Team = () => {
  const { data: user } = useUser();

  const {
    toggle: togglePlayerDialog,
    selectedPlayer,
    setSelectedPlayer,
  } = useDialog('playerDialog');

  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState('players');

  const handleSetPlayer = (tokenId) => {
    const players = [...lineup, ...substitutes].filter((p) => p);
    setSelectedPlayer(players.find((p) => p.tokenId === tokenId));

    togglePlayerDialog(true);
  };

  if (!user) {
    return null;
  }

  const {
    team: { lineup, substitutes },
  } = user;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex justify-center"
    >
      <div className="relative w-[700px] h-[900px] mr-16">
        <div className="h-full">
          {lineup.map((player, i) => {
            if (!player) {
              return null;
            }

            const { tokenId, name, image } = player;

            let style = {};
            switch (i) {
              case 0:
                style = {
                  bottom: '35%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                };
                break;
              case 1:
                style = {
                  bottom: '15%',
                  left: '15%',
                };
                break;
              case 2:
                style = {
                  bottom: '15%',
                  left: '62.5%',
                };
                break;
            }

            return (
              <div
                key={tokenId}
                className="absolute bottom-0 left-0 flex flex-col items-center cursor-pointer"
                style={style}
                onMouseEnter={() => {
                  setHoveredPlayer(i);
                }}
                onMouseLeave={() => {
                  setHoveredPlayer(null);
                }}
                onClick={() => {
                  handleSetPlayer(i);
                }}
              >
                <img
                  src={`https://ipfs.io/ipfs/${image.replace('ipfs://', '')}`}
                  alt="Player photo"
                  className="w-24 h-24 rounded-t-lg"
                />
                <p
                  className={cn(
                    'bg-white border-2 border-blue-600 px-2 text-black',
                    (hoveredPlayer === i || selectedPlayer === i) &&
                      'bg-blue-600 text-white'
                  )}
                >
                  {name}
                </p>
              </div>
            );
          })}
        </div>

        <img
          src="/street-court.png"
          className="absolute top-0 left-0 -z-10 w-full h-full"
        />
      </div>
      <div className="w-1/2">
        <div className="flex items-center">
          <h2 className="text-4xl mb-1 mr-4">
            Team <span className="text-blue-600">Based</span>
          </h2>
          <div>
            {[
              { tab: 'players', label: 'Players' },
              { tab: 'tactics', label: 'Tactics' },
              { tab: 'history', label: 'History' },
            ].map(({ label, tab }) => (
              <Button
                key={tab}
                size="sm"
                className={cn(
                  'mr-4 last:mr-0',
                  activeTab === tab && 'bg-blue-600 text-white'
                )}
                onClick={() => setActiveTab(tab)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="my-2"
        >
          {activeTab === 'history' && <History />}
          {activeTab === 'players' && (
            <Players
              hoveredPlayer={hoveredPlayer}
              selectedPlayer={selectedPlayer}
              setHoveredPlayer={setHoveredPlayer}
              setSelectedPlayer={handleSetPlayer}
            />
          )}
          {activeTab === 'tactics' && <Tactics />}
        </motion.div>
      </div>
    </motion.div>
  );
};
