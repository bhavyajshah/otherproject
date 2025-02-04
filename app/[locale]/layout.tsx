import "../[locale]/globals.scss"
import type { Metadata } from "next"
import type React from "react" // Import React

export const metadata: Metadata = {
  title: "TuranLine - International Marketplace",
  description: "International marketplace for wholesale clothing and accessories",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}