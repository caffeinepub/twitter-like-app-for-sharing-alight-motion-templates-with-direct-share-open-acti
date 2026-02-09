import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import FeedPage from './pages/FeedPage';
import PostDetailPage from './pages/PostDetailPage';
import ComposePage from './pages/ComposePage';
import PremiumPage from './pages/PremiumPage';
import AdminPage from './pages/AdminPage';
import AppLayout from './components/AppLayout';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: FeedPage,
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post/$postId',
  component: PostDetailPage,
});

const composeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compose',
  component: ComposePage,
});

const premiumRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/premium',
  component: PremiumPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([indexRoute, postDetailRoute, composeRoute, premiumRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
