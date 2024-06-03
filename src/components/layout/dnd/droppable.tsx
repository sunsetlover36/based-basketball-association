import { useDroppable } from '@dnd-kit/core';

export const Droppable = ({ children, droppableId }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
  });
  const style = {
    backgroundColor: isOver ? '#2563EB' : undefined,
    backgroundOpacity: 0.1,
  };
  console.log(isOver);
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};
