import { useNavigate } from 'react-router-dom';
import { Avatar, Name } from '@coinbase/onchainkit/identity';

import { Button } from '@/components';
import { ConnectButton } from './connect-button';

export const Header = () => {
  const navigate = useNavigate();

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
      <div className="flex items-center gap-x-4">
        <Button onClick={() => navigate('/games')}>Games</Button>
        <Button onClick={() => navigate('/team')}>My Team</Button>
        <Button onClick={() => navigate('/leaderboard')}>Leaderboard</Button>
      </div>
      <div className="flex items-center">
        <div className="mr-8 border-2 border-blue-600 rounded-lg px-2 py-1">
          <span className="text-sm">🏀</span> 1 200 Points
        </div>
        <div className="flex h-10 items-center space-x-4">
          <div className="flex flex-col text-right">
            <b className="-mb-1">
              <Name address="0x6047ec2435C5906241AeAcC13b09D3c0eb09Cb45" />
            </b>
            <Name
              address="0x6047ec2435C5906241AeAcC13b09D3c0eb09Cb45"
              showAddress
            />
          </div>
          <Avatar
            address="0x6047ec2435C5906241AeAcC13b09D3c0eb09Cb45"
            showAttestation
          />
        </div>
        {/* <ConnectButton /> */}
      </div>
    </header>
  );
};
