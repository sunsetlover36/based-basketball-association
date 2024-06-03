import { useRef } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { useUser } from '@/lib/queryClient';
import { Player } from '@/components';
import { useStore } from '@/store';
import { Draggable, Droppable } from '@/components/layout';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

export const Players = ({
  selectedPlayer,
  hoveredPlayer,
  setHoveredPlayer,
  setSelectedPlayer,
}) => {
  const { data: user } = useUser();
  const { gym } = useStore();

  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });

  if (!user) {
    return null;
  }

  const { team: { players } = { players: [] } } = user;
  return (
    <DndContext>
      <div className="flex">
        <motion.div className="w-1/2 mr-16">
          <h2 className="text-2xl mb-2">Team players</h2>

          <div className={cn('flex gap-4 mt-2 mb-8 min-h-48 w-full')}>
            {players.length > 0 ? (
              players.map((player) => {
                return (
                  <Draggable key={player.tokenId} draggableId={player.tokenId}>
                    <Player
                      player={player}
                      isHovered={
                        hoveredPlayer === player.tokenId ||
                        selectedPlayer === player.tokenId
                      }
                      onMouseEnter={() => setHoveredPlayer(player.tokenId)}
                      onMouseLeave={() => setHoveredPlayer(null)}
                      onClick={() => setSelectedPlayer(player.tokenId)}
                    />
                  </Draggable>
                );
              })
            ) : (
              <p>No players</p>
            )}
          </div>
        </motion.div>
        <motion.div>
          <h2 className="text-2xl mb-2">Gym</h2>

          <div className={cn('flex gap-4 mt-2 mb-8 min-h-48 w-full')}>
            {gym.length > 0 ? (
              gym.map((player) => {
                return <Player key={player.tokenId} player={player} />;
              })
            ) : (
              <Droppable droppableId={'droppable'}>
                <div
                  className={cn(
                    'cursor-pointer w-40 h-48 border-2 border-blue-600 rounded-lg flex items-center justify-center'
                  )}
                >
                  <p className="text-center leading-4">
                    Drag and drop players here
                  </p>
                </div>
              </Droppable>
            )}
          </div>
        </motion.div>
      </div>
    </DndContext>
  );
};
