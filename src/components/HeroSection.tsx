import { useEffect, useState } from 'react'
import type { Product } from '../data/products'
import { formatSoles } from '../utils/currency'

interface HeroSectionProps {
  featuredProduct: Product | null
  onAddToCart: () => void
}

export function HeroSection({ featuredProduct, onAddToCart }: HeroSectionProps) {
  // Mantiene visible una cuenta regresiva de demostración para la oferta.
  const [secondsLeft, setSecondsLeft] = useState(5 * 60 * 60 + 42 * 60 + 18)

  useEffect(() => {
    // Actualiza el reloj cada segundo y detiene el temporizador al desmontarse.
    const timer = window.setInterval(() => setSecondsLeft((seconds) => (seconds > 0 ? seconds - 1 : 12 * 60 * 60)), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')

  // Presenta la promoción principal y el acceso rápido para añadirla al carrito.
  return (
    <section id="inicio" className="hero-glow relative overflow-hidden border-b border-slate-800/80 py-10 md:py-16">
      <div className="relative z-10 mx-auto grid max-w-screen-2xl grid-cols-1 items-center gap-8 px-4 lg:grid-cols-12 sm:px-6 lg:px-8">
        <div className="space-y-6 lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-400">
            <i className="fa-solid fa-fire text-amber-400" aria-hidden="true" /> OFERTA RELÁMPAGO DE HOY
          </span>
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Potencia Absoluta <br />
            <span className="bg-gradient-to-r from-brand-400 via-brand-accent to-emerald-200 bg-clip-text text-transparent">{featuredProduct?.name ?? 'Catálogo NovaTech'}</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Experimenta gráficos ultrareales en 4K con trazado de rayos de 3ra generación y DLSS 3.5. Disponible con garantía extendida en NovaTech.
          </p>
          <div className="flex flex-wrap items-center gap-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">La oferta termina en:</span>
            <div className="flex gap-2 text-center font-mono">
              {[`${hours}h`, `${minutes}m`, `${seconds}s`].map((time) => <span key={time} className="rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-1 text-sm font-bold text-brand-400">{time}</span>)}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 pt-2">
            <div>
              <span className="block text-xs text-slate-400">Precio Exclusivo</span>
              <span className="font-display text-3xl font-extrabold text-emerald-400">{featuredProduct ? formatSoles(featuredProduct.price) : 'Cargando...'}</span>
              {featuredProduct?.oldPrice && <span className="ml-2 text-xs text-slate-500 line-through">{formatSoles(featuredProduct.oldPrice)}</span>}
            </div>
            <button type="button" onClick={onAddToCart} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-4 font-extrabold text-slate-950 shadow-xl shadow-brand-500/20 transition hover:from-brand-400 hover:to-brand-500 active:scale-95">
              <i className="fa-solid fa-cart-plus" aria-hidden="true" /> Añadir Oferta al Carrito
            </button>
          </div>
        </div>
        <div className="relative flex justify-center lg:col-span-5">
          <div className="relative flex aspect-square w-full max-w-md flex-col justify-between overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-8 shadow-2xl">
            <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="z-10 flex items-center justify-between text-xs">
              <span className="rounded-full border border-brand-500/30 bg-brand-500/20 px-3 py-1 font-bold text-brand-300">Stock Disponible</span>
              <span className="text-slate-400"><i className="fa-solid fa-star mr-1 text-amber-400" aria-hidden="true" /> 4.9 / 5</span>
            </div>
            <div className="animate-float relative my-4 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-white">
              {featuredProduct ? (
                <img src={featuredProduct.image} alt={featuredProduct.name} className="h-full w-full object-contain p-2" />
              ) : (
                <i className="fa-solid fa-image text-5xl text-slate-400" aria-hidden="true" />
              )}
            </div>
            <div className="z-10 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4 backdrop-blur-md">
              <div>
                <h2 className="text-sm font-bold text-slate-100">{featuredProduct?.name ?? 'Producto destacado'}</h2>
                <p className="text-xs text-slate-400">{featuredProduct?.badge ?? 'Catálogo de productos'}</p>
              </div>
              {featuredProduct && <span className="rounded-lg bg-brand-500/10 px-2.5 py-1 text-xs font-bold text-brand-400">{formatSoles(featuredProduct.price)}</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
