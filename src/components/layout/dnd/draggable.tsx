import { type FC, type ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';

interface DraggableProps {
  children: ReactNode;
  draggableId: string;
}
export const Draggable: FC<DraggableProps> = ({ children, draggableId }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: draggableId,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
};
