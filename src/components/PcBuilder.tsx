import { useState } from 'react'
import { pcParts } from '../data/pcParts'
import { useCartStore } from '../store/useCartStore'
import { formatSoles } from '../utils/currency'

interface PcBuilderProps {
  open: boolean
  onClose: () => void
  onToast: (message: string) => void
}

export function PcBuilder({ open, onClose, onToast }: PcBuilderProps) {
  const [selection, setSelection] = useState<number[]>(pcParts.map(() => -1))
  const addCustomBuild = useCartStore((state) => state.addCustomBuild)
  if (!open) return null

  const selectedParts = selection.map((index, partIndex) => pcParts[partIndex].options[index])
  const total = selectedParts.reduce((sum, part) => sum + (part?.price ?? 0), 0)

  const addBuild = () => {
    if (selectedParts.some((part) => !part)) {
      onToast('Completa los 4 componentes para armar tu PC')
      return
    }
    const name = `PC Custom: ${selectedParts.map((part) => part?.name).join(' + ')}`
    addCustomBuild(name, total)
    setSelection(pcParts.map(() => -1))
    onClose()
    onToast('¡PC ensamblada añadida al carrito!')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="builder-title" className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h2 id="builder-title" className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <i className="fa-solid fa-screwdriver-wrench text-brand-400" aria-hidden="true" /> Configurador Personalizado (S/.)
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar configurador" className="text-lg text-slate-400 hover:text-white"><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div className="flex items-center gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4 text-xs text-brand-300">
            <i className="fa-solid fa-circle-info text-xl" aria-hidden="true" />
            <span>Los precios incluyen IGV. Ensamblado profesional y prueba incluidos sin costo adicional.</span>
          </div>
          {pcParts.map((part, partIndex) => (
            <div key={part.label}>
              <label htmlFor={`pc-part-${partIndex}`} className="mb-1 block text-xs font-semibold text-slate-400">{partIndex + 1}. {part.label}</label>
              <select
                id={`pc-part-${partIndex}`}
                value={selection[partIndex]}
                onChange={(event) => setSelection((values) => values.map((value, index) => index === partIndex ? Number(event.target.value) : value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none"
              >
                <option value={-1}>Selecciona una opción...</option>
                {part.options.map((option, optionIndex) => <option key={option.name} value={optionIndex}>{option.name} - {formatSoles(option.price)}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 bg-slate-950 p-6">
          <div><span className="block text-xs text-slate-400">Total Estimado en Soles:</span><span className="font-display text-2xl font-extrabold text-brand-400">{formatSoles(total)}</span></div>
          <button type="button" onClick={addBuild} className="rounded-2xl bg-brand-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-brand-400">Añadir Ensamble al Carrito</button>
        </div>
      </section>
    </div>
  )
}
