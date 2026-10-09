import { useState } from 'react'
import type { Product } from '../data/products'
import { useCartStore } from '../store/useCartStore'
import { formatSoles } from '../utils/currency'
import { getProductUrl } from '../utils/productUrl'

interface ProductCardProps {
  product: Product
  onOpen: () => void
  onToast: (message: string) => void
}

export function ProductCard({ product, onOpen, onToast }: ProductCardProps) {
  // Cambia a un icono cuando la imagen del producto no puede cargarse.
  const addProduct = useCartStore((state) => state.addProduct)
  const [imageFailed, setImageFailed] = useState(false)

  // Muestra datos del producto y ofrece vista previa o añadir al carrito.
  return (
    <article className="card-hover-effect group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <div>
        <div className="mb-4 flex items-start justify-between">
          <span className="rounded-full border border-brand-500/20 bg-brand-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-400">{product.badge}</span>
          <button type="button" onClick={onOpen} title="Vista previa" aria-label={`Vista previa de ${product.name}`} className="text-slate-500 transition hover:text-brand-400">
            <i className="fa-regular fa-eye" aria-hidden="true" />
          </button>
        </div>
        <a href={getProductUrl(product.id)} onClick={(event) => {
          event.preventDefault()
          onOpen()
        }} aria-label={`Ver ${product.name}`} className="mb-4 flex h-36 w-full items-center justify-center rounded-2xl bg-slate-950/60 transition duration-300 group-hover:scale-[1.02]">
          {imageFailed ? (
            <i className={`fa-solid ${product.icon} text-5xl text-brand-400/80`} aria-hidden="true" />
          ) : (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full rounded-2xl object-contain p-2"
            />
          )}
        </a>
        <a
          href={getProductUrl(product.id)}
          onClick={(event) => {
            event.preventDefault()
            onOpen()
          }}
          className="mb-1 line-clamp-2 text-left text-sm font-semibold text-slate-100 transition hover:text-brand-400"
        >
          {product.name}
        </a>
        <p className="mb-3 text-xs text-slate-400">{product.specs}</p>
      </div>
      <div className="flex items-center justify-between border-t border-slate-800 pt-3">
        <div>
          <span className="block text-[10px] text-slate-500">Precio Contado (IGV Inc.)</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-base font-extrabold text-white">{formatSoles(product.price)}</span>
            {product.oldPrice && <span className="text-[10px] text-slate-500 line-through">{formatSoles(product.oldPrice)}</span>}
          </div>
        </div>
        <button type="button" onClick={() => {
          if (addProduct(product)) onToast(`Añadido: ${product.name}`)
          else onToast('Máximo 10 unidades por producto')
        }} aria-label={`Añadir ${product.name} al carrito`} className="flex items-center justify-center rounded-xl bg-slate-800 p-2.5 text-brand-400 transition hover:bg-brand-500 hover:text-slate-950">
          <i className="fa-solid fa-cart-plus" aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
