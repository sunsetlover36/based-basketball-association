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
import { checkTeamName, createTeam, shareSocials } from '@/lib/api';

export const ConfirmTeamDialog = () => {
  const account = useActiveAccount();
  const { isOpen, toggle } = useDialog(DialogName.CONFIRM_TEAM_DIALOG);
  const { teamData, setTeamData, toggleConfetti } = useStore();

  const { writeContractAsync } = useWriteContract();

  const [isLoading, setIsLoading] = useState(false);
  const [createTx, setCreateTx] = useState<`0x${string}` | undefined>();
  const createTxReceipt = useWaitForTransactionReceipt({
    hash: createTx,
  });
  const [isTeamCreated, setIsTeamCreated] = useState(false);
  const [teamName, setTeamName] = useState<string>('');
  const [isShared, setIsShared] = useState(false);

  const onCreateTeam = async () => {
    setIsLoading(true);

    try {
      const isTeamExists = await checkTeamName(teamData!.teamName);

      if (!isTeamExists) {
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
      } else {
        toast.error('Team already exists!', {
          id: 'error-creation-tx',
          icon: '❌',
        });
      }
    } catch {
      toast.error('Something went wrong!', {
        id: 'error-creation-tx',
        icon: '❌',
      });
    } finally {
      setIsLoading(false);
    }
  };
  const processCreationTx = async () => {
    try {
      await createTeam(teamData!);
      setTeamName(teamData!.teamName);

      await queryClient.invalidateQueries({
        queryKey: ['user'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['team', account!.address],
      });
      await queryClient.invalidateQueries({
        queryKey: ['hasTeam', account!.address],
      });
      setTeamData(null);
      toggle(true);
      setIsTeamCreated(true);
      toggleConfetti(true);

      setTimeout(() => {
        toggleConfetti(false);
      }, 10000);

      toast.success('Team created!', { id: 'team-created', icon: '🎮' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const onShare = async (social: 'x' | 'warpcast') => {
    setIsShared(true);

    if (social === 'x') {
      window.open(
        `https://x.com/intent/post?text=I%20just%20became%20the%20coach%20of%20my%20team%20${teamName}%20in%20%40BasedBBA%21%20Join%20the%20training%20on%20%40base%20with%20me%21`,
        '_blank'
      );
    } else if (social === 'warpcast') {
      window.open(
        `https://warpcast.com/~/compose?text=I%20just%20became%20the%20coach%20of%20my%20team%20${teamName}%20in%20%40basedbba%21%20Join%20the%20training%20on%20%40base%20with%20me%21`,
        '_blank'
      );
    }

    await shareSocials();
  };

  useEffect(() => {
    if (!isOpen) {
      setIsTeamCreated(false);
      setTeamData(null);
    }
  }, [isOpen]);
  useEffect(() => {
    if (createTxReceipt.data && createTxReceipt.data.status === 'success') {
      const { status } = createTxReceipt.data;
      if (status === 'success') {
        processCreationTx();
      } else {
        toast.error('Something went wrong with transaction!', {
          id: 'tx-error',
          icon: '❌',
        });
        setIsLoading(false);
      }
    }
  }, [createTxReceipt.data]);

  if (!account) {
    toggle(false);
    return null;
  }

  const faq = [
    {
      title: 'Train your players',
      content: (
        <p>
          The first step is to train your players.
          <br />
          The more you train your basketball player, the stronger he will be in
          the season matches!
        </p>
      ),
    },
    {
      title: 'Cheer other players',
      content: (
        <p>
          The second step is to cheer other players.
          <br />
          For each cheer, you give 🏀{' '}
          <span className="text-blue-600">50 points</span> to the coach and
          receive 🏀 <span className="text-blue-600">50 points</span> yourself!
        </p>
      ),
    },
    {
      title: 'Share with friends',
      content: (
        <div>
          {!isShared && (
            <div className="flex items-center gap-x-2 my-1">
              <Button className="bg-black" onClick={() => onShare('x')}>
                On X
              </Button>
              <Button
                className="bg-purple-700"
                onClick={() => onShare('warpcast')}
              >
                On Warpcast
              </Button>
            </div>
          )}

          <p>
            {isShared ? (
              <>
                🎉 Thank you! You received 🏀{' '}
                <span className="text-blue-600">1000 points</span>
              </>
            ) : (
              <>
                You will receive 🏀{' '}
                <span className="text-blue-600">1000 points</span> for sharing!
              </>
            )}
          </p>
        </div>
      ),
    },
  ];
  return (
    <Modal
      showModal={isOpen}
      close={() => {
        toggle(false);
      }}
      title={isTeamCreated ? 'Team Created 🎉' : 'Creating Team'}
      fixedButton
      buttons={
        !isTeamCreated && (
          <Button className="ml-4" disabled={isLoading} onClick={onCreateTeam}>
            Create
          </Button>
        )
      }
    >
      {!isTeamCreated &&
        (isLoading ? (
          <p className="flex items-center">
            <Loader size={20} className="mr-2" />
            In progress...
          </p>
        ) : (
          <p>Confirm the creation of the team {teamData?.teamName}.</p>
        ))}

      {isTeamCreated && (
        <div className="mb-4">
          <p className="text-lg mb-2">What to do next?</p>

          <div>
            {faq.map((item, index) => (
              <div
                key={item.title}
                className="mb-4 border-2 border-blue-600 rounded-lg last:mb-0 px-4 py-2"
              >
                <h3 className="font-bold text-xl text-blue-600">
                  {index + 1}. {item.title}
                </h3>
                {item.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};
