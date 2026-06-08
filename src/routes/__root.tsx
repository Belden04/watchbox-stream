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
import { Navbar } from "../components/sportflix/Navbar";
import { Footer } from "../components/sportflix/Footer";
import { Splash } from "../components/sportflix/Splash";
import { AuthProvider } from "../lib/auth";
import { Toaster } from "sonner";
import { SF_FAVICON } from "../lib/sf-favicon";


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
            Back to SPORTFLIX
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
      { title: "SPORTFLIX | The home of translated & non-translated & all matches highlights" },
      {
        name: "description",
        content:
          "SPORTFLIX — the home of translated & non-translated movies and all matches highlights. Watch and download as a guest.",
      },
      { name: "author", content: "Belden Right" },
      { property: "og:title", content: "SPORTFLIX | The home of translated & non-translated & all matches highlights" },
      { property: "og:description", content: "Sportflix is a premium streaming platform for movies and sports highlights." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "SPORTFLIX" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SPORTFLIX | The home of translated & non-translated & all matches highlights" },
      { name: "description", content: "Sportflix is a premium streaming platform for movies and sports highlights." },
      { name: "twitter:description", content: "Sportflix is a premium streaming platform for movies and sports highlights." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Cml0dBvx2dbnvcFhcXFvMhnigIq1/social-images/social-1780896263252-ChatGPT_Image_Jun_2,_2026,_10_11_37_AM.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Cml0dBvx2dbnvcFhcXFvMhnigIq1/social-images/social-1780896263252-ChatGPT_Image_Jun_2,_2026,_10_11_37_AM.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: SF_FAVICON },
      { rel: "apple-touch-icon", href: SF_FAVICON },
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
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <Toaster theme="dark" position="top-center" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}

