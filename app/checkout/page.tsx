"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Smartphone, Building2, MapPin, Package, Shield, ArrowLeft, Check, Truck } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { getImagePath } from "@/lib/image-utils";

const cartItems = [
  {
    id: 1,
    name: "Café Arábica Premium Huila",
    price: 45000,
    quantity: 2,
    image: "/cafe-arabica.jpg",
    seller: "Finca El Paraíso",
  },
  {
    id: 2,
    name: "Fertilizante Orgánico 5kg",
    price: 35000,
    quantity: 1,
    image: "/fertilizante.jpg",
    seller: "AgroSolutions",
  },
]

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "Juan Carlos Pérez",
    phone: "+57 300 123 4567",
    address: "Carrera 15 #45-67",
    city: "Bogotá",
    department: "Cundinamarca",
    zipCode: "110111",
    notes: "",
  })
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })
  const [nequiPhone, setNequiPhone] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 80000 ? 0 : 8000
  const total = subtotal + shipping

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSubmitOrder = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      alert("¡Pedido realizado exitosamente! Recibirás un email de confirmación.")
      window.location.href = "/orders"
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Finalizar Compra</h1>
            <p className="text-stone-600">Completa tu pedido de forma segura</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Dirección completa</Label>
                  <Input
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Calle, carrera, número, apartamento"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress((prev) => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      value={shippingAddress.department}
                      onChange={(e) => setShippingAddress((prev) => ({ ...prev, department: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Código Postal</Label>
                    <Input
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress((prev) => ({ ...prev, zipCode: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notas de entrega (opcional)</Label>
                  <Textarea
                    id="notes"
                    value={shippingAddress.notes}
                    onChange={(e) => setShippingAddress((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Instrucciones especiales para la entrega"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  {/* Credit Card */}
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <div className="font-medium">Tarjeta de Crédito/Débito</div>
                        <div className="text-sm text-stone-600">Visa, MasterCard</div>
                      </div>
                    </Label>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="ml-6 space-y-4 p-4 bg-stone-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="cardNumber">Número de tarjeta</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardData.number}
                            onChange={(e) => setCardData((prev) => ({ ...prev, number: e.target.value }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                          <Input
                            id="cardName"
                            placeholder="Juan Pérez"
                            value={cardData.name}
                            onChange={(e) => setCardData((prev) => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardExpiry">Fecha de vencimiento</Label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM/AA"
                            value={cardData.expiry}
                            onChange={(e) => setCardData((prev) => ({ ...prev, expiry: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvv">CVV</Label>
                          <Input
                            id="cardCvv"
                            placeholder="123"
                            value={cardData.cvv}
                            onChange={(e) => setCardData((prev) => ({ ...prev, cvv: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nequi */}
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="nequi" id="nequi" />
                    <Label htmlFor="nequi" className="flex items-center cursor-pointer flex-1">
                      <Smartphone className="w-5 h-5 mr-3 text-purple-600" />
                      <div>
                        <div className="font-medium">Nequi</div>
                        <div className="text-sm text-stone-600">Pago con tu celular</div>
                      </div>
                    </Label>
                  </div>

                  {paymentMethod === "nequi" && (
                    <div className="ml-6 p-4 bg-stone-50 rounded-lg">
                      <Label htmlFor="nequiPhone">Número de celular Nequi</Label>
                      <Input
                        id="nequiPhone"
                        placeholder="300 123 4567"
                        value={nequiPhone}
                        onChange={(e) => setNequiPhone(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Bank Transfer */}
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer" className="flex items-center cursor-pointer flex-1">
                      <Building2 className="w-5 h-5 mr-3 text-green-600" />
                      <div>
                        <div className="font-medium">Transferencia Bancaria</div>
                        <div className="text-sm text-stone-600">PSE - Débito a cuenta corriente/ahorros</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={getImagePath(item.image)}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-stone-800 line-clamp-2">{item.name}</h4>
                      <p className="text-sm text-stone-600">por {item.seller}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-stone-600">Cantidad: {item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
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
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 text-sm text-stone-600">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-stone-800">Compra 100% segura</div>
                    <div>Tus datos están protegidos con encriptación SSL</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 text-sm text-stone-600">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-stone-800">Información de envío</div>
                    <div>Entrega estimada: 2-5 días hábiles</div>
                    <div>Seguimiento incluido</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button
              onClick={handleSubmitOrder}
              disabled={isProcessing}
              className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Procesando...
                </div>
              ) : (
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Realizar Pedido - {formatPrice(total)}
                </div>
              )}
            </Button>

            <div className="text-xs text-center text-stone-500">
              Al realizar el pedido, aceptas nuestros{" "}
              <Link href="/terms" className="text-amber-600 hover:underline">
                términos y condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
