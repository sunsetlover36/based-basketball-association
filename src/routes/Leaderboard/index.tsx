import { motion } from 'framer-motion';

import { useUser } from '@/lib/queryClient';
import { shortenAddress } from '@/lib/utils';

export const Leaderboard = () => {
  const { data: user } = useUser();

  if (!user) {
    return null;
  }

  const data = [
    {
      id: 1,
      name: <span className="text-blue-600">You</span>,
      score: 1200,
    },
    {
      id: 2,
      name: shortenAddress('0xC0e967eEcDd6c0C8D859606d733818b4Ac798e85'),
      score: 200,
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex justify-center"
    >
      <div className="w-1/2">
        <h2 className="text-center text-lg sm:text-xl md:text-2xl uppercase mb-8">
          Leaderboard
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
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((player, index) => (
                <tr key={player.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">
                      {index === 0 ? '🥇' : '🥈'} {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{player.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{player.score}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
