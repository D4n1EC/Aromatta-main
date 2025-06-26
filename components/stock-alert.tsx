"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { getImagePath } from "@/lib/image-utils";

interface StockAlertProps {
  cartItems: Array<{
    id: number
    name: string
    stock: number
    quantity: number
    image: string
    price: number
  }>
}

export function StockAlert({ cartItems }: StockAlertProps) {
  const [lowStockItems, setLowStockItems] = useState<typeof cartItems>([])
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    // Filtrar productos con poco stock (menos de 5 unidades)
    const lowStock = cartItems.filter((item) => item.stock <= 5 && item.stock > 0)
    setLowStockItems(lowStock)
    setShowAlert(lowStock.length > 0)
  }, [cartItems])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (!showAlert || lowStockItems.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-800">¡Pocas existencias!</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAlert(false)}
              className="h-6 w-6 text-orange-600 hover:text-orange-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-orange-700 mb-3">
            Algunos productos en tu carrito tienen pocas unidades disponibles:
          </p>

          <div className="space-y-2 mb-4">
            {lowStockItems.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center space-x-2 p-2 bg-white rounded border">
                <img
                  src={getImagePath(item.image)}
                  alt={item.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive" className="text-xs">
                      Solo {item.stock} disponibles
                    </Badge>
                    <span className="text-xs text-stone-600">Tienes {item.quantity} en carrito</span>
                  </div>
                </div>
              </div>
            ))}
            {lowStockItems.length > 2 && (
              <p className="text-xs text-orange-600">+{lowStockItems.length - 2} productos más con poco stock</p>
            )}
          </div>

          <div className="flex space-x-2">
            <Link href="/cart" className="flex-1">
              <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                <ShoppingCart className="w-4 h-4 mr-1" />
                Ver Carrito
              </Button>
            </Link>
            <Link href="/checkout" className="flex-1">
              <Button size="sm" variant="outline" className="w-full">
                Comprar Ya
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
