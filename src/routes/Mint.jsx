import { usePrivy } from '@privy-io/react-auth';
import { useReadContract } from 'wagmi';

import { Button } from '@/components';
import { nftContract } from '@/lib/contracts';

export const Mint = () => {
  const { authenticated } = usePrivy();

  const { data: totalMinted } = useReadContract({
    ...nftContract,
    functionName: 'totalMinted',
  });
  const { data: totalSupply } = useReadContract({
    ...nftContract,
    functionName: 'nextTokenIdToMint',
  });

  if (totalMinted === undefined || totalSupply === undefined) {
    return null;
  }
  console.log(totalMinted, totalSupply);

  return (
    <div>
      <div className="flex flex-col justify-center items-center mb-8">
        <img src="/logo.jpg" className="w-64 h-64 mb-2" />
        <p className="text-xl">
          Pack containing 3 unique rookie basketball players ready to play.
        </p>
      </div>

      {authenticated && (
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

          <Button className="mx-auto block">Mint</Button>
        </div>
      )}
    </div>
  );
};
