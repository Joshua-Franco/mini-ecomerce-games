import type { Product } from '../data/products'
import { getAuthHeaders } from './auth'

// Datos editables del producto, en el formato que espera la API.
export interface ProductInput {
  sortOrder: number
  name: string
  category: string
  price: number
  oldPrice: number | null
  badge: string
  icon: string
  specs: string
  imageFilename: string
}

const API_URL = import.meta.env.VITE_API_URL ?? 'https://mini-backend-pm9f.onrender.com/api'

// Centraliza solicitudes de escritura y convierte errores del backend en mensajes.
async function requestProduct(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: ProductInput): Promise<void> {
  const response = await fetch(`${API_URL}/products${path}`, {
    method,
    headers: {
      ...getAuthHeaders(),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!response.ok) {
    let message = `La operación de producto falló (HTTP ${response.status}).`
    try {
      const data: unknown = await response.json()
      if (typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string') {
        message = data.error
      }
    } catch {
      // Conserva el error HTTP si el servidor no envió JSON.
    }
    throw new Error(message)
  }
}

// Crea un producto; el backend comprueba los permisos de administrador.
export function createProduct(product: ProductInput): Promise<void> {
  return requestProduct('', 'POST', product)
}

// Reemplaza los datos de un producto existente.
export function updateProduct(id: string, product: ProductInput): Promise<void> {
  return requestProduct(`/${encodeURIComponent(id)}`, 'PUT', product)
}

// Elimina un producto existente después de que el backend autorice la operación.
export function deleteProduct(id: string): Promise<void> {
  return requestProduct(`/${encodeURIComponent(id)}`, 'DELETE')
}

// Adapta un producto del catálogo al formulario de creación o edición.
export function productToInput(product: Product, index: number): ProductInput {
  const imageFilename =
    product.imageFilename ?? decodeURIComponent(new URL(product.image, window.location.href).pathname.split('/').pop() ?? '')
  return {
    sortOrder: product.sortOrder ?? index + 1,
    name: product.name,
    category: product.category,
    price: product.price,
    oldPrice: product.oldPrice ?? null,
    badge: product.badge,
    icon: product.icon,
    specs: product.specs,
    imageFilename,
  }
}
