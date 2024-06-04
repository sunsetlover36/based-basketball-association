import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';

export const Droppable = ({ children, droppableId }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
  });

  return (
    <div ref={setNodeRef} className={cn('rounded-lg', isOver && 'bg-blue-300')}>
      {children}
    </div>
  );
};
