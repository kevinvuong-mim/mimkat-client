'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Key, Mail, Phone, Camera, Shield, Loader2, XCircle, CheckCircle } from 'lucide-react';

import { ErrorResponse } from '@/types';
import { useI18n } from '@/i18n/context';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/context/current-user-context';
import { EditProfileDialog } from '@/components/edit-profile-dialog';
import { uploadAvatar, getProfileByIdentifier } from '@/services/users';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { t } = useI18n();
  const { identifier } = useParams();
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  const isOwnProfile = currentUser?.id === identifier || identifier === currentUser?.username;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data, error, isLoading } = useQuery({
    enabled: !!currentUser && !isOwnProfile,
    queryKey: ['getProfileByIdentifier', identifier],
    queryFn: () => getProfileByIdentifier(identifier as string),
  });

  const { mutate, isPending } = useMutation({
    onError: (error) => toast.error(error.message),
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: () => {
      toast.success(t.profile.avatarUpdated);
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
    },
  });

  const displayUser = isOwnProfile ? currentUser : data;

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

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl">
        <div className="space-y-6 rounded-lg border border-slate-300 bg-white p-8 shadow-2xl dark:border-slate-600 dark:bg-slate-800">
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                <XCircle className="h-12 w-12 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
              {(error as unknown as ErrorResponse)?.statusCode === 404
                ? t.profile.userNotFound
                : t.profile.errorLoading}
            </h1>
          </div>
          <div className="space-y-3 border-t pt-4">
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
      <div className="space-y-6 rounded-lg border border-slate-300 bg-white p-8 shadow-2xl dark:border-slate-600 dark:bg-slate-800">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-32 w-32 ring-4 ring-slate-200 dark:ring-slate-700">
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
                  className={`absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 ${
                    isPending ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5" />
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
            <h1 className="text-2xl font-bold tracking-tight">{displayUser?.fullName || ''}</h1>
            <p className="text-sm text-muted-foreground">
              {displayUser?.username ? `@${displayUser.username}` : ''}
            </p>
          </div>
        </div>

        {isOwnProfile ? (
          <>
            <div className="space-y-3">
              <h2 className="mb-4 text-lg font-semibold">{t.profile.contact}</h2>

              <div className="grid grid-cols-2 gap-3">
                <InfoRow icon={Mail} label={t.profile.email} value={currentUser?.email} />
                <InfoRow
                  icon={Phone}
                  label={t.profile.phoneNumber}
                  value={currentUser?.phoneNumber}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="mb-4 text-lg font-semibold">{t.profile.accountStatus}</h2>

              <div className="grid grid-cols-2 gap-3">
                <InfoRow
                  icon={CheckCircle}
                  label={t.profile.isActive}
                  value={currentUser?.isActive}
                />
                <InfoRow
                  icon={Mail}
                  label={t.profile.isEmailVerified}
                  value={currentUser?.isEmailVerified}
                />
                <InfoRow
                  icon={Key}
                  label={t.profile.hasPassword}
                  value={currentUser?.hasPassword}
                />
                <InfoRow
                  icon={Shield}
                  label={t.profile.hasGoogleAuth}
                  value={currentUser?.hasGoogleAuth}
                />
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <Button className="w-full" onClick={() => setIsEditDialogOpen(true)}>
                {t.profile.editProfile}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">{t.profile.backToHome}</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3 border-t pt-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">{t.profile.backToHome}</Link>
            </Button>
          </div>
        )}
      </div>

      {currentUser && (
        <EditProfileDialog
          open={isEditDialogOpen}
          currentUser={currentUser}
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
    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
        <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">
          {typeof value === 'boolean' ? (
            <span className="flex items-center gap-1">
              {value ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">{t.profile.yes}</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-600 dark:text-red-400">{t.profile.no}</span>
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
