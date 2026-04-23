import Link from "next/link"
import { buttonVariants } from "@/shared/ui/button"

export default function Forbidden() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 text-foreground">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="font-semibold text-muted-foreground text-sm">403</p>
        <h1 className="mt-2 font-bold text-2xl">접근 권한이 없습니다</h1>
        <p className="mt-3 text-muted-foreground leading-7">
          관리자 권한이 필요한 페이지입니다.
        </p>
        <Link href="/" className={buttonVariants({ className: "mt-6" })}>
          홈으로 이동
        </Link>
      </section>
    </main>
  )
}
