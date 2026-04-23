export const MainContent = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <main className="mx-auto flex w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      {children}
    </main>
  )
}
