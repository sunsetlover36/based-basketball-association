import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export const Draggable = ({ children, draggableId }) => {
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
