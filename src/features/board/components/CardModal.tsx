import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BrewButton } from '@/shared/components/BrewButton';
import { useBoardStore } from '../store';
import type { CardData } from '../types';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).default(''),
  priority: z.enum(['low', 'medium', 'high']),
});

type FormValues = z.infer<typeof schema>;

interface CardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columnId: string;
  card?: CardData | null;
}

export const CardModal = ({ open, onOpenChange, columnId, card }: CardModalProps) => {
  const addCard = useBoardStore(s => s.addCard);
  const updateCard = useBoardStore(s => s.updateCard);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', priority: 'medium' },
  });

  useEffect(() => {
    if (open) {
      reset(
        card
          ? { title: card.title, description: card.description, priority: card.priority }
          : { title: '', description: '', priority: 'medium' }
      );
    }
  }, [open, card, reset]);

  const onSubmit = (data: FormValues) => {
    if (card) {
      updateCard(card.id, data);
      toast.success('Card updated');
    } else {
      addCard({ title: data.title, description: data.description ?? '', priority: data.priority, columnId });
      toast.success('Card brewed! ☕');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {card ? 'Edit Card' : 'Brew a New Card'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Title</label>
            <input
              {...register('title')}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="What needs to be done?"
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
            <textarea
              {...register('description')}
              className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Add more details…"
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Priority</label>
            <div className="flex gap-3">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <label
                  key={p}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="radio"
                    value={p}
                    {...register('priority')}
                    className="accent-primary w-4 h-4"
                  />
                  <span className="capitalize text-foreground">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <BrewButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </BrewButton>
            <BrewButton type="submit" size="sm">
              {card ? 'Save Changes' : 'Add Card'}
            </BrewButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
