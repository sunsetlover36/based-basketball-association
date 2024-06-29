import { QueryClient, useQuery } from '@tanstack/react-query';

import {
  getLeaderboard,
  getTeam,
  getTxStatus,
  getUser,
  hasTeam,
} from '@/lib/api';

export const queryClient = new QueryClient();

export const useUser = () =>
  useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
    retry: false,
  });

export const useTeam = (address?: string) =>
  useQuery({
    queryKey: address ? ['team', address] : [],
    queryFn: () => getTeam(address!),
    enabled: !!address,
  });

export const LEADERBOARD_QUERY = {
  queryKey: ['leaderboard'],
  queryFn: getLeaderboard,
};
export const useLeaderboard = () => useQuery(LEADERBOARD_QUERY);

export const useHasTeam = (address?: string) =>
  useQuery({
    queryKey: ['hasTeam', address],
    queryFn: () => hasTeam(address!),
    enabled: !!address,
  });

export const useTxStatus = (queueId?: string | null) =>
  useQuery({
    queryKey: ['txStatus', queueId],
    queryFn: () => getTxStatus(queueId!),
    enabled: !!queueId,
    refetchInterval: 2000,
  });
