"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Star, Heart, Search } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useProducts } from "@/components/products-context"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { getImagePath } from "@/lib/image-utils";

export default function SearchPage() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q") || ""
  const categoryParam = searchParams.get("category") || ""

  const { products, searchProducts } = useProducts()
  const { addToCart } = useCart()
  const { isLoggedIn } = useAuth()

  const [searchQuery, setSearchQuery] = useState(queryParam)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [sortBy, setSortBy] = useState("relevance")
  const [priceRange, setPriceRange] = useState("all")
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [favorites, setFavorites] = useState<number[]>([])

  const categories = [
    "Café en grano",
    "Café molido",
    "Fertilizantes",
    "Herramientas",
    "Semillas",
    "Maquinaria",
    "Insumos agrícolas",
    "Infraestructura",
    "Instrumentos",
  ]

  useEffect(() => {
    // Actualizar estado inicial si cambian los parámetros de búsqueda
    setSearchQuery(queryParam)
    setSelectedCategory(categoryParam)
  }, [queryParam, categoryParam])

  useEffect(() => {
    let results = products.slice() // Copia para no mutar

    // Filtrar por búsqueda
    if (searchQuery) {
      results = searchProducts(searchQuery)
    }

    // Filtrar por categoría
    if (selectedCategory && selectedCategory !== "todos") {
      results = results.filter((product) => product.category === selectedCategory)
    }

    // Rango de precios
    switch (priceRange) {
      case "0-50000":
        results = results.filter((p) => p.price <= 50000)
        break
      case "50000-100000":
        results = results.filter((p) => p.price > 50000 && p.price <= 100000)
        break
      case "100000-500000":
        results = results.filter((p) => p.price > 100000 && p.price <= 500000)
        break
      case "500000+":
        results = results.filter((p) => p.price > 500000)
        break
    }

    // Ordenar
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        results.sort((a, b) => b.price - a.price)
        break
      case "rating":
        results.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    setFilteredProducts(results)
  }, [searchQuery, selectedCategory, sortBy, priceRange, products])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)

  const handleAddToCart = (product: any) => {
    if (!isLoggedIn) return
    addToCart(product, 1)
    alert(`${product.name} agregado al carrito`)
  }

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-800 mb-2">
            {searchQuery
              ? `Resultados para "${searchQuery}"`
              : selectedCategory && selectedCategory !== "todos"
              ? `Categoría: ${selectedCategory}`
              : "Todos los productos"}
          </h1>
          <p className="text-stone-600">{filteredProducts.length} productos encontrados</p>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="Precio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los precios</SelectItem>
              <SelectItem value="0-50000">Hasta $50.000</SelectItem>
              <SelectItem value="50000-100000">$50.000 - $100.000</SelectItem>
              <SelectItem value="100000-500000">$100.000 - $500.000</SelectItem>
              <SelectItem value="500000+">Más de $500.000</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevancia</SelectItem>
              <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
              <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
              <SelectItem value="rating">Mejor calificados</SelectItem>
              <SelectItem value="newest">Más recientes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={getImagePath(product.image)}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white">-{product.discount}%</Badge>
                )}
                <AuthGuard requireAuth={true} action="guardar favoritos">
                  <button
                    aria-label="Agregar a favoritos"
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-stone-600"
                      }`}
                    />
                  </button>
                </AuthGuard>
              </div>

              <CardContent className="p-4">
                <div>
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                </div>

                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-stone-800 mb-2 hover:text-amber-700 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-stone-600 mb-2">por {product.seller}</p>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-stone-500 ml-2">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-stone-800">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-stone-500 line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <AuthGuard requireAuth={true} action="agregar productos al carrito">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-amber-700 border-amber-700 hover:bg-amber-50"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                  </AuthGuard>
                  <AuthGuard requireAuth={true} action="realizar compras">
                    <Link href={`/product/${product.id}`} className="flex-1">
                      <Button size="sm" className="w-full bg-amber-700 hover:bg-amber-800">
                        Comprar
                      </Button>
                    </Link>
                  </AuthGuard>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-stone-400" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">No se encontraron productos</h3>
            <p className="text-stone-600 mb-4">Intenta con otros términos de búsqueda o filtros</p>
            <Link href="/">
              <Button className="bg-amber-600 hover:bg-amber-700">Explorar todos los productos</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
