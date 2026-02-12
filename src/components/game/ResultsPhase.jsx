import { motion } from 'framer-motion'

export default function ResultsPhase({ players, votes, isAdmin, onReveal }) {
  // Calculate vote counts per player
  const voteCounts = {}
  votes.forEach((v) => {
    voteCounts[v.voted_for_id] = (voteCounts[v.voted_for_id] || 0) + 1
  })

  // Sort by votes descending, take top 3
  const ranked = players
    .map((p) => ({
      ...p,
      voteCount: voteCounts[p.player_id] || 0,
    }))
    .filter((p) => p.voteCount > 0)
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 3)

  const medals = ['🥇', '🥈', '🥉']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 w-full"
    >
      <div className="text-center mb-6">
        <span className="text-4xl">📊</span>
        <h2 className="text-xl font-bold mt-3 text-gray-800">
          Les plus suspects !
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Voici les joueurs les plus suspectés
        </p>
      </div>

      <div className="space-y-3">
        {ranked.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className={`flex items-center gap-4 p-4 rounded-xl ${
              i === 0
                ? 'bg-linear-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200'
                : i === 1
                  ? 'bg-linear-to-r from-gray-50 to-slate-50 border border-gray-200'
                  : 'bg-linear-to-r from-orange-50 to-amber-50 border border-orange-200'
            }`}
          >
            <span className="text-3xl">{medals[i]}</span>
            <div className="flex-1">
              <p className="font-bold text-gray-800">{p.player?.name}</p>
              <p className="text-sm text-gray-500">
                {p.voteCount} vote{p.voteCount > 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-2xl font-bold text-rose-500">
              {p.voteCount}
            </div>
          </motion.div>
        ))}

        {ranked.length === 0 && (
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-500">Aucun vote enregistré</p>
          </div>
        )}
      </div>

      {isAdmin && (
        <button onClick={onReveal} className="btn-primary w-full mt-6">
          🎭 Révéler l'auteur !
        </button>
      )}

      {!isAdmin && (
        <div className="text-center mt-6 p-3 bg-rose-50/50 rounded-xl">
          <p className="text-sm text-gray-500">
            L'admin va révéler l'auteur...
          </p>
        </div>
      )}
    </motion.div>
  )
}
