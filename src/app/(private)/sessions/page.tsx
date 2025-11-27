"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { LogOut, Tablet, Loader2, Monitor, Smartphone } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useI18n } from "@/i18n/context";
import { Session } from "@/types/session";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/user.service";

export default function SessionsPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLogoutAllDialogOpen, setIsLogoutAllDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["getSessions"],
    queryFn: userService.getSessions,
  });

  const { mutate: logoutDeviceMutation } = useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      setSelectedSessionId("");
      setIsLogoutDialogOpen(false);

      toast.success(t.sessions.logoutSuccess);
      queryClient.invalidateQueries({ queryKey: ["getSessions"] });
    },
    mutationFn: (sessionId: string) => userService.logoutDevice(sessionId),
  });

  const { mutate: logoutAllDevicesMutation } = useMutation({
    mutationFn: userService.logoutAllDevices,
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      setIsLogoutAllDialogOpen(false);

      toast.success(t.sessions.logoutAllSuccess);
      queryClient.invalidateQueries({ queryKey: ["getSessions"] });
    },
  });

  const openLogoutDialog = (sessionId: string) => {
    setIsLogoutDialogOpen(true);
    setSelectedSessionId(sessionId);
  };

  const getDeviceIcon = (deviceType: string) => {
    const type = deviceType.toLowerCase();

    if (type.includes("mobile") || type.includes("phone")) {
      return <Smartphone className="h-5 w-5" />;
    }

    if (type.includes("tablet")) {
      return <Tablet className="h-5 w-5" />;
    }

    return <Monitor className="h-5 w-5" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      year: "numeric",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t.sessions.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t.sessions.title}
        </h1>
        <p className="text-muted-foreground">{t.sessions.description}</p>
      </div>

      {(data?.sessions.length ?? 0) > 1 && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => setIsLogoutAllDialogOpen(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t.sessions.logoutAllOthers}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {data?.sessions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Monitor className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-center text-muted-foreground">
                {t.sessions.noSessions}
              </p>
            </CardContent>
          </Card>
        ) : (
          data?.sessions.map((session: Session) => (
            <Card
              key={session.id}
              className={session.isCurrent ? "border-primary" : ""}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {session.deviceName}
                        {session.isCurrent && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                            {t.sessions.currentDevice}
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {session.deviceType} • {session.ipAddress}
                      </CardDescription>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openLogoutDialog(session.id)}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t.sessions.logoutDevice}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t.sessions.createdAt}:
                    </span>
                    <span className="font-medium">
                      {formatDate(session.createdAt)}
                    </span>
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
                    <span className="font-medium">
                      {formatDate(session.expiresAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-start">
        <Button variant="outline" asChild>
          <Link href="/">{t.sessions.backToHome}</Link>
        </Button>
      </div>

      {/* Logout Device Confirmation Dialog */}
      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
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
              {t.sessions.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout All Other Devices Confirmation Dialog */}
      <AlertDialog
        open={isLogoutAllDialogOpen}
        onOpenChange={setIsLogoutAllDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
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
              {t.sessions.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
