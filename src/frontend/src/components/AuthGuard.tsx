import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: () => void;
}

export function useAuthGuard() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to continue', {
        description: 'You need to be signed in to perform this action.',
        action: {
          label: 'Sign In',
          onClick: login,
        },
      });
      return;
    }
    action();
  };

  return { requireAuth, isAuthenticated };
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (!isAuthenticated && fallback) {
    fallback();
    return null;
  }

  return <>{children}</>;
}
