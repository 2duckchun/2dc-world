import { MainContent } from "@/widgets/layouts/main-content"
import { MainFooter } from "@/widgets/layouts/main-footer"
import { MainHeader } from "@/widgets/layouts/main-header"

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="blog-surface flex min-h-svh flex-col bg-background text-foreground">
      <MainHeader />
      <MainContent>{children}</MainContent>
      <MainFooter />
    </div>
  )
}
