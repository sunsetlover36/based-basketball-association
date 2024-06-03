import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { useDialog } from '@/store';
import { useUser, useGames, queryClient } from '@/lib/queryClient';
import { Button, Loader } from '@/components';
import { gameContract } from '@/lib/contracts';

export const Games = () => {
  const navigate = useNavigate();
  const { toggle } = useDialog('newMatchDialog');
  const { address } = useAccount();
  const { data: user } = useUser();
  const { data: games } = useGames();
  const { writeContractAsync } = useWriteContract();

  const [joinTxHash, setJoinTxHash] = useState<`0x${string}` | undefined>();
  const joinTxReceipt = useWaitForTransactionReceipt({ hash: joinTxHash });

  useEffect(() => {
    if (joinTxReceipt.data && joinTxReceipt.data.status === 'success') {
      queryClient.invalidateQueries({
        queryKey: ['games'],
      });
      toast.success('Joined room successfully!');
      console.log(joinTxReceipt.data);
      // navigate(`/games/${joinTxReceipt.data.logs[0].topics[2]}`);
    }
  }, [joinTxReceipt.data]);

  if (!user || !games) {
    return <Loader />;
  }

  const { userRooms, notStartedRooms } = games;

  const handleCreateMatch = () => {
    if (userRooms.length > 0) {
      toast('You already have a match!', {
        style: {
          border: '2px solid #2563EB',
        },
      });
      return;
    }

    toggle(true);
  };
  const handleJoin = async (gameId: number) => {
    const room = [...userRooms, ...notStartedRooms].find(
      (r) => r.gameId === gameId
    );
    if (room.players.some((p) => p.address !== address)) {
      const joinTxHash = await writeContractAsync({
        ...gameContract,
        functionName: 'joinGameRoom',
        args: [BigInt(gameId)],
      });
      setJoinTxHash(joinTxHash);
    } else {
      navigate(`/games/${gameId}`);
    }
  };

  const rooms = userRooms.concat(notStartedRooms);
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full min-h-[60vh] flex items-center justify-center"
      >
        <div>
          <div className="mb-4 flex flex-col items-center justify-center">
            <h2 className="text-6xl text-center mb-1">Game rooms</h2>
            <Button size="sm" onClick={handleCreateMatch}>
              Create new room
            </Button>
          </div>

          {rooms && rooms.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {rooms.map((room) => {
                const { players, maxPlayers } = room;
                return (
                  <div
                    key={room._id}
                    className="border-2 border-blue-600 p-4 w-1/2 rounded-lg flex items-center justify-between"
                  >
                    <h3 className="text-xl">
                      {players.length}/{maxPlayers}
                    </h3>
                    <Button onClick={() => handleJoin(room.gameId)}>
                      Join
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-xl">No rooms. Create one!</p>
          )}
        </div>
      </motion.div>
    </>
  );
};
