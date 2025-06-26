"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Heart, User, Lock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  action?: string
  fallbackMessage?: string
}

export function AuthGuard({
  children,
  requireAuth = false,
  action = "realizar esta acción",
  fallbackMessage,
}: AuthGuardProps) {
  // Simular estado de autenticación - en una app real esto vendría de un contexto o store
  const { isLoggedIn } = useAuth()

  if (!requireAuth || isLoggedIn) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle>Inicia sesión para continuar</CardTitle>
          <CardDescription>{fallbackMessage || `Necesitas una cuenta para ${action}`}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Link href="/login">
              <Button className="w-full" variant="outline">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">Registrarse</Button>
            </Link>
          </div>

          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              Continuar navegando
            </Button>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-2">Con una cuenta puedes:</h4>
            <div className="space-y-2 text-sm text-stone-600">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Realizar compras seguras</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Guardar productos favoritos</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Seguir el estado de tus pedidos</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook para usar en componentes
export function useAuthGuard() {
  const { isLoggedIn } = useAuth()

  const requireAuth = (action: () => void, actionName?: string) => {
    if (isLoggedIn) {
      action()
    } else {
      console.log(`Requiere autenticación para: ${actionName || "esta acción"}`)
    }
  }

  return { isLoggedIn, requireAuth }
}
