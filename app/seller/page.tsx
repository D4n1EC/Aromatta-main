"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Package, DollarSign, Eye, Edit, Trash2, Upload, Star, ShoppingCart, BarChart3 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useProducts } from "@/components/products-context"
import { useAuth } from "@/components/auth-context"

const salesData = [
  { month: "Enero", sales: 2500000, orders: 45 },
  { month: "Febrero", sales: 3200000, orders: 58 },
  { month: "Marzo", sales: 2800000, orders: 52 },
  { month: "Abril", sales: 3800000, orders: 67 },
  { month: "Mayo", sales: 4200000, orders: 78 },
  { month: "Junio", sales: 3900000, orders: 71 },
]

const categories = [
  { value: "cafe-grano", label: "Café en grano" },
  { value: "cafe-molido", label: "Café molido" },
  { value: "cafe-descafeinado", label: "Café descafeinado" },
  { value: "cafe-organico", label: "Café orgánico" },
  { value: "cafe-specialty", label: "Café specialty" },
  { value: "semillas", label: "Semillas de café" },
  { value: "fertilizantes", label: "Fertilizantes" },
  { value: "abonos", label: "Abonos orgánicos" },
  { value: "herramientas", label: "Herramientas de cultivo" },
  { value: "maquinaria", label: "Maquinaria cafetera" },
  { value: "tostadoras", label: "Tostadoras" },
  { value: "molinos", label: "Molinos de café" },
  { value: "equipos-extraccion", label: "Equipos de extracción" },
  { value: "insumos", label: "Insumos agrícolas" },
  { value: "empaques", label: "Empaques y envases" },
  { value: "accesorios", label: "Accesorios para café" },
]

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [] as File[],
    origin: "",
    variety: "",
    roastLevel: "",
    weight: "",
    altitude: "",
  })

  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const { user } = useAuth()

  // Filtrar productos del vendedor actual
  const sellerProducts = products.filter((product) => product.seller === user?.name || product.seller === "Mi Tienda")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewProduct((prev) => ({
        ...prev,
        images: Array.from(e.target.files!),
      }))
    }
  }

  const convertToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })


  const handleSubmitProduct = async (e: React.FormEvent) => {
  e.preventDefault()

  let imageBase64 = ""
  if (newProduct.images.length > 0) {
    imageBase64 = await convertToBase64(newProduct.images[0])
  }

  const productData = {
    name: newProduct.name,
    description: newProduct.description,
    price: Number.parseInt(newProduct.price),
    stock: Number.parseInt(newProduct.stock),
    category: newProduct.category,
    image: imageBase64 || "/placeholder.svg",
    seller: user?.name || "Mi Tienda",
    origin: newProduct.origin,
    variety: newProduct.variety,
    roastLevel: newProduct.roastLevel,
    weight: newProduct.weight,
    altitude: newProduct.altitude,
    status: "active" as const,
  }

  addProduct(productData)
  alert("Producto creado exitosamente!")

  // Limpiar formulario
  setNewProduct({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
    origin: "",
    variety: "",
    roastLevel: "",
    weight: "",
    altitude: "",
  })

  setActiveTab("products")
}


  const totalSales = salesData.reduce((sum, month) => sum + month.sales, 0)
  const totalOrders = salesData.reduce((sum, month) => sum + month.orders, 0)
  const averageRating = sellerProducts.reduce((sum, product) => sum + product.rating, 0) / sellerProducts.length

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Panel de Vendedor</h1>
            <p className="text-stone-600 mt-2">Gestiona tus productos y ventas</p>
          </div>
          <Badge className="bg-green-100 text-green-800 px-4 py-2">Vendedor Verificado</Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="add-product">Agregar Producto</TabsTrigger>
            <TabsTrigger value="analytics">Estadísticas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-stone-600">Ventas Totales</p>
                      <p className="text-2xl font-bold text-stone-800">{formatPrice(totalSales)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-stone-600">Pedidos</p>
                      <p className="text-2xl font-bold text-stone-800">{totalOrders}</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-stone-600">Productos</p>
                      <p className="text-2xl font-bold text-stone-800">{sellerProducts.length}</p>
                    </div>
                    <Package className="w-8 h-8 text-amber-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-stone-600">Calificación</p>
                      <p className="text-2xl font-bold text-stone-800">{averageRating.toFixed(1)}</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Productos Más Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sellerProducts
                      .sort((a, b) => b.sold - a.sold)
                      .slice(0, 3)
                      .map((product) => (
                        <div key={product.id} className="flex items-center space-x-4">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-stone-800">{product.name}</h4>
                            <p className="text-sm text-stone-600">{product.sold} vendidos</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(product.price)}</p>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm ml-1">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ventas Mensuales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesData.slice(-3).map((month) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <span className="font-medium text-stone-700">{month.month}</span>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(month.sales)}</p>
                          <p className="text-sm text-stone-600">{month.orders} pedidos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-stone-800">Mis Productos ({sellerProducts.length})</h2>
              <div className="flex items-center space-x-2">
                <Input placeholder="Buscar productos..." className="w-64" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="out_of_stock">Sin Stock</SelectItem>
                    <SelectItem value="paused">Pausados</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setActiveTab("add-product")} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {sellerProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-stone-800">{product.name}</h3>
                          <Badge
                            variant={
                              product.status === "active"
                                ? "default"
                                : product.status === "out_of_stock"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {product.status === "active"
                              ? "Activo"
                              : product.status === "out_of_stock"
                                ? "Sin Stock"
                                : "Pausado"}
                          </Badge>
                        </div>
                        <p className="text-sm text-stone-600 mb-2">{product.category}</p>
                        <p className="text-xs text-stone-500 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-stone-600">
                          <span>Precio: {formatPrice(product.price)}</span>
                          <span>Stock: {product.stock}</span>
                          <span>Vendidos: {product.sold}</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {product.rating}
                          </div>
                          <span>Creado: {product.createdAt}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {sellerProducts.length === 0 && (
              <Card className="text-center p-8">
                <CardContent>
                  <Package className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-stone-800 mb-2">No tienes productos publicados</h3>
                  <p className="text-stone-600 mb-4">Comienza a vender agregando tu primer producto</p>
                  <Button onClick={() => setActiveTab("add-product")} className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Primer Producto
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Add Product Tab */}
          <TabsContent value="add-product" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agregar Nuevo Producto</CardTitle>
                <CardDescription>Completa la información de tu producto para comenzar a vender</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del producto *</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: Café Arábica Premium"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría *</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Precio (COP) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="45000"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock disponible *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: e.target.value }))}
                        placeholder="10"
                        required
                      />
                    </div>
                  </div>

                  {/* Agregar campos adicionales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="origin">Origen del producto</Label>
                      <Input
                        id="origin"
                        value={newProduct.origin || ""}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, origin: e.target.value }))}
                        placeholder="Ej: Huila, Colombia"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="variety">Variedad (para café)</Label>
                      <Select
                        value={newProduct.variety || ""}
                        onValueChange={(value) => setNewProduct((prev) => ({ ...prev, variety: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona variedad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="arabica">Arábica</SelectItem>
                          <SelectItem value="robusta">Robusta</SelectItem>
                          <SelectItem value="geisha">Geisha</SelectItem>
                          <SelectItem value="bourbon">Bourbon</SelectItem>
                          <SelectItem value="typica">Typica</SelectItem>
                          <SelectItem value="caturra">Caturra</SelectItem>
                          <SelectItem value="castillo">Castillo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="roastLevel">Nivel de tueste</Label>
                      <Select
                        value={newProduct.roastLevel || ""}
                        onValueChange={(value) => setNewProduct((prev) => ({ ...prev, roastLevel: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Nivel de tueste" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="medium">Medio</SelectItem>
                          <SelectItem value="medium-dark">Medio Oscuro</SelectItem>
                          <SelectItem value="dark">Oscuro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Peso (gramos)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={newProduct.weight || ""}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, weight: e.target.value }))}
                        placeholder="500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="altitude">Altitud (msnm)</Label>
                      <Input
                        id="altitude"
                        value={newProduct.altitude || ""}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, altitude: e.target.value }))}
                        placeholder="1600-1800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe tu producto, sus características, origen, proceso de elaboración, etc."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="images">Imágenes del producto *</Label>
                    <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-stone-600">
                          Arrastra y suelta tus imágenes aquí, o{" "}
                          <label
                            htmlFor="images"
                            className="text-amber-600 hover:text-amber-700 cursor-pointer underline"
                          >
                            selecciona archivos
                          </label>
                        </p>
                        <p className="text-sm text-stone-500">
                          Máximo 5 imágenes, formato JPG o PNG, máximo 5MB cada una
                        </p>
                      </div>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    {newProduct.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {Array.from(newProduct.images).map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file) || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => {
                                const newImages = Array.from(newProduct.images)
                                newImages.splice(index, 1)
                                setNewProduct((prev) => ({ ...prev, images: newImages }))
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                      Crear Producto
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setActiveTab("products")}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Estadísticas de Ventas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesData.map((month, index) => (
                      <div key={month.month} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-stone-800">{month.month}</h4>
                          <p className="text-sm text-stone-600">{month.orders} pedidos</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-stone-800">{formatPrice(month.sales)}</p>
                          <div className="w-32 bg-stone-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(month.sales / Math.max(...salesData.map((m) => m.sales))) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Productos por Categoría</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Café en grano</span>
                        <Badge>2 productos</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Café molido</span>
                        <Badge>1 producto</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rendimiento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Tasa de conversión</span>
                        <span className="font-medium">12.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tiempo promedio de respuesta</span>
                        <span className="font-medium">2.3 horas</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Satisfacción del cliente</span>
                        <span className="font-medium">4.8/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}