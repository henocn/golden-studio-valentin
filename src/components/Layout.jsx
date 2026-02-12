import FloatingHearts from './FloatingHearts'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Heart, LogOut, User } from 'lucide-react'

export default function Layout({ children }) {
  const { player, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen relative hadassa-watermark">
      <FloatingHearts />

      {player && (
        <header className="relative z-10 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse-heart" />
            <h1 className="text-xl font-bold bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Studio Valentin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-rose-600 font-medium">
              <User className="w-4 h-4" />
              {player.name}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-rose-500 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Quitter
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
