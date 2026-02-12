import { motion } from 'framer-motion'

export default function ReadingPhase({ currentPhrase, isAdmin, onStartVoting }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 w-full"
    >
      <div className="text-center mb-6">
        <span className="text-4xl">📖</span>
        <h2 className="text-xl font-bold mt-3 text-gray-800">
          La phrase mystère
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isAdmin
            ? 'Lis cette phrase à voix haute !'
            : "L'admin va lire la phrase..."}
        </p>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-linear-to-br from-rose-50 to-pink-50 rounded-2xl p-8 text-center border border-rose-200"
      >
        <p className="text-xl font-medium text-gray-800 leading-relaxed italic">
          &ldquo;{currentPhrase?.content}&rdquo;
        </p>
      </motion.div>

      <p className="text-center text-sm text-gray-400 mt-4">
        Qui a bien pu écrire ça ? 🤔
      </p>

      {isAdmin && (
        <button onClick={onStartVoting} className="btn-primary w-full mt-6">
          🗳️ Lancer le vote !
        </button>
      )}

      {!isAdmin && (
        <div className="text-center mt-6 p-3 bg-rose-50/50 rounded-xl">
          <p className="text-sm text-gray-500">
            L'admin va bientôt lancer le vote...
          </p>
        </div>
      )}
    </motion.div>
  )
}
