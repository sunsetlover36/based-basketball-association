import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useDialog } from '@/store';
import { useUser, useMatches } from '@/lib/queryClient';
import { Button, Loader } from '@/components';
import { joinMatch } from '@/lib/api';

export const Matches = () => {
  const navigate = useNavigate();
  const { toggle } = useDialog('newMatchDialog');
  const { data: user } = useUser();
  const { data: matches } = useMatches();

  if (!user) {
    return <Loader />;
  }

  const { _id } = user;

  const handleCreateMatch = () => {
    const userHasMatch = matches.some((match) => match.player1.userId === _id);
    if (userHasMatch) {
      toast('You already have a match!', {
        style: {
          border: '2px solid #2563EB',
        },
      });
      return;
    }

    toggle(true);
  };
  const handleJoin = async (matchId) => {
    const match = matches.find((m) => m._id === matchId);
    if (match.player1.userId !== _id || match.player2?.userId !== _id) {
      await joinMatch({ matchId });
    }

    navigate(`/matches/${matchId}`);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full"
      >
        <div className="flex items-center mb-4">
          <h2 className="text-3xl text-center mr-4">Matches</h2>
          <Button size="sm" onClick={handleCreateMatch}>
            Create new match
          </Button>
        </div>

        {matches && matches.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {matches.map((match) => (
              <div
                key={match._id}
                className="border-2 border-blue-600 p-4 w-1/2 rounded-lg flex items-center justify-between"
              >
                <h3 className="text-xl">
                  {_id === match.player1.userId ? (
                    <span className="text-blue-600">You</span>
                  ) : (
                    match.player1.userId
                  )}{' '}
                  vs {match.player2 ? match.player2.userId : 'TBD'}
                </h3>
                <Button onClick={() => handleJoin(match._id)}>Join</Button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};
