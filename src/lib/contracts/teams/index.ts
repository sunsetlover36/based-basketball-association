import { APP_THIRDWEB_CHAIN, IS_PROD } from '@/lib/utils';
import { abi } from './abi';
import { getContract } from 'thirdweb';
import { thirdwebClient } from '@/lib/thirdweb';

const address = (
  IS_PROD
    ? '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    : '0xd50634BC21f34b3E5C5831f5898Ad456e900f28B'
) as `0x${string}`;
export const teamsContract = {
  abi,
  address,
};
export const twTeamsContract = getContract({
  address,
  chain: APP_THIRDWEB_CHAIN,
  client: thirdwebClient,
});
