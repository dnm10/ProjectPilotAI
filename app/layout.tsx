declare module "*.css" {
  const content: { [className: string]: string }
  export default content
}

import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import QueryProvider from "../components/providers/QueryProvider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ProjectPilot AI — Engineering Project Intelligence",
  description: "AI-powered project management, explainable risk prediction, and team analytics",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#F8FAFC] text-[#0F172A]">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}