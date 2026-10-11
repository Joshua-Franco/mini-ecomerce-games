import { useState } from 'react'
import { loginAccount, registerAccount } from '../api/auth'
import type { Customer } from '../api/auth'

interface AccountModalProps {
  open: boolean
  customer: Customer | null
  onClose: () => void
  onLogin: (customer: Customer) => void
  onUpdateAccount: (name: string, email: string) => Promise<Customer>
  onDeleteAccount: (password: string) => Promise<void>
  onLogout: () => void
}

export function AccountModal({
  open,
  customer,
  onClose,
  onLogin,
  onUpdateAccount,
  onDeleteAccount,
  onLogout,
}: AccountModalProps) {
  // Controla el formulario de acceso/registro y sus errores de validación.
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editingAccount, setEditingAccount] = useState(false)

  if (!open) return null

  // Valida registro o inicio de sesión y muestra los errores del servidor.
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    const password = String(formData.get('password') ?? '')

    if (tab === 'register') {
      // Verifica todos los campos antes de guardar una cuenta nueva.
      const name = String(formData.get('name') ?? '').trim()
      const confirmation = String(formData.get('confirmation') ?? '')
      if (name.length < 2) return setError('Ingresa tu nombre completo.')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setError('Ingresa un correo válido.')
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return setError('Usa al menos 8 caracteres, con letras y números.')
      if (password !== confirmation) return setError('Las contraseñas no coinciden.')
      if (!formData.get('terms')) return setError('Debes aceptar los términos y condiciones.')
      setSubmitting(true)
      try {
        onLogin(await registerAccount(name, email, password))
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'No se pudo crear la cuenta.')
      } finally {
        setSubmitting(false)
      }
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setError('Ingresa un correo válido.')
    setSubmitting(true)
    try {
      onLogin(await loginAccount(email, password))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo iniciar sesión.')
    } finally {
      setSubmitting(false)
    }
  }

  // Envía los cambios del perfil con la sesión autenticada.
  const submitAccountUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    if (name.length < 2) return setError('Ingresa tu nombre completo.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setError('Ingresa un correo válido.')

    setSubmitting(true)
    try {
      await onUpdateAccount(name, email)
      setEditingAccount(false)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo actualizar la cuenta.')
    } finally {
      setSubmitting(false)
    }
  }

  // Solicita la contraseña actual para confirmar el borrado permanente.
  const submitAccountDeletion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('delete-password') ?? '')
    setSubmitting(true)
    try {
      await onDeleteAccount(password)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar la cuenta.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="auth-title" className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 id="auth-title" className="font-display text-xl font-bold text-white">{customer ? `Hola, ${customer.name}` : tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
            <p className="mt-1 text-xs text-slate-400">{customer ? customer.email : 'Tu cuenta se guarda de forma segura en el servidor'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-lg text-slate-400 hover:text-white"><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
        </div>
        {customer ? (
          <div className="space-y-4 p-6 pt-0">
            <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200">La sesión usa un token temporal guardado solo en memoria y se cerrará al recargar la página.</p>
            {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}
            {editingAccount ? (
              <form onSubmit={submitAccountUpdate} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-400">Nombre completo<input name="name" defaultValue={customer.name} required minLength={2} maxLength={120} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none" /></label>
                <label className="block text-xs font-semibold text-slate-400">Correo electrónico<input name="email" type="email" defaultValue={customer.email} required className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none" /></label>
                <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-brand-500 py-3 font-bold text-slate-950 disabled:opacity-60">{submitting ? 'Guardando...' : 'Guardar cambios'}</button>
                <button type="button" disabled={submitting} onClick={() => { setEditingAccount(false); setError('') }} className="w-full rounded-2xl bg-slate-800 py-3 font-bold text-slate-100 hover:bg-slate-700">Cancelar</button>
              </form>
            ) : (
              <>
                <button type="button" onClick={() => { setEditingAccount(true); setError('') }} className="w-full rounded-2xl bg-brand-500 py-3 font-bold text-slate-950 hover:bg-brand-400">Editar cuenta</button>
                <button type="button" onClick={onLogout} className="w-full rounded-2xl bg-slate-800 py-3 font-bold text-slate-100 hover:bg-slate-700">Cerrar sesión</button>
                <details className="rounded-2xl border border-red-500/30 p-4">
                  <summary className="cursor-pointer text-sm font-bold text-red-300">Eliminar cuenta</summary>
                  <p className="mt-3 text-xs text-slate-400">Esta acción es permanente. Confirma tu contraseña para eliminar la cuenta.</p>
                  <form onSubmit={submitAccountDeletion} className="mt-3 space-y-3">
                    <label className="block text-xs font-semibold text-slate-400">Contraseña actual<input name="delete-password" type="password" required autoComplete="current-password" className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none" /></label>
                    <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-red-600 py-3 font-bold text-white hover:bg-red-500 disabled:opacity-60">{submitting ? 'Eliminando...' : 'Confirmar eliminación'}</button>
                  </form>
                </details>
              </>
            )}
          </div>
        ) : (
          <div className="px-6">
            <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-800 bg-slate-950 p-1">
              <button type="button" disabled={submitting} onClick={() => { setTab('login'); setError('') }} className={`rounded-xl py-2 text-xs font-bold transition ${tab === 'login' ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Iniciar sesión</button>
              <button type="button" disabled={submitting} onClick={() => { setTab('register'); setError('') }} className={`rounded-xl py-2 text-xs font-bold transition ${tab === 'register' ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Crear cuenta</button>
            </div>
            <p role="alert" className={`mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 ${error ? '' : 'hidden'}`}>{error}</p>
            <form onSubmit={submit} className="space-y-4 py-6">
              {tab === 'register' && <label className="block text-xs font-semibold text-slate-400">Nombre completo<input name="name" autoComplete="name" required placeholder="Ej. Ana Torres" className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none" /></label>}
              <label className="block text-xs font-semibold text-slate-400">Correo electrónico<input name="email" type="email" autoComplete="email" required placeholder="tucorreo@ejemplo.com" className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none" /></label>
              <label className="block text-xs font-semibold text-slate-400">Contraseña<input name="password" type="password" autoComplete={tab === 'login' ? 'current-password' : 'new-password'} required placeholder={tab === 'login' ? '••••••••' : 'Mínimo 8 caracteres'} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none" /></label>
              {tab === 'register' && <>
                <label className="block text-xs font-semibold text-slate-400">Repite tu contraseña<input name="confirmation" type="password" autoComplete="new-password" required className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none" /></label>
                <label className="flex items-start gap-2 text-xs text-slate-400"><input name="terms" type="checkbox" className="mt-0.5 accent-emerald-500" /> Acepto los términos y condiciones de NovaTech.</label>
              </>}
              <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-brand-500 py-3 font-extrabold text-slate-950 transition hover:bg-brand-400 disabled:cursor-wait disabled:opacity-60">{submitting ? 'Conectando...' : tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</button>
              <p className="text-center text-xs text-slate-400">El servidor protege tu contraseña y tu sesión termina al recargar.</p>
            </form>
          </div>
        )}
      </section>
    </div>
  )
}
