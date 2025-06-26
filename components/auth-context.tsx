"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "buyer" | "seller" | "admin"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role: "buyer" | "seller") => Promise<boolean>
  logout: () => void
  loading: boolean
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("aromatta_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("aromatta_user")
      }
    }
    setLoading(false)
  }, [])


  // Obtener todos los usuarios registrados
  const getUsers = (): any[] => {
    const stored = localStorage.getItem("aromatta_users")
    return stored ? JSON.parse(stored) : []
  }

  const saveUsers = (users: any[]) => {
    localStorage.setItem("aromatta_users", JSON.stringify(users))
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users = getUsers()
    const foundUser = users.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("aromatta_user", JSON.stringify(foundUser))
      setLoading(false)
      return true
    }

    setLoading(false)
    return false
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "buyer" | "seller"
  ): Promise<boolean> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users = getUsers()

    if (users.find((u) => u.email === email)) {
      setLoading(false)
      return false // Email ya existe
    }

const newUser: User = {
  id: Date.now().toString(),
  name,
  email,
  role,
  avatar: "", // Se inicia sin imagen personalizada
}


    const userWithPassword = { ...newUser, password } // Solo en localStorage
    users.push(userWithPassword)
    saveUsers(users)

    setUser(newUser)
    localStorage.setItem("aromatta_user", JSON.stringify(newUser))
    setLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("aromatta_user")
  }

  const updateUser = (updates: Partial<User>) => {
  if (user) {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem("aromatta_user", JSON.stringify(updatedUser))
  }
}


  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        loading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
