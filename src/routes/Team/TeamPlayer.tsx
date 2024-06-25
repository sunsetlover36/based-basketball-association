import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useActiveAccount } from 'thirdweb/react';
import { format } from 'date-fns';

import { PlayerTrainingMode, type PlayerTraits } from '@/types';
import { Button, Loader, Progress } from '@/components';
import {
  cn,
  formatToDuration,
  TRAINING_MODE_MAP,
  TRAITS_MAP,
} from '@/lib/utils';
import { useDialog, useStore } from '@/store';
import { DialogName } from '@/store/ui/types';
import { cheerPlayer, getBoost } from '@/lib/api';
import { queryClient, useTeam, useUser } from '@/lib/queryClient';
import { Player } from './Players';

export const getProgressBoost = (
  trait: keyof PlayerTraits,
  mode: PlayerTrainingMode | null
) => {
  switch (mode) {
    case PlayerTrainingMode.ATTACK:
      if (['shooting', 'dribbling'].includes(trait)) {
        return 2;
      }

      if (trait === 'passing') {
        return 1;
      }

      return 0;
    case PlayerTrainingMode.DEFENSE:
      if (['blocking', 'stealing'].includes(trait)) {
        return 2;
      }

      if (trait === 'passing') {
        return 1;
      }

      return 0;
    case PlayerTrainingMode.MEDITATION:
      if (['determination', 'reactionTime'].includes(trait)) {
        return 2;
      }

      return 0;
    case PlayerTrainingMode.CARDIO:
      if (trait === 'speed') {
        return 3;
      }

      return 0;
    case PlayerTrainingMode.STRENGTH:
      if (trait === 'strength') {
        return 3;
      }

      return 0;

    default:
      return 0;
  }
};

