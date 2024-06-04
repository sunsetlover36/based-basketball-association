import { useState } from 'react';
import { motion } from 'framer-motion';

import { useDialog } from '@/store';
import { cn } from '@/lib/utils';
import { useUser } from '@/lib/queryClient';
import { Button } from '@/components/button';
import { History } from './History';
import { Players } from './Players';
import { Tactics } from './Tactics';
import { Training } from './Training';

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
    const filteredPlayers = players.filter((p) => p);
    setSelectedPlayer(filteredPlayers.find((p) => p.tokenId === tokenId));

    togglePlayerDialog(true);
  };

  if (!user) {
    return null;
  }

  const { team: { players } = { players: [] } } = user;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex justify-center"
    >
      <div className="w-1/2">
        <div className="flex items-center">
          <div className="text-4xl mb-1 border-2 border-blue-600 w-full h-52 rounded-lg flex flex-col items-center justify-center">
            <img src="/team-logo.png" className="w-32 h-32" />
            <h2>
              Team <span className="text-blue-600">Based</span> Camp
            </h2>
          </div>
          {/* <div>
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
          </div> */}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="my-2"
        >
          <div className="flex mb-16 justify-between">
            <div className="w-1/2 mr-8">
              <Tactics />
            </div>
            <History className="w-1/2" />
          </div>

          <Players
            hoveredPlayer={hoveredPlayer}
            selectedPlayer={selectedPlayer}
            setHoveredPlayer={setHoveredPlayer}
            setSelectedPlayer={handleSetPlayer}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
