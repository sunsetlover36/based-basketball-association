import { QueryClient, useQuery } from '@tanstack/react-query';
import { getLeaderboard, getTeam, getUser } from '@/lib/api';

export const queryClient = new QueryClient();

export const USER_QUERY = {
  queryKey: ['user'],
  queryFn: getUser,
};
export const useUser = () => useQuery(USER_QUERY);

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
