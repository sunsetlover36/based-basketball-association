import { type FC } from 'react';
import { LoaderCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  size?: number;
}
export const Loader: FC<LoaderProps> = ({ className, size }) => {
  return (
    <LoaderCircle
      size={size}
      color="#2563EB"
      className={cn('animate-spin', className)}
    />
  );
};
