import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineBadge = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive rounded-full text-xs font-semibold animate-fade-in">
      <WifiOff className="w-3.5 h-3.5" />
      Offline
    </div>
  );
};
