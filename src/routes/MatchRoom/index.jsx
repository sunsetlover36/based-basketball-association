import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

import { useDialog } from '@/store';
import { useUser, useMatch } from '@/lib/queryClient';
import { Loader, Player } from '@/components';

const nameToGifMap = {
  'Andres Jast': 'player0.gif',
  'Mr. Myron Pfeffer': 'player1.gif',
  'Al Quitzon IV': 'player2.gif',
  'Carlton Kemmer': 'player0.gif',
  'Mr. Dwayne Hermann': 'player0.gif',
  'Clayton Bayer': 'player0.gif',
};
const getTime = (from, to) => {
  const difference = to - from;
  const minutes = Math.floor(difference / 1000 / 60);
  const seconds = Math.floor((difference / 1000) % 60);
  return `${minutes < 10 ? '0' : ''}${minutes < 0 ? 0 : minutes}:${
    seconds < 10 ? '0' : ''
  }${seconds < 0 ? 0 : seconds}`;
};
const formatMatchState = (match) => {
  const { state, startTime, score } = match;
  const { player1: player1Score, player2: player2Score } = score;

  const startTimeInMilliseconds = new Date(startTime).getTime();
  switch (state) {
    case 'starting':
      return `STARTING IN ${getTime(Date.now(), startTimeInMilliseconds)}`;
    case 'in_progress':
      return (
        <div>
          <h3 className="text-2xl mb-1">
            {player1Score} - {player2Score}
          </h3>
          <h4>{getTime(startTimeInMilliseconds, Date.now())}</h4>
        </div>
      );
    case 'finished':
      return `${player1Score} - ${player2Score}`;
    default:
      return 'WAITING FOR PLAYER';
  }
};

export const MatchRoom = () => {
  const { matchId } = useParams();

  const [matchState, setMatchState] = useState('');
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const { setSelectedPlayer, toggle: togglePlayerDialog } =
    useDialog('playerDialog');
  const { data: user } = useUser();
  const { data: match, refetch } = useMatch(matchId);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setMatchState(formatMatchState(match));
    }, 1000);

    return () => clearInterval(interval);
  }, [match]);

  if (!user || !match) {
    return <Loader />;
  }

  const handleSetPlayer = (player) => {
    setSelectedPlayer(player);
    togglePlayerDialog(true);
  };

  const { _id: userId } = user;
  const { player1, player2, feed, score, state } = match;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full"
      >
        <div className="text-center mb-8">
          <div className="text-2xl flex items-center justify-center">
            <div className="w-48">
              <div>
                Team <span className="text-blue-600">Based</span>
              </div>
              {state === 'finished' && score.player1 > score.player2 ? (
                <div className="text-green-600"> [winner]</div>
              ) : (
                <div className="text-red-600"> [loser]</div>
              )}
            </div>
            <div className="mx-8">vs.</div>
            <div className="w-48">
              Team <span className="text-blue-600">Ballers</span>
              {state === 'finished' && score.player2 > score.player1 ? (
                <div className="text-green-600"> [winner]</div>
              ) : (
                <div className="text-red-600"> [loser]</div>
              )}
            </div>
          </div>
          <h4 className="text-2xl border-2 border-blue-600 px-2 rounded-lg w-fit mx-auto">
            {matchState}
          </h4>
        </div>
        <div className="w-1/2 mx-auto">
          <div className="w-full">
            <div className="border border-blue-600 rounded-lg p-4 mb-4 h-[550px] overflow-y-auto custom-scrollbar">
              <h3 className="text-xl text-center">Live match feed</h3>
              <div>
                {[...feed].reverse().map((feedItem) => {
                  let { author, text } = feedItem;

                  const names = Object.keys(nameToGifMap);
                  names.forEach((n) => {
                    text = text.replaceAll(
                      n,
                      `<span class="text-blue-600">${n}</span>`
                    );
                  });
                  return (
                    <div className="border-2 border-blue-600 rounded-lg mt-2 last:mb-0 p-2 flex items-center">
                      <img
                        src={`/${
                          author === 'Commentator'
                            ? 'mic.png'
                            : nameToGifMap[author] // TODO: Send image from backend to feed
                        }`}
                        className="w-16 h-16 mr-4 rounded-lg"
                      />
                      <div>
                        <h4 className="text-gray-700 leading-4 mb-1">
                          {author}
                        </h4>
                        <p
                          className="leading-4"
                          dangerouslySetInnerHTML={{ __html: text }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl">
                {player1.userId === userId ? (
                  'Your team'
                ) : (
                  <>
                    Team <span className="text-blue-600">Based</span>
                  </>
                )}
              </h3>
              <div className="flex items-center gap-4">
                {player1.lineup.map((player) => {
                  return (
                    <Player
                      key={player._id}
                      player={player}
                      isHovered={hoveredPlayer === player.tokenId}
                      onMouseEnter={() => setHoveredPlayer(player.tokenId)}
                      onMouseLeave={() => setHoveredPlayer(null)}
                      onClick={() => handleSetPlayer(player)}
                    />
                  );
                })}
              </div>
            </div>
            {player2 && (
              <div>
                <h3 className="text-2xl">
                  {player2.userId === userId ? (
                    'Your team'
                  ) : (
                    <>
                      Team <span className="text-blue-600">Ballers</span>
                    </>
                  )}
                </h3>
                <div className="flex items-center gap-4">
                  {player2.lineup.map((player) => {
                    return (
                      <Player
                        key={player._id}
                        player={player}
                        isHovered={hoveredPlayer === player.tokenId}
                        onMouseEnter={() => setHoveredPlayer(player.tokenId)}
                        onMouseLeave={() => setHoveredPlayer(null)}
                        onClick={() => handleSetPlayer(player)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};
