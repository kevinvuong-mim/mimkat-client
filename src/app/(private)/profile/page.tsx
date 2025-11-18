"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

/**
 * This page automatically redirects to /auth if user is not authenticated
 */
function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">User Profile</CardTitle>
            <CardDescription>
              View and manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Email</Label>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Full Name</Label>
                <p className="text-lg font-medium">
                  {user?.fullName || "Not set"}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Username</Label>
                <p className="text-lg font-medium">
                  {user?.username || "Not set"}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Account Status</Label>
                <div className="flex gap-2">
                  <Badge variant={user?.isActive ? "default" : "destructive"}>
                    {user?.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge
                    variant={user?.isEmailVerified ? "default" : "secondary"}
                  >
                    {user?.isEmailVerified
                      ? "Email Verified"
                      : "Email Not Verified"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">
                  Authentication Methods
                </Label>
                <div className="flex gap-2">
                  {user?.hasPassword && (
                    <Badge variant="outline">Password</Badge>
                  )}
                  {user?.hasGoogleAuth && (
                    <Badge variant="outline">Google</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button asChild>
                <Link href="/change-password">Change Password</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
