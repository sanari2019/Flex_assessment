export const metadata = {
  title: 'Flex Living Reviews API',
  description: 'Backend API for Flex Living Reviews Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
//test
