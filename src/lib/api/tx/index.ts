import { api } from '../api';
import { GetTxStatusResponse } from './types';
import { txUrls } from './urls';

export const getTxStatus = async (
  queueId: string
): Promise<GetTxStatusResponse> => {
  const { txStatus } = await api
    .get(txUrls.STATUS, {
      searchParams: {
        queueId,
      },
    })
    .json<GetTxStatusResponse>();

  return { txStatus };
};
