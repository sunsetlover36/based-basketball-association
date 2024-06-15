import { useEffect, useState } from 'react';
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import toast from 'react-hot-toast';
import { useActiveAccount } from 'thirdweb/react';

import { useDialog, useStore } from '@/store';
import { Modal, Button, Loader } from '@/components';
import { queryClient } from '@/lib/queryClient';
import { DialogName } from '@/store/ui/types';
import { teamsContract } from '@/lib/contracts';
import { createTeam } from '@/lib/api';

export const ConfirmTeamDialog = () => {
  const account = useActiveAccount();
  const { isOpen, toggle } = useDialog(DialogName.CONFIRM_TEAM_DIALOG);
  const { teamData, setTeamData } = useStore();

  const { writeContractAsync, error, failureReason } = useWriteContract();

  const [isLoading, setIsLoading] = useState(false);
  const [createTx, setCreateTx] = useState<`0x${string}` | undefined>();
  const createTxReceipt = useWaitForTransactionReceipt({
    hash: createTx,
  });
  const onCreateTeam = async () => {
    setIsLoading(true);

    try {
      const txHash = await writeContractAsync({
        ...teamsContract,
        functionName: 'createTeamFCFS',
        args: [teamData!.teamName],
      });
      setCreateTx(txHash);
    } catch (err) {
      const msg = (err as BaseError).shortMessage.replace(
        `The contract function "createTeamFCFS" reverted with the following reason:\n`,
        ''
      );
      toast.error(msg, { id: 'error-creation-tx', icon: '❌' });
      setIsLoading(false);
    }
  };
  const processCreationTx = async () => {
    console.log(createTxReceipt.data);
    try {
      await createTeam(teamData!);
      await queryClient.invalidateQueries({
        queryKey: ['user'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['team', account!.address],
      });
      setTeamData(null);
      toggle(false);
      toast.success('Team created!', { id: 'team-created', icon: '🎮' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (createTxReceipt.data && createTxReceipt.data.status === 'success') {
      console.log('WHY YOU CREATE', createTxReceipt.data);
      processCreationTx();
    }
  }, [createTxReceipt.data]);

  if (!account) {
    toggle(false);
    return null;
  }

  return (
    <Modal
      showModal={isOpen}
      close={() => {
        if (!isLoading) {
          toggle(false);
        }
      }}
      title="Creating Team"
      fixedButton
      buttons={
        <Button className="ml-4" disabled={isLoading} onClick={onCreateTeam}>
          Create
        </Button>
      }
    >
      {isLoading ? (
        <p className="flex items-center">
          <Loader size={20} className="mr-2" />
          In progress...
        </p>
      ) : (
        <p>Confirm the creation of the team {teamData?.teamName}.</p>
      )}
    </Modal>
  );
};
