import { SiteLayout } from "@/widgets/layouts/site-layout"

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <SiteLayout>{children}</SiteLayout>
}
