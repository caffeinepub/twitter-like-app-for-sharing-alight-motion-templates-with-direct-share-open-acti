import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useAdminLogin, useAdminLogout } from '../hooks/useAdmin';
import { useGetCustomizationSettings, useSaveCustomizationSettings } from '../hooks/useCustomizationSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, LogOut, Settings, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: settings, isLoading: settingsLoading } = useGetCustomizationSettings();
  const adminLoginMutation = useAdminLogin();
  const adminLogoutMutation = useAdminLogout();
  const saveSettingsMutation = useSaveCustomizationSettings();

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [settingsForm, setSettingsForm] = useState({
    theme: '',
    primaryColor: '',
    logoUrl: '',
  });

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Update settings form when data loads
  if (settings && settingsForm.theme === '' && settingsForm.primaryColor === '' && settingsForm.logoUrl === '') {
    setSettingsForm({
      theme: settings.theme,
      primaryColor: settings.primaryColor,
      logoUrl: settings.logoUrl,
    });
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminLoginMutation.mutateAsync({
      username: loginForm.username,
      password: loginForm.password,
    });
  };

  const handleAdminLogout = async () => {
    await adminLogoutMutation.mutateAsync();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettingsMutation.mutateAsync(settingsForm);
  };

  // Not authenticated - show sign-in CTA
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-2xl py-16 px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <Shield className="h-8 w-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
            <CardDescription>Sign in with Internet Identity to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button onClick={login} disabled={isLoggingIn} size="lg">
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated but not admin - show login form
  if (isAdminLoading) {
    return (
      <div className="container mx-auto max-w-2xl py-16 px-4">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto max-w-2xl py-16 px-4">
        <Card>
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <Shield className="h-8 w-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-center text-2xl">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={adminLoginMutation.isPending}>
                {adminLoginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login as Admin'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin authenticated - show admin panel
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-accent-foreground" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-1">Manage application customization settings</p>
        </div>
        <Button variant="outline" onClick={handleAdminLogout} disabled={adminLogoutMutation.isPending}>
          {adminLogoutMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Admin Logout
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Customization Settings
          </CardTitle>
          <CardDescription>Configure the application's appearance and branding</CardDescription>
        </CardHeader>
        <CardContent>
          {settingsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  type="text"
                  placeholder="e.g., dark, light, system"
                  value={settingsForm.theme}
                  onChange={(e) => setSettingsForm({ ...settingsForm, theme: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">The default theme for the application</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  type="text"
                  placeholder="e.g., #FF6B35, oklch(0.65 0.2 35)"
                  value={settingsForm.primaryColor}
                  onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  The primary accent color (hex, rgb, or oklch format)
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  type="text"
                  placeholder="e.g., /assets/logo.png"
                  value={settingsForm.logoUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">The URL or path to the application logo</p>
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (settings) {
                      setSettingsForm({
                        theme: settings.theme,
                        primaryColor: settings.primaryColor,
                        logoUrl: settings.logoUrl,
                      });
                    }
                  }}
                  disabled={saveSettingsMutation.isPending}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={saveSettingsMutation.isPending}>
                  {saveSettingsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
