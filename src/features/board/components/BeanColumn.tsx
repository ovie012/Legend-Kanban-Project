import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { SortableCard } from './SortableCard';
import { CardModal } from './CardModal';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { BrewButton } from '@/shared/components/BrewButton';
import { useBoardStore } from '../store';
import { usePermissions, canCreate, canEdit, canDelete } from '@/permissions/usePermissions';
import type { CardData, ColumnData } from '../types';

interface BeanColumnProps {
  column: ColumnData;
  cards: CardData[];
  dragDisabled?: boolean;
}

export const BeanColumn = ({ column, cards, dragDisabled }: BeanColumnProps) => {
  const { setNodeRef } = useDroppable({ id: column.id });
  const deleteCard = useBoardStore(s => s.deleteCard);
  const role = usePermissions(s => s.role);

  const [addOpen, setAddOpen] = useState(false);
  const [editCard, setEditCard] = useState<CardData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CardData | null>(null);

  const handleDelete = () => {
    if (deleteTarget) {
      deleteCard(deleteTarget.id);
      toast.success('Card deleted');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex-shrink-0 w-full sm:w-80">
      <div className="bg-secondary/40 rounded-2xl border border-border/50">
        <div className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-foreground">{column.title}</h3>
            <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {cards.length}
            </span>
          </div>
        </div>

        <div ref={setNodeRef} className="px-3 pb-3 min-h-[140px] space-y-2.5">
          <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {cards.map(card => (
              <SortableCard
                key={card.id}
                card={card}
                disabled={dragDisabled}
                onEdit={canEdit(role) ? () => setEditCard(card) : undefined}
                onDelete={canDelete(role) ? () => setDeleteTarget(card) : undefined}
              />
            ))}
          </SortableContext>
        </div>

        {canCreate(role) && (
          <div className="px-3 pb-3">
            <BrewButton
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add card
            </BrewButton>
          </div>
        )}
      </div>

      <CardModal open={addOpen} onOpenChange={setAddOpen} columnId={column.id} />
      <CardModal
        open={!!editCard}
        onOpenChange={(open) => { if (!open) setEditCard(null); }}
        columnId={column.id}
        card={editCard}
      />
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDelete}
        title={deleteTarget?.title || ''}
      />
    </div>
  );
};
