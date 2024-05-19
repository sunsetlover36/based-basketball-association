import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

import { Button } from '@/components';
import { nftContract } from '@/lib/contracts';
import { queryClient } from '@/lib/queryClient';

export const Mint = () => {
  const windowSize = useWindowSize();

  const { authenticated } = usePrivy();
  const { address } = useAccount();

  const { data: balance, queryKey: balanceKey } = useReadContract({
    ...nftContract,
    functionName: 'balanceOf',
    args: [address],
  });
  const { data: totalMinted, queryKey: totalMintedKey } = useReadContract({
    ...nftContract,
    functionName: 'totalMinted',
  });
  const { data: totalSupply } = useReadContract({
    ...nftContract,
    functionName: 'nextTokenIdToMint',
  });
  const { data: claimCondition } = useReadContract({
    ...nftContract,
    functionName: 'getClaimConditionById',
    args: [0],
  });
  const { writeContractAsync } = useWriteContract();

  const [isConfettiVisible, setIsConfettiVisible] = useState(false);
  const [mintTxHash, setMintTxHash] = useState(null);
  const [isMinted, setIsMinted] = useState(balance > 0n);
  const mintTxReceipt = useWaitForTransactionReceipt({ hash: mintTxHash });

  const mint = async () => {
    const { merkleRoot, quantityLimitPerWallet } = claimCondition;
    const txHash = await writeContractAsync({
      ...nftContract,
      functionName: 'claim',
      args: [
        address,
        1n,
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        0n,
        [
          [merkleRoot],
          quantityLimitPerWallet.toString(),
          '0',
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        ],
        '0x',
      ],
    });

    setMintTxHash(txHash);
  };

  useEffect(() => {
    if (mintTxReceipt.data) {
      queryClient.invalidateQueries({
        queryKey: totalMintedKey,
      });
      queryClient.invalidateQueries({
        queryKey: balanceKey,
      });

      setMintTxHash(undefined);
      setIsMinted(true);
      setIsConfettiVisible(true);

      setTimeout(() => {
        setIsConfettiVisible(false);
      }, 10000);
    }
  }, [mintTxReceipt.data, totalMintedKey]);

  if (
    balance === undefined ||
    totalMinted === undefined ||
    totalSupply === undefined
  ) {
    return null;
  }

  return (
    <>
      <motion.div
        key={isMinted}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {isMinted || balance > 0n ? (
          <div>
            <p className="text-xl">Congratulations! What's next?</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center mb-8">
              <img src="/logo.jpg" className="w-64 h-64 mb-2" />
              <p className="text-xl">
                Pack containing 3 unique rookie basketball players ready to
                play.
              </p>
            </div>

            <div>
              <div className="mb-4">
                <p className="text-xl text-center mb-1">
                  {totalMinted === totalSupply
                    ? 'Sold out'
                    : `${totalMinted}/${totalSupply}`}
                </p>

                <div className="w-1/2 mx-auto bg-slate-400 rounded-lg h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-lg"
                    style={{
                      width: `${
                        (totalMinted.toString() / totalSupply.toString()) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {authenticated ? (
                <Button className="mx-auto block" onClick={mint}>
                  Mint
                </Button>
              ) : (
                <p className="text-center">Connect wallet to mint</p>
              )}
            </div>
          </>
        )}
      </motion.div>

      {isConfettiVisible && (
        <Confetti
          width={windowSize.width * 0.9}
          height={windowSize.height * 0.95}
          numberOfPieces={500}
          recycle={false}
          className="mx-auto"
        />
      )}
    </>
  );
};
