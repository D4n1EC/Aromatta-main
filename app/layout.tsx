import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-context"
import { CartProvider } from "@/components/cart-context"
import { ProductsProvider } from "@/components/products-context"
import { NotificationProvider } from "@/components/notification-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aromatta - Marketplace de Café y Cultivo",
  description: "Plataforma de comercio electrónico especializada en café y productos de cultivo",
  generator: "v0.dev",
  icons: {
    icon: "/icono.png"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
