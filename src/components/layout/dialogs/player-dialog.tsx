import { cn, SPECIAL_TRAITS_MAP } from '@/lib/utils';
import { Progress, Modal, ImageWithLoader } from '@/components';
import { useDialog } from '@/store';

export const PlayerDialog = () => {
  const { isOpen, toggle, selectedPlayer, setSelectedPlayer } =
    useDialog('playerDialog');

  const { name, image, traits } = selectedPlayer || {};
  return (
    <Modal
      showModal={isOpen}
      close={() => {
        toggle(false);
        setTimeout(() => setSelectedPlayer(null), 75);
      }}
      title="Team player"
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
                  return (
                    <div key={type} className="w-1/4">
                      <div className="flex justify-between">
                        <div>{label}</div> <div>{value}</div>
                      </div>

                      <Progress progress={value} total={99} />
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
                        <Progress
                          progress={value}
                          total={99}
                          wrapperClassName="mt-2"
                          className={progressBg}
                        />
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
          </div>
        </div>
      )}
    </Modal>
  );
};
