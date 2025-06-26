"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus, ShoppingBag, Truck, Shield, ArrowLeft, Tag } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useCart } from "@/components/cart-context"
import { useNotifications } from "@/components/notification-context"
import { getImagePath } from "@/lib/image-utils";

interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  seller: string
  quantity: number
  stock: number
  category: string
}
const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Café Arábica Premium Huila",
    price: 45000,
    originalPrice: 60000,
    image: "/cafe-arabica.jpg", // ✔️ sin espacio
    seller: "Finca El Paraíso",
    quantity: 2,
    stock: 15,
    category: "Café en grano",
  },
  {
    id: 2,
    name: "Fertilizante Orgánico Compost 5kg",
    price: 35000,
    image: "/fertilizante.jpg", // ✔️
    seller: "AgroSolutions",
    quantity: 1,
    stock: 8,
    category: "Fertilizantes",
  },
  {
    id: 3,
    name: "Kit Herramientas Cultivo Profesional",
    price: 120000,
    image: "/herramientas.jpg", // ✔️ sin espacio
    seller: "ToolsPro",
    quantity: 1,
    stock: 5,
    category: "Herramientas",
  },
]

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const { markAllAsRead } = useNotifications()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)

  useEffect(() => {
    // Marcar todas las notificaciones como leídas al visitar el carrito
    markAllAsRead()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const removeItem = (id: number) => {
    removeFromCart(id)
  }

  const applyCoupon = () => {
    // Simulate coupon validation
    const validCoupons = {
      CAFE10: 10,
      PRIMERA15: 15,
      AROMATTA20: 20,
    }

    if (validCoupons[couponCode as keyof typeof validCoupons]) {
      setAppliedCoupon({
        code: couponCode,
        discount: validCoupons[couponCode as keyof typeof validCoupons],
      })
      setCouponCode("")
    } else {
      alert("Cupón no válido")
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const subtotal = getCartTotal()
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity
    }
    return sum
  }, 0)
  const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0
  const shipping = subtotal >= 80000 ? 0 : 8000
  const total = subtotal - couponDiscount + shipping

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center p-8">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-stone-400" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">Tu carrito está vacío</h2>
            <p className="text-stone-600 mb-6">Descubre nuestros productos de café y comienza a llenar tu carrito</p>
            <Link href="/">
              <Button className="bg-amber-600 hover:bg-amber-700">Explorar productos</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-stone-800">Carrito de compras</h1>
              <p className="text-stone-600">
                {cartItems.length} {cartItems.length === 1 ? "producto" : "productos"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImagePath(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge variant="secondary" className="text-xs mb-2">
                            {item.category}
                          </Badge>
                          <Link href={`/product/${item.id}`}>
                            <h3 className="font-semibold text-stone-800 hover:text-amber-700 transition-colors line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-stone-600 mt-1">Vendido por {item.seller}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-stone-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="h-8 w-8"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm text-stone-500">(Stock: {item.stock})</span>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-stone-800">{formatPrice(item.price * item.quantity)}</div>
                          {item.originalPrice && (
                            <div className="text-sm text-stone-500 line-through">
                              {formatPrice(item.originalPrice * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Cupón de descuento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-800">{appliedCoupon.code}</div>
                      <div className="text-sm text-green-600">-{appliedCoupon.discount}% de descuento</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeCoupon}
                      className="text-green-700 hover:text-green-800"
                    >
                      Quitar
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Código de cupón"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                    <Button onClick={applyCoupon} disabled={!couponCode.trim()} variant="outline">
                      Aplicar
                    </Button>
                  </div>
                )}
                <div className="text-xs text-stone-500">Cupones disponibles: CAFE10, PRIMERA15, AROMATTA20</div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Ahorros</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento ({appliedCoupon.code})</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className="text-xs text-stone-500">
                      Envío gratis en compras superiores a {formatPrice(80000)}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6">Proceder al pago</Button>
                </Link>

                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Continuar comprando
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Truck className="w-5 h-5 text-green-600" />
                <div className="text-sm">
                  <div className="font-medium">Envío seguro</div>
                  <div className="text-stone-600">2-5 días hábiles</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
                <div className="text-sm">
                  <div className="font-medium">Compra protegida</div>
                  <div className="text-stone-600">Garantía de satisfacción</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
