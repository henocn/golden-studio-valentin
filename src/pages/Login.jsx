import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Heart, KeyRound, User } from 'lucide-react'

export default function Login() {
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) return setError('Le nom est requis')
    if (!/^\d{4}$/.test(pin))
      return setError('Le code PIN doit contenir exactement 4 chiffres')

    setLoading(true)
    try {
      await login(name.trim(), pin)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="glass-card p-8">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 mx-auto text-rose-500 fill-rose-500 animate-pulse-heart" />
          <h2 className="text-2xl font-bold mt-4 bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            Connexion
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Content de te revoir, beau gosse !</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <User className="w-4 h-4" /> Ton prénom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Ex: Hadassa"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <KeyRound className="w-4 h-4" /> Code PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
              }
              className="input-field text-center text-2xl tracking-[0.5em]"
              placeholder="● ● ● ●"
              maxLength={4}
              inputMode="numeric"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center bg-red-50 rounded-lg p-2"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <Link
            to="/register"
            className="text-rose-500 font-medium hover:text-rose-600"
          >
            S'inscrire
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
