"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useCart } from "@/components/cart-context"

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

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  getUnreadCount: () => number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { cartItems } = useCart()

  // Verificar stock bajo cuando cambie el carrito
  useEffect(() => {
    cartItems.forEach((item) => {
      if (item.stock <= 3 && item.stock > 0) {
        // Solo crear notificación si no existe ya una para este producto
        const existingNotification = notifications.find(
          (notif) => notif.type === "stock" && notif.metadata?.productId === item.id,
        )

        if (!existingNotification) {
          addNotification({
            type: "stock",
            title: "Stock bajo",
            message: `${item.name} tiene solo ${item.stock} unidades disponibles`,
            read: false,
            priority: "high",
            actionUrl: `/product/${item.id}`,
            metadata: { productId: item.id },
          })
        }
      }
    })
  }, [cartItems])

  const addNotification = (notificationData: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getUnreadCount = () => {
    return notifications.filter((notif) => !notif.read).length
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        getUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
