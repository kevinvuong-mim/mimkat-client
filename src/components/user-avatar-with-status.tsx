'use client';

import { cn } from '@/lib/utils';
import { usePresence } from '@/context/presence';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserAvatarWithStatusProps {
  userId?: string;
  fallback: string;
  className?: string;
  src?: string | null;
  showStatus?: boolean;
}

export function UserAvatarWithStatus({
  src,
  userId,
  fallback,
  className,
  showStatus = true,
}: UserAvatarWithStatusProps) {
  const { isOnline } = usePresence();
  const online = userId ? isOnline(userId) : false;

  return (
    <div className="relative inline-flex shrink-0">
      <Avatar className={className}>
        <AvatarImage src={src ?? undefined} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      {showStatus && userId && (
        <span
          className={cn(
            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background',
            online ? 'bg-green-500' : 'bg-muted-foreground/40',
          )}
          aria-hidden
        />
      )}
    </div>
  );
}
