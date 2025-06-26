"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  seller: string
  discount?: number
  stock: number
  description: string
  origin?: string
  variety?: string
  roastLevel?: string
  weight?: string
  altitude?: string
  createdAt: string
  status: "active" | "out_of_stock" | "paused"
}

interface ProductsContextType {
  products: Product[]
  addProduct: (product: Omit<Product, "id" | "createdAt" | "rating" | "reviews">) => void
  updateProduct: (id: number, updates: Partial<Product>) => void
  deleteProduct: (id: number) => void
  getProductById: (id: number) => Product | undefined
  getProductsByCategory: (category: string) => Product[]
  searchProducts: (query: string) => Product[]
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

// Productos predeterminados para demostración
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Café Arábica Premium Huila",
    price: 45000,
    originalPrice: 50000,
    image: "/cafe-arabica.jpg",
    rating: 4.8,
    reviews: 124,
    category: "Café",
    seller: "Finca El Paraíso",
    discount: 10,
    stock: 25,
    description:
      "Café arábica de alta calidad cultivado en las montañas del Huila. Notas frutales y chocolate con acidez balanceada.",
    origin: "Huila, Colombia",
    variety: "Arábica",
    roastLevel: "Medio",
    weight: "500g",
    altitude: "1800m",
    createdAt: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    name: "Café Geisha Especial",
    price: 85000,
    image: "/Geisha.jpg",
    rating: 4.9,
    reviews: 89,
    category: "Café",
    seller: "Café de los Andes",
    stock: 12,
    description:
      "Variedad Geisha excepcional con perfil floral único. Cultivado a gran altitud con métodos tradicionales.",
    origin: "Nariño, Colombia",
    variety: "Geisha",
    roastLevel: "Claro",
    weight: "250g",
    altitude: "2100m",
    createdAt: "2024-01-20",
    status: "active",
  },
  {
    id: 3,
    name: "Café Orgánico Tolima",
    price: 38000,
    originalPrice: 42000,
    image: "/OrganicoTolima.webp",
    rating: 4.6,
    reviews: 156,
    category: "Café",
    seller: "Cooperativa Tolima",
    discount: 9,
    stock: 45,
    description: "Café 100% orgánico certificado. Proceso lavado con notas a caramelo y nueces.",
    origin: "Tolima, Colombia",
    variety: "Caturra",
    roastLevel: "Medio-Oscuro",
    weight: "1kg",
    altitude: "1600m",
    createdAt: "2024-01-10",
    status: "active",
  },
  {
    id: 4,
    name: "Machete Cafetero Profesional",
    price: 65000,
    image: "/MacheteCafetero.jpg",
    rating: 4.7,
    reviews: 78,
    category: "Herramientas",
    seller: "Herramientas del Campo",
    stock: 30,
    description: "Machete especializado para cosecha de café. Acero inoxidable de alta calidad con mango ergonómico.",
    createdAt: "2024-01-12",
    status: "active",
  },
  {
    id: 5,
    name: "Canastas Recolectoras de Café",
    price: 25000,
    image: "/CanastaXD.webp",
    rating: 4.5,
    reviews: 92,
    category: "Herramientas",
    seller: "Implementos Agrícolas",
    stock: 50,
    description: "Set de 3 canastas de mimbre tradicionales para recolección de café. Resistentes y duraderas.",
    createdAt: "2024-01-08",
    status: "active",
  },
  {
    id: 6,
    name: "Despulpadora Manual de Café",
    price: 450000,
    image: "/despulpadora.jpg",
    rating: 4.8,
    reviews: 34,
    category: "Maquinaria",
    seller: "Maquinaria Cafetera",
    stock: 8,
    description: "Despulpadora manual de alta eficiencia. Ideal para pequeños productores. Fácil mantenimiento.",
    createdAt: "2024-01-05",
    status: "active",
  },
  {
    id: 7,
    name: "Fertilizante Orgánico para Café",
    price: 35000,
    image: "/fertilizante.jpg",
    rating: 4.6,
    reviews: 145,
    category: "Fertilizantes",
    seller: "Abonos Naturales",
    stock: 60,
    description:
      "Fertilizante 100% orgánico especialmente formulado para cultivos de café. Rico en nutrientes esenciales.",
    weight: "25kg",
    createdAt: "2024-01-18",
    status: "active",
  },
  {
    id: 8,
    name: "Compost Premium Cafetero",
    price: 28000,
    image: "/CompostCafetero.webp",
    rating: 4.4,
    reviews: 67,
    category: "Fertilizantes",
    seller: "Tierra Fértil",
    stock: 40,
    description: "Compost elaborado con pulpa de café y materiales orgánicos. Mejora la estructura del suelo.",
    weight: "20kg",
    createdAt: "2024-01-14",
    status: "active",
  },
  {
    id: 9,
    name: "Semillas de Café Caturra",
    price: 15000,
    image: "/Caturra.webp",
    rating: 4.7,
    reviews: 89,
    category: "Semillas",
    seller: "Vivero San José",
    stock: 100,
    description: "Semillas certificadas de café Caturra. Alta germinación y resistencia a enfermedades.",
    variety: "Caturra",
    createdAt: "2024-01-22",
    status: "active",
  },
  {
    id: 10,
    name: "Plántulas de Café Castillo",
    price: 3500,
    image: "/Castillo.jpg",
    rating: 4.8,
    reviews: 156,
    category: "Semillas",
    seller: "Vivero La Esperanza",
    stock: 200,
    description: "Plántulas de 6 meses, variedad Castillo resistente a roya. Listas para trasplante.",
    variety: "Castillo",
    createdAt: "2024-01-25",
    status: "active",
  },
  {
    id: 11,
    name: "Secadora Solar para Café",
    price: 1200000,
    image: "/Secadora.jpg",
    rating: 4.9,
    reviews: 23,
    category: "Maquinaria",
    seller: "Tecnología Cafetera",
    stock: 3,
    description: "Secadora solar de alta eficiencia. Reduce tiempo de secado y mejora calidad del grano.",
    createdAt: "2024-01-03",
    status: "active",
  },
  {
    id: 12,
    name: "Tostadora Artesanal",
    price: 2800000,
    image: "/tostadora.jpg",
    rating: 4.8,
    reviews: 15,
    category: "Maquinaria",
    seller: "Equipos de Tostado",
    stock: 2,
    description: "Tostadora artesanal para pequeños lotes. Control preciso de temperatura y tiempo.",
    createdAt: "2024-01-01",
    status: "active",
  },
  {
    id: 13,
    name: "Café Especial Microlote",
    price: 120000,
    image: "/Microlote.webp",
    rating: 5.0,
    reviews: 12,
    category: "Café",
    seller: "Finca Especial",
    stock: 3,
    description: "Microlote excepcional de café especial. Edición limitada con puntaje de 90+ puntos.",
    origin: "Cauca, Colombia",
    variety: "Pink Bourbon",
    roastLevel: "Claro",
    weight: "200g",
    altitude: "2200m",
    createdAt: "2024-01-28",
    status: "active",
  },
  {
    id: 14,
    name: "Fertilizante Líquido Concentrado",
    price: 55000,
    image: "/FertilizanteLiquido.jpg",
    rating: 4.5,
    reviews: 34,
    category: "Fertilizantes",
    seller: "Nutrición Vegetal",
    stock: 4,
    description: "Fertilizante líquido concentrado de rápida absorción. Ideal para aplicación foliar.",
    weight: "5L",
    createdAt: "2024-01-26",
    status: "active",
  },
]


export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  // Cargar productos del localStorage al iniciar
  useEffect(() => {
    const savedProducts = localStorage.getItem("aromatta-products")
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts)
        // Si hay productos guardados, usarlos; si no, usar los iniciales
        setProducts(parsed.length > 0 ? parsed : initialProducts)
      } catch (error) {
        console.error("Error parsing saved products:", error)
        setProducts(initialProducts)
      }
    }
  }, [])

  // Guardar productos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("aromatta-products", JSON.stringify(products))
  }, [products])

  const addProduct = (productData: Omit<Product, "id" | "createdAt" | "rating" | "reviews">) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now(), // Usar timestamp como ID único
      createdAt: new Date().toISOString().split("T")[0],
      rating: 0,
      reviews: 0,
    }
    setProducts((prev) => [newProduct, ...prev])
  }

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...updates } : product)))
  }

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  const getProductById = (id: number) => {
    return products.find((product) => product.id === id)
  }

  const getProductsByCategory = (category: string) => {
    return products.filter((product) => product.category.toLowerCase().includes(category.toLowerCase()))
  }

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.seller.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery),
    )
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getProductsByCategory,
        searchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
