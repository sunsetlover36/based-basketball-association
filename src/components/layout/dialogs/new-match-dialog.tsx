import { useEffect, useState } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { useDialog } from '@/store';
import { Modal, Button } from '@/components';
import { cn } from '@/lib/utils';
import { gameContract } from '@/lib/contracts';
import { queryClient } from '@/lib/queryClient';
import toast from 'react-hot-toast';

const GAMEMODES = [
  {
    id: 0,
    name: 'Poker 🃏',
    description: 'Basketball Texas Holdem',
  },
  {
    id: 1,
    name: 'Battle Royale 🏆',
    description: <>Survive in&nbsp;the arena and win the prize!</>,
    disabled: true,
  },
];
export const NewMatchDialog = () => {
  const { isOpen, toggle } = useDialog('newMatchDialog');

  const { writeContractAsync } = useWriteContract();

  const [gamemode, setGamemode] = useState(0); // 0 - poker, 1 - battle royale
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [isSelectedVisible, setIsSelectedVisible] = useState(true);

  const [joinTx, setJoinTx] = useState<`0x${string}` | undefined>();
  const joinTxReceipt = useWaitForTransactionReceipt({
    hash: joinTx,
  });

  const onJoinMatch = async () => {
    const txHash = await writeContractAsync({
      ...gameContract,
      functionName: 'createGameRoom',
      args: [BigInt(maxPlayers), BigInt(gamemode)],
    });
    setJoinTx(txHash);

    toggle(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSelectedVisible((visible) => !visible);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (joinTxReceipt.data && joinTxReceipt.data.status === 'success') {
      console.log(joinTxReceipt.data);
      queryClient.invalidateQueries({
        queryKey: ['games'],
      });
      toast.success('Game created!', { icon: '🎮' });
    }
  }, [joinTxReceipt.data]);

  return isOpen ? (
    <Modal
      showModal={isOpen}
      close={() => {
        toggle(false);
      }}
      title="New match"
      fixedButton
      buttons={
        <Button className="ml-4" onClick={onJoinMatch}>
          Confirm
        </Button>
      }
      className="sm:max-w-3xl"
    >
      <div className="mb-4">
        <h4 className="text-lg mb-1">Select gamemode</h4>
        <div className="flex">
          {GAMEMODES.map((gm) => (
            <div
              key={gm.id}
              className={cn(
                'p-4 border-2 border-blue-600 rounded-lg mr-4 last:mr-0 w-72 cursor-pointer select-none',
                gm.disabled && 'opacity-50 cursor-not-allowed',
                gm.id === gamemode && !isSelectedVisible && 'border-blue-500'
              )}
              onClick={() => !gm.disabled && setGamemode(gm.id)}
            >
              <p className="text-lg">{gm.name}</p>
              <p className="leading-4 h-8">{gm.description}</p>
              {gm.disabled && (
                <p className="mt-2 text-blue-600 text-right">Coming soon</p>
              )}
              {gm.id === gamemode && isSelectedVisible && (
                <p className="mt-2 text-blue-600 text-right">Selected</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg mb-1">Max players</h4>
        <div className="flex">
          {[2, 4, 8].map((num) => (
            <div
              key={num}
              className={cn(
                'px-4 border-2 border-blue-600 rounded-lg mr-4 last:mr-0 cursor-pointer text-lg select-none',
                maxPlayers === num && 'bg-blue-600 text-white'
              )}
              onClick={() => setMaxPlayers(num)}
            >
              {num} players
            </div>
          ))}
        </div>
      </div>
    </Modal>
  ) : null;
};
