"use client";

import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { useI18n } from "@/i18n/context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, UpdateProfileData } from "@/types";
import { userService } from "@/services/user.service";

interface EditProfileDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({
  open,
  user,
  onOpenChange,
}: EditProfileDialogProps) {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    onError: (err) => toast.error(err.message),
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t.editProfile.updateSuccess);
      queryClient.invalidateQueries({ queryKey: ["getProfile"] });
    },
    mutationFn: (data: UpdateProfileData) => userService.updateProfile(data),
  });

  const formSchema = z.object({
    username: z
      .string()
      .min(3, t.editProfile.usernameMinLength)
      .max(50)
      .regex(/^[a-zA-Z0-9_]+$/, t.editProfile.usernamePattern)
      .optional()
      .or(z.literal("")),
    phoneNumber: z
      .string()
      .regex(/^[0-9+\-() ]*$/, t.editProfile.phoneNumberPattern)
      .optional()
      .or(z.literal("")),
    fullName: z.string().min(1, t.editProfile.fullNameRequired).max(100),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user.fullName,
      username: user.username,
      phoneNumber: user.phoneNumber,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updateData: UpdateProfileData = {};

    if (values.fullName && values.fullName !== user.fullName) {
      updateData.fullName = values.fullName;
    }

    if (values.username && values.username !== user.username) {
      updateData.username = values.username;
    }

    if (values.phoneNumber && values.phoneNumber !== user.phoneNumber) {
      updateData.phoneNumber = values.phoneNumber;
    }

    if (Object.keys(updateData).length === 0) {
      toast.info(t.editProfile.noChanges);
      return;
    }

    mutate(updateData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.editProfile.title}</DialogTitle>
          <DialogDescription>{t.editProfile.description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-1" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="fullName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.editProfile.fullName}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t.editProfile.fullName} />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.editProfile.username}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t.editProfile.username} />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.editProfile.phoneNumber}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t.editProfile.phoneNumber} />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
              >
                {t.editProfile.cancel}
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t.editProfile.submit
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
