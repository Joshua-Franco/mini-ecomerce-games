import { useState } from 'react'
import { createProduct, deleteProduct, productToInput, updateProduct, type ProductInput } from '../api/adminProducts'
import type { Product } from '../data/products'

interface ProductAdminProps {
  open: boolean
  products: Product[]
  onClose: () => void
  onRefresh: () => Promise<void>
  onToast: (message: string) => void
}

// Valores iniciales para registrar un producto nuevo.
const emptyProduct = (sortOrder: number): ProductInput => ({
  sortOrder,
  name: '',
  category: 'gpu',
  price: 0,
  oldPrice: null,
  badge: '',
  icon: 'fa-box',
  specs: '',
  imageFilename: '',
})

// Panel administrativo: lista productos y permite crear, editar o eliminar.
export function ProductAdmin({ open, products, onClose, onRefresh, onToast }: ProductAdminProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductInput>(() => emptyProduct(products.length + 1))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  if (!open) return null

  // Prepara un formulario nuevo con el siguiente orden disponible.
  const startCreate = () => {
    setEditingId(null)
    setForm(emptyProduct(Math.max(0, ...products.map((product) => product.sortOrder ?? 0)) + 1))
    setError('')
  }

  // Copia los datos existentes al formulario para modificarlos.
  const startEdit = (product: Product, index: number) => {
    setEditingId(product.id)
    setForm(productToInput(product, index))
    setError('')
  }

  // Convierte los valores del formulario a tipos listos para la API.
  const updateField = (field: keyof ProductInput, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: field === 'sortOrder' || field === 'price'
        ? Number(value)
        : field === 'oldPrice'
          ? value === '' ? null : Number(value)
          : value,
    }))
  }

  // Envía el formulario y vuelve a cargar el catálogo tras guardar.
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (editingId) await updateProduct(editingId, form)
      else await createProduct(form)
      await onRefresh()
      onToast(editingId ? 'Producto actualizado' : 'Producto creado')
      startCreate()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo guardar el producto.')
    } finally {
      setSaving(false)
    }
  }

  // Pide confirmación antes de borrar y actualiza la lista después.
  const remove = async (product: Product) => {
    if (!window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return
    setError('')
    setSaving(true)
    try {
      await deleteProduct(product.id)
      await onRefresh()
      if (editingId === product.id) startCreate()
      onToast('Producto eliminado')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar el producto.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md">
      <section role="dialog" aria-modal="true" aria-labelledby="product-admin-title" className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 p-5 sm:p-6">
          <div>
            <h2 id="product-admin-title" className="font-display text-xl font-bold text-white">Administrar productos</h2>
            <p className="mt-1 text-xs text-slate-400">Solo administradores pueden modificar el catálogo.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white"><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
        </header>
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <form onSubmit={submit} className="space-y-3">
            <h3 className="text-lg font-bold text-white">{editingId ? 'Editar producto' : 'Crear producto'}</h3>
            {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-slate-400">Orden<input type="number" min="1" required value={form.sortOrder} onChange={(event) => updateField('sortOrder', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-100" /></label>
              <label className="text-xs text-slate-400">Categoría<input required maxLength={40} value={form.category} onChange={(event) => updateField('category', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-100" /></label>
            </div>
            <label className="block text-xs text-slate-400">Nombre<input required maxLength={180} value={form.name} onChange={(event) => updateField('name', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-100" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-slate-400">Precio<input type="number" min="0.01" step="0.01" required value={form.price} onChange={(event) => updateField('price', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-100" /></label>
              <label className="text-xs text-slate-400">Precio anterior<input type="number" min="0.01" step="0.01" value={form.oldPrice ?? ''} onChange={(event) => updateField('oldPrice', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-100" /></label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-slate-400">Etiqueta<input maxLength={80} value={form.badge} onChange={(event) => updateField('badge', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-100" /></label>
              <label className="text-xs text-slate-400">Icono<input required maxLength={80} value={form.icon} onChange={(event) => updateField('icon', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-100" /></label>
            </div>
            <label className="block text-xs text-slate-400">Especificaciones<input maxLength={500} value={form.specs} onChange={(event) => updateField('specs', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-100" /></label>
            <label className="block text-xs text-slate-400">Archivo de imagen (src/static/images)<input required maxLength={180} value={form.imageFilename} onChange={(event) => updateField('imageFilename', event.target.value)} placeholder="product-109.jpg" className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-100" /></label>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-60">{saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear producto'}</button>
              {editingId && <button type="button" disabled={saving} onClick={startCreate} className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-slate-200">Cancelar</button>}
            </div>
          </form>
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Catálogo ({products.length})</h3>
            <ul className="max-h-[62vh] space-y-2 overflow-y-auto pr-1">
              {products.map((product, index) => (
                <li key={product.id} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <img src={product.image} alt="" className="h-14 w-14 rounded-lg bg-slate-800 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-100">{product.name}</p>
                    <p className="text-xs text-slate-400">{product.category} · S/ {product.price.toFixed(2)}</p>
                  </div>
                  <button type="button" disabled={saving} onClick={() => startEdit(product, index)} className="rounded-lg px-3 py-2 text-xs font-bold text-brand-300 hover:bg-slate-800">Editar</button>
                  <button type="button" disabled={saving} onClick={() => void remove(product)} aria-label={`Eliminar ${product.name}`} className="rounded-lg px-3 py-2 text-xs font-bold text-red-300 hover:bg-slate-800"><i className="fa-solid fa-trash" aria-hidden="true" /></button>
                </li>
              ))}
              {products.length === 0 && <li className="rounded-xl border border-slate-800 p-4 text-sm text-slate-400">No hay productos.</li>}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
