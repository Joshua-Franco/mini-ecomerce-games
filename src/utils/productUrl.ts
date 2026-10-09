import { parse, stringify, validate as isUuid } from 'uuid'

// Crea el enlace del producto usando el UUID que ya entrega el backend.
export function getProductUrl(productId: string): string {
  if (!isUuid(productId)) {
    throw new Error('No se puede crear un enlace para un producto con UUID inválido.')
  }

  return `/producto/${stringify(parse(productId))}`
}
