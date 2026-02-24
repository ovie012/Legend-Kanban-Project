import type { UserPresence } from '@/features/board/types';

const mockUsers: UserPresence[] = [
  { id: 'user-1', name: 'You', avatar: '☕', isOnline: true },
  { id: 'user-2', name: 'Alex', avatar: '🫘', isOnline: true },
  { id: 'user-3', name: 'Jordan', avatar: '🍵', isOnline: true },
  { id: 'user-4', name: 'Sam', avatar: '🧋', isOnline: false },
];

export const PresenceBar = () => {
  const online = mockUsers.filter(u => u.isOnline);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-2">
        {online.map(user => (
          <div
            key={user.id}
            title={user.name}
            className="relative w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-sm select-none"
          >
            {user.avatar}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-priority-low border-2 border-background" />
          </div>
        ))}
      </div>
      <span className="text-xs text-muted-foreground font-medium ml-1">
        {online.length} online
      </span>
    </div>
  );
};
