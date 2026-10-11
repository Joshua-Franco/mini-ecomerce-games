import { useMemo, useState } from 'react'
import type { Customer } from '../api/auth'
import type { Product } from '../data/products'
import { useCartStore } from '../store/useCartStore'

interface HeaderProps {
  products: Product[]
  customer: Customer | null
  onOpenAccount: () => void
  onOpenProductAdmin: () => void
  onOpenBuilder: () => void
  onCategoryChange: (category: string) => void
  onSearch: (query: string) => void
  onToast: (message: string) => void
  onOrderTracker: () => void
}

const categories = [
  { id: 'laptop', label: 'Laptops y Notebooks', icon: 'fa-laptop' },
  { id: 'gpu', label: 'Tarjetas Gráficas', icon: 'fa-microchip' },
  { id: 'cpu', label: 'Procesadores', icon: 'fa-cpu' },
  { id: 'monitor', label: 'Monitores Gamer', icon: 'fa-desktop' },
  { id: 'peripherals', label: 'Periféricos', icon: 'fa-keyboard' },
]

// Combina búsqueda, navegación de categorías, cuenta y acceso al carrito.
export function Header({
  products,
  customer,
  onOpenAccount,
  onOpenProductAdmin,
  onOpenBuilder,
  onCategoryChange,
  onSearch,
  onToast,
  onOrderTracker,
}: HeaderProps) {
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.qty, 0))
  const setCartOpen = useCartStore((state) => state.setOpen)
  const results = useMemo(
    // Actualiza las sugerencias de búsqueda cuando cambia el texto o el catálogo.
    () =>
      search.trim()
        ? products.filter((product) =>
            `${product.name} ${product.specs}`.toLowerCase().includes(search.trim().toLowerCase()),
          )
        : [],
    [products, search],
  )

  const applyCategory = (category: string) => {
    // Cambia el filtro y desplaza la página al catálogo.
    onCategoryChange(category)
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    // Confirma la búsqueda y lleva al usuario a los resultados.
    event.preventDefault()
    onSearch(search)
    setSearchOpen(false)
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div className="border-b border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-400 sm:px-8">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-6 overflow-x-auto py-0.5">
            <span className="flex items-center gap-1.5 whitespace-nowrap font-semibold text-brand-400">
              <i className="fa-solid fa-bolt text-amber-400" aria-hidden="true" /> Cyber Days Tech
            </span>
            <button type="button" onClick={() => onToast('Soporte vía WhatsApp activo 24/7')} className="flex items-center gap-1.5 whitespace-nowrap transition hover:text-brand-400">
              <i className="fa-solid fa-headset text-brand-400" aria-hidden="true" /> Asesoría Técnica
            </button>
            <button type="button" onClick={onOrderTracker} className="flex items-center gap-1.5 whitespace-nowrap transition hover:text-brand-400">
              <i className="fa-solid fa-truck-fast" aria-hidden="true" /> Seguimiento de Pedido
            </button>
          </div>
          <div className="ml-auto flex items-center gap-5">
            <button type="button" onClick={onOpenBuilder} className="flex items-center gap-1.5 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 font-bold text-brand-400 transition hover:bg-brand-500/20">
              <i className="fa-solid fa-screwdriver-wrench" aria-hidden="true" /> Arma tu PC
            </button>
            <button type="button" onClick={() => onToast('Horario de tiendas: Lunes a Sábado 9:00am - 8:00pm')} className="hidden transition hover:text-slate-200 sm:inline">
              Tiendas Físicas
            </button>
          </div>
        </div>
      </div>

      <header className="glass-header sticky top-0 z-40 border-b border-slate-800/80">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4 lg:gap-8">
            <a href="#inicio" className="group flex flex-shrink-0 items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-accent text-2xl font-black text-slate-950 shadow-lg shadow-brand-500/20 transition group-hover:scale-105">
                <i className="fa-solid fa-bolt-lightning" aria-hidden="true" />
              </span>
              <span className="font-display text-2xl font-extrabold tracking-tight text-white">Nova<span className="text-brand-400">Tech</span></span>
            </a>

            <div className="group relative hidden lg:block">
              <button type="button" className="flex items-center gap-2.5 rounded-xl border border-slate-700/80 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800">
                <i className="fa-solid fa-grid-2 text-brand-400" aria-hidden="true" /> Categorías
                <i className="fa-solid fa-chevron-down text-xs text-slate-400 transition group-hover:rotate-180" aria-hidden="true" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-64 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
                <div className="space-y-1 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl">
                  {categories.map((category) => (
                    <button key={category.id} type="button" onClick={() => applyCategory(category.id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-brand-400">
                      <i className={`fa-solid ${category.icon} w-5 text-center text-brand-400`} aria-hidden="true" />
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative max-w-2xl flex-1">
              <form onSubmit={submitSearch} className="relative">
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setSearchOpen(Boolean(event.target.value.trim()))
                  }}
                  onFocus={() => setSearchOpen(Boolean(search.trim()))}
                  placeholder="Buscar procesadores, RTX 4080, laptops OLED..."
                  aria-label="Buscar productos"
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/90 py-3 pl-11 pr-20 text-sm text-slate-100 transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-brand-400">Buscar</button>
              </form>
              {searchOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl">
                  {results.length ? results.slice(0, 5).map((product) => (
                    <button key={product.id} type="button" onClick={() => {
                      onSearch(product.name)
                      setSearch(product.name)
                      setSearchOpen(false)
                      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
                    }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800">
                      <i className={`fa-solid ${product.icon} text-brand-400`} aria-hidden="true" />
                      <span className="truncate">{product.name}</span>
                    </button>
                  )) : <p className="px-3 py-2 text-sm text-slate-400">No encontramos coincidencias.</p>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <button type="button" aria-haspopup="true" onClick={() => setAccountOpen((open) => !open)} className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800/60 hover:text-brand-400 sm:px-3">
                  <i className="fa-regular fa-circle-user text-xl" aria-hidden="true" />
                  <span className="hidden max-w-[120px] truncate md:inline">{customer?.name ?? 'Mi Cuenta'}</span>
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl">
                    {customer && <p className="truncate border-b border-slate-800 px-3 py-2 text-xs text-slate-400">{customer.email}</p>}
                    <button type="button" onClick={() => {
                      setAccountOpen(false)
                      onOpenAccount()
                    }} className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800">
                      <i className="fa-regular fa-user mr-2" aria-hidden="true" /> {customer ? 'Ver cuenta' : 'Iniciar sesión / Crear cuenta'}
                    </button>
                    {/* La visibilidad mejora la navegación; el backend también verifica el permiso. */}
                    {customer?.isAdmin && <button type="button" onClick={() => {
                      setAccountOpen(false)
                      onOpenProductAdmin()
                    }} className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-brand-300 hover:bg-slate-800">
                      <i className="fa-solid fa-boxes-stacked mr-2" aria-hidden="true" /> Administrar productos
                    </button>}
                    {customer && <button type="button" onClick={() => onToast('Para cerrar sesión, abre Mi Cuenta.')} className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800">Administrar cuenta</button>}
                  </div>
                )}
              </div>
              <button type="button" aria-label="Abrir carrito" onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 rounded-xl bg-slate-800/80 px-3 py-2.5 text-slate-100 transition hover:bg-slate-700">
                <i className="fa-solid fa-bag-shopping text-lg" aria-hidden="true" />
                <span className="hidden text-sm font-medium sm:inline">Carrito</span>
                {cartCount > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-black text-slate-950">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
