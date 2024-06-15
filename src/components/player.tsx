import { cn } from '@/lib/utils';

export const OldPlayer = ({ player, isHovered, className, ...props }) => {
  const { name, image } = player;

  return (
    <div
      className={cn(
        'cursor-pointer flex flex-col items-center justify-center',
        className
      )}
      {...props}
    >
      <div className="w-40 h-40">
        <img
          src={`https://ipfs.io/ipfs/${image.replace('ipfs://', '')}`}
          alt="Player photo"
          className="w-40 h-40 rounded-t-lg"
        />
      </div>
      <p
        className={cn(
          'bg-white border-2 border-blue-600 px-2 text-black text-center w-full text-sm whitespace-nowrap',
          isHovered && 'bg-blue-600 text-white'
        )}
      >
        {name}
      </p>
    </div>
  );
};
