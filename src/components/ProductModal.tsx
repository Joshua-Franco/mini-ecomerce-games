import type { Product } from '../data/products'
import { useCartStore } from '../store/useCartStore'
import { formatSoles } from '../utils/currency'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  onToast: (message: string) => void
}

export function ProductModal({ product, onClose, onToast }: ProductModalProps) {
  const addProduct = useCartStore((state) => state.addProduct)
  if (!product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="product-modal-title" className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button type="button" onClick={onClose} aria-label="Cerrar vista previa" className="absolute right-4 top-4 text-lg text-slate-400 hover:text-white"><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
          <div className="flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-slate-950">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-3" />
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase text-brand-400">{product.badge}</span>
            <h2 id="product-modal-title" className="text-xl font-bold text-white">{product.name}</h2>
            <p className="text-xs text-slate-400">{product.specs}</p>
            <div className="text-2xl font-extrabold text-emerald-400">{formatSoles(product.price)}</div>
            <button type="button" onClick={() => {
              const added = addProduct(product)
              onClose()
              onToast(added ? `Añadido: ${product.name}` : 'Máximo 10 unidades por producto')
            }} className="w-full rounded-xl bg-brand-500 py-3 font-bold text-slate-950 transition hover:bg-brand-400">Añadir al Carrito</button>
          </div>
        </div>
      </section>
    </div>
  )
}
