"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { getImagePath } from "@/lib/image-utils";
import { useAuth } from "@/components/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  Camera,
  Package,
  Heart,
  Star,
  Store,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Award,
  Plus,
  Trash2,
  Download,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
const userProfile = {
  id: 1,
  name: "Juan Carlos Pérez",
  email: "juan.perez@email.com",
  phone: "+57 300 123 4567",
  document: "CC 12345678",
  avatar: "/images/icono.png", // reemplazado
  role: "buyer", // "buyer" or "seller"
  joinDate: "2023-06-15",
  address: {
    street: "Carrera 15 #45-67",
    city: "Bogotá",
    department: "Cundinamarca",
    zipCode: "110111",
  },
  preferences: {
    notifications: true,
    marketing: false,
    newsletter: true,
  },
  stats: {
    orders: 24,
    reviews: 18,
    favorites: 12,
    points: 1250,
  },
  sellerInfo: {
    storeName: "Café Premium Juan",
    description: "Vendedor especializado en café de alta calidad desde las montañas de Colombia",
    rating: 4.8,
    sales: 156,
    products: 8,
    verified: true,
  },
}

const recentOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    total: 125000,
    status: "delivered",
    items: 3,
    image: "/cafe-arabica.jpg", // reemplazado
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    total: 85000,
    status: "shipped",
    items: 2,
    image: "/images/herramientas-kit.jpg", // reemplazado
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    total: 45000,
    status: "processing",
    items: 1,
    image: "/fertilizante.jpg", // reemplazado
  },
]

const favoriteProducts = [
  {
    id: 1,
    name: "Café Arábica Premium",
    price: 45000,
    image: "/cafe-arabica.jpg", // reemplazado
    seller: "Finca El Paraíso",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Kit Herramientas Pro",
    price: 120000,
    image: "/herramientas-kit.jpg", // reemplazado
    seller: "ToolsPro",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Fertilizante Orgánico",
    price: 35000,
    image: "/fertilizante.jpg", // reemplazado
    seller: "AgroSolutions",
    rating: 4.6,
  },
]


export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const { user, isLoggedIn, updateUser } = useAuth()
  const [profile, setProfile] = useState({
  ...userProfile,
  ...user,
  })


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Entregado"
      case "shipped":
        return "Enviado"
      case "processing":
        return "Procesando"
      default:
        return "Desconocido"
    }
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Aquí iría la lógica para guardar el perfil
    console.log("Profile saved:", profile)
  }

  const toggleSellerMode = () => {
    setProfile((prev) => ({
      ...prev,
      role: prev.role === "buyer" ? "seller" : "buyer",
    }))
  }

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Image = reader.result as string

      // ✅ Actualizar el estado local del perfil
      setProfile((prev) => ({ ...prev, avatar: base64Image }))

      // ✅ Actualizar el estado global del usuario (Navbar y otras partes)
      updateUser({ avatar: base64Image })

      // ✅ Guardar en localStorage por si acaso (extra seguridad)
      const storedUser = localStorage.getItem("aromatta_user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        parsedUser.avatar = base64Image
        localStorage.setItem("aromatta_user", JSON.stringify(parsedUser))
      }
    }
    reader.readAsDataURL(file)
  }
}



  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
  <AvatarImage src={profile.avatar || "/default.jpeg"} alt={profile.name} />
  <AvatarFallback>{profile.name?.charAt(0) || "U"}</AvatarFallback>
