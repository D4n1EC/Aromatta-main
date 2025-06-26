"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Camera, Send, MessageCircle, Package, Edit, Trash2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { getImagePath } from "@/lib/image-utils";

const purchasedProducts = [
  {
    id: 1,
    name: "Café Arábica Premium Huila",
    price: 45000,
    image: "/cafe-arabica.jpg",
    seller: "Finca El Paraíso",
    purchaseDate: "2024-01-15",
    orderId: "ORD-001",
    canReview: true,
    hasReview: false,
  },
  {
    id: 2,
    name: "Fertilizante Orgánico 5kg",
    price: 35000,
    image: "/fertilizante.jpg",
    seller: "AgroSolutions",
    purchaseDate: "2024-01-10",
    orderId: "ORD-002",
    canReview: true,
    hasReview: true,
  },
]

const myReviews = [
  {
    id: 1,
    productId: 2,
    productName: "Fertilizante Orgánico 5kg",
    rating: 5,
    comment: "Excelente producto, muy efectivo para mis plantas de café. Lo recomiendo totalmente.",
    date: "2024-01-12",
    images: ["/fertilizante.jpg"],
    seller: "AgroSolutions",
    helpful: 12,
    verified: true,
  },
]

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState("pending")
  const [newReview, setNewReview] = useState({
    productId: null as number | null,
    rating: 0,
    comment: "",
    images: [] as { file: File; preview: string }[],
  })
  const [showReviewForm, setShowReviewForm] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleStartReview = (productId: number) => {
    setNewReview({ productId, rating: 0, comment: "", images: [] })
    setShowReviewForm(true)
  }

  const handleRatingClick = (rating: number) => {
    setNewReview({ ...newReview, rating })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const imageData = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      setNewReview({ ...newReview, images: imageData })
    }
  }

  const handleSubmitReview = () => {
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      alert("Por favor completa la calificación y el comentario")
      return
    }

    console.log("Submitting review:", newReview)
    alert("¡Reseña enviada exitosamente!")
    setShowReviewForm(false)
    setNewReview({ productId: null, rating: 0, comment: "", images: [] })
  }

  const pendingReviews = purchasedProducts.filter((p) => p.canReview && !p.hasReview)

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800">Mis Reseñas</h1>
          <p className="text-stone-600 mt-2">Comparte tu experiencia con otros compradores</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pendientes ({pendingReviews.length})</TabsTrigger>
            <TabsTrigger value="published">Publicadas ({myReviews.length})</TabsTrigger>
            <TabsTrigger value="contact">Contactar Vendedores</TabsTrigger>
          </TabsList>

          {/* PENDIENTES */}
          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Productos por Reseñar
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingReviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-stone-700 mb-2">No hay productos por reseñar</h3>
                    <p className="text-stone-600">
                      Cuando compres productos, aparecerán aquí para que puedas reseñarlos
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingReviews.map((product) => (
                      <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={getImagePath(product.image)}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-stone-800">{product.name}</h4>
                          <p className="text-sm text-stone-600">por {product.seller}</p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-stone-500">
                            <span>Pedido #{product.orderId}</span>
                            <span>Comprado el {product.purchaseDate}</span>
                            <span>{formatPrice(product.price)}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleStartReview(product.id)}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Reseñar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FORMULARIO DE RESEÑA */}
            {showReviewForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Escribir Reseña</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Calificación *</Label>
                    <div className="flex items-center space-x-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => handleRatingClick(star)} className="p-1">
                          <Star
                            className={`w-8 h-8 ${
                              star <= newReview.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-stone-300 hover:text-yellow-400"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-stone-600">
                        {newReview.rating > 0 && (
                          <>
                            {newReview.rating === 1 && "Muy malo"}
                            {newReview.rating === 2 && "Malo"}
                            {newReview.rating === 3 && "Regular"}
                            {newReview.rating === 4 && "Bueno"}
                            {newReview.rating === 5 && "Excelente"}
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comment">Comentario *</Label>
                    <Textarea
                      id="comment"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Comparte tu experiencia con este producto..."
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="images">Fotos (opcional)</Label>
                    <div className="mt-2 border-2 border-dashed border-stone-300 rounded-lg p-4 text-center">
                      <Camera className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                      <p className="text-sm text-stone-600 mb-2">Agrega fotos para ayudar a otros compradores</p>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("images")?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Seleccionar Fotos
                      </Button>
                    </div>
                    {newReview.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newReview.images.map((image, index) => (
                          <img
                            key={index}
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={handleSubmitReview} className="bg-amber-600 hover:bg-amber-700">
                      <Send className="w-4 h-4 mr-2" />
                      Publicar Reseña
                    </Button>
                    <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* PUBLICADAS */}
          <TabsContent value="published" className="space-y-6">
            {/* ... puedes mantener tu lógica actual aquí ... */}
          </TabsContent>

          {/* CONTACTAR */}
          <TabsContent value="contact" className="space-y-6">
            {/* ... puedes mantener tu lógica actual aquí ... */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
