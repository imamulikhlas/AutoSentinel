import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Auto Sentinel - AI-Powered Smart Contract Security",
  description:
    "Advanced AI threat detection for smart contracts with comprehensive API platform - Built for BI-OJK Hackathon 2025",
  keywords: "smart contract, security, AI, blockchain, hackathon, BI-OJK, threat detection",
  authors: [{ name: "Anjay Mabar Team" }],
  openGraph: {
    title: "Auto Sentinel - AI-Powered Smart Contract Security",
    description: "Revolutionary AI technology that stops web3 threats before they cause damage",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-inter antialiased">{children}</body>
    </html>
  )
}
