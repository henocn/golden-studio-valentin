import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function FinalScoreboard({ players }) {
  const navigate = useNavigate()

  const ranked = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))
  const medals = ['🥇', '🥈', '🥉']

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 w-full"
    >
      <div className="text-center mb-8">
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="text-6xl inline-block"
        >
          🏆
        </motion.span>
        <h2 className="text-2xl font-bold mt-4 bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
          Classement final
        </h2>
        <p className="text-sm text-gray-500 mt-1">Merci d'avoir joué ! 💕</p>
      </div>

      <div className="space-y-3">
        {ranked.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`flex items-center gap-4 p-4 rounded-xl ${
              i === 0
                ? 'bg-linear-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 shadow-lg'
                : i === 1
                  ? 'bg-linear-to-r from-gray-50 to-slate-100 border-2 border-gray-300'
                  : i === 2
                    ? 'bg-linear-to-r from-orange-50 to-amber-50 border-2 border-orange-300'
                    : 'bg-white/60 border border-gray-100'
            }`}
          >
            <span className="text-2xl w-8 text-center">
              {i < 3 ? medals[i] : `${i + 1}.`}
            </span>
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-md">
              {p.player?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">{p.player?.name}</p>
            </div>
            <div
              className={`text-xl font-bold ${i === 0 ? 'text-yellow-600' : 'text-rose-500'}`}
            >
              {p.score || 0} pt{(p.score || 0) > 1 ? 's' : ''}
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={() => navigate('/')}
        className="btn-secondary w-full mt-8"
      >
        🏠 Retour à l'accueil
      </button>
    </motion.div>
  )
}
