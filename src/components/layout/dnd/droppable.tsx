import { type FC, type ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

import { cn } from '@/lib/utils';

interface DroppableProps {
  children: ReactNode;
  droppableId: string;
}
export const Droppable: FC<DroppableProps> = ({ children, droppableId }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
  });

  return (
    <div ref={setNodeRef} className={cn('rounded-lg', isOver && 'bg-blue-300')}>
      {children}
    </div>
  );
};
