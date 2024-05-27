import { LoaderCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

export const Loader = ({ className, size }) => {
  return (
    <LoaderCircle
      size={size}
      color="#2563EB"
      className={cn('animate-spin', className)}
    />
  );
};
