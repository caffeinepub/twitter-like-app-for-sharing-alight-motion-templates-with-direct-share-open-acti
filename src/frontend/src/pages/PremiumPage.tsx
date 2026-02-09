import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetPremiumStatus, useUpgradeToPremium, useCancelPremium } from '../hooks/usePremiumSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles } from 'lucide-react';
import LoginButton from '../components/LoginButton';

export default function PremiumPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isPremium, isLoading: premiumLoading } = useGetPremiumStatus();
  const upgradeMutation = useUpgradeToPremium();
  const cancelMutation = useCancelPremium();

  const handleUpgrade = () => {
    upgradeMutation.mutate();
  };

  const handleCancel = () => {
    cancelMutation.mutate();
  };

  const features = [
    'Unlimited template downloads',
    'Priority support',
    'Early access to new templates',
    'Exclusive premium templates',
    'Ad-free experience',
    'Advanced customization tools',
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
            <Crown className="h-8 w-8 text-accent-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock exclusive features and take your motion graphics to the next level
          </p>
        </div>

        {!isAuthenticated ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Sign in to continue</CardTitle>
              <CardDescription>
                You need to be signed in to manage your Premium subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <LoginButton />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-1 max-w-2xl mx-auto">
            <Card className="relative overflow-hidden">
              {isPremium && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-accent text-accent-foreground">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Crown className="h-6 w-6 text-accent-foreground" />
                  Premium Plan
                </CardTitle>
                <CardDescription>
                  {isPremium
                    ? 'You are currently subscribed to Premium'
                    : 'Get access to all premium features'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold">
                    Free
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      (Demo mode)
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent-foreground shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                {premiumLoading ? (
                  <Button disabled className="w-full">
                    Loading...
                  </Button>
                ) : isPremium ? (
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                    className="w-full"
                  >
                    {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Subscription'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleUpgrade}
                    disabled={upgradeMutation.isPending}
                    className="w-full"
                  >
                    {upgradeMutation.isPending ? 'Upgrading...' : 'Upgrade to Premium'}
                  </Button>
                )}
              </CardFooter>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                This is a demo subscription system. In production, this would integrate with a payment
                processor.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
