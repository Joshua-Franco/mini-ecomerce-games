import { useEffect, useState } from 'react'
import { AccountModal, type Customer } from './components/AccountModal'
import { CartDrawer } from './components/CartDrawer'
import { Catalog } from './components/Catalog'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { PcBuilder } from './components/PcBuilder'
import { ProductModal } from './components/ProductModal'
import { Toast } from './components/Toast'
import { products } from './data/products'
import { useCartStore } from './store/useCartStore'
import { formatSoles } from './utils/currency'

function App() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [builderOpen, setBuilderOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [customer, setCustomer] = useState<Customer | null>(() => {
    const saved = localStorage.getItem('novatech_customer_v1')
    return saved ? (JSON.parse(saved) as Customer) : null
  })
  const [toastMessage, setToastMessage] = useState('')
  const [checkoutAfterLogin, setCheckoutAfterLogin] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const cart = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const setCartOpen = useCartStore((state) => state.setOpen)

  const showToast = (message: string) => setToastMessage(message)

  useEffect(() => {
    if (!toastMessage) return
    const timeout = window.setTimeout(() => setToastMessage(''), 3000)
    return () => window.clearTimeout(timeout)
  }, [toastMessage])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setBuilderOpen(false)
      setSelectedProductId(null)
      setAccountOpen(false)
      setCartOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [setCartOpen])

  const handleLogin = (newCustomer: Customer) => {
    setCustomer(newCustomer)
    localStorage.setItem('novatech_customer_v1', JSON.stringify(newCustomer))
    setAccountOpen(false)
    showToast(`¡Hola, ${newCustomer.name.split(' ')[0]}!`)
    if (checkoutAfterLogin) {
      setCheckoutAfterLogin(false)
      window.setTimeout(() => void checkout(newCustomer), 0)
    }
  }

  const checkout = async (signedInCustomer = customer) => {
    if (checkingOut) return
    if (cart.length === 0) {
      showToast('El carrito está vacío')
      return
    }
    if (!signedInCustomer) {
      setCheckoutAfterLogin(true)
      setCartOpen(false)
      setAccountOpen(true)
      showToast('Inicia sesión para finalizar tu compra')
      return
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    const orderCode = `NT-${String(Date.now()).slice(-6)}`
    setCheckingOut(true)
    showToast('Procesando pago de demostración...')
    await new Promise((resolve) => window.setTimeout(resolve, 900))
    clearCart()
    setCartOpen(false)
    setCheckingOut(false)
    showToast(`¡Gracias, ${signedInCustomer.name.split(' ')[0]}! Pedido ${orderCode} por ${formatSoles(total)} confirmado.`)
  }

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? null

  return (
    <div className="min-h-screen overflow-x-hidden bg-dark-bg text-slate-100">
      <Header
        customer={customer}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenBuilder={() => setBuilderOpen(true)}
        onCategoryChange={setCategory}
        onSearch={setSearch}
        onToast={showToast}
        onOrderTracker={() => showToast('Ingresa tu código de boleta para rastrear el despacho')}
      />
      <main>
        <HeroSection onAddToCart={() => {
          if (useCartStore.getState().addProduct(products[0])) showToast(`Añadido: ${products[0].name}`)
          else showToast('Máximo 10 unidades por producto')
        }} />
        <Catalog
          category={category}
          search={search}
          onCategoryChange={setCategory}
          onOpenProduct={(id) => setSelectedProductId(id)}
          onToast={showToast}
        />
        <section className="my-10 border-y border-slate-800 bg-slate-900/60 py-12">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-slate-700/60 bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 p-8 shadow-2xl sm:p-12 lg:flex-row">
              <div className="max-w-2xl space-y-4">
                <span className="rounded-full border border-brand-500/20 bg-brand-500/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-brand-400">
                  Configurador Virtual NovaTech
                </span>
                <h2 className="font-display text-2xl font-extrabold text-white sm:text-4xl">Arma tu PC Gamer a Medida (S/.)</h2>
                <p className="text-sm leading-relaxed text-slate-300">
                  Selecciona tus componentes favoritos. Nuestro configurador te ayuda a elegir procesador, gráfica,
                  memoria y almacenamiento. Ensamblado y pasta térmica gratis.
                </p>
                <button
                  type="button"
                  onClick={() => setBuilderOpen(true)}
                  className="flex items-center gap-2 rounded-2xl bg-brand-500 px-7 py-3.5 font-extrabold text-slate-950 transition hover:bg-brand-400"
                >
                  <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" /> Abrir Configurador PC
                </button>
              </div>
              <div className="flex h-44 w-44 flex-shrink-0 items-center justify-center rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-400">
                <i className="fa-solid fa-computer text-7xl" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer onToast={showToast} onOrderTracker={() => showToast('Ingresa tu código de boleta para rastrear el despacho')} />
      <CartDrawer onCheckout={() => void checkout()} checkingOut={checkingOut} />
      <PcBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} onToast={showToast} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProductId(null)} onToast={showToast} />
      <AccountModal
        open={accountOpen}
        customer={customer}
        onClose={() => {
          setAccountOpen(false)
          setCheckoutAfterLogin(false)
        }}
        onLogin={handleLogin}
        onLogout={() => {
          setCustomer(null)
          localStorage.removeItem('novatech_customer_v1')
          setAccountOpen(false)
          showToast('Sesión cerrada')
        }}
      />
      <Toast message={toastMessage} />
    </div>
  )
}

export default App
