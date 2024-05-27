import { useNavigate } from 'react-router-dom';

import { Button } from '@/components';
import { ConnectButton } from './connect-button';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="min-h-[10vh] px-4 md:px-8 flex items-center justify-end">
      <div className="flex items-center gap-x-4">
        <Button onClick={() => navigate('/matches')}>Matches</Button>
        <Button onClick={() => navigate('/team')}>My Team</Button>
        <Button onClick={() => navigate('/')}>About</Button>
        <ConnectButton />
      </div>
    </header>
  );
};
