import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { Button } from '@/components';
import { nftContract } from '@/lib/contracts';
import { queryClient, useUser } from '@/lib/queryClient';

export const Burn = () => {
  const { data: user } = useUser();

  const { authenticated } = usePrivy();
  const { address } = useAccount();

  const { data: balance, queryKey: balanceKey } = useReadContract({
    ...nftContract,
    functionName: 'balanceOf',
    args: [address],
  });

  const { writeContractAsync } = useWriteContract();

  const [burnTxHash, setBurnTxHash] = useState(null);
  const [isBurned, setIsBurned] = useState(balance > 0n);
  const burnTxReceipt = useWaitForTransactionReceipt({ hash: burnTxHash });

  const burn = async () => {
    const txHash = await writeContractAsync({
      ...nftContract,
      functionName: 'burn',
      args: [BigInt(user.packs[0])],
    });

    setBurnTxHash(txHash);
  };

  useEffect(() => {
    if (burnTxReceipt.data) {
      queryClient.invalidateQueries({
        queryKey: balanceKey,
      });

      setBurnTxHash(undefined);
      setIsBurned(true);

      toast('3 players have been airdropped to your wallet!', {
        style: {
          border: '2px solid #2563EB',
          color: 'black',
        },
        icon: '🎉',
      });
    }
  }, [burnTxReceipt.data]);

  return (
    <motion.div
      key={isBurned}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div className="flex flex-col justify-center items-center mb-4">
        <img src="/logo.jpg" className="w-64 h-64 mb-2" />
        <p className="text-xl">
          Burn your pack and receive 3 players. Then, you will need to create
          your team.
        </p>
      </div>

      {balance > 0n ? (
        <>
          {authenticated ? (
            <Button className="mx-auto block" onClick={burn}>
              Burn
            </Button>
          ) : (
            <p className="text-center">Connect wallet to burn</p>
          )}
        </>
      ) : (
        <p className="text-center text-lg">You don't have a pack to burn.</p>
      )}
    </motion.div>
  );
};
