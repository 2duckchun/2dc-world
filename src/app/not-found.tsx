import { Compass, Home } from "lucide-react"
import Link from "next/link"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center py-12">
      <section className="w-full rounded-[2rem] border border-border/70 bg-card/80 p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Compass className="size-6" />
          </span>
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
              Not found
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance">
              This page does not exist in the public reading map.
            </h1>
            <p className="text-base leading-8 text-muted-foreground text-pretty">
              The route may be incorrect, unpublished, or intentionally
              unavailable. Try returning home or browsing one of the public
              reading sections.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
            >
              <Home className="size-4" />
              Go home
            </Link>
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full",
              )}
            >
              Browse blog
            </Link>
            <Link
              href="/booklog"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full",
              )}
            >
              Browse booklog
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
