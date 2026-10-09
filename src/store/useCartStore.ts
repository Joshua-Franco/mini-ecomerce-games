import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Product } from '../data/products'

export interface CartItem {
  id: number
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
  updateQuantity: (id: number, delta: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
  setOpen: (open: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
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
      addCustomBuild: (name, price) =>
        set((state) => ({
          items: [...state.items, { id: Date.now(), name, price, qty: 1, icon: 'fa-desktop' }],
        })),
      updateQuantity: (id, delta) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, qty: Math.min(10, item.qty + delta) } : item))
            .filter((item) => item.qty > 0),
        })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clearCart: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'novatech_cart_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
