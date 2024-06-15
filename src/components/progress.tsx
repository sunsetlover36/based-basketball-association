import { type FC } from 'react';

import { cn } from '@/lib/utils';

interface ProgressProps {
  progress: number;
  potentialProgress?: number;
  total?: number;
  className?: string;
  wrapperClassName?: string;
}
export const Progress: FC<ProgressProps> = ({
  progress,
  potentialProgress = 0,
  total = 99,
  className,
  wrapperClassName,
}) => {
  return (
    <div
      className={cn(
        'w-full bg-slate-400 rounded-lg h-2 flex',
        wrapperClassName
      )}
    >
      <div
        className={cn(
          'bg-blue-600 h-2 rounded-l-lg',
          progress >= total && 'rounded-lg',
          className
        )}
        style={{
          width: `${
            ((potentialProgress < 0 ? progress + potentialProgress : progress) /
              total) *
            100
          }%`,
        }}
      />
      {potentialProgress !== 0 && (
        <div
          className={cn(
            potentialProgress < 0 && 'bg-red-600 rounded-r-lg',
            potentialProgress > 0 && 'bg-green-600',
            progress + potentialProgress === total && 'rounded-r-lg',
            progress + potentialProgress <= 0 && 'rounded-l-lg'
          )}
          style={{
            width: `${(Math.abs(potentialProgress) / total) * 100}%`,
          }}
        />
      )}
    </div>
  );
};
