import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { PenSquare, Crown } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function AppHeader() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const handleCompose = () => {
    navigate({ to: '/compose' });
  };

  const handlePremium = () => {
    navigate({ to: '/premium' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src="/assets/generated/am-template-logo.dim_512x512.png"
            alt="Alight Motion Templates"
            className="h-10 w-10"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none">AM Templates</span>
            <span className="text-xs text-muted-foreground">Motion Graphics Hub</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <>
              <Button onClick={handlePremium} variant="ghost" size="default" className="gap-2">
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">Premium</span>
              </Button>
              <Button onClick={handleCompose} size="default" className="gap-2">
                <PenSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
              </Button>
            </>
          )}
          {isAuthenticated ? <ProfileMenu /> : <LoginButton />}
        </div>
      </div>
    </header>
  );
}