let boostingInterval: NodeJS.Timeout | null = null;
export const TeamPlayer = () => {
  const navigate = useNavigate();
  const { address, playerIndex } = useParams();
  const account = useActiveAccount();
  const { data: user } = useUser();
  const { data: team, error, isLoading } = useTeam(address);
  const { trainingMode, setTrainingMode } = useStore();
  const { isOpen: isConfirmTrainingOpen, toggle: toggleConfirmTraining } =
    useDialog(DialogName.CONFIRM_TRAINING_DIALOG);

  const [isBoosting, setIsBoosting] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [isCheered, setIsCheered] = useState(false);

  const player = useMemo(() => {
    return team?.players[Number(playerIndex) - 1];
  }, [team, playerIndex]);
  const { hasBoosts, hasOgBoost, hasCoachBoost } = useMemo(() => {
    const hasBoosts =
      user?.boosts && user.boosts.filter((boost) => !boost.claimed).length > 0;

    if (hasBoosts) {
      const ogBoost = user.boosts.find((b) => b.boostType === 'og');
      const coachBoost = user.boosts.find((b) => b.boostType === 'coach');

      return {
        hasBoosts,
        hasOgBoost: ogBoost && !ogBoost.claimed,
        hasCoachBoost: coachBoost && !coachBoost.claimed,
      };
    }

    return { hasBoosts, hasOgBoost: false, hasCoachBoost: false };
  }, [user]);

  const onCheerPlayer = async () => {
    setIsCheered(true);

    setShowPoints(true);
    setTimeout(() => {
      setShowPoints(false);
    }, 1000);

    await cheerPlayer({
      address: address!,
      playerId: player!._id,
    });
    await queryClient.invalidateQueries({
      queryKey: ['user'],
    });
    await queryClient.invalidateQueries({
      queryKey: ['team', address],
    });
    toast.success(`You have cheered for ${player!.fullName}!`);
  };
  const onBoostPlayer = async (type: 'og' | 'coach') => {
    await getBoost(type);
    await queryClient.invalidateQueries({
      queryKey: ['user'],
    });
    await queryClient.invalidateQueries({
      queryKey: ['team', address],
    });
    toast.success(`You have boosted ${player!.fullName}!`, {
      icon: '🎉',
      id: 'boost-player',
    });
  };

  useEffect(() => {
    let trainingCheckInterval: NodeJS.Timeout | null = null;
    const lastTraining = player?.trainings[player?.trainings.length - 1];
    if (lastTraining) {
      const lastTrainingEndDate = new Date(lastTraining.endDate).getTime();

      if (lastTrainingEndDate > Date.now()) {
        trainingCheckInterval = setInterval(() => {
          if (lastTrainingEndDate < new Date().getTime()) {
            setTrainingMode(null);

            setTimeout(() => {
              queryClient.invalidateQueries({
                queryKey: ['user'],
              });
              queryClient.invalidateQueries({
                queryKey: ['team', address],
              });
            }, 1000);
          }
        }, 1000);
      }
    }

    return () => {
      if (trainingCheckInterval) {
        clearInterval(trainingCheckInterval);
      }
    };
  }, [trainingMode, player]);
  useEffect(() => {
    if (player && !isLastTrainingEnded) {
      console.log('SET LAST TRAINING');
      setTrainingMode(lastTraining!.mode);
    } else {
      setTrainingMode(null);
    }
  }, [team, player, address]);
  useEffect(() => {
    if (trainingMode !== null) {
      boostingInterval = setInterval(() => {
        setIsBoosting((boosting) => !boosting);
      }, 350);
    }

    return () => {
      if (boostingInterval) {
        clearInterval(boostingInterval);
      }
    };
  }, [trainingMode]);

  if (isLoading) {
    return <Loader size={100} className="mx-auto" />;
  }
  if (error) {
    toast.error('Something went wrong!', {
      id: 'player-error',
      icon: '🚨',
    });
    return <Navigate to="/" />;
  }
  if (!player) {
    toast.error('Player not found', {
      id: 'player-not-found',
      icon: '🚨',
    });
    return <Navigate to={`/${address}/team`} />;
  }

  const { fullName, traits, trainings } = player;
  const lastTraining =
    trainings.length > 0 ? trainings[trainings.length - 1] : null;

  const isLastTrainingEnded = lastTraining?.endDate
    ? new Date(lastTraining?.endDate).getTime() <= Date.now()
    : true;

  const traitsArr = Object.entries(traits).filter(([key]) => key !== '_id');
  const trainingDisabled =
    !isLastTrainingEnded || account?.address !== address || traits.stamina < 50;
  const formattedDuration = formatToDuration(
    new Date().toISOString(),
    lastTraining?.endDate
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex justify-center"
    >
      <div className="xl:w-full 2xl:w-3/4 3xl:w-1/2">
        <div className="flex items-start mb-4">
          <Button
            className="mr-4 flex items-center"
            onClick={() => navigate(`/${address}/team`)}
          >
            Back to team
          </Button>
          <h1 className="text-3xl">{fullName} Bio</h1>
        </div>
        <div>
          <div className="flex mb-4">
            <Player player={player} />
            <div className="w-2/3">
              <div className="grid grid-cols-3 gap-y-2 gap-x-8 mb-6">
                {traitsArr
                  .filter(
                    ([key]) =>
                      !['injury', 'stamina', 'specialTraits'].includes(key)
                  )
                  .map(([key, value]) => {
                    const boost = getProgressBoost(
                      key as keyof PlayerTraits,
                      trainingMode
                    );

                    return (
                      <div key={key}>
                        <div className="flex justify-between">
                          <div>
                            {TRAITS_MAP[key as keyof typeof TRAITS_MAP]}
                          </div>{' '}
                          <div
                            className={cn(
                              trainingMode !== null &&
                                boost > 0 &&
                                (isBoosting ? 'visible' : 'invisible'),
                              isLastTrainingEnded &&
                                trainingMode !== null &&
                                boost === 0 &&
                                'invisible'
                            )}
                          >
                            {value}
                            {boost ? (
                              <>
                                {' '}
                                <span className="text-green-600">
                                  (+
                                  {boost})
                                </span>
                              </>
                            ) : null}
                          </div>
                        </div>

                        <Progress
                          progress={value}
                          wrapperClassName="mt-1"
                          potentialProgress={isBoosting ? boost : 0}
                        />
                      </div>
                    );
                  })}
              </div>
              <div className="grid grid-cols-3 gap-x-8 mb-4">
                {traitsArr
                  .filter(([key]) => ['injury', 'stamina'].includes(key))
                  .map(([key, value]) => {
                    let progressBg = 'bg-blue-600';
                    if (key === 'stamina') {
                      if (value <= 33) {
                        progressBg = 'bg-red-600';
                      } else if (value <= 66) {
                        progressBg = 'bg-yellow-600';
                      } else {
                        progressBg = 'bg-green-600';
                      }
                    }

                    let valueColor = 'text-black';
                    if (key === 'injury') {
                      if (value === 0) {
                        valueColor = 'text-green-600';
                      } else {
                        valueColor = 'text-red-600';
                      }
                    }

                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between">
                          <p>{TRAITS_MAP[key as keyof typeof TRAITS_MAP]}</p>
                          {key === 'stamina' && (
                            <p>
                              <span className="text-green-600">+4</span>/hour
                            </p>
                          )}
                        </div>
                        {key === 'stamina' ? (
                          <>
                            <Progress
                              progress={value}
                              wrapperClassName="mt-2"
                              className={progressBg}
                              potentialProgress={
                                value >= 50 &&
                                isLastTrainingEnded &&
                                trainingMode !== null
                                  ? -50
                                  : 0
                              }
                            />
                          </>
                        ) : (
                          <div className={valueColor}>
                            {value === 0 ? 'No' : `Injured for ${value} days`}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              {(lastTraining && !isLastTrainingEnded
                ? true
                : account?.address === address) && (
                <div>
                  <h3 className="text-xl -mb-1">Fans</h3>
                  {lastTraining && !isLastTrainingEnded ? (
                    <div className="flex items-center">
                      <p className="text-blue-600 text-3xl">
                        {lastTraining.fans.length}
                      </p>
                      {account?.address !== address && address && (
                        <div className="relative">
                          {user?.team &&
                            account?.address &&
                            !lastTraining.fans.includes(account?.address) &&
                            !isCheered && (
                              <Button
                                data-tooltip-id="cheer"
                                data-tooltip-content="Cheer gives you 50 points"
                                className="ml-4"
                                size="sm"
                                onClick={onCheerPlayer}
                              >
                                Cheer
                              </Button>
                            )}
                          {showPoints && (
                            <div className="point-animation absolute -top-8 text-blue-600 whitespace-nowrap">
                              +50 points
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-blue-600">Start training to get fans!</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-b-2 border-blue-600 pb-4 mb-4">
            <h2 className="text-2xl">Training Camp</h2>
            <p className="mb-2">
              {lastTraining && trainingMode !== null
                ? `Training session is set for ${
                    TRAINING_MODE_MAP[
                      trainingMode as keyof typeof TRAINING_MODE_MAP
                    ].label
                  }.`
                : `No training session is set for this player.${
                    account?.address === address ? ' You can set one.' : ''
                  }`}
              {traits.stamina < 50 &&
                isLastTrainingEnded &&
                'Player is too tired to set training session.'}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {Object.values(PlayerTrainingMode)
                .filter((v) => typeof v === 'number')
                .map((value) => {
                  const { label, emoji } =
                    TRAINING_MODE_MAP[value as keyof typeof TRAINING_MODE_MAP];
                  return (
                    <div
                      key={value}
                      className={cn(
                        'border-2 border-blue-600 rounded-lg px-2 py-1 mr-4 flex flex-col items-center justify-center h-32 transition-all select-none',
                        trainingMode === value && 'bg-blue-600 text-white',
                        trainingDisabled &&
                          trainingMode !== value &&
                          'opacity-50 cursor-not-allowed',
                        !trainingDisabled &&
                          'cursor-pointer hover:bg-blue-600 hover:text-white'
                      )}
                      onMouseEnter={() =>
                        !trainingDisabled &&
                        !isConfirmTrainingOpen &&
                        setTrainingMode(+value)
                      }
                      onMouseLeave={() =>
                        !trainingDisabled &&
                        !isConfirmTrainingOpen &&
                        setTrainingMode(null)
                      }
                      onClick={() => {
                        if (!trainingDisabled) {
                          setTrainingMode(+value);
                          toggleConfirmTraining(true);
                        }
                      }}
                    >
                      <p className="text-2xl">{emoji}</p>
                      <p>{label}</p>
                      {!isLastTrainingEnded &&
                        lastTraining &&
                        lastTraining.mode === value &&
                        formattedDuration && (
                          <p className="text-xs xl:text-sm text-center">
                            {formattedDuration} remaining
                          </p>
                        )}
                    </div>
                  );
                })}
            </div>
            {isLastTrainingEnded && (
              <p className="bg-blue-600 text-white p-3 rounded-lg mt-4 w-fit flex items-center">
                <Info className="mr-2" />
                One training session lasts 12 hours and consumes 50 stamina.
                Players recover 4 stamina per hour.
              </p>
            )}

            {address === account?.address && hasBoosts && (
              <div className="mt-4">
                <h2 className="text-2xl mb-1">Secret Menu</h2>
                <div className="flex gap-x-2">
                  {hasOgBoost && (
                    <Button
                      className="secret-button-gradient"
                      onClick={() => onBoostPlayer('og')}
                    >
                      OG Boost
                    </Button>
                  )}
                  {hasCoachBoost && (
                    <Button
                      className="secret-button-gradient"
                      onClick={() => onBoostPlayer('coach')}
                    >
                      Coach Boost
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl mb-2">Training History</h2>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Start Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >
                      End Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trainings.reverse().map(({ mode, startDate, endDate }) => {
                    const trainingMode = TRAINING_MODE_MAP[mode];
                    return (
                      <tr key={startDate}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            {trainingMode.label} {trainingMode.emoji}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(new Date(startDate), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            {format(new Date(endDate), 'dd/MM/yyyy HH:mm')}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
