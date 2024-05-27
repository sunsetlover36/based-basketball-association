import { cn } from '@/lib/utils';

export const Progress = ({
  progress,
  total = 100,
  className,
  wrapperClassName,
}) => {
  return (
    <div className={cn('w-full bg-slate-400 rounded-lg h-2', wrapperClassName)}>
      <div
        className={cn('bg-blue-600 h-2 rounded-lg', className)}
        style={{
          width: `${(progress / total) * 100}%`,
        }}
      />
    </div>
  );
};
