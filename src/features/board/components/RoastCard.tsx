import { memo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CardData } from '../types';

const priorityClasses: Record<string, string> = {
  low: 'bg-priority-low',
  medium: 'bg-priority-medium',
  high: 'bg-priority-high',
};

const priorityLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

interface RoastCardProps {
  card: CardData;
  isOverlay?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const RoastCard = memo(({ card, isOverlay, onEdit, onDelete }: RoastCardProps) => (
  <div
    className={cn(
      'group bg-card rounded-xl border border-border p-3.5 shadow-sm transition-all duration-200',
      !isOverlay && 'hover:shadow-md hover:-translate-y-0.5',
      isOverlay && 'shadow-xl scale-105 rotate-1 opacity-95'
    )}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className={cn('w-2 h-2 rounded-full flex-shrink-0', priorityClasses[card.priority])}
            title={priorityLabels[card.priority]}
          />
          <h4 className="font-semibold text-card-foreground text-sm leading-tight truncate">
            {card.title}
          </h4>
        </div>
        {card.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 ml-4">
            {card.description}
          </p>
        )}
      </div>

      {(onEdit || onDelete) && (
        <div
          className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Edit card"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Delete card"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>

    <div className="flex items-center justify-between mt-2.5 ml-4">
      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
        v{card.version}
      </span>
    </div>
  </div>
));

RoastCard.displayName = 'RoastCard';
