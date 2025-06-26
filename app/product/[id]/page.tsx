"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Share2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { AuthGuard } from "@/components/auth-guard"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-context"
import { getImagePath } from "@/lib/image-utils";

// Mock product data
const product = {
  id: 1,
  name: "Café Arábica Premium Huila",
  price: 45000,
  originalPrice: 60000,
  images: [
    "/cafe-arabica.jpg",
    "/semillas.jpg",
    "/tostadora.jpg",
    "/Geisha.jpg",
  ],
  rating: 4.8,
  reviews: 124,
  category: "Café en grano",
  seller: {
    name: "Finca El Paraíso",
    rating: 4.9,
    sales: 1250,
    location: "Huila, Colombia",
  },
  discount: 25,
  stock: 15,
  description:
    "Café arábica premium cultivado en las montañas de Huila, Colombia. Procesado mediante método lavado y secado al sol. Notas de chocolate, caramelo y frutas cítricas. Ideal para métodos de preparación como V60, Chemex y prensa francesa.",
  specifications: {
    Origen: "Huila, Colombia",
    Variedad: "Arábica",
    Proceso: "Lavado",
    Tueste: "Medio",
    Altitud: "1,600 - 1,800 msnm",
    Peso: "500g",
    "Fecha de tueste": "Hace 3 días",
  },
  tags: ["Premium", "Orgánico", "Comercio Justo", "Specialty Coffee"],
  shipping: {
    free: true,
    days: "2-3 días hábiles",
    cost: 0,
  },
}


const reviews = [
  {
    id: 1,
    user: "María González",
    rating: 5,
    date: "2024-01-15",
    comment: "Excelente café, muy aromático y con un sabor increíble. Lo recomiendo 100%.",
    verified: true,
  },
  {
    id: 2,
    user: "Carlos Rodríguez",
    rating: 4,
    date: "2024-01-10",
    comment: "Buen café, aunque esperaba un poco más de acidez. Aún así, muy buena calidad.",
    verified: true,
  },
  {
    id: 3,
    user: "Ana Martínez",
    rating: 5,
    date: "2024-01-08",
    comment: "Mi café favorito! Perfecto para las mañanas. El empaque llegó en perfectas condiciones.",
    verified: true,
  },
]
const relatedProducts = [
  {
    id: 2,
    name: "Café Molido Especial Nariño",
    price: 28000,
    originalPrice: 35000,
    image: "cafe-molido.webp",
    rating: 4.7,
    discount: 20,
  },
  {
    id: 3,
    name: "Café Robusta Premium Tolima",
    price: 38000,
    image: "cafe-robusta.jpg",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Café Descafeinado Suave",
    price: 32000,
    image: "/Microlote.webp",
    rating: 4.4,
  },
  {
    id: 5,
    name: "Café Geisha Premium",
    price: 85000,
    image: "/Geisha.jpg",
    rating: 4.9,
  },
]

