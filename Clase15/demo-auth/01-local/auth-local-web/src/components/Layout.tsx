import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Layout() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <>
      <header className="navbar">
        <strong>🔐 Demo Auth · Local</strong>
        <nav>
          <NavLink to="/">Inicio</NavLink>
          {isAuthenticated && <button onClick={logout}>Cerrar sesión</button>}
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  )
}
