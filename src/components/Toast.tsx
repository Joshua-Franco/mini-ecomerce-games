interface ToastProps {
  message: string
}

export function Toast({ message }: ToastProps) {
  return (
    <div role="status" aria-live="polite" className={`fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-2xl border border-brand-500/50 bg-slate-900 px-5 py-3 text-white shadow-2xl transition-all duration-300 ${message ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-20 opacity-0'}`}>
      <i className="fa-solid fa-circle-check text-lg text-brand-400" aria-hidden="true" />
      <span className="text-sm font-medium">{message || 'Notificación'}</span>
    </div>
  )
}
