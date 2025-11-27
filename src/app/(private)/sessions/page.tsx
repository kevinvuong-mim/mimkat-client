"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Tablet, Loader2, Monitor, Smartphone } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLogoutAllDialogOpen, setIsLogoutAllDialogOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["getSessions"],
    queryFn: userService.getSessions,
  });

  const { mutate: logoutDeviceMutation, isPending: isLogoutDevicePending } =
    useMutation({
      onError: (error) => toast.error(error.message),
      onSuccess: () => {
        setSelectedSessionId("");
        setIsLogoutDialogOpen(false);

        toast.success(t.sessions.logoutSuccess);
        queryClient.invalidateQueries({ queryKey: ["getSessions"] });
      },
      mutationFn: (sessionId: string) => userService.logoutDevice(sessionId),
    });

  const {
    mutate: logoutAllDevicesMutation,
    isPending: isLogoutAllDevicesPending,
  } = useMutation({
    mutationFn: userService.logoutAllDevices,
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      setIsLogoutAllDialogOpen(false);

      toast.success(t.sessions.logoutAllSuccess);

      setTimeout(() => router.push("/login"), 3000);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 dark:from-black dark:via-slate-950 dark:to-black p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary drop-shadow-sm">
            {t.sessions.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t.sessions.description}
          </p>
        </div>

        {(data?.sessions.length ?? 0) > 1 && (
          <div className="mb-6 flex justify-end">
            <Button
              variant="destructive"
              onClick={() => setIsLogoutAllDialogOpen(true)}
              className="rounded-lg shadow-md hover:scale-[1.03] transition-transform mr-4"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t.sessions.logoutAllOthers.replace(
                "{count}",
                (data?.sessions.length ?? 0).toString()
              )}
            </Button>
          </div>
        )}

        <div className="relative">
          <ScrollArea className="h-[444px] w-full">
            <div className="space-y-6 pr-4">
              {data?.sessions.length === 0 ? (
                <Card className="shadow-lg border-0 bg-gradient-to-br from-muted/40 to-white">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Monitor className="h-14 w-14 text-muted-foreground" />
                    <p className="mt-6 text-lg text-center text-muted-foreground">
                      {t.sessions.noSessions}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                data?.sessions.map((session: Session) => (
                  <Card
                    key={session.id}
                    className={`transition-all border-2 ${
                      session.isCurrent
                        ? "border-primary"
                        : "border-transparent bg-white hover:border-muted/40"
                    } rounded-xl`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`rounded-full p-3 ${
                              session.isCurrent
                                ? "bg-primary/80"
                                : "bg-muted/40"
                            } shadow-sm flex items-center justify-center`}
                          >
                            {getDeviceIcon(session.deviceType)}
                          </div>
                          <div>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                              {session.deviceName}
                              {session.isCurrent && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground shadow">
                                  {t.sessions.currentDevice}
                                </span>
                              )}
                            </CardTitle>
                            <CardDescription className="text-base text-muted-foreground">
                              {session.deviceType} • {session.ipAddress}
                            </CardDescription>
                          </div>
                        </div>
                        {!session.isCurrent && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 hover:scale-105 transition-transform"
                            onClick={() => openLogoutDialog(session.id)}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            {t.sessions.logoutDevice}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid gap-3 text-base">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium">
                            {t.sessions.createdAt}:
                          </span>
                          <span className="font-semibold">
                            {formatDate(session.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium">
                            {t.sessions.lastUsed}:
                          </span>
                          <span className="font-semibold">
                            {formatDate(session.lastUsedAt)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium">
                            {t.sessions.expiresAt}:
                          </span>
                          <span className="font-semibold">
                            {formatDate(session.expiresAt)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="mt-10 flex justify-start">
          <Button
            asChild
            variant="outline"
            className="rounded-lg px-6 py-2 text-base font-medium shadow hover:bg-muted/30"
          >
            <Link href="/">{t.sessions.backToHome}</Link>
          </Button>
        </div>

        <AlertDialog
          open={isLogoutDialogOpen}
          onOpenChange={setIsLogoutDialogOpen}
        >
          <AlertDialogContent className="rounded-xl shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-destructive">
                {t.sessions.logoutDeviceConfirmTitle}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                {t.sessions.logoutDeviceConfirmDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg px-4 py-2 text-base font-medium">
                {t.sessions.cancel}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (selectedSessionId) {
                    logoutDeviceMutation(selectedSessionId);
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg px-4 py-2 text-base font-bold"
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

        <AlertDialog
          open={isLogoutAllDialogOpen}
          onOpenChange={setIsLogoutAllDialogOpen}
        >
          <AlertDialogContent className="rounded-xl shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-destructive">
                {t.sessions.logoutAllConfirmTitle}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                {t.sessions.logoutAllConfirmDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg px-4 py-2 text-base font-medium">
                {t.sessions.cancel}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => logoutAllDevicesMutation()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg px-4 py-2 text-base font-bold"
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
      </div>
    </div>
  );
}
