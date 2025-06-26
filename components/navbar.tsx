"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Heart,
  Store,
  Settings,
  LogOut,
  Coffee,
  Package,
  Star,
  ChevronRight,
  TrendingUp,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"
import { NotificationSystem } from "@/components/notification-system"
import { useCart } from "@/components/cart-context"

// Simulación de sugerencias de búsqueda
const searchSuggestions = [
  { text: "Café arábica premium", category: "Café en grano", trending: true },
  { text: "Fertilizante orgánico", category: "Fertilizantes", trending: false },
  { text: "Herramientas cultivo", category: "Herramientas", trending: true },
  { text: "Café molido especial", category: "Café molido", trending: false },
  { text: "Semillas café", category: "Semillas", trending: true },
  { text: "Maquinaria cafetera", category: "Maquinaria", trending: false },
]

const recentSearches = ["Café huila premium", "Fertilizante 5kg", "Tostadora artesanal"]

export function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const { getCartItemsCount } = useCart()
  const cartItems = getCartItemsCount()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState(searchSuggestions)

  const categories = [
    { name: "Café en grano", icon: "☕", count: 45 },
    { name: "Café molido", icon: "🫘", count: 32 },
    { name: "Insumos agrícolas", icon: "🌱", count: 28 },
    { name: "Fertilizantes", icon: "🧪", count: 19 },
    { name: "Herramientas", icon: "🔧", count: 24 },
    { name: "Maquinaria", icon: "⚙️", count: 12 },
    { name: "Semillas", icon: "🌰", count: 15 },
  ]

  // Filtrar sugerencias basadas en la búsqueda
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchSuggestions.filter(
        (suggestion) =>
          suggestion.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          suggestion.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setFilteredSuggestions(searchSuggestions)
      setShowSuggestions(false)
    }
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    window.location.href = `/search?q=${encodeURIComponent(suggestion)}`
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg flex items-center justify-center">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-800">Aromatta</h1>
              <p className="text-xs text-stone-600">Café & Más</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar productos, marcas y más..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="pr-12 h-10 border-stone-300 focus:border-amber-500"
                />
                <Button type="submit" size="sm" className="absolute right-1 top-1 h-8 bg-amber-600 hover:bg-amber-700">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 bg-white border border-stone-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
                {searchQuery && (
                  <div className="p-3 border-b">
                    <h4 className="text-sm font-medium text-stone-700 mb-2">Sugerencias</h4>
                    <div className="space-y-1">
                      {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion.text)}
                          className="w-full text-left p-2 hover:bg-stone-50 rounded flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <Search className="w-4 h-4 text-stone-400" />
                            <span className="text-sm">{suggestion.text}</span>
                            {suggestion.trending && (
                              <Badge variant="secondary" className="text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Tendencia
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-stone-500">{suggestion.category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!searchQuery && recentSearches.length > 0 && (
                  <div className="p-3 border-b">
                    <h4 className="text-sm font-medium text-stone-700 mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Búsquedas recientes
                    </h4>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(search)}
                          className="w-full text-left p-2 hover:bg-stone-50 rounded flex items-center space-x-2"
                        >
                          <Clock className="w-4 h-4 text-stone-400" />
                          <span className="text-sm">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3">
                  <h4 className="text-sm font-medium text-stone-700 mb-2">Categorías populares</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 4).map((category) => (
                      <Link
                        key={category.name}
                        href={`/search?category=${encodeURIComponent(category.name)}`}
                        className="p-2 hover:bg-stone-50 rounded flex items-center justify-between"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <span className="text-xs text-stone-500">{category.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Search className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-auto">
                <SheetHeader>
                  <SheetTitle>Buscar productos</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSearch} className="mt-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="¿Qué estás buscando?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-12"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="absolute right-1 top-1 h-8 bg-amber-600 hover:bg-amber-700"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </SheetContent>
            </Sheet>

            {/* Favorites */}
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 animate-pulse">
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <NotificationSystem />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "Usuario"} />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "Usuario"} />
                          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user?.name}</p>
                          <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {user?.role === "seller" ? "Vendedor" : "Comprador"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="w-4 h-4 mr-2" />
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">
                        <Package className="w-4 h-4 mr-2" />
                        Mis Compras
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites">
                        <Heart className="w-4 h-4 mr-2" />
                        Favoritos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/reviews">
                        <Star className="w-4 h-4 mr-2" />
                        Mis Reseñas
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "seller" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/seller">
                            <Store className="w-4 h-4 mr-2" />
                            Panel Vendedor
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Configuración
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Ingresar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <Coffee className="w-6 h-6 text-amber-600" />
                    <span>Aromatta</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* User Profile Section */}
                  {isLoggedIn ? (
                    <div className="p-4 bg-stone-50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "Usuario"} />
                          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{user?.name}</p>
                          <p className="text-sm text-stone-600 truncate">{user?.email}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {user?.role === "seller" ? "Vendedor" : "Comprador"}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link href="/profile">
                          <Button variant="outline" size="sm" className="w-full">
                            <User className="w-4 h-4 mr-1" />
                            Perfil
                          </Button>
                        </Link>
                        <Link href="/settings">
                          <Button variant="outline" size="sm" className="w-full">
                            <Settings className="w-4 h-4 mr-1" />
                            Config
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <h3 className="font-medium text-amber-800 mb-2">¡Únete a Aromatta!</h3>
                      <p className="text-sm text-amber-700 mb-3">Accede a ofertas exclusivas y gestiona tus pedidos</p>
                      <div className="space-y-2">
                        <Link href="/register">
                          <Button className="w-full bg-amber-600 hover:bg-amber-700">Crear Cuenta</Button>
                        </Link>
                        <Link href="/login">
                          <Button variant="outline" className="w-full">
                            Iniciar Sesión
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-stone-800">Categorías</h3>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          href={`/search?category=${encodeURIComponent(category.name)}`}
                          className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{category.icon}</span>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {category.count}
                            </Badge>
                            <ChevronRight className="w-4 h-4 text-stone-400" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Additional Options */}
                  {isLoggedIn && (
                    <div className="space-y-2">
                      <Separator />
                      <div className="space-y-1">
                        <Link href="/orders" className="flex items-center space-x-3 p-3 hover:bg-stone-50 rounded-lg">
                          <Package className="w-5 h-5 text-stone-600" />
                          <span>Mis Compras</span>
                        </Link>
                        <Link href="/reviews" className="flex items-center space-x-3 p-3 hover:bg-stone-50 rounded-lg">
                          <Star className="w-5 h-5 text-stone-600" />
                          <span>Mis Reseñas</span>
                        </Link>
                        {user?.role === "seller" && (
                          <Link href="/seller" className="flex items-center space-x-3 p-3 hover:bg-stone-50 rounded-lg">
                            <Store className="w-5 h-5 text-stone-600" />
                            <span>Panel Vendedor</span>
                          </Link>
                        )}
                        <button
                          onClick={logout}
                          className="flex items-center space-x-3 p-3 hover:bg-red-50 rounded-lg text-red-600 w-full text-left"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Categories Bar - Desktop */}
        <div className="hidden md:flex items-center space-x-6 py-2 border-t">
          <span className="text-sm font-medium text-stone-700">Categorías:</span>
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.name}
              href={`/search?category=${encodeURIComponent(category.name)}`}
              className="text-sm text-stone-600 hover:text-amber-700 transition-colors flex items-center space-x-1"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
              <Badge variant="secondary" className="text-xs ml-1">
                {category.count}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay para cerrar sugerencias */}
      {showSuggestions && <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)} />}
    </header>
  )
}
