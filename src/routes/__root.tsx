import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Sidebar } from "../components/sportflix/Sidebar";
import { Footer } from "../components/sportflix/Footer";
import { Splash } from "../components/sportflix/Splash";
import { AuthProvider } from "../lib/auth";
import { Toaster } from "sonner";
import { WB_FAVICON } from "../lib/wb-favicon";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-black text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the archive</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            Back to WatchBox7
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Playback interrupted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Try again or head back to the home screen.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:scale-105"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-border bg-surface-2 px-4 py-2 text-sm font-medium hover:bg-secondary"
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
      { name: "theme-color", content: "#0d0d0d" },
      { title: "WatchBox7 | The home of translated & non-translated movies" },
      {
        name: "description",
        content:
          "WatchBox7 — the home of translated & non-translated movies and full-series episodes. Watch and download as a guest.",
      },
      { name: "author", content: "Belden Right" },
      { property: "og:title", content: "WatchBox7 | The home of translated & non-translated movies" },
      { property: "og:description", content: "WatchBox7 is a premium streaming platform for movies and series." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "WatchBox7" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "WatchBox7 | The home of translated & non-translated movies" },
      { name: "twitter:description", content: "WatchBox7 is a premium streaming platform for movies and series." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: WB_FAVICON },
      { rel: "apple-touch-icon", href: WB_FAVICON },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap",
      },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Splash />
        <div className="relative min-h-screen bg-background text-foreground">
          {/* Cinematic backdrop */}
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(30,91,255,0.18),transparent_60%),radial-gradient(900px_500px_at_90%_10%,rgba(232,29,29,0.15),transparent_60%),linear-gradient(180deg,#050505,#0a0a0a)]" />
          <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.05] [background-image:repeating-linear-gradient(0deg,transparent_0,transparent_2px,#fff_2px,#fff_3px)]" />
          <Sidebar />
          <div className="flex min-h-screen flex-col pt-14">
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
        <Toaster theme="dark" position="top-center" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}

