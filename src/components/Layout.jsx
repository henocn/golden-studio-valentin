import FloatingHearts from './FloatingHearts'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Layout({ children }) {
  const { player, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen relative">
      <FloatingHearts />

      {player && (
        <header className="relative z-10 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-pulse-heart">💕</span>
            <h1 className="text-xl font-bold bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Studio Valentin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-rose-600 font-medium">
              {player.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-rose-500 transition-colors cursor-pointer"
            >
              Déconnexion
            </button>
          </div>
        </header>
      )}

      <main
        className="relative z-10 flex items-center justify-center px-4 py-8"
        style={{ minHeight: player ? 'calc(100vh - 72px)' : '100vh' }}
      >
        {children}
      </main>
    </div>
  )
}
