interface FooterProps {
  onToast: (message: string) => void
  onOrderTracker: () => void
}

export function Footer({ onToast, onOrderTracker }: FooterProps) {
  const showSocialMessage = () => onToast('Redes sociales NovaTech')

  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 px-4 py-12 text-slate-400 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 font-black text-slate-950"><i className="fa-solid fa-bolt-lightning" aria-hidden="true" /></span><span className="font-display text-xl font-bold text-white">NovaTech</span></div>
          <p className="text-xs leading-relaxed">Tienda especializada en hardware de alto rendimiento, laptops gamer y componentes de cómputo. Garantía directa y comprobante electrónico.</p>
          <div className="pt-2">
            <span className="mb-2 block text-xs font-semibold text-slate-300">Métodos de Pago Aceptados:</span>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-200">
              <span className="rounded border border-purple-700 bg-purple-900/60 px-2 py-1">YAPE</span><span className="rounded border border-cyan-700 bg-cyan-900/60 px-2 py-1">PLIN</span><span className="rounded border border-blue-700 bg-blue-900/60 px-2 py-1">BBVA</span><span className="rounded border border-emerald-700 bg-emerald-900/60 px-2 py-1">INTERBANK</span><span className="rounded border border-slate-700 bg-slate-800 px-2 py-1">PAGOEFECTIVO</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Atención al Cliente</h2>
          <ul className="space-y-2 text-xs">
            <li><button type="button" onClick={() => onToast('Facturación electrónica lista')} className="hover:text-brand-400">Comprobante Electrónico</button></li>
            <li><button type="button" onClick={onOrderTracker} className="hover:text-brand-400">Seguimiento de Despacho</button></li>
            <li><button type="button" onClick={() => onToast('Términos de garantía NovaTech')} className="hover:text-brand-400">Políticas de Garantía</button></li>
            <li><button type="button" onClick={() => onToast('Libro de Reclamaciones Virtual')} className="hover:text-brand-400">Libro de Reclamaciones</button></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Sedes Físicas</h2>
          <ul className="space-y-2 text-xs">
            <li><i className="fa-solid fa-location-dot mr-1.5 text-brand-400" aria-hidden="true" /> Av. Rivera Navarrete 420 - San Isidro</li><li><i className="fa-solid fa-location-dot mr-1.5 text-brand-400" aria-hidden="true" /> CC. Jockey Plaza - Nivel 2</li><li><i className="fa-solid fa-location-dot mr-1.5 text-brand-400" aria-hidden="true" /> Av. Petit Thouars 5300 - Miraflores</li><li><i className="fa-solid fa-location-dot mr-1.5 text-brand-400" aria-hidden="true" /> Av. Ejército 710 - Arequipa</li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Contacto Directo</h2>
          <ul className="space-y-2 text-xs">
            <li><i className="fa-solid fa-phone mr-2 text-brand-400" aria-hidden="true" /> (01) 708-9999 (Central)</li><li><i className="fa-brands fa-whatsapp mr-2 text-emerald-400" aria-hidden="true" /> +51 987 654 321 (WhatsApp)</li><li><i className="fa-solid fa-envelope mr-2 text-brand-400" aria-hidden="true" /> ventas@novatech.com</li><li><i className="fa-solid fa-clock mr-2 text-brand-400" aria-hidden="true" /> Lun - Sáb: 9:00 am - 8:00 pm</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-screen-2xl flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row">
        <p>© 2026 NovaTech S.A.C. Todos los derechos reservados.</p>
        <div className="flex space-x-4 text-base">
          <button type="button" onClick={showSocialMessage} aria-label="Facebook" className="hover:text-brand-400"><i className="fa-brands fa-facebook" aria-hidden="true" /></button>
          <button type="button" onClick={showSocialMessage} aria-label="Instagram" className="hover:text-brand-400"><i className="fa-brands fa-instagram" aria-hidden="true" /></button>
          <button type="button" onClick={showSocialMessage} aria-label="TikTok" className="hover:text-brand-400"><i className="fa-brands fa-tiktok" aria-hidden="true" /></button>
        </div>
      </div>
    </footer>
  )
}