export default function ProductPage() {
  const [currentImage, setCurrentImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  const { addToCart } = useCart()
  const { isLoggedIn } = useAuth()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para agregar productos al carrito")
      return
    }

    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      seller: product.seller.name,
      category: product.category,
      stock: product.stock,
    }

    addToCart(productToAdd, quantity)
    alert(`${quantity} ${product.name} agregado${quantity > 1 ? "s" : ""} al carrito`)
  }

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para realizar compras")
      return
    }

    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      seller: product.seller.name,
      category: product.category,
      stock: product.stock,
    }

    addToCart(productToAdd, quantity)
    window.location.href = "/checkout"
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-stone-600">
            <Link href="/" className="hover:text-amber-700">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/search" className="hover:text-amber-700">
              Productos
            </Link>
            <span>/</span>
            <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-amber-700">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-stone-800">{product.name}</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={getImagePath(product.images[currentImage])}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1">
                  -{product.discount}%
                </Badge>
              )}

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Image Thumbnails */}
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImage === index ? "border-amber-500" : "border-stone-200"
                  }`}
                >
                  <img
                    src={getImagePath(image)}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{product.category}</Badge>
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-bold text-stone-800 mb-4">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-stone-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">{product.rating}</span>
                  <span className="ml-1 text-stone-600">({product.reviews} reseñas)</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="text-3xl font-bold text-stone-800">{formatPrice(product.price)}</div>
                {product.originalPrice && (
                  <div className="text-xl text-stone-500 line-through">{formatPrice(product.originalPrice)}</div>
                )}
                {product.discount && (
                  <div className="text-green-600 font-medium">
                    Ahorras {formatPrice(product.originalPrice! - product.price)}
                  </div>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-stone-800">Vendido por</h3>
                    <Link
                      href={`/seller/${product.seller.name}`}
                      className="text-amber-700 hover:underline font-medium"
                    >
                      {product.seller.name}
                    </Link>
                    <div className="flex items-center space-x-4 text-sm text-stone-600 mt-1">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {product.seller.rating}
                      </div>
                      <span>{product.seller.sales} ventas</span>
                      <span>{product.seller.location}</span>
                    </div>
                  </div>
                  <AuthGuard requireAuth={true} action="contactar vendedores">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contactar
                    </Button>
                  </AuthGuard>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Options */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cantidad:</span>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-stone-600">Stock disponible: {product.stock} unidades</div>

                <Separator />

                <div className="space-y-3">
                  <AuthGuard
                    requireAuth={true}
                    action="realizar compras"
                    fallbackMessage="Inicia sesión para comprar este producto"
                  >
                    <Button onClick={handleBuyNow} className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6">
                      Comprar ahora - {formatPrice(product.price * quantity)}
                    </Button>
                  </AuthGuard>

                  <AuthGuard requireAuth={true} action="agregar al carrito">
                    <Button
                      variant="outline"
                      onClick={handleAddToCart}
                      className="w-full text-amber-700 border-amber-700 hover:bg-amber-50 py-6"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Agregar al carrito
                    </Button>
                  </AuthGuard>

                  <AuthGuard requireAuth={true} action="guardar favoritos">
                    <Button variant="ghost" onClick={() => setIsFavorite(!isFavorite)} className="w-full">
                      <Heart className={`w-5 h-5 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                      {isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                    </Button>
                  </AuthGuard>
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Truck className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-medium text-sm">Envío gratis</div>
                  <div className="text-xs text-stone-600">{product.shipping.days}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-medium text-sm">Compra protegida</div>
                  <div className="text-xs text-stone-600">Garantía de calidad</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <RotateCcw className="w-6 h-6 text-amber-600" />
                <div>
                  <div className="font-medium text-sm">Devolución</div>
                  <div className="text-xs text-stone-600">30 días</div>
                </div>
              </div>
            </div>

            {/* Share */}
            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir producto
            </Button>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas ({product.reviews})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-6">
              <div className="prose max-w-none">
                <p className="text-stone-700 leading-relaxed">{product.description}</p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-stone-200">
                    <span className="font-medium text-stone-700">{key}:</span>
                    <span className="text-stone-600">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-6">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-stone-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <span className="font-medium text-amber-700">{review.user.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-stone-800">{review.user}</div>
                          <div className="text-sm text-stone-600">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-stone-300"
                              }`}
                            />
                          ))}
                        </div>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">
                            Compra verificada
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-stone-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-stone-800 mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={getImagePath(relatedProduct.image)}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {relatedProduct.discount && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">-{relatedProduct.discount}%</Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <Link href={`/product/${relatedProduct.id}`}>
                    <h3 className="font-semibold text-stone-800 mb-2 hover:text-amber-700 transition-colors line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="font-medium text-amber-700">{relatedProduct.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-stone-800">{relatedProduct.name}</div>
                        <div className="text-sm text-stone-600">{formatPrice(relatedProduct.price)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(relatedProduct.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-stone-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
