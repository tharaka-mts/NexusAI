"use client";

import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { User, Mail, KeyRound, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  const authMethod = user.googleId ? 'Google OAuth' : 'Email & Password';

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account information.</p>
      </div>

      <section className="glass-card rounded-xl border border-border/60 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold">
            {(user.username?.[0] || user.email[0] || 'U').toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-lg">{user.username || 'Nexus User'}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-background/45 p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <User className="h-4 w-4" />
              Username
            </div>
            <p className="font-medium">{user.username || 'Not set'}</p>
          </div>

          <div className="rounded-lg border border-border/60 bg-background/45 p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Mail className="h-4 w-4" />
              Email
            </div>
            <p className="font-medium">{user.email}</p>
          </div>

          <div className="rounded-lg border border-border/60 bg-background/45 p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <KeyRound className="h-4 w-4" />
              Sign-in Method
            </div>
            <p className="font-medium">{authMethod}</p>
          </div>

          <div className="rounded-lg border border-border/60 bg-background/45 p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <ShieldCheck className="h-4 w-4" />
              User ID
            </div>
            <p className="font-mono text-xs break-all">{user.id}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
