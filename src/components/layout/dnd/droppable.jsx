import { useDroppable } from '@dnd-kit/core';

export const Droppable = ({ children, droppableId }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
  });
  const style = {
    color: isOver ? '#2563EB' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};
