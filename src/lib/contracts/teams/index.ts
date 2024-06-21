import { IS_PROD } from '@/lib/utils';
import { abi } from './abi';

export const teamsContract = {
  abi,
  address: (IS_PROD
    ? '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    : '0xd50634BC21f34b3E5C5831f5898Ad456e900f28B') as `0x${string}`,
};
