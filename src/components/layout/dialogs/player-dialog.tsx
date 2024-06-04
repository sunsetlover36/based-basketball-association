import { cn, SPECIAL_TRAITS_MAP } from '@/lib/utils';
import { Progress, Modal, ImageWithLoader, Button } from '@/components';
import { useDialog, useStore } from '@/store';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const PlayerDialog = () => {
  const { isOpen, toggle, selectedPlayer, setSelectedPlayer } =
    useDialog('playerDialog');

  const { isTrainingMode, setIsTrainingMode, gym, setGym } = useStore();

  const gymPlayer = gym.find((player) => player.name === selectedPlayer?.name);
  const [trainingType, setTrainingType] = useState(
    gymPlayer?.trainingType || ''
  );

  const handleTrain = () => {
    toast(`${name} is training!`, {
      style: {
        border: '2px solid #2563EB',
        color: 'black',
      },
      icon: '🎉',
    });
    setGym([
      ...gym,
      {
        ...selectedPlayer,
        trainingType,
      },
    ]);
    toggle(false);
  };

  const { name, image, traits } = selectedPlayer || {};

  let title = 'Team Player';
  if (gymPlayer) {
    title = 'Training (3 hours remaining)';
  } else if (isTrainingMode) {
    title = 'Training';
  }
  return (
    <Modal
      showModal={isOpen}
      close={() => {
        toggle(false);

        setTimeout(() => {
          setIsTrainingMode(false);
          setSelectedPlayer(null);
        }, 75);
      }}
      title={title}
      className="sm:max-w-[90%] 2xl:max-w-[50%]"
    >
      {selectedPlayer && (
        <div className="flex items-start">
          <ImageWithLoader
            src={`https://ipfs.io/ipfs/${image.replace('ipfs://', '')}`}
            alt="Player photo"
            className="mr-4 rounded-lg"
            width={256}
            height={256}
          />
          <div>
            <h3 className="text-2xl">{name}</h3>
            <div className="flex flex-wrap gap-2 gap-x-8 mb-8">
              {traits
                .filter(
                  ({ type }) =>
                    !['injury', 'stamina', 'specialTrait'].includes(type)
                )
                .map(({ type, label, value }) => {
                  let increaseBy = 0;

                  if (isTrainingMode) {
                    if (
                      [
                        'shootingAccuracy',
                        'threePointShooting',
                        'shootingSpeed',
                        'dribblingSkill',
                        'speed',
                        'jumpingAbility',
                      ].includes(type) &&
                      trainingType === 'attack'
                    ) {
                      increaseBy = 3;
                    } else if (
                      [
                        'reboundingSkill',
                        'blockingSkill',
                        'strength',
                        'stealingSkill',
                        'speed',
                        'jumpingAbility',
                      ].includes(type) &&
                      trainingType === 'defense'
                    ) {
                      increaseBy = 3;
                    } else if (
                      ['determination', 'reactionTime'].includes(type) &&
                      trainingType === 'meditation'
                    ) {
                      increaseBy = 4;
                    } else if (trainingType === 'meditation') {
                      increaseBy = 1;
                    }
                  }
                  return (
                    <div key={type} className="w-1/4">
                      <div className="flex justify-between">
                        <div>{label}</div>{' '}
                        <div>
                          {value}{' '}
                          {increaseBy ? (
                            <span className="text-green-600">
                              +{increaseBy}
                            </span>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>

                      <Progress
                        progress={value}
                        total={99}
                        positiveProgress={increaseBy}
                      />
                    </div>
                  );
                })}
            </div>
            <div className="flex flex-wrap gap-x-8">
              {traits
                .filter(({ type }) =>
                  ['injury', 'stamina', 'specialTrait'].includes(type)
                )
                .map(({ type, label, value }) => {
                  let progressBg = 'bg-blue-600';
                  if (type === 'stamina') {
                    if (value <= 33) {
                      progressBg = 'bg-red-600';
                    } else if (value <= 66) {
                      progressBg = 'bg-yellow-600';
                    } else {
                      progressBg = 'bg-green-600';
                    }
                  }

                  let valueColor = 'text-black',
                    borderColor = 'border-black';
                  if (type === 'specialTrait') {
                    const impact = SPECIAL_TRAITS_MAP[value];
                    if (impact < 0) {
                      valueColor = 'text-red-600';
                      borderColor = 'border-red-600';
                    } else if (impact > 0) {
                      valueColor = 'text-green-600';
                      borderColor = 'border-green-600';
                    } else {
                      valueColor = 'text-gray-600';
                      borderColor = 'border-gray-600';
                    }
                  } else if (type === 'injury') {
                    if (value === 'No') {
                      valueColor = 'text-green-600';
                    } else {
                      valueColor = 'text-red-600';
                    }
                  }

                  return (
                    <div key={type} className="w-1/4">
                      <div
                        className={cn(
                          type === 'specialTrait' && 'text-blue-600'
                        )}
                      >
                        {label}
                      </div>
                      {type === 'stamina' ? (
                        <>
                          <Progress
                            progress={value}
                            negativeProgress={isTrainingMode && 50}
                            total={99}
                            wrapperClassName="mt-2"
                            className={progressBg}
                          />
                          {isTrainingMode && (
                            <p className="text-right text-sm text-red-600">
                              -50
                            </p>
                          )}
                        </>
                      ) : (
                        <div
                          className={cn(
                            valueColor,
                            type === 'specialTrait' &&
                              `${borderColor} border-2 w-fit px-1 rounded-lg text-sm`
                          )}
                        >
                          {value}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {isTrainingMode && !gymPlayer && (
              <>
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleTrain}
                    onMouseEnter={() => setTrainingType('attack')}
                    onMouseLeave={() => setTrainingType('')}
                  >
                    Attack Training
                  </Button>
                  <Button
                    onClick={handleTrain}
                    onMouseEnter={() => setTrainingType('defense')}
                    onMouseLeave={() => setTrainingType('')}
                    className="mx-4"
                  >
                    Defense Training
                  </Button>
                  <Button
                    onClick={handleTrain}
                    onMouseEnter={() => setTrainingType('meditation')}
                    onMouseLeave={() => setTrainingType('')}
                  >
                    Meditation
                  </Button>
                </div>

                <p className="text-right mt-2">
                  You will earn <span className="text-xs">🏀</span> 200 points
                  for this training!
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
