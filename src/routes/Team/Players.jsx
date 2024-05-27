import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { updateUser } from '@/lib/api';
import { cn, formatIndexToPos } from '@/lib/utils';
import { useUser, queryClient } from '@/lib/queryClient';
import { Player } from '@/components';
import { Droppable, Draggable } from '@/components/layout';

export const Players = ({
  selectedPlayer,
  hoveredPlayer,
  setHoveredPlayer,
  setSelectedPlayer,
}) => {
  const { data: user, isFetching: isUserFetching } = useUser();

  const [lineup, setLineup] = useState([]);
  const [substitutes, setSubstitutes] = useState([]);

  const handleTacticsUpdate = async ({ lineup, substitutes }) => {
    await updateUser({ lineup, substitutes });
    await queryClient.invalidateQueries(['user']);
  };
  const handleDragEnd = (event) => {
    if (user && event.over && event.over.id.includes('droppable')) {
      const players = user.team.lineup.concat(user.team.substitutes);
      const index = parseInt(event.over.id.split('-')[2]);
      const playerId = event.active.id;
      const player = players
        .filter((p) => p)
        .find((player) => player.tokenId === playerId);

      let newLineup = [...lineup];
      let newSubs = [...substitutes];
      if (event.over.id.includes('lineup')) {
        const oldPlayer =
          newLineup[index]?.tokenId !== player.tokenId
            ? newLineup[index]
            : null;

        const existingPlayerIndex = newLineup.findIndex(
          (p) => p?.tokenId === player.tokenId
        );
        if (existingPlayerIndex !== -1 && existingPlayerIndex !== index) {
          newLineup[existingPlayerIndex] = oldPlayer;
        }

        newLineup[index] = player;
        newSubs = newSubs.filter((p) => p.tokenId !== player.tokenId);

        setLineup(newLineup);
        setSubstitutes(newSubs);
      } else if (event.over.id.includes('substitutes')) {
        const playerIndex = newLineup.findIndex(
          (p) => p?.tokenId === player.tokenId
        );
        if (playerIndex !== -1) {
          newLineup[playerIndex] = null;
        }
        setLineup(newLineup);

        if (!substitutes.find((p) => p.tokenId === player.tokenId)) {
          newSubs = [...newSubs, player];
        }
        setSubstitutes(newSubs);
      }

      handleTacticsUpdate({
        lineup: newLineup,
        substitutes: newSubs,
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (user && !isUserFetching) {
      setLineup(user.team.lineup);
      setSubstitutes(user.team.substitutes);
    }
  }, [user, isUserFetching]);

  if (!user) {
    return null;
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <motion.div>
        <h2 className="text-2xl mb-2">Team players</h2>

        <div>
          <h3 className="text-xl text-slate-600">Starting lineup</h3>
          <div className="flex items-center gap-4 mt-2 mb-8">
            {[0, 1, 2].map((i) => {
              const player = lineup[i];
              return (
                <Droppable droppableId={`droppable-lineup-${i}`} key={i}>
                  <div className="p-2 border-2 border-blue-600 rounded-lg">
                    <div className="text-center">{formatIndexToPos(i)}</div>
                    {player ? (
                      <Draggable draggableId={player.tokenId}>
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
                    ) : (
                      <div className="border-2 border-black w-40 h-48 rounded-lg" />
                    )}
                  </div>
                </Droppable>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xl text-slate-600">Substitute players</h3>

          <Droppable droppableId="droppable-substitutes">
            <div
              className={cn(
                'flex gap-4 mt-2 mb-8 min-h-48 w-full',
                substitutes.length > 0 && 'items-center'
              )}
            >
              {substitutes.length > 0 ? (
                substitutes.map((player, i) => {
                  return (
                    <Draggable
                      draggableId={player.tokenId}
                      key={player.tokenId}
                    >
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
                <p>No substitutes</p>
              )}
            </div>
          </Droppable>
        </div>
      </motion.div>
    </DndContext>
  );
};
