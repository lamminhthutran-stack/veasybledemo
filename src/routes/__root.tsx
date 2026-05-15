import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Veasyble Demo" },
      {
        name: "description",
        content:
          "Veasyble Demo showcases executor task flows and operations dashboards for retail visibility campaigns.",
      },
      { name: "author", content: "Veasyble" },
      { property: "og:title", content: "Veasyble Demo" },
      {
        property: "og:description",
        content:
          "Veasyble Demo showcases executor task flows and operations dashboards for retail visibility campaigns.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Veasyble Demo" },
      {
        name: "twitter:description",
        content:
          "Veasyble Demo showcases executor task flows and operations dashboards for retail visibility campaigns.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2fa86abc-2c94-4a69-920f-1be6ce0a4c79/id-preview-07538958--c6faf933-4ef5-4f4d-92d6-c9e0e9b417bb.lovable.app-1778642614063.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2fa86abc-2c94-4a69-920f-1be6ce0a4c79/id-preview-07538958--c6faf933-4ef5-4f4d-92d6-c9e0e9b417bb.lovable.app-1778642614063.png",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { DeviceProvider, DeviceToggle } from "@/lib/device";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        
          <DeviceProvider>
            <RouteGuard>
              <Outlet />
            </RouteGuard>
            {/* DeviceToggle and LangToggle are handled in ExecutorSidebar/BottomNav, but for Login or Ops we might need them, though Ops is web-only. Let's not render global DeviceToggle since it's already inside Sidebar and BottomNav */}
          </DeviceProvider>
        
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth();
  const navigate = useRouter();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!auth.isLoggedIn && pathname !== "/login") {
      navigate.navigate({ to: "/login" });
    }
  }, [auth.isLoggedIn, pathname, navigate]);

  return <>{children}</>;
}
