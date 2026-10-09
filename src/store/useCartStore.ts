import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Product } from '../data/products'

export interface CartItem {
  // Los UUID del backend son texto; los ensambles locales usan una marca numérica.
  id: string | number
  name: string
  price: number
  qty: number
  icon: string
  image?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addProduct: (product: Product) => boolean
  addCustomBuild: (name: string, price: number) => void
  updateQuantity: (id: string | number, delta: number) => void
  removeItem: (id: string | number) => void
  clearCart: () => void
  setOpen: (open: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      // Incrementa un artículo existente o lo agrega, con un máximo de diez unidades.
      addProduct: (product) => {
        const existing = get().items.find((item) => item.id === product.id)
        if (existing?.qty && existing.qty >= 10) return false
        set((state) => ({
          items: existing
            ? state.items.map((item) =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
              )
            : [...state.items, { ...product, qty: 1 }],
        }))
        return true
      },
      // Añade el ensamble como un artículo local independiente del catálogo.
      addCustomBuild: (name, price) =>
        set((state) => ({
          items: [...state.items, { id: Date.now(), name, price, qty: 1, icon: 'fa-desktop' }],
        })),
      // Ajusta unidades y elimina automáticamente los artículos que llegan a cero.
      updateQuantity: (id, delta) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, qty: Math.min(10, item.qty + delta) } : item))
            .filter((item) => item.qty > 0),
        })),
      // Expone acciones directas para eliminar, vaciar y abrir el carrito.
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clearCart: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      // Conserva los artículos entre recargas; el estado visual no se persiste.
      name: 'novatech_cart_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
