import { SiteLayout } from "@/widgets/layouts/site-layout"

// 편집 화면은 넓은 폭이 필요해서 공개 페이지(reading 폭)와 레이아웃을 나눈다.
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <SiteLayout width="wide">{children}</SiteLayout>
}
