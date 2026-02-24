import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RoastCard } from './RoastCard';
import type { CardData } from '../types';

interface SortableCardProps {
  card: CardData;
  disabled?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SortableCard = ({ card, disabled, onEdit, onDelete }: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
    >
      <RoastCard card={card} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};
