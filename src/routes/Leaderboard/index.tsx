import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

import { useLeaderboard, useUser } from '@/lib/queryClient';
import { cn, shortenAddress } from '@/lib/utils';
import { Loader } from '@/components';

const getLeaderboardMedal = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
};

export const Leaderboard = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = useUser();
  const {
    data: leaderboard,
    isLoading: isLeaderboardLoading,
    error,
  } = useLeaderboard();

  if (isLeaderboardLoading || isUserLoading) {
    return <Loader size={100} className="mx-auto" />;
  }

  if (error) {
    toast.error('Something went wrong!', {
      id: 'leaderboard-error',
      icon: '🚨',
    });
    return <Navigate to="/" />;
  }

  if (!leaderboard) {
    toast('Unable to load leaderboard!', {
      id: 'no-leaderboard',
      icon: '🚨',
    });
    return <Navigate to="/" />;
  }

  const leaderboardIndex = leaderboard.findIndex(
    (lUser) => lUser.address === user?.address
  );
  const leaderboardUser =
    leaderboardIndex !== -1 ? leaderboard[leaderboardIndex] : null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex justify-center"
    >
      <div className="w-1/2">
        <h2 className="text-center text-xl sm:text-2xl md:text-4xl uppercase mb-8">
          Top 10 Coaches
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  Player
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  🏀 Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard.slice(0, 10).map(({ address, points }, index) => (
                <tr key={address}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">
                      {getLeaderboardMedal(index + 1)} {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={cn(
                        'text-gray-900 transition-colors',
                        address !== user?.address &&
                          'cursor-pointer hover:text-blue-600'
                      )}
                      onClick={() => {
                        if (address !== user?.address) {
                          navigate(`/${address}/team`);
                        }
                      }}
                    >
                      {address === user?.address
                        ? 'You'
                        : shortenAddress(address)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{points}</div>
                  </td>
                </tr>
              ))}
              {leaderboardUser && (
                <tr className="bg-blue-200 outline outline-2 outline-blue-600">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">
                      {getLeaderboardMedal(leaderboardIndex + 1)}{' '}
                      {leaderboardIndex + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">You</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">
                      {leaderboardUser?.points ? leaderboardUser.points : 0}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
