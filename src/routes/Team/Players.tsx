import { motion } from 'framer-motion';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { cn } from '@/lib/utils';
import { useUser } from '@/lib/queryClient';
import { Player } from '@/components';
import { useStore } from '@/store';
import { Draggable, Droppable } from '@/components/layout';

export const Players = ({
  selectedPlayer,
  hoveredPlayer,
  setHoveredPlayer,
  setSelectedPlayer,
}) => {
  const { data: user } = useUser();
  const { gym, setIsTrainingMode } = useStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (!user) {
    return null;
  }

  const handleDragEnd = ({ over, active: { id } }) => {
    if (over) {
      setIsTrainingMode(true);
      setSelectedPlayer(id);
    }
  };

  const { team: { players } = { players: [] } } = user;
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex justify-between">
        <motion.div className="w-1/2 mr-8">
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
        <motion.div className="w-1/2">
          <h2 className="text-2xl mb-2">Gym</h2>

          <div className={cn('flex gap-4 mt-2 mb-8 min-h-48 w-full')}>
            {gym.length > 0 &&
              gym.map((player) => {
                return (
                  <div>
                    <Player
                      key={player.tokenId}
                      player={player}
                      isHovered={
                        hoveredPlayer === player.tokenId ||
                        selectedPlayer === player.tokenId
                      }
                      onMouseEnter={() => setHoveredPlayer(player.tokenId)}
                      onMouseLeave={() => setHoveredPlayer(null)}
                      onClick={() => {
                        setSelectedPlayer(player.tokenId);
                        setIsTrainingMode(true);
                      }}
                    />
                    <div className="flex justify-between items-center text-sm">
                      <p>{player.trainingType}</p>
                      <p>3 hours</p>
                    </div>
                  </div>
                );
              })}
            <Droppable droppableId={'droppable'}>
              <div
                className={cn(
                  'cursor-pointer w-40 h-[186px] border-2 border-blue-600 rounded-lg flex items-center justify-center'
                )}
              >
                <p className="text-center leading-4">
                  Drag and drop players here
                </p>
              </div>
            </Droppable>
          </div>
        </motion.div>
      </div>
    </DndContext>
  );
};
