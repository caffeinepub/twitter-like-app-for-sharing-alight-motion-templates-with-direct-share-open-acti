import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useCurrentUser';
import { useGetPremiumStatus } from '../hooks/usePremiumSubscription';
import { useIsCallerAdmin } from '../hooks/useAdmin';
import { useNavigate } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Crown, Shield } from 'lucide-react';

export default function ProfileMenu() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isPremium } = useGetPremiumStatus();
  const { data: isAdmin } = useIsCallerAdmin();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handlePremiumClick = () => {
    navigate({ to: '/premium' });
  };

  const handleAdminClick = () => {
    navigate({ to: '/admin' });
  };

  const initials = userProfile?.username
    ? userProfile.username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-accent text-accent-foreground">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{userProfile?.fullName || 'User'}</p>
              {isPremium && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  <Crown className="h-3 w-3 mr-0.5" />
                  Premium
                </Badge>
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">@{userProfile?.username || 'anonymous'}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePremiumClick} className="cursor-pointer">
          <Crown className="mr-2 h-4 w-4" />
          <span>{isPremium ? 'Manage Premium' : 'Upgrade to Premium'}</span>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleAdminClick} className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
