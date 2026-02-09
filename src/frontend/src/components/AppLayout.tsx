import { Outlet } from '@tanstack/react-router';
import AppHeader from './AppHeader';
import ProfileSetupDialog from './ProfileSetupDialog';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-7xl">
        <Outlet />
      </main>
      <ProfileSetupDialog />
      <footer className="mt-16 border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>
          © 2026. Built with <span className="text-accent-foreground">♥</span> using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-accent-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
