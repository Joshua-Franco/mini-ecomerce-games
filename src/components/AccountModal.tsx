import { useState } from 'react'

export interface Customer {
  name: string
  email: string
}

interface StoredCustomer extends Customer {
  // Estos datos solo sirven para cuentas de demostración guardadas localmente.
  salt: string
  passwordHash: string
}

interface AccountModalProps {
  open: boolean
  customer: Customer | null
  onClose: () => void
  onLogin: (customer: Customer) => void
  onLogout: () => void
}

const USERS_KEY = 'novatech_demo_users_v1'

async function hashPassword(password: string, salt: string) {
  // Genera un hash local con sal; no reemplaza autenticación del servidor.
  const bytes = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function AccountModal({ open, customer, onClose, onLogin, onLogout }: AccountModalProps) {
  // Controla el formulario de acceso/registro y sus errores de validación.
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')

  if (!open) return null

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Lee las cuentas guardadas antes de autenticar o registrar al cliente.
    event.preventDefault()
    setError('')
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    const password = String(formData.get('password') ?? '')
    let users: StoredCustomer[] = []
    try {
      const stored = JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') as unknown
      if (Array.isArray(stored)) users = stored as StoredCustomer[]
    } catch {
      setError('No se pudieron leer las cuentas guardadas en este navegador.')
      return
    }

    if (tab === 'register') {
      // Verifica todos los campos antes de guardar una cuenta nueva.
      const name = String(formData.get('name') ?? '').trim()
      const confirmation = String(formData.get('confirmation') ?? '')
      if (name.length < 2) return setError('Ingresa tu nombre completo.')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setError('Ingresa un correo válido.')
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return setError('Usa al menos 8 caracteres, con letras y números.')
      if (password !== confirmation) return setError('Las contraseñas no coinciden.')
      if (!formData.get('terms')) return setError('Debes aceptar los términos y condiciones.')
      if (users.some((user) => user.email === email)) return setError('Ya existe una cuenta con ese correo.')
      try {
        const salt = crypto.getRandomValues(new Uint8Array(16)).join(',')
        const passwordHash = await hashPassword(password, salt)
        const newCustomer = { name, email, salt, passwordHash }
        localStorage.setItem(USERS_KEY, JSON.stringify([...users, newCustomer]))
        onLogin({ name, email })
      } catch {
        setError('No se pudo proteger o guardar la cuenta en este navegador.')
      }
      return
    }

    // En el acceso, compara el hash calculado con el registro local encontrado.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setError('Ingresa un correo válido.')
    const found = users.find((user) => user.email === email)
    if (!found) return setError('Correo o contraseña incorrectos. Si aún no tienes cuenta, crea una.')
    let passwordHash: string
    try {
      passwordHash = await hashPassword(password, found.salt)
    } catch {
      setError('No se pudo verificar la contraseña en este navegador.')
      return
    }
    if (found.passwordHash !== passwordHash) return setError('Correo o contraseña incorrectos. Si aún no tienes cuenta, crea una.')
    onLogin({ name: found.name, email: found.email })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="auth-title" className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 id="auth-title" className="font-display text-xl font-bold text-white">{customer ? `Hola, ${customer.name}` : tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
            <p className="mt-1 text-xs text-slate-400">{customer ? customer.email : 'Cuenta de demostración guardada en este navegador'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-lg text-slate-400 hover:text-white"><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
        </div>
        {customer ? (
          <div className="space-y-4 p-6 pt-0">
            <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200">Esta sesión es solo una demostración local; las cuentas se guardan en este navegador y no reemplazan autenticación de servidor.</p>
            <button type="button" onClick={onLogout} className="w-full rounded-2xl bg-slate-800 py-3 font-bold text-slate-100 hover:bg-slate-700">Cerrar sesión</button>
          </div>
        ) : (
          <div className="px-6">
            <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-800 bg-slate-950 p-1">
              <button type="button" onClick={() => { setTab('login'); setError('') }} className={`rounded-xl py-2 text-xs font-bold transition ${tab === 'login' ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Iniciar sesión</button>
              <button type="button" onClick={() => { setTab('register'); setError('') }} className={`rounded-xl py-2 text-xs font-bold transition ${tab === 'register' ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Crear cuenta</button>
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
              <button type="submit" className="w-full rounded-2xl bg-brand-500 py-3 font-extrabold text-slate-950 transition hover:bg-brand-400">{tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</button>
              <p className="text-center text-xs text-slate-400">La cuenta y la sesión se guardan solo en este navegador.</p>
            </form>
          </div>
        )}
      </section>
    </div>
  )
}
