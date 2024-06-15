import { useNavigate } from 'react-router-dom';

import { ConnectButton } from './connect-button';
import { useUser } from '@/lib/queryClient';
import { Button } from '@/components';
import { useActiveAccount } from 'thirdweb/react';

export const Header = () => {
  const navigate = useNavigate();

  const account = useActiveAccount();
  const { data: user } = useUser();

  return (
    <header className="min-h-[10vh] px-4 md:px-8 flex items-center justify-between">
      <div
        className="flex items-center cursor-pointer min-w-[342px]"
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
        {account && user && user.team && (
          <>
            <Button onClick={() => navigate(`/${user.address}/team`)}>
              My Team
            </Button>
          </>
        )}
        <Button className="mx-4" onClick={() => navigate('/leaderboard')}>
          Leaderboard
        </Button>
        {account && user && user.team && (
          <Button className="mr-4" onClick={() => navigate('/invite')}>
            Invite friends
          </Button>
        )}
        <ConnectButton />
      </div>
    </header>
  );
};
