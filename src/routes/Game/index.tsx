import { motion } from 'framer-motion';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { useGame } from '@/lib/queryClient';
import { shortenAddress } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/components';
import { Link } from 'lucide-react';
import { gameContract } from '@/lib/contracts';

const allStarColors = [
  'purple',
  'blue',
  'red',
  'yellow',
  'green',
  'orange',
  'pink',
];
const PokerTable = ({ players }) => {
  const { address } = useAccount();
  const positions = [
    '-top-16 left-1/2 transform -translate-x-1/2', // Top center
    '-bottom-16 left-1/2 transform -translate-x-1/2', // Bottom center
    'top-1/2 -left-12 transform -translate-y-1/2', // Left center
    'top-1/2 -right-12 transform -translate-y-1/2', // Right center
    '-top-16 left-1/4 transform -translate-x-1/2', // Top left
    '-top-16 right-1/4 transform translate-x-1/2', // Top right
    '-bottom-16 left-1/4 transform -translate-x-1/2', // Bottom left
    '-bottom-16 right-1/4 transform translate-x-1/2', // Bottom right
  ];

  const [allStarColor, setAllStarColor] = useState(allStarColors[0]);

  useEffect(() => {
    setAllStarColor(
      allStarColors[Math.floor(Math.random() * allStarColors.length)]
    );
    const interval = setInterval(() => {
      setAllStarColor(
        allStarColors[Math.floor(Math.random() * allStarColors.length)]
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-blue-950 rounded-full">
      <div className="w-full h-full flex justify-center items-center absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-blue-700 text-9xl opacity-20 absolute bottom-4">
          BBA
        </h1>
        <motion.div
          transition={{ duration: 1, delay: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="w-28 h-36 border-2 bg-black rounded-lg mx-auto mb-1 flex items-center justify-center text-4xl transition-colors duration-[1.5s]"
            style={{ color: allStarColor, borderColor: allStarColor }}
          >
            ?
          </div>
          <div className="text-center text-blue-400 leading-4">
            <p className="text-lg">Room All Star</p>
            <p>from ???</p>
          </div>
        </motion.div>
      </div>
      {players.slice(0, 8).map((player, index) => {
        return (
          <div
            key={index}
            className={`absolute ${positions[index]} bg-black border-2 border-blue-600 rounded-lg px-4 py-2`}
          >
            <p className="text-center">
              {player.address === address
                ? 'You'
                : shortenAddress(player.address)}
            </p>
            <div className="flex items-center gap-2">
              {[0, 1].map(() => (
                <div className="w-20 h-28 border-2 border-blue-600 rounded-lg flex items-center justify-center">
                  ?
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Game = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { data: game } = useGame(gameId);
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [dots, setDots] = useState('');
  const [leaveTxHash, setLeaveTxHash] = useState<`0x${string}` | undefined>();
  const leaveTxReceipt = useWaitForTransactionReceipt({ hash: leaveTxHash });

  const leaveGame = async () => {
    const txHash = await writeContractAsync({
      ...gameContract,
      functionName: 'leaveGameRoom',
      args: [BigInt(gameId!)],
    });
    setLeaveTxHash(txHash);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((dots) => (dots === '...' ? '' : dots + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (leaveTxReceipt.data) {
      setLeaveTxHash(undefined);
      navigate('/games');
    }
  }, [leaveTxReceipt.data]);

  if (!game) {
    return null;
  }

  const { players, maxPlayers, owner, rounds } = game;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full min-h-[60vh]"
      >
        <div className="mb-8">
          <div className="flex items-center">
            <h2 className="text-5xl mr-4">Game Room #{gameId}</h2>
            <div className="flex items-center relative top-px">
              <Button
                variant="error"
                className="text-2xl rounded-lg px-4 mr-4"
                size="sm"
                onClick={leaveGame}
              >
                Leave
              </Button>
              <Button
                className="bg-blue-600 text-white text-2xl rounded-lg px-4"
                size="sm"
              >
                Share
              </Button>
            </div>
          </div>
          <p className="text-xl mb-2">Hosted by {shortenAddress(owner)}</p>
        </div>
        <div className="flex border-4 border-blue-600 rounded-lg h-[60vh]">
          <div className="w-[440px] h-full border-r-4 border-blue-600 p-8 pr-8">
            <div>
              {players.length < maxPlayers && (
                <div className="mb-4">
                  <h2 className="text-5xl w-fit">
                    {players.length}/{maxPlayers}
                  </h2>
                  <p className="text-2xl">
                    Waiting for {maxPlayers - players.length} players{dots}
                  </p>
                </div>
              )}
              {players.map((player) => {
                const { address: pAddress, players } = player;

                return (
                  <div
                    key={pAddress}
                    className="p-4 border-4 border-blue-600 rounded-lg"
                  >
                    <div className="flex mb-2">
                      {[0, 1, 2].map((_, i) => {
                        const player = players.length > i ? players[i] : null;

                        return (
                          <img
                            src="/back.png"
                            key={i}
                            className="select-none w-20 h-28 shadow-sm shadow-black mr-3 last:mr-0 text-2xl transform transition-transform duration-500 ease-in-out hover:-translate-y-1"
                          />
                        );
                      })}
                    </div>
                    <p className="text-right leading-4 text-xl">
                      {pAddress === address ? 'You' : shortenAddress(pAddress)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="h-full w-full relative">
            <div className="p-8 w-full h-1/2 border-b-4 border-blue-600">
              <h2 className="text-5xl">Upcoming match</h2>
              <div>
                {rounds.length > 0 ? (
                  rounds.map((round) => (
                    <div key={round.roundId} className="flex items-center mb-2">
                      <div className="w-20 h-28 border-4 border-blue-400 shadow-sm shadow-black bg-blue-600 rounded-lg flex items-center justify-center mr-3 last:mr-0 text-2xl">
                        {round.gameId}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-2xl">Waiting for the round to start</p>
                )}
              </div>

              <div className="absolute top-8 right-8 border-4 border-blue-600 py-2 px-4 rounded-lg">
                <h3 className="text-3xl text-center">
                  <span className="text-blue-600">Blue</span> vs.{' '}
                  <span className="text-red-600">Red</span>
                </h3>
                <h2 className="text-4xl text-center">0 &mdash; 0</h2>
              </div>
            </div>
            <div className="p-8 w-full h-1/2 relative">
              <h2 className="text-5xl">Room rounds</h2>
              <div>
                {rounds.length > 0 ? (
                  rounds.map((round) => (
                    <div key={round.roundId} className="flex items-center mb-2">
                      <div className="w-20 h-28 border-4 border-blue-400 shadow-sm shadow-black bg-blue-600 rounded-lg flex items-center justify-center mr-3 last:mr-0 text-2xl">
                        {round.gameId}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-2xl">No rounds yet</p>
                )}
              </div>
              <div className="absolute right-8 bottom-8 flex items-center gap-8">
                <div className="flex items-center gap-8">
                  <Button size="lg">-</Button>
                  <p className="text-3xl">25</p>
                  <Button size="lg">+</Button>
                </div>
                <Button
                  className="bg-blue-600 text-white text-2xl rounded-lg px-4"
                  size="lg"
                >
                  Place bet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
