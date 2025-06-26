"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Package, MessageCircle, Star, ShoppingCart, AlertTriangle, Check, Trash2, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface Notification {
  id: string
  type: "order" | "message" | "review" | "stock" | "offer" | "system"
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: "high" | "medium" | "low"
  actionUrl?: string
  metadata?: any
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Nuevo pedido recibido",
    message: "Juan Pérez ha realizado un pedido de Café Arábica Premium por $45.000",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
    read: false,
    priority: "high",
    actionUrl: "/seller/orders/123",
  },
  {
    id: "2",
    type: "message",
    title: "Nuevo mensaje",
    message: "María González pregunta sobre el tiempo de entrega del fertilizante orgánico",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
    read: false,
    priority: "medium",
    actionUrl: "/messages/456",
  },
  {
    id: "3",
    type: "stock",
    title: "Stock bajo",
    message: "Café Molido Especial tiene solo 3 unidades disponibles",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
    read: false,
    priority: "high",
    actionUrl: "/seller/products/789",
  },
  {
    id: "4",
    type: "review",
    title: "Nueva reseña",
    message: "Carlos Rodríguez dejó una reseña de 5 estrellas en tu producto",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    read: true,
    priority: "low",
    actionUrl: "/seller/reviews/101",
  },
  {
    id: "5",
    type: "offer",
    title: "Oferta especial disponible",
    message: "Promoción del 20% en fertilizantes orgánicos hasta el viernes",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
    read: true,
    priority: "medium",
    actionUrl: "/offers/special-fertilizers",
  },
]

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsPaused, setNotificationsPaused] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length
  const displayedNotifications = showOnlyUnread ? notifications.filter((n) => !n.read) : notifications

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return <Package className="w-4 h-4" />
      case "message":
        return <MessageCircle className="w-4 h-4" />
      case "review":
        return <Star className="w-4 h-4" />
      case "stock":
        return <AlertTriangle className="w-4 h-4" />
      case "offer":
        return <ShoppingCart className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-amber-600 bg-amber-50"
      case "low":
        return "text-blue-600 bg-blue-50"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Ahora"
    if (minutes < 60) return `Hace ${minutes}m`
    if (hours < 24) return `Hace ${hours}h`
    return `Hace ${days}d`
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  // Simular nuevas notificaciones
  useEffect(() => {
    if (notificationsPaused) return

    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        // 20% de probabilidad cada 30 segundos
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "message",
          title: "Nueva consulta",
          message: "Un cliente está interesado en tus productos",
          timestamp: new Date(),
          read: false,
          priority: "medium",
        }

        setNotifications((prev) => [newNotification, ...prev])

        // Reproducir sonido si está habilitado
        if (soundEnabled && "Notification" in window) {
          new Notification("Nueva notificación en Aromatta", {
            body: newNotification.message,
            icon: "/favicon.ico",
          })
        }
      }
    }, 300000)

    return () => clearInterval(interval)
  }, [soundEnabled, notificationsPaused])

  // Solicitar permisos de notificación
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  return (
    <>
      {/* Desktop Dropdown */}
      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-3">
              <h3 className="font-semibold">Notificaciones</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotificationsPaused(!notificationsPaused)}
                  className="text-xs"
                >
                  {notificationsPaused ? "Reanudar" : "Pausar"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                  className="text-xs"
                >
                  {showOnlyUnread ? "Ver todas" : "Solo no leídas"}
                </Button>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                    Marcar todas
                  </Button>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <ScrollArea className="h-80">
              {displayedNotifications.length === 0 ? (
                <div className="p-4 text-center text-stone-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay notificaciones</p>
                </div>
              ) : (
                displayedNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="p-0 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className={`w-full p-3 ${!notification.read ? "bg-blue-50" : ""}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{notification.title}</p>
                            <span className="text-xs text-stone-500">{formatTimestamp(notification.timestamp)}</span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1 line-clamp-2">{notification.message}</p>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>Notificaciones</span>
                <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
                  <Settings className="w-4 h-4" />
                </Button>
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => setShowOnlyUnread(!showOnlyUnread)}>
                  {showOnlyUnread ? "Ver todas" : "Solo no leídas"}
                </Button>
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    <Check className="w-4 h-4 mr-1" />
                    Marcar todas
                  </Button>
                )}
              </div>

              <ScrollArea className="h-96">
                {displayedNotifications.length === 0 ? (
                  <div className="p-4 text-center text-stone-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay notificaciones</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {displayedNotifications.map((notification) => (
                      <Card
                        key={notification.id}
                        className={`cursor-pointer transition-colors ${!notification.read ? "bg-blue-50 border-blue-200" : ""}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium">{notification.title}</p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNotification(notification.id)
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-stone-600 mb-2">{notification.message}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-stone-500">
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                                {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
