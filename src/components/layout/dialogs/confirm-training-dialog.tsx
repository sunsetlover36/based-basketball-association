import { useEffect, useMemo, useState } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import toast from 'react-hot-toast';

import { useDialog, useStore } from '@/store';
import { Modal, Button } from '@/components';
import { cn, TRAINING_MODE_MAP } from '@/lib/utils';
import { queryClient, useTeam } from '@/lib/queryClient';
import { DialogName } from '@/store/ui/types';
import { trainPlayer } from '@/lib/api';
import { useParams } from 'react-router-dom';

export const ConfirmTrainingDialog = () => {
  const { address, playerIndex } = useParams();
  const { data: team } = useTeam(address);

  const player = useMemo(() => {
    return team?.players[Number(playerIndex) - 1];
  }, [team, playerIndex]);

  const { trainingMode, setTrainingMode } = useStore();
  const { isOpen, toggle } = useDialog(DialogName.CONFIRM_TRAINING_DIALOG);

  const { writeContractAsync } = useWriteContract();

  const [joinTx, setJoinTx] = useState<`0x${string}` | undefined>();
  const joinTxReceipt = useWaitForTransactionReceipt({
    hash: joinTx,
  });

  const onStartTraining = async () => {
    const { _id, fullName } = player!;

    await trainPlayer({
      playerId: _id,
      trainingMode: trainingMode!,
    });
    await queryClient.invalidateQueries({
      queryKey: ['team', address],
    });
    toast(`${fullName} started training!`, {
      style: {
        border: '2px solid #2563EB',
        color: 'black',
      },
      icon: '🎉',
    });
    toggle(false);
  };

  useEffect(() => {
    if (joinTxReceipt.data && joinTxReceipt.data.status === 'success') {
      console.log(joinTxReceipt.data);
      queryClient.invalidateQueries({
        queryKey: ['games'],
      });
      toast.success('Game created!', { icon: '🎮' });
    }
  }, [joinTxReceipt.data]);

  if (!player || trainingMode === null) {
    return null;
  }

  const { fullName } = player;
  const training = TRAINING_MODE_MAP[trainingMode];
  return (
    <Modal
      showModal={isOpen}
      close={() => {
        setTrainingMode(null);
        toggle(false);
      }}
      title="Confirm Training"
      fixedButton
      buttons={
        <Button className="ml-4" onClick={onStartTraining}>
          Confirm
        </Button>
      }
      className="sm:max-w-3xl"
    >
      <p>Confirm the start of the training session for</p>
      <h3 className="text-2xl text-blue-600 my-1">{fullName}</h3>
      <p className="mb-4">
        <span className="text-blue-600">
          {training.label} {training.emoji}
        </span>{' '}
        will take <span className="text-blue-600">12</span> hours.
      </p>
      <div className="flex justify-end">
        <div className="w-fit bg-blue-600 rounded-lg text-white px-2">
          🏀 200 points for this training session!
        </div>
      </div>
    </Modal>
  );
};
