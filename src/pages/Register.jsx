import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function Register() {
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) return setError('Le nom est requis')
    if (!/^\d{4}$/.test(pin))
      return setError('Le code PIN doit contenir exactement 4 chiffres')

    setLoading(true)
    try {
      await register(name.trim(), pin)
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
          <span className="text-5xl animate-pulse-heart inline-block">💖</span>
          <h2 className="text-2xl font-bold mt-4 bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            Créer un compte
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Rejoins la partie !</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Ton prénom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Ex: Marie"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Code PIN (4 chiffres)
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
            {loading ? 'Création...' : "S'inscrire"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Déjà un compte ?{' '}
          <Link
            to="/login"
            className="text-rose-500 font-medium hover:text-rose-600"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
