import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Navigate, useParams } from 'react-router-dom';

import { useTeam } from '@/lib/queryClient';
import { Players } from './Players';
import { Loader } from '@/components';
import { useActiveAccount } from 'thirdweb/react';

export const Team = () => {
  const account = useActiveAccount();
  const { address } = useParams();
  const { data: team, error, isLoading } = useTeam(address);
  console.log('???', team, error);
  if (isLoading) {
    return <Loader size={100} className="mx-auto" />;
  }
  if (error) {
    toast.error('Something went wrong!', {
      id: 'team-error',
      icon: '🚨',
    });
    return <Navigate to="/" />;
  }
  if (!team) {
    if (account?.address === address) {
      toast('Please create a team first!', {
        id: 'create-team',
        icon: '🚀',
      });
      return <Navigate to="/create-team" />;
    }

    toast('User has no team!', {
      id: 'no-team',
      icon: '🚨',
    });
    return <Navigate to="/" />;
  }

  const { logo, name, points } = team;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex justify-center"
    >
      <div className="w-1/2">
        <div className="flex items-center">
          <div className="mb-2 w-full h-52 rounded-lg flex flex-col items-center justify-center">
            <img
              src={`${import.meta.env.VITE_API_URL}/assets${logo}`}
              className="w-32 h-32 rounded-lg mb-1"
            />
            <h2 className="text-4xl mb-2">
              Team <span className="text-blue-600">{name}</span> Camp
            </h2>
            <div className="border-2 border-blue-600 rounded-lg px-2 py-1">
              <span className="text-sm">🏀</span> {points} Points
            </div>
          </div>
        </div>

        <Players />
      </div>
    </motion.div>
  );
};