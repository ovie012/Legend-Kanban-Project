import { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBoardStore } from '../store';
import { usePermissions, canDrag } from '@/permissions/usePermissions';
import { socketClient } from '@/socket/socketClient';
import { BeanColumn } from './BeanColumn';
import { RoastCard } from './RoastCard';

export const Board = () => {
  const columns = useBoardStore(s => s.columns);
  const cards = useBoardStore(s => s.cards);
  const moveCard = useBoardStore(s => s.moveCard);
  const reorderCards = useBoardStore(s => s.reorderCards);
  const takeSnapshot = useBoardStore(s => s.takeSnapshot);
  const role = usePermissions(s => s.role);

  const [activeId, setActiveId] = useState<string | null>(null);
  const dragDisabled = !canDrag(role);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getColumnCards = useCallback(
    (columnId: string) =>
      cards.filter(c => c.columnId === columnId).sort((a, b) => a.order - b.order),
    [cards]
  );

  const findColumnId = useCallback(
    (id: string): string | undefined => {
      if (columns.some(c => c.id === id)) return id;
      return cards.find(c => c.id === id)?.columnId;
    },
    [columns, cards]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id as string);
      takeSnapshot();
    },
    [takeSnapshot]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeCol = findColumnId(active.id as string);
      const overCol = findColumnId(over.id as string);

      if (!activeCol || !overCol || activeCol === overCol) return;

      moveCard(active.id as string, overCol);
    },
    [findColumnId, moveCard]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      if (activeId === overId) return;

      // If dropped on a column directly, card is already moved
      if (columns.some(c => c.id === overId)) return;

      const activeCol = findColumnId(activeId);
      const overCol = findColumnId(overId);

      if (activeCol && activeCol === overCol) {
        const colCards = getColumnCards(activeCol);
        const oldIndex = colCards.findIndex(c => c.id === activeId);
        const newIndex = colCards.findIndex(c => c.id === overId);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          reorderCards(activeCol, oldIndex, newIndex);
        }
      }

      socketClient.emit('card:moved', { cardId: activeId });
    },
    [columns, findColumnId, getColumnCards, reorderCards]
  );

  const activeCard = useMemo(
    () => cards.find(c => c.id === activeId),
    [cards, activeId]
  );

  const sortedColumns = useMemo(
    () => [...columns].sort((a, b) => a.order - b.order),
    [columns]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 overflow-x-auto pb-4">
        {sortedColumns.map(col => (
          <BeanColumn
            key={col.id}
            column={col}
            cards={getColumnCards(col.id)}
            dragDisabled={dragDisabled}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeCard ? <RoastCard card={activeCard} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};
