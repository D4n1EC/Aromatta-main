"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Star,
  MessageCircle,
  Download,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { getImagePath } from "@/lib/image-utils";

const orders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 125000,
    items: [
      {
        id: 1,
        name: "Café Arábica Premium Huila",
        quantity: 2,
        price: 45000,
        image: "/cafe-arabica.jpg",
        seller: "Finca El Paraíso",
      },
      {
        id: 2,
        name: "Fertilizante Orgánico 5kg",
        quantity: 1,
        price: 35000,
        image: "/fertilizante.jpg",
        seller: "AgroSolutions",
      },
    ],
    shipping: {
      address: "Carrera 15 #45-67, Bogotá",
      method: "Envío estándar",
      tracking: "COL123456789",
    },
    deliveredDate: "2024-01-18",
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-20",
    status: "shipped",
    total: 85000,
    items: [
      {
        id: 3,
        name: "Kit Herramientas Cultivo",
        quantity: 1,
        price: 85000,
        image: "/herramientas-kit.jpg",
        seller: "ToolsPro",
      },
    ],
    shipping: {
      address: "Carrera 15 #45-67, Bogotá",
      method: "Envío express",
      tracking: "COL987654321",
    },
    estimatedDelivery: "2024-01-23",
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-22",
    status: "processing",
    total: 45000,
    items: [
      {
        id: 4,
        name: "Café Molido Especial",
        quantity: 1,
        price: 45000,
        image: "/cafe-molido.webp",
        seller: "Café del Valle",
      },
    ],
    shipping: {
      address: "Carrera 15 #45-67, Bogotá",
      method: "Envío estándar",
    },
  },
  {
    id: "ORD-2024-004",
    date: "2024-01-10",
    status: "cancelled",
    total: 120000,
    items: [
      {
        id: 5,
        name: "Máquina Despulpadora",
        quantity: 1,
        price: 120000,
        image: "/despulpadora.jpg",
        seller: "CafeMaq",
      },
    ],
    shipping: {
      address: "Carrera 15 #45-67, Bogotá",
      method: "Envío especializado",
    },
    cancelReason: "Producto no disponible",
  },
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          label: "Entregado",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
        }
      case "shipped":
        return {
          label: "Enviado",
          color: "bg-blue-100 text-blue-800",
          icon: Truck,
        }
      case "processing":
        return {
          label: "Procesando",
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
        }
      case "cancelled":
        return {
          label: "Cancelado",
          color: "bg-red-100 text-red-800",
          icon: RefreshCw,
        }
      default:
        return {
          label: "Desconocido",
          color: "bg-gray-100 text-gray-800",
          icon: Package,
        }
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    const matchesDate =
      dateFilter === "all" ||
      (() => {
        const orderDate = new Date(order.date)
        const now = new Date()
        const diffTime = now.getTime() - orderDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        switch (dateFilter) {
          case "week":
            return diffDays <= 7
          case "month":
            return diffDays <= 30
          case "3months":
            return diffDays <= 90
          default:
            return true
        }
      })()

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">Mis Pedidos</h1>
          <p className="text-stone-600">Gestiona y revisa el estado de tus compras</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                <Input
                  placeholder="Buscar pedidos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="processing">Procesando</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="delivered">Entregado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las fechas</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mes</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Más filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status)
            const StatusIcon = statusInfo.icon

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-stone-50 border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-stone-800">Pedido #{order.id}</CardTitle>
                      <p className="text-sm text-stone-600 mt-1">
                        Realizado el {new Date(order.date).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <span className="text-lg font-bold text-stone-800">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={getImagePath(item.image)}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-stone-800">{item.name}</h4>
                          <p className="text-sm text-stone-600">por {item.seller}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-stone-600">Cantidad: {item.quantity}</span>
                            <span className="font-medium text-stone-800">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-stone-50 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-stone-800 mb-2">Información de envío</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-stone-600">Dirección:</span>
                        <p className="font-medium">{order.shipping.address}</p>
                      </div>
                      <div>
                        <span className="text-stone-600">Método:</span>
                        <p className="font-medium">{order.shipping.method}</p>
                      </div>
                      {order.shipping.tracking && (
                        <div>
                          <span className="text-stone-600">Seguimiento:</span>
                          <p className="font-medium">{order.shipping.tracking}</p>
                        </div>
                      )}
                      {order.estimatedDelivery && (
                        <div>
                          <span className="text-stone-600">Entrega estimada:</span>
                          <p className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString("es-CO")}</p>
                        </div>
                      )}
                      {order.deliveredDate && (
                        <div>
                          <span className="text-stone-600">Entregado el:</span>
                          <p className="font-medium text-green-600">
                            {new Date(order.deliveredDate).toLocaleDateString("es-CO")}
                          </p>
                        </div>
                      )}
                      {order.cancelReason && (
                        <div className="md:col-span-2">
                          <span className="text-stone-600">Motivo de cancelación:</span>
                          <p className="font-medium text-red-600">{order.cancelReason}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                    </Link>

                    {order.status === "delivered" && (
                      <>
                        <Button variant="outline" size="sm">
                          <Star className="w-4 h-4 mr-2" />
                          Calificar
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Volver a comprar
                        </Button>
                      </>
                    )}

                    {order.status === "shipped" && order.shipping.tracking && (
                      <Button variant="outline" size="sm">
                        <Truck className="w-4 h-4 mr-2" />
                        Rastrear envío
                      </Button>
                    )}

                    {order.status === "processing" && (
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                        Cancelar pedido
                      </Button>
                    )}

                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contactar vendedor
                    </Button>

                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Factura
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredOrders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-12 h-12 text-stone-400" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">No se encontraron pedidos</h3>
              <p className="text-stone-600 mb-4">
                {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Aún no has realizado ningún pedido"}
              </p>
              <Link href="/search">
                <Button className="bg-amber-600 hover:bg-amber-700">Explorar productos</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
