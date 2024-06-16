import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

import { Loader } from '@/components';
import { useUser } from '@/lib/queryClient';

export const InviteFriends = () => {
  const { data: user, isLoading, error } = useUser();

  if (isLoading) {
    return <Loader size={100} className="mx-auto" />;
  }
  if (error || !user) {
    toast.error('You need to be logged in to invite friends', {
      id: 'invite-friends-no-user',
      icon: '🚨',
    });
    return <Navigate to="/" replace={true} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex justify-center"
    >
      <div className="w-1/2">
        <h2 className="text-center text-xl sm:text-2xl md:text-4xl uppercase">
          Invite your friends!
        </h2>
        <p className="text-sm sm:text-base lg:text-lg 2xl:text-xl text-center mb-4">
          Coming soon.
        </p>
        {/* <p className="text-sm sm:text-base lg:text-lg 2xl:text-xl text-center mb-4">
          Invite your friends and get <span className="text-blue-600">600</span>{' '}
          points for each friend!
        </p>

        <div className="bg-blue-600 px-8 py-2 rounded-lg w-fit mx-auto text-white mb-8">
          <p>Your referral code</p>
          <div className="flex items-center bg-blue-700 px-4 rounded-lg w-fit mx-auto m-2 text-3xl">
            {referralCode}
            <Copy
              className="ml-2 relative top-px cursor-pointer"
              size={16}
              onClick={() => {
                copyToClipboard(referralCode);
                toast('Copied to clipboard!', {
                  id: 'copy-referral-code',
                  icon: '📋',
                });
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
              {[].slice(0, 10).map(({ address, points }) => (
                <tr key={address}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-gray-900 transition-colors cursor-pointer hover:text-blue-600"
                      onClick={() => navigate(`/${address}/team`)}
                    >
                      {shortenAddress(address)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{points}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>
    </motion.div>
  );
};
