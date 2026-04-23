import { MainContent } from "@/widgets/layouts/main-content"
import { MainHeader } from "@/widgets/layouts/main-header"

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="blog-surface min-h-svh bg-background text-foreground">
      <MainHeader />
      <MainContent>{children}</MainContent>
    </div>
  )
}
