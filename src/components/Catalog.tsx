import type { Product } from '../data/products'
import { products } from '../data/products'
import { ProductCard } from './ProductCard'

interface CatalogProps {
  category: string
  search: string
  onCategoryChange: (category: string) => void
  onOpenProduct: (id: number) => void
  onToast: (message: string) => void
}

const filters = [
  ['all', 'Todos'],
  ['laptop', 'Laptops Gamer'],
  ['gpu', 'Tarjetas Gráficas'],
  ['cpu', 'Procesadores'],
  ['monitor', 'Monitores'],
  ['storage', 'Almacenamiento'],
  ['peripherals', 'Periféricos'],
]

export function Catalog({ category, search, onCategoryChange, onOpenProduct, onToast }: CatalogProps) {
  const visibleProducts: Product[] = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category
    const matchesSearch = !search.trim() || `${product.name} ${product.specs} ${product.badge}`.toLowerCase().includes(search.trim().toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section id="catalogo" className="mx-auto max-w-screen-2xl scroll-mt-28 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">Catálogo de Productos NovaTech (S/.)</h2>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">Precios en Soles con IGV incluido • Garantía local de 12 a 36 meses</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {filters.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onCategoryChange(id)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs transition ${category === id ? 'bg-brand-500 font-bold text-slate-950' : 'border border-slate-800 bg-slate-900 font-semibold text-slate-300 hover:bg-slate-800'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {visibleProducts.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={() => onOpenProduct(product.id)} onToast={onToast} />)}
        </div>
      ) : (
        <div className="col-span-full py-12 text-center text-slate-500">
          <i className="fa-solid fa-magnifying-glass mb-3 block text-4xl" aria-hidden="true" />
          <p className="text-sm">No encontramos productos coincidentes.</p>
        </div>
      )}
    </section>
  )
}
