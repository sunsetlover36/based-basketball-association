import { useNavigate } from 'react-router-dom';

import { ConnectButton } from './connect-button';
import { useHasTeam, useUser } from '@/lib/queryClient';
import { Button } from '@/components';
import { useActiveAccount } from 'thirdweb/react';
import { useMedia } from 'react-use';

export const Header = () => {
  const isTablet = useMedia('(max-width: 1024px)');
  const navigate = useNavigate();

  const account = useActiveAccount();
  const { data: user } = useUser();
  const { data: hasTeam } = useHasTeam(account?.address);

  const isTeamVisible = hasTeam && user && account;
  return (
    <header className="min-h-[10vh] px-4 md:px-8 flex items-center justify-between">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img src="/logo.jpg" className="w-16 h-16 rounded-full mr-2" />
        <div className="leading-4">
          <p className="text-blue-600">Based</p>
          <p>Basketball</p>
          <p>Association</p>
        </div>
      </div>
      <div className="flex items-center">
        {isTeamVisible && (
          <>
            <Button onClick={() => navigate(`/${user?.address}/team`)}>
              My Team
            </Button>
          </>
        )}
        <Button className="mx-4" onClick={() => navigate('/leaderboard')}>
          Leaderboard
        </Button>
        {isTeamVisible && (
          <Button className="mr-4" onClick={() => navigate('/invite')}>
            Invite {!isTablet ? 'Friends' : ''}
          </Button>
        )}
        <ConnectButton />
      </div>
    </header>
  );
};
