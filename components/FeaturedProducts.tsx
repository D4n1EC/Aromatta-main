// src/components/FeaturedProducts.tsx
import { getImagePath } from "@/lib/image-utils"

import React from "react"

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
}

interface FeaturedProductsProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, onAddToCart }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg">
          <img src={getImagePath(product.image)} alt={product.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-sm text-gray-600 mt-1">Vendido por: {product.seller}</p>
            <div className="flex items-center justify-between mt-2">
              <div>
                <span className="text-green-700 font-bold">
                  ${product.price.toLocaleString("es-CO")}
                </span>
                {product.originalPrice && (
                  <span className="text-sm line-through text-gray-400 ml-2">
                    ${product.originalPrice.toLocaleString("es-CO")}
                  </span>
                )}
              </div>
              <span className="text-yellow-500 text-sm">⭐ {product.rating}</span>
            </div>
            {onAddToCart && (
              <button
                className="mt-3 w-full bg-amber-600 text-white py-1 rounded hover:bg-amber-700"
                onClick={() => onAddToCart(product)}
              >
                Agregar al carrito
              </button>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}

export default FeaturedProducts
