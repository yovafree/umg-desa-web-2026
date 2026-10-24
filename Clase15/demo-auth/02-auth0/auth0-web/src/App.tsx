import { useAuth0 } from '@auth0/auth0-react'
import { config } from './config'

export default function App() {
  const { isLoading, isAuthenticated } = useAuth0()

  return (
    <main className="container">
      <section className="card">
        <h1>Demo Auth · Auth0</h1>
        <p>
          Tenant: <code>{config.domain}</code> · Audience: <code>{config.audience}</code>
        </p>
        <p>{isLoading ? 'Cargando sesión…' : isAuthenticated ? '✅ Sesión iniciada' : '❌ Sin sesión'}</p>
      </section>
    </main>
  )
}
