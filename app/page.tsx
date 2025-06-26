"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import FloatingChatBot from "@/components/FloatingChatBot" // ✅ Este es el correcto
import { AuthGuard } from "@/components/auth-guard"
import { useCart } from "@/components/cart-context"
import { useProducts } from "@/components/products-context"
import { useAuth } from "@/components/auth-context"
import { getImagePath } from "@/lib/image-utils";


const promotions = [
  {
    id: 1,
    title: "Café Premium Colombiano",
    subtitle: "50% de descuento en tu primera compra",
    image: "/cafe-arabica.jpg",
    color: "from-amber-900 to-amber-700",
  },
  {
    id: 2,
    title: "Herramientas de Cultivo",
    subtitle: "Todo lo que necesitas para tu plantación",
    image: "/herramientas-kit.jpg",
    color: "from-green-800 to-green-600",
  },
  {
    id: 3,
    title: "Fertilizantes Orgánicos",
    subtitle: "Mejora la calidad de tu cosecha",
    image: "/fertilizante.jpg",
    color: "from-stone-800 to-stone-600",
  },
]


const featuredProducts = [
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
  },
  {
    id: 2,
    name: "Fertilizante Orgánico 5kg",
    price: 35000,
    image: "/abono-natural.jpg",
    rating: 4.6,
    reviews: 89,
    category: "Fertilizantes",
    seller: "AgroSolutions",
  },
  {
    id: 3,
    name: "Café Molido Especial",
    price: 28000,
    originalPrice: 35000,
    image: "/cafe-molido.webp",
    rating: 4.7,
    reviews: 156,
    category: "Café molido",
    seller: "Café del Valle",
    discount: 20,
  },
  {
    id: 4,
    name: "Kit Herramientas Cultivo",
    price: 120000,
    image: "/herramientas-kit.jpg",
    rating: 4.9,
    reviews: 67,
    category: "Herramientas",
    seller: "ToolsPro",
  },
  {
    id: 5,
    name: "Café Robusta Premium",
    price: 38000,
    image: "/cafe-robusta.jpg",
    rating: 4.5,
    reviews: 203,
    category: "Café en grano",
    seller: "Montaña Verde",
  },
  {
    id: 6,
    name: "Abono Natural 10kg",
    price: 55000,
    originalPrice: 70000,
    image: "/fertilizante.jpg",
    rating: 4.8,
    reviews: 91,
    category: "Fertilizantes",
    seller: "EcoFarm",
    discount: 21,
  },
  {
    id: 7,
    name: "Máquina Despulpadora",
    price: 850000,
    image: "/despulpadora.jpg",
    rating: 4.9,
    reviews: 34,
    category: "Maquinaria",
    seller: "CafeMaq",
  },
  {
    id: 8,
    name: "Semillas Café Arábica",
    price: 25000,
    image: "/semillas.jpg",
    rating: 4.6,
    reviews: 78,
    category: "Semillas",
    seller: "Semillas Premium",
  },
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [favorites, setFavorites] = useState<number[]>([])
  const { products } = useProducts()
  const { addToCart } = useCart()
  const { isLoggedIn } = useAuth()
  const [displayedProducts, setDisplayedProducts] = useState(products.slice(0, 8))
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Función para cargar más productos
  const loadMoreProducts = () => {
    if (loading || !hasMore) return

    setLoading(true)

    // Simular carga de más productos
    setTimeout(() => {
      const moreProducts = [
        {
          id: 9,
          name: "Tostadora de Café Artesanal",
          price: 1200000,
          image: "/tostadora.jpg",
          rating: 4.8,
          reviews: 45,
          category: "Maquinaria",
          seller: "Tostadores Pro",
        },
        {
          id: 10,
          name: "Café Geisha Premium",
          price: 85000,
          originalPrice: 100000,
          image: "/cafe-robusta.jpg",
          rating: 4.9,
          reviews: 67,
          category: "Café en grano",
          seller: "Finca Especial",
          discount: 15,
        },
        // ... más productos
      ]

      setDisplayedProducts((prev) => [...prev, ...moreProducts])
      setLoading(false)

      // Simular que no hay más productos después de cierto punto
      if (displayedProducts.length > 20) {
        setHasMore(false)
      }
    }, 10)
  }

  // Agregar useEffect para scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
        loading
      ) {
        return
      }
      loadMoreProducts()
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading])

  const handleAddToCart = (product: any) => {
    if (!isLoggedIn) {
      // Mostrar modal de autenticación
      return
    }
    addToCart(product, 1)
    // Mostrar mensaje de éxito
    alert(`${product.name} agregado al carrito`)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Hero Carousel */}
      <div className="relative h-80 overflow-hidden">
        {promotions.map((promo, index) => (
          <div
            key={promo.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
            }`}
          >
            <div className={`h-full bg-gradient-to-r ${promo.color} flex items-center justify-between px-8 md:px-16`}>
              <div className="text-white max-w-md">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{promo.title}</h2>
                <p className="text-lg md:text-xl mb-6 opacity-90">{promo.subtitle}</p>
                <Button size="lg" className="bg-white text-amber-900 hover:bg-stone-100">
                  Ver Ofertas
                </Button>
              </div>
              <div className="hidden md:block">
                <img
                  src={getImagePath(promo.image)}
                  alt={promo.title}
                  className="w-80 h-60 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % promotions.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {promotions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Categorías Populares</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Café en Grano", icon: "☕", color: "bg-amber-100 text-amber-800" },
            { name: "Café Molido", icon: "🫘", color: "bg-stone-100 text-stone-800" },
            { name: "Fertilizantes", icon: "🌱", color: "bg-green-100 text-green-800" },
            { name: "Herramientas", icon: "🔧", color: "bg-blue-100 text-blue-800" },
          ].map((category) => (
            <Link key={category.name} href={`/search?category=${encodeURIComponent(category.name)}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-3 text-2xl`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-stone-700">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-stone-800">Productos Destacados</h2>
          <Link href="/search">
            <Button variant="outline" className="text-amber-700 border-amber-700 hover:bg-amber-50">
              Ver todos
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
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
          {loading && (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          )}

          {!hasMore && (
            <div className="col-span-full text-center py-8 text-stone-600">
              <p>¡Has visto todos nuestros productos!</p>
            </div>
          )}
        </div>
      </div>
      

      {/* Trust Indicators */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Envío Seguro</h3>
              <p className="text-stone-600">Entrega garantizada en todo el país</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Pago Seguro</h3>
              <p className="text-stone-600">Múltiples métodos de pago protegidos</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Calidad Garantizada</h3>
              <p className="text-stone-600">Productos verificados y de alta calidad</p>
            </div>
          </div>
        </div>
            </div>

      <FloatingChatBot />
    </div>
  )
}

  
