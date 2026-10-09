import { useEffect } from 'react'
import { useCartStore } from '../store/useCartStore'
import { formatSoles } from '../utils/currency'

interface CartDrawerProps {
  onCheckout: () => void
  checkingOut: boolean
}

export function CartDrawer({ onCheckout, checkingOut }: CartDrawerProps) {
  const items = useCartStore((state) => state.items)
  const isOpen = useCartStore((state) => state.isOpen)
  const setOpen = useCartStore((state) => state.setOpen)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const subtotal = total / 1.18

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  return (
    <div aria-hidden={!isOpen} className={`fixed inset-0 z-50 overflow-hidden transition-[opacity,visibility] duration-300 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
      <button type="button" aria-label="Cerrar carrito" onClick={() => setOpen(false)} className="absolute inset-0 cursor-default bg-slate-950/70" />
      <aside className={`cart-panel pointer-events-auto absolute right-0 top-0 flex h-full w-screen max-w-md flex-col border-l border-slate-800 bg-slate-900 text-slate-100 shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold"><i className="fa-solid fa-bag-shopping text-brand-400" aria-hidden="true" /> Tu Carrito NovaTech</h2>
          <button type="button" aria-label="Cerrar carrito" onClick={() => setOpen(false)} className="p-1 text-xl text-slate-400 hover:text-white"><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="py-12 text-center text-slate-500"><i className="fa-solid fa-bag-shopping mb-3 block text-4xl" aria-hidden="true" /><p className="text-sm">Tu carrito está vacío</p></div>
          ) : items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-900 text-brand-400">
                  {item.image ? <img src={item.image} alt="" className="h-full w-full object-contain p-0.5" /> : <i className={`fa-solid ${item.icon}`} aria-hidden="true" />}
                </div>
                <div className="min-w-0">
                  <h3 title={item.name} className="max-w-[150px] truncate text-xs font-semibold text-slate-200">{item.name}</h3>
                  <span className="text-xs font-bold text-brand-400">{formatSoles(item.price)}</span>
                  {item.qty > 1 && <span className="block text-[10px] text-slate-500">Subtotal: {formatSoles(item.price * item.qty)}</span>}
                </div>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <button type="button" aria-label="Quitar uno" onClick={() => updateQuantity(item.id, -1)} className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-700 text-xs hover:bg-slate-600">-</button>
                <span className="w-4 text-center text-xs font-bold">{item.qty}</span>
                <button type="button" aria-label="Añadir uno" onClick={() => updateQuantity(item.id, 1)} disabled={item.qty >= 10} className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-700 text-xs hover:bg-slate-600 disabled:opacity-50">+</button>
                <button type="button" aria-label="Eliminar" onClick={() => removeItem(item.id)} className="ml-1 text-sm text-slate-500 hover:text-red-400"><i className="fa-regular fa-trash-can" aria-hidden="true" /></button>
              </div>
            </div>
          ))}
          {items.length > 0 && <button type="button" onClick={clearCart} className="w-full pt-2 text-center text-xs text-slate-500 transition hover:text-red-400">Vaciar carrito</button>}
        </div>
        <div className="space-y-3 border-t border-slate-800 bg-slate-950/90 p-6">
          <div className="flex justify-between text-xs text-slate-400"><span>Base Imponible (Subtotal)</span><span className="font-medium text-slate-300">{formatSoles(subtotal)}</span></div>
          <div className="flex justify-between text-xs text-slate-400"><span>IGV (18% Incluido)</span><span className="font-medium text-slate-300">{formatSoles(total - subtotal)}</span></div>
          <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-extrabold text-white"><span>Total a Pagar</span><span className="font-display text-xl text-brand-400">{formatSoles(total)}</span></div>
          <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-slate-400">
            <span className="rounded border border-purple-800 bg-purple-950/60 px-2 py-0.5 text-purple-300">Yape / Plin</span>
            <span className="rounded border border-blue-800 bg-blue-950/60 px-2 py-0.5 text-blue-300">BBVA Cuotas</span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">Tarjetas</span>
          </div>
          <button type="button" disabled={checkingOut} onClick={onCheckout} className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 py-3.5 font-extrabold text-slate-950 shadow-lg transition hover:bg-brand-400 disabled:cursor-wait disabled:opacity-60">
            <span>{checkingOut ? 'Procesando...' : 'Proceder al Pago'}</span><i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </aside>
    </div>
  )
}
