import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiFetch, ApiError } from '../api/apiFetch'
import { useAuth } from '../auth/AuthContext'

interface LoginResponse {
  accessToken: string
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/perfil'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const result = await apiFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      login(result.accessToken) // el token queda SOLO en memoria
      navigate(from, { replace: true })
    } catch (err) {
      // 401 = credenciales incorrectas (mensaje genérico), 429 = demasiados intentos
      setError(err instanceof ApiError ? `${err.status}: ${err.message}` : 'Error de red')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card">
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Correo
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="alert error">{error}</p>}
        <button disabled={busy}>Entrar</button>
      </form>
    </section>
  )
}
