export interface Customer {
  name: string
  email: string
  isAdmin?: boolean
}

// Forma mínima de la respuesta que debe entregar el servidor de autenticación.
interface AuthResponse {
  access_token: string
  user: Customer
}

// Comprueba campos públicos antes de confiar en el JSON recibido.
function isCustomer(data: unknown): data is Customer {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    typeof data.name === 'string' &&
    data.name.length > 0 &&
    'email' in data &&
    typeof data.email === 'string' &&
    data.email.length > 0 &&
    (!('isAdmin' in data) || typeof data.isAdmin === 'boolean')
  )
}

const API_URL = import.meta.env.VITE_API_URL ?? 'https://mini-backend-pm9f.onrender.com/api'
// Se conserva en memoria para evitar persistir el JWT en el almacenamiento del navegador.
let accessToken: string | null = null

// Verifica que la respuesta incluya tanto el token como una cuenta válida.
function isAuthResponse(data: unknown): data is AuthResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'access_token' in data &&
    typeof data.access_token === 'string' &&
    data.access_token.length > 0 &&
    'user' in data &&
    isCustomer(data.user)
  )
}

// Comparte el envío y manejo de errores para registro e inicio de sesión.
async function authenticate(path: 'register' | 'login', credentials: Record<string, string>): Promise<Customer> {
  const response = await fetch(`${API_URL}/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new Error('El servidor devolvió una respuesta no válida.')
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string'
        ? data.error
        : `No se pudo autenticar la cuenta (HTTP ${response.status}).`
    throw new Error(message)
  }
  if (!isAuthResponse(data)) {
    throw new Error('El servidor devolvió datos de autenticación no válidos.')
  }

  accessToken = data.access_token
  return { ...data.user, isAdmin: data.user.isAdmin === true }
}

// Crea la cuenta y conserva la sesión que devuelve el backend.
export function registerAccount(name: string, email: string, password: string): Promise<Customer> {
  return authenticate('register', { name, email, password })
}

// Verifica las credenciales y conserva el JWT devuelto por el servidor.
export function loginAccount(email: string, password: string): Promise<Customer> {
  return authenticate('login', { email, password })
}

// Actualiza los datos del perfil usando el token de la sesión activa.
async function updateAccountRequest(path: string, body: Record<string, string>): Promise<unknown> {
  const response = await fetch(`${API_URL}/auth/${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  })
  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string'
        ? data.error
        : `No se pudo actualizar la cuenta (HTTP ${response.status}).`
    throw new Error(message)
  }
  return data
}

// Verifica la respuesta del backend antes de actualizar el perfil en pantalla.
export async function updateAccount(name: string, email: string): Promise<Customer> {
  const data = await updateAccountRequest('me', { name, email })
  if (
    typeof data !== 'object' ||
    data === null ||
    !('user' in data) ||
    !isCustomer(data.user)
  ) {
    throw new Error('El servidor devolvió datos de cuenta no válidos.')
  }
  return { ...data.user, isAdmin: data.user.isAdmin === true }
}

// Solicita el borrado de la cuenta y olvida el JWT si el servidor confirma.
export async function deleteAccount(password: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ password }),
  })
  const data: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string'
        ? data.error
        : `No se pudo eliminar la cuenta (HTTP ${response.status}).`
    throw new Error(message)
  }
  accessToken = null
}

// Termina la sesión local; un JWT ya copiado vence según el plazo del backend.
export function clearAuthToken(): void {
  accessToken = null
}

// Devuelve el encabezado Bearer para endpoints protegidos.
export function getAuthHeaders(): Record<string, string> {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
}
