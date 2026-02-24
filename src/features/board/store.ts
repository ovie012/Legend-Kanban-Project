import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import type { CardData, ColumnData } from './types';

interface BoardState {
  columns: ColumnData[];
  cards: CardData[];
  snapshot: CardData[] | null;

  takeSnapshot: () => void;
  rollback: () => void;

  addCard: (card: Pick<CardData, 'title' | 'description' | 'priority' | 'columnId'>) => void;
  updateCard: (id: string, updates: Partial<Pick<CardData, 'title' | 'description' | 'priority'>>) => void;
  deleteCard: (id: string) => void;
  moveCard: (cardId: string, toColumnId: string) => void;
  reorderCards: (columnId: string, oldIndex: number, newIndex: number) => void;
}

const initialColumns: ColumnData[] = [
  { id: 'col-1', title: 'To Brew', order: 0 },
  { id: 'col-2', title: 'Brewing', order: 1 },
  { id: 'col-3', title: 'Served', order: 2 },
];

const now = new Date().toISOString();

const initialCards: CardData[] = [
  { id: 'card-1', title: 'Design the landing page', description: 'Create wireframes and high-fidelity mockups for the homepage.', columnId: 'col-1', order: 0, version: 1, priority: 'high', createdAt: now, updatedAt: now },
  { id: 'card-2', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment.', columnId: 'col-1', order: 1, version: 1, priority: 'medium', createdAt: now, updatedAt: now },
  { id: 'card-3', title: 'Write API documentation', description: 'Document all REST endpoints using OpenAPI spec.', columnId: 'col-1', order: 2, version: 1, priority: 'low', createdAt: now, updatedAt: now },
  { id: 'card-4', title: 'Implement auth flow', description: 'OAuth2 login with Google and GitHub providers.', columnId: 'col-2', order: 0, version: 1, priority: 'high', createdAt: now, updatedAt: now },
  { id: 'card-5', title: 'Database schema review', description: 'Review and optimize PostgreSQL indexes.', columnId: 'col-2', order: 1, version: 1, priority: 'medium', createdAt: now, updatedAt: now },
  { id: 'card-6', title: 'Deploy staging environment', description: 'Staging is live and tested end-to-end.', columnId: 'col-3', order: 0, version: 2, priority: 'low', createdAt: now, updatedAt: now },
];

export const useBoardStore = create<BoardState>((set, get) => ({
  columns: initialColumns,
  cards: initialCards,
  snapshot: null,

  takeSnapshot: () => set({ snapshot: structuredClone(get().cards) }),

  rollback: () => {
    const { snapshot } = get();
    if (snapshot) set({ cards: snapshot, snapshot: null });
  },

  addCard: (data) => {
    const cards = get().cards;
    const columnCards = cards.filter(c => c.columnId === data.columnId);
    const ts = new Date().toISOString();
    const newCard: CardData = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      priority: data.priority,
      columnId: data.columnId,
      order: columnCards.length,
      version: 1,
      createdAt: ts,
      updatedAt: ts,
    };
    set({ cards: [...cards, newCard] });
  },

  updateCard: (id, updates) => {
    set({
      cards: get().cards.map(c =>
        c.id === id
          ? { ...c, ...updates, version: c.version + 1, updatedAt: new Date().toISOString() }
          : c
      ),
    });
  },

  deleteCard: (id) => {
    set({ cards: get().cards.filter(c => c.id !== id) });
  },

  moveCard: (cardId, toColumnId) => {
    set(state => {
      const targetCount = state.cards.filter(c => c.columnId === toColumnId && c.id !== cardId).length;
      return {
        cards: state.cards.map(c =>
          c.id === cardId
            ? { ...c, columnId: toColumnId, order: targetCount, updatedAt: new Date().toISOString() }
            : c
        ),
      };
    });
  },

  reorderCards: (columnId, oldIndex, newIndex) => {
    set(state => {
      const columnCards = state.cards
        .filter(c => c.columnId === columnId)
        .sort((a, b) => a.order - b.order);

      const reordered = arrayMove(columnCards, oldIndex, newIndex).map((c, i) => ({
        ...c,
        order: i,
      }));

      const otherCards = state.cards.filter(c => c.columnId !== columnId);
      return { cards: [...otherCards, ...reordered] };
    });
  },
}));
