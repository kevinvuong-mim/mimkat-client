'use client';

import {
  Key,
  Mail,
  Phone,
  Camera,
  Shield,
  Loader2,
  Monitor,
  UserPen,
  XCircle,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ErrorResponse } from '@/types';
import { useI18n } from '@/i18n/context';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/user-context';
import { usersService } from '@/services/users.service';
import { EditProfileDialog } from '@/components/edit-profile-dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { t } = useI18n();
  const { user } = useUser();
  const { identifier } = useParams();
  const queryClient = useQueryClient();

  const isOwnProfile = user?.id === identifier || identifier === user?.username;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data, error, isLoading } = useQuery({
    enabled: !!user && !isOwnProfile,
    queryKey: ['getProfileByIdentifier', identifier],
    queryFn: () => usersService.getProfileByIdentifier(identifier as string),
  });

  const { mutate, isPending } = useMutation({
    onError: (error) => toast.error(error.message),
    mutationFn: (file: File) => usersService.uploadAvatar(file),
    onSuccess: () => {
      toast.success(t.profile.avatarUpdated);
      queryClient.invalidateQueries({ queryKey: ['getProfile'] });
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error(t.profile.fileSizeError);
      return;
    }

    if (!/(jpg|jpeg|png|webp|gif)$/i.test(file.name)) {
      toast.error(t.profile.fileTypeError);
      return;
    }

    mutate(file);
  };

  const displayUser = isOwnProfile ? user : data;

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <XCircle className="w-12 h-12 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
              {(error as unknown as ErrorResponse)?.statusCode === 404
                ? t.profile.userNotFound
                : t.profile.errorLoading}
            </h1>
          </div>
          <div className="pt-4 border-t space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">{t.profile.backToHome}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-32 h-32 ring-4 ring-slate-200 dark:ring-slate-700">
                <AvatarImage
                  loading="lazy"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  src={displayUser?.avatar || '/images/default-user.png'}
                />
                <AvatarFallback>
                  {displayUser?.fullName ? displayUser.fullName.charAt(0) : ''}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-1 right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg ${
                    isPending ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                  <input
                    type="file"
                    className="hidden"
                    id="avatar-upload"
                    disabled={isPending}
                    onChange={handleAvatarChange}
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  />
                </label>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {displayUser?.fullName || ''}
            </h1>
            <p className="text-sm text-muted-foreground">
              {displayUser?.username ? `@${displayUser.username}` : ''}
            </p>
          </div>
        </div>

        {isOwnProfile ? (
          <>
            <div className="space-y-3">
              <h2 className="text-lg font-semibold mb-4">
                {t.profile.contact}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <InfoRow
                  icon={Mail}
                  value={user?.email}
                  label={t.profile.email}
                />
                <InfoRow
                  icon={Phone}
                  value={user?.phoneNumber}
                  label={t.profile.phoneNumber}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold mb-4">
                {t.profile.accountStatus}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <InfoRow
                  icon={CheckCircle}
                  value={user?.isActive}
                  label={t.profile.isActive}
                />
                <InfoRow
                  icon={Mail}
                  value={user?.isEmailVerified}
                  label={t.profile.isEmailVerified}
                />
                <InfoRow
                  icon={Key}
                  value={user?.hasPassword}
                  label={t.profile.hasPassword}
                />
                <InfoRow
                  icon={Shield}
                  value={user?.hasGoogleAuth}
                  label={t.profile.hasGoogleAuth}
                />
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <Button
                className="w-full"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <UserPen className="mr-2 h-4 w-4" />
                {t.profile.editProfile}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/change-password">
                    <Key className="mr-2 h-4 w-4" />
                    {t.profile.changePassword}
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/sessions">
                    <Monitor className="mr-2 h-4 w-4" />
                    {t.home.sessions}
                  </Link>
                </Button>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">{t.profile.backToHome}</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="pt-4 border-t space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">{t.profile.backToHome}</Link>
            </Button>
          </div>
        )}
      </div>

      {user && (
        <EditProfileDialog
          user={user}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </div>
  );
}

const InfoRow = ({
  label,
  value,
  icon: Icon,
}: {
  icon: any;
  label: string;
  value: string | boolean | undefined;
}) => {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">
          {typeof value === 'boolean' ? (
            <span className="flex items-center gap-1">
              {value ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">
                    {t.profile.yes}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-600 dark:text-red-400">
                    {t.profile.no}
                  </span>
                </>
              )}
            </span>
          ) : (
            value || 'N/A'
          )}
        </p>
      </div>
    </div>
  );
};
