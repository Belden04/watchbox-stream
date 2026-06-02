import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  accent?: "primary" | "accent";
  children: ReactNode;
  viewAllHref?: string;
};

export function Rail({ title, accent = "primary", children, viewAllHref }: Props) {
  const bar = accent === "primary" ? "bg-primary" : "bg-accent";
  return (
    <section className="py-10">
      <div className="mx-auto mb-6 flex max-w-[1600px] items-end justify-between px-4 md:px-8">
        <h2 className="font-display flex items-center gap-3 text-2xl font-bold tracking-tight md:text-3xl">
          <span className={`h-7 w-1.5 rounded-full ${bar}`} />
          {title}
        </h2>
        {viewAllHref && (
          <a
            href={viewAllHref}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
          >
            View All <ChevronRight className="size-3" />
          </a>
        )}
      </div>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-4 md:gap-5 md:px-8">
        {children}
      </div>
    </section>
  );
}
