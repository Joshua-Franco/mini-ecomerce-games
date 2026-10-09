import type { Product } from '../data/products'
import { validate as isUuid } from 'uuid'

// El backend local es el valor predeterminado; Vite permite cambiarlo por entorno.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:6072/api'

// Describe la envoltura JSON que devuelve el endpoint de listado.
interface ProductListResponse {
  products: Product[]
}

function isProductListResponse(data: unknown): data is ProductListResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'products' in data &&
    Array.isArray(data.products) &&
    data.products.every(
      (product: unknown) =>
        typeof product === 'object' &&
        product !== null &&
        'id' in product &&
        typeof product.id === 'string' &&
        isUuid(product.id),
    )
  )
}

export async function fetchProducts(): Promise<Product[]> {
  // Propaga errores HTTP para que la interfaz pueda mostrar el estado de fallo.
  const response = await fetch(`${API_URL}/products`)
  if (!response.ok) {
    throw new Error(`No se pudo cargar el catálogo (HTTP ${response.status}).`)
  }

  const data: unknown = await response.json()
  if (!isProductListResponse(data)) {
    throw new Error('El catálogo contiene productos con UUID inválidos.')
  }

  return data.products
}
