"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateUserTimezone, updateUserAvatar } from "@/app/actions/user.actions";
import { useToast } from "@/components/ui/toast-provider";
import { PageHeader } from "@/components/ui/page-header";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { COMMON_TIMEZONES } from "@/lib/constants";
import { Globe, LogOut, Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    session?.user?.image || null
  );
  const [selectedTimezone, setSelectedTimezone] = useState(
    session?.user?.timezone || "Africa/Lagos"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isAvatarSaving, setIsAvatarSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image file size must be less than 4MB.");
      return;
    }

    setIsAvatarSaving(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        await updateUserAvatar(base64Data);
        await update({ user: { ...session?.user, image: base64Data } });
        setAvatarUrl(base64Data);
        toast.success("Avatar image updated successfully!");
        setIsAvatarSaving(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Failed to upload avatar image:", err);
      toast.error("Failed to update avatar image.");
      setIsAvatarSaving(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsAvatarSaving(true);
    try {
      await updateUserAvatar(null);
      await update({ user: { ...session?.user, image: null } });
      setAvatarUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Avatar removed.");
    } catch (err) {
      console.error("Failed to remove avatar image:", err);
      toast.error("Failed to remove avatar image.");
    } finally {
      setIsAvatarSaving(false);
    }
  };

  const handleTimezoneSave = async () => {
    setIsSaving(true);
    try {
      await updateUserTimezone(selectedTimezone);
      await update({ user: { ...session?.user, timezone: selectedTimezone } });
      toast.success("Timezone updated successfully!");
    } catch (err) {
      console.error("Failed to update timezone:", err);
      toast.error("Failed to update timezone. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground" role="status">
        Loading user profile...
      </div>
    );
  }

  const userInitials = session?.user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <AnimatedContainer delay={0} direction="fade">
        <PageHeader
          title="Profile & Settings"
          description="Manage your account preferences, local timezone, and session details."
        />
      </AnimatedContainer>

      {/* Profile Card */}
      <AnimatedContainer delay={100}>
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar Image / Initials */}
            <div className="relative group">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-xl shadow-primary/20 overflow-hidden relative"
                aria-hidden="true"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={session?.user?.name || "Avatar"}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  userInitials
                )}
              </div>

              {/* Upload Trigger overlay button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-xl bg-card border border-border shadow-lg text-foreground hover:bg-accent transition-colors cursor-pointer"
                title="Change Avatar Image"
              >
                <Camera className="w-4 h-4 text-primary" />
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="text-center sm:text-left space-y-2 flex-1">
              <div>
                <h2 className="text-2xl font-bold font-outfit text-foreground">
                  {session?.user?.name || "User Profile"}
                </h2>
                <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
              </div>

              {/* Upload & Remove Action Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={isAvatarSaving}
                  onClick={() => fileInputRef.current?.click()}
                  leftIcon={<Camera className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  {isAvatarSaving ? "Uploading..." : "Upload Photo"}
                </Button>

                {avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isAvatarSaving}
                    onClick={handleRemoveAvatar}
                    leftIcon={<Trash2 className="w-3.5 h-3.5 text-destructive" />}
                    className="text-xs text-destructive hover:bg-destructive/10"
                  >
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 space-y-6">
            {/* Timezone Settings Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="timezone-select"
                  className="text-sm font-semibold text-foreground flex items-center space-x-2"
                >
                  <Globe className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span>Notification Timezone</span>
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Deadline reminders will be dispatched according to your selected local timezone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  id="timezone-select"
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  className="flex-1 h-12 px-4 py-3 rounded-xl bg-card border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                  aria-label="Select your timezone"
                >
                  {COMMON_TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleTimezoneSave}
                  disabled={isSaving}
                  className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-sm font-semibold text-primary-foreground transition-all cursor-pointer disabled:opacity-50"
                  aria-label={isSaving ? "Saving timezone" : "Save timezone"}
                >
                  {isSaving ? "Saving..." : "Save Timezone"}
                </button>
              </div>
            </div>

            {/* Account Management */}
            <div className="border-t border-border pt-6 flex justify-between items-center">
              <div className="space-y-0.5">
                <div className="text-sm font-semibold text-foreground">Sign Out</div>
                <div className="text-xs text-muted-foreground">Safely log out of your current session.</div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  await signOut({ callbackUrl: "/auth", redirect: true });
                  router.push("/auth");
                }}
                leftIcon={<LogOut className="w-3.5 h-3.5 text-white" />}
                aria-label="Sign out of your account"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
}
