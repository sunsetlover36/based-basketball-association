import { type FC } from 'react';

import { type Player as IPlayer } from '@/types';
import { useTeam } from '@/lib/queryClient';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';

interface PlayerProps {
  player: IPlayer;
  onClick?: () => void;
}
export const Player: FC<PlayerProps> = ({ player, onClick }) => {
  const { fullName, number, country, nickname } = player;

  return (
    <div
      className={cn(
        'rounded-lg py-2 px-8 w-1/4 transition-all ease-in-out',
        onClick && 'hover:bg-blue-200 cursor-pointer select-none'
      )}
      onClick={onClick}
    >
      <img
        className="w-full rounded-lg mb-4"
        src="/unrevealed.gif"
        alt={fullName}
      />

      <p className="text-lg font-bold text-center leading-4">{fullName}</p>
      {nickname && (
        <p className="text-xl text-center leading-6 text-blue-600">
          &laquo;{nickname}&raquo;
        </p>
      )}
      <div className="flex items-center justify-center">
        <img
          src={`https://flagcdn.com/w20/${country.toLowerCase()}.png`}
          alt={country}
          className="mr-2"
        />
        <p className="text-2xl font-bold text-center text-blue-500">
          #{number}
        </p>
      </div>
    </div>
  );
};

export const Players = () => {
  const navigate = useNavigate();
  const { address } = useParams();

  const { data: team } = useTeam(address);
  const { players } = team!;

  return (
    <div className="w-full">
      <h2 className="text-2xl mb-2">Team Players</h2>
      <div className="flex items-center gap-4">
        {players.map((player, i) => (
          <Player
            key={player._id}
            player={player}
            onClick={() => navigate(`/${address}/team/${i + 1}`)}
          />
        ))}
      </div>
    </div>
  );
};
