'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Tablet, Loader2, Monitor, Smartphone } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { useI18n } from '@/i18n/context';
import { Session } from '@/types/session';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usersService } from '@/services/users.service';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SessionsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLogoutAllDialogOpen, setIsLogoutAllDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['getSessions'],
    queryFn: usersService.getSessions,
  });

  const { mutate: logoutDeviceMutation, isPending: isLogoutDevicePending } = useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      setSelectedSessionId('');
      setIsLogoutDialogOpen(false);

      toast.success(t.sessions.logoutSuccess);
      queryClient.invalidateQueries({ queryKey: ['getSessions'] });
    },
    mutationFn: (sessionId: string) => usersService.logoutDevice(sessionId),
  });

  const { mutate: logoutAllDevicesMutation, isPending: isLogoutAllDevicesPending } = useMutation({
    mutationFn: usersService.logoutAllDevices,
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      setIsLogoutAllDialogOpen(false);

      toast.success(t.sessions.logoutAllSuccess);

      setTimeout(() => router.push('/login'), 3000);
    },
  });

  const openLogoutDialog = (sessionId: string) => {
    setIsLogoutDialogOpen(true);
    setSelectedSessionId(sessionId);
  };

  const getDeviceIcon = (deviceType: string) => {
    const type = deviceType.toLowerCase();

    if (type.includes('mobile') || type.includes('phone')) {
      return <Smartphone className="h-5 w-5" />;
    }

    if (type.includes('tablet')) {
      return <Tablet className="h-5 w-5" />;
    }

    return <Monitor className="h-5 w-5" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      year: 'numeric',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  }

  return (
    <>
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">{t.sessions.title}</h1>
            <p className="text-sm text-muted-foreground">{t.sessions.description}</p>
          </div>

          {(data?.meta.total ?? 0) > 1 && (
            <div className="flex justify-end border-b pb-4">
              <Button variant="destructive" onClick={() => setIsLogoutAllDialogOpen(true)}>
                <LogOut className="mr-2 h-4 w-4" />
                {t.sessions.logoutAllOthers.replace('{count}', (data?.meta.total ?? 0).toString())}
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <ScrollArea className="h-[432px] w-full">
              <div className="pr-4">
                {data?.items.map((session: Session, index: number) => (
                  <div key={session.id}>
                    <div
                      className={`p-3 rounded-lg transition-colors ${
                        session.isCurrent
                          ? 'bg-primary/10 dark:bg-primary/20 border-2 border-primary'
                          : 'bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              session.isCurrent
                                ? 'bg-primary/20 dark:bg-primary/30'
                                : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          >
                            {getDeviceIcon(session.deviceType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium">{session.deviceName}</p>
                              {session.isCurrent && (
                                <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                                  {t.sessions.currentDevice}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {session.deviceType} • {session.ipAddress}
                            </p>
                            <div className="mt-2 space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t.sessions.createdAt}:
                                </span>
                                <span className="font-medium">{formatDate(session.createdAt)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t.sessions.lastUsed}:
                                </span>
                                <span className="font-medium">
                                  {formatDate(session.lastUsedAt)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t.sessions.expiresAt}:
                                </span>
                                <span className="font-medium">{formatDate(session.expiresAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {!session.isCurrent && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-shrink-0 text-destructive hover:bg-destructive/10"
                            onClick={() => openLogoutDialog(session.id)}
                          >
                            <LogOut className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {index < (data?.items.length ?? 0) - 1 && <Separator className="my-3" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="pt-4 border-t">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">{t.sessions.backToHome}</Link>
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              {t.sessions.logoutDeviceConfirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t.sessions.logoutDeviceConfirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.sessions.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedSessionId) {
                  logoutDeviceMutation(selectedSessionId);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLogoutDevicePending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t.sessions.confirm
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isLogoutAllDialogOpen} onOpenChange={setIsLogoutAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              {t.sessions.logoutAllConfirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t.sessions.logoutAllConfirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.sessions.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => logoutAllDevicesMutation()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLogoutAllDevicesPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t.sessions.confirm
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