</Avatar>
                <label className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center cursor-pointer">
  <Camera className="w-4 h-4 text-white" />
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleImageChange}
/>
</label>

              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-stone-800">{profile.name}</h1>
                    <p className="text-stone-600">{profile.email}</p>
                    <div className="flex items-center justify-center md:justify-start space-x-4 mt-2">
                      <Badge variant={profile.role === "seller" ? "default" : "secondary"}>
                        {profile.role === "seller" ? "Vendedor" : "Comprador"}
                      </Badge>
                      {profile.role === "seller" && profile.sellerInfo.verified && (
                        <Badge className="bg-green-100 text-green-800">
                          <Award className="w-3 h-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                      <span className="text-sm text-stone-500">
                        Miembro desde {new Date(profile.joinDate).toLocaleDateString("es-CO")}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="flex items-center">
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? "Cancelar" : "Editar"}
                    </Button>
                    {profile.role === "buyer" && (
                      <Button onClick={toggleSellerMode} className="bg-amber-600 hover:bg-amber-700">
                        <Store className="w-4 h-4 mr-2" />
                        Ser Vendedor
                      </Button>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-stone-100 rounded-lg">
                    <div className="text-xl font-bold text-stone-800">{profile.stats.orders}</div>
                    <div className="text-sm text-stone-600">Pedidos</div>
                  </div>
                  <div className="text-center p-3 bg-stone-100 rounded-lg">
                    <div className="text-xl font-bold text-stone-800">{profile.stats.reviews}</div>
                    <div className="text-sm text-stone-600">Reseñas</div>
                  </div>
                  <div className="text-center p-3 bg-stone-100 rounded-lg">
                    <div className="text-xl font-bold text-stone-800">{profile.stats.favorites}</div>
                    <div className="text-sm text-stone-600">Favoritos</div>
                  </div>
                  <div className="text-center p-3 bg-stone-100 rounded-lg">
                    <div className="text-xl font-bold text-amber-600">{profile.stats.points}</div>
                    <div className="text-sm text-stone-600">Puntos</div>
                  </div>
                </div>

                {/* Seller Stats */}
                {profile.role === "seller" && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <div className="text-xl font-bold text-amber-700">{profile.sellerInfo.sales}</div>
                      <div className="text-sm text-amber-600">Ventas</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <div className="text-xl font-bold text-amber-700">{profile.sellerInfo.products}</div>
                      <div className="text-sm text-amber-600">Productos</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center justify-center">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-xl font-bold text-amber-700">{profile.sellerInfo.rating}</span>
                      </div>
                      <div className="text-sm text-amber-600">Calificación</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
            {profile.role === "seller" && <TabsTrigger value="seller">Mi Tienda</TabsTrigger>}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        value={profile.name.split(" ")[0]}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            name: `${e.target.value} ${prev.name.split(" ").slice(1).join(" ")}`,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        value={profile.name.split(" ").slice(1).join(" ")}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            name: `${prev.name.split(" ")[0]} ${e.target.value}`,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled={!isEditing}
                      onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="document">Documento</Label>
                    <Input id="document" value={profile.document} disabled />
                  </div>

                  {isEditing && (
                    <Button onClick={handleSaveProfile} className="w-full bg-amber-600 hover:bg-amber-700">
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Cambios
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Dirección de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street">Dirección</Label>
                    <Input
                      id="street"
                      value={profile.address.street}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          address: { ...prev.address, street: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={profile.address.city}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            address: { ...prev.address, city: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Código Postal</Label>
                      <Input
                        id="zipCode"
                        value={profile.address.zipCode}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            address: { ...prev.address, zipCode: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="department">Departamento</Label>
                    <Select
                      value={profile.address.department}
                      disabled={!isEditing}
                      onValueChange={(value) =>
                        setProfile((prev) => ({
                          ...prev,
                          address: { ...prev.address, department: value },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cundinamarca">Cundinamarca</SelectItem>
                        <SelectItem value="Antioquia">Antioquia</SelectItem>
                        <SelectItem value="Valle del Cauca">Valle del Cauca</SelectItem>
                        <SelectItem value="Huila">Huila</SelectItem>
                        <SelectItem value="Nariño">Nariño</SelectItem>
                        <SelectItem value="Tolima">Tolima</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Mis Pedidos
                </CardTitle>
                <CardDescription>Historial de tus compras recientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={getImagePath(order.image)}
                        alt="Producto"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-stone-800">Pedido #{order.id}</h4>
                          <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                        </div>
                        <p className="text-sm text-stone-600 mb-1">
                          {order.items} {order.items === 1 ? "producto" : "productos"} • {order.date}
                        </p>
                        <p className="font-medium text-stone-800">{formatPrice(order.total)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            Reseñar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Productos Favoritos
                </CardTitle>
                <CardDescription>Productos que has marcado como favoritos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <img
                        src={getImagePath(product.image)}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-stone-800 mb-1">{product.name}</h4>
                      <p className="text-sm text-stone-600 mb-2">por {product.seller}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800">{formatPrice(product.price)}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm">{product.rating}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" className="flex-1 bg-amber-600 hover:bg-amber-700">
                          Comprar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications">Notificaciones push</Label>
                      <p className="text-sm text-stone-600">Recibe notificaciones sobre tus pedidos</p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={profile.preferences.notifications}
                      onCheckedChange={(checked) =>
                        setProfile((prev) => ({
                          ...prev,
                          preferences: { ...prev.preferences, notifications: checked },
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing">Ofertas y promociones</Label>
                      <p className="text-sm text-stone-600">Recibe ofertas especiales por email</p>
                    </div>
                    <Switch
                      id="marketing"
                      checked={profile.preferences.marketing}
                      onCheckedChange={(checked) =>
                        setProfile((prev) => ({
                          ...prev,
                          preferences: { ...prev.preferences, marketing: checked },
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newsletter">Newsletter</Label>
                      <p className="text-sm text-stone-600">Recibe nuestro boletín semanal</p>
                    </div>
                    <Switch
                      id="newsletter"
                      checked={profile.preferences.newsletter}
                      onCheckedChange={(checked) =>
                        setProfile((prev) => ({
                          ...prev,
                          preferences: { ...prev.preferences, newsletter: checked },
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Cambiar Contraseña
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Verificar Email
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Verificar Teléfono
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Métodos de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">**** **** **** 1234</p>
                          <p className="text-sm text-stone-600">Visa • Expira 12/25</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Método de Pago
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Privacidad y Datos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Perfil público</Label>
                      <p className="text-sm text-stone-600">Permitir que otros usuarios vean tu perfil</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Historial de compras visible</Label>
                      <p className="text-sm text-stone-600">Mostrar tus compras en tu perfil público</p>
                    </div>
                    <Switch />
                  </div>

                  <Separator />

                  <Button variant="outline" className="w-full justify-start text-red-600 border-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar mi cuenta
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar mis datos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Seller Tab */}
          {profile.role === "seller" && (
            <TabsContent value="seller" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="w-5 h-5 mr-2" />
                    Mi Tienda
                  </CardTitle>
                  <CardDescription>Información de tu tienda en Aromatta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="storeName">Nombre de la tienda</Label>
                    <Input
                      id="storeName"
                      value={profile.sellerInfo.storeName}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          sellerInfo: { ...prev.sellerInfo, storeName: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="storeDescription">Descripción</Label>
                    <Textarea
                      id="storeDescription"
                      value={profile.sellerInfo.description}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          sellerInfo: { ...prev.sellerInfo, description: e.target.value },
                        }))
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-700">{profile.sellerInfo.sales}</div>
                      <div className="text-sm text-amber-600">Ventas Totales</div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-700">{profile.sellerInfo.products}</div>
                      <div className="text-sm text-amber-600">Productos Activos</div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="flex items-center justify-center">
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-2xl font-bold text-amber-700">{profile.sellerInfo.rating}</span>
                      </div>
                      <div className="text-sm text-amber-600">Calificación</div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Link href="/seller" className="flex-1">
                      <Button className="w-full bg-amber-600 hover:bg-amber-700">
                        <Settings className="w-4 h-4 mr-2" />
                        Panel de Vendedor
                      </Button>
                    </Link>
                    <Button variant="outline" className="flex-1">
                      <Package className="w-4 h-4 mr-2" />
                      Mis Productos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
