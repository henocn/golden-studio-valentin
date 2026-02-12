import { motion } from 'framer-motion'

export default function RevealPhase({
  players,
  votes,
  currentPhrase,
  phrases,
  isAdmin,
  onNext,
}) {
  const author = players.find((p) => p.player_id === currentPhrase?.player_id)
  const correctVoters = votes.filter(
    (v) => v.voted_for_id === currentPhrase?.player_id
  )
  const correctVoterNames = correctVoters
    .map((v) => {
      const p = players.find((pl) => pl.player_id === v.voter_id)
      return p?.player?.name
    })
    .filter(Boolean)

  // Count remaining phrases
  const usedCount = phrases.filter((p) => p.used).length
  const totalPhrases = phrases.length
  const remaining = totalPhrases - usedCount

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 w-full"
    >
      <div className="text-center mb-6">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-5xl inline-block"
        >
          🎭
        </motion.span>
        <h2 className="text-xl font-bold mt-3 text-gray-800">Révélation !</h2>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="bg-linear-to-br from-rose-100 to-pink-100 rounded-2xl p-6 text-center border-2 border-rose-300"
      >
        <p className="text-sm text-gray-500 mb-2">La phrase était de...</p>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
            {author?.player?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-2xl font-bold text-rose-600">
            {author?.player?.name}
          </span>
        </div>
        <p className="text-gray-600 italic text-sm">
          &ldquo;{currentPhrase?.content}&rdquo;
        </p>
      </motion.div>

      {correctVoterNames.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 p-4 bg-green-50 rounded-xl text-center"
        >
          <p className="text-green-700 font-medium">
            🎯 Bravo {correctVoterNames.join(', ')} !
          </p>
          <p className="text-sm text-green-600 mt-1">
            +1 point pour avoir trouvé le bon auteur
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 p-4 bg-amber-50 rounded-xl text-center"
        >
          <p className="text-amber-700 font-medium">
            😮 Personne n'a deviné !
          </p>
        </motion.div>
      )}

      <p className="text-center text-xs text-gray-400 mt-4">
        {remaining > 0
          ? `${remaining} phrase${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}`
          : 'Dernière phrase !'}
      </p>

      {isAdmin && (
        <button onClick={onNext} className="btn-primary w-full mt-4">
          {remaining > 0
            ? '➡️ Phrase suivante'
            : '🏆 Voir le classement final'}
        </button>
      )}

      {!isAdmin && (
        <div className="text-center mt-4 p-3 bg-rose-50/50 rounded-xl">
          <p className="text-sm text-gray-500">
            {remaining > 0
              ? "L'admin passe à la phrase suivante..."
              : "L'admin va afficher le classement..."}
          </p>
        </div>
      )}
    </motion.div>
  )
}
