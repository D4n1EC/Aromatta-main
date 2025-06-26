"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Star, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-context"
import { getImagePath } from "@/lib/image-utils";

const favoriteProducts = [
  {
    id: 1,
    name: "Café Arábica Premium Huila",
    price: 45000,
    originalPrice: 60000,
    image: "/cafe-arabica.jpg",
    rating: 4.8,
    reviews: 124,
    category: "Café en grano",
    seller: "Finca El Paraíso",
    discount: 25,
    stock: 15,
    addedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Kit Herramientas Cultivo Profesional",
    price: 120000,
    image: "/tostadora.jpg",
    rating: 4.9,
    reviews: 67,
    category: "Herramientas",
    seller: "ToolsPro",
    stock: 8,
    addedDate: "2024-01-12",
  },
  {
    id: 3,
    name: "Fertilizante Orgánico Compost 5kg",
    price: 35000,
    image: "/fertilizante.jpg",
    rating: 4.6,
    reviews: 89,
    category: "Fertilizantes",
    seller: "AgroSolutions",
    stock: 25,
    addedDate: "2024-01-10",
  },
  {
    id: 4,
    name: "Café Geisha Premium",
    price: 85000,
    originalPrice: 100000,
    image: "/Geisha.jpg",
    rating: 4.9,
    reviews: 67,
    category: "Café en grano",
    seller: "Finca Especial",
    discount: 15,
    stock: 3,
    addedDate: "2024-01-08",
  },
  {
    id: 5,
    name: "Máquina Despulpadora Café",
    price: 850000,
    image: "/despulpadora.jpg",
    rating: 4.9,
    reviews: 34,
    category: "Maquinaria",
    seller: "CafeMaq",
    stock: 2,
    addedDate: "2024-01-05",
  },
  {
    id: 6,
    name: "Semillas Café Arábica Certificadas",
    price: 25000,
    image: "/semillas.jpg",
    rating: 4.6,
    reviews: 112,
    category: "Semillas",
    seller: "Semillas Premium",
    stock: 50,
    addedDate: "2024-01-03",
  },
]

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [favorites, setFavorites] = useState(favoriteProducts)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const { addToCart } = useCart()
  const { isLoggedIn } = useAuth()

  const categories = ["Café en grano", "Café molido", "Fertilizantes", "Herramientas", "Semillas", "Maquinaria"]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredFavorites = favorites
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name.localeCompare(b.name)
        case "recent":
        default:
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      }
    })

  const handleRemoveFromFavorites = (productId: number) => {
    setFavorites((prev) => prev.filter((product) => product.id !== productId))
    setSelectedItems((prev) => prev.filter((id) => id !== productId))
  }

  const handleAddToCart = (product: any) => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para agregar productos al carrito")
      return
    }
    addToCart(product, 1)
    alert(`${product.name} agregado al carrito`)
  }

  const handleAddAllToCart = () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para agregar productos al carrito")
      return
    }

    const itemsToAdd =
      selectedItems.length > 0 ? favorites.filter((product) => selectedItems.includes(product.id)) : favorites

    itemsToAdd.forEach((product) => addToCart(product, 1))
    alert(`${itemsToAdd.length} productos agregados al carrito`)
  }

  const handleSelectItem = (productId: number) => {
    setSelectedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredFavorites.map((product) => product.id))
    }
  }

  const handleRemoveSelected = () => {
    setFavorites((prev) => prev.filter((product) => !selectedItems.includes(product.id)))
    setSelectedItems([])
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">Mis Favoritos</h1>
          <p className="text-stone-600">
            {favorites.length} productos guardados • {selectedItems.length} seleccionados
          </p>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                <Input
                  placeholder="Buscar favoritos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Más recientes</SelectItem>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                  <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                  <SelectItem value="rating">Mejor calificados</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleSelectAll}>
                {selectedItems.length === filteredFavorites.length ? "Deseleccionar todo" : "Seleccionar todo"}
              </Button>

              <Button
                variant="outline"
                onClick={handleAddAllToCart}
                disabled={filteredFavorites.length === 0}
                className="text-amber-700 border-amber-700 hover:bg-amber-50"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Agregar al carrito
              </Button>
            </div>

            {selectedItems.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <span className="text-sm font-medium text-amber-800">
                  {selectedItems.length} productos seleccionados
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveSelected}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar seleccionados
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(product.id)}
                    onChange={() => handleSelectItem(product.id)}
                    className="absolute top-3 left-3 z-10 w-4 h-4 text-amber-600 bg-white border-gray-300 rounded focus:ring-amber-500"
                  />

                  <img
                    src={getImagePath(product.image)}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {product.discount && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white">-{product.discount}%</Badge>
                  )}

                  {product.stock <= 5 && (
                    <Badge className="absolute bottom-3 left-3 bg-orange-500 text-white">
                      ¡Últimas {product.stock} unidades!
                    </Badge>
                  )}

                  <button
                    onClick={() => handleRemoveFromFavorites(product.id)}
                    className="absolute top-3 right-12 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                </div>

                <CardContent className="p-4">
                  <div className="mb-2">
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

                  <div className="text-xs text-stone-500 mb-3">
                    Agregado el {new Date(product.addedDate).toLocaleDateString("es-CO")}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-amber-700 border-amber-700 hover:bg-amber-50"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                    <Link href={`/product/${product.id}`} className="flex-1">
                      <Button size="sm" className="w-full bg-amber-700 hover:bg-amber-800">
                        Comprar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-12 h-12 text-stone-400" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">
                {searchQuery || categoryFilter !== "all"
                  ? "No se encontraron favoritos"
                  : "No tienes productos favoritos"}
              </h3>
              <p className="text-stone-600 mb-4">
                {searchQuery || categoryFilter !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Explora nuestros productos y guarda tus favoritos"}
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
