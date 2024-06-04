import { cn } from '@/lib/utils';

export const Progress = ({
  progress,
  negativeProgress = 0,
  positiveProgress = 0,
  total = 100,
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
        className={cn('bg-blue-600 h-2 rounded-l-lg', className)}
        style={{
          width: `${((progress - negativeProgress) / total) * 100}%`,
        }}
      />
      {negativeProgress !== 0 && (
        <div
          className="bg-red-600 rounded-lg"
          style={{
            width: `${(negativeProgress / total) * 100}%`,
          }}
        />
      )}
      {positiveProgress !== 0 && (
        <div
          className="bg-green-600 rounded-r-lg"
          style={{
            width: `${(positiveProgress / total) * 100}%`,
          }}
        />
      )}
    </div>
  );
};
