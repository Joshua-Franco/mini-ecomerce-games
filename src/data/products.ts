// Modelo compartido entre la respuesta de la API y los componentes de la tienda.
export interface Product {
  id: string
  sortOrder?: number
  name: string
  category: string
  price: number
  oldPrice?: number
  badge: string
  icon: string
  specs: string
  imageFilename?: string
  image: string
}
