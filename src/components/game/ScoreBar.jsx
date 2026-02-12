import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

export default function ScoreBar({ players, currentPlayerId }) {
  const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 bg-white/50 backdrop-blur-md rounded-xl p-3 border border-white/40"
    >
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 whitespace-nowrap">
          <Trophy className="w-3.5 h-3.5" /> Scores
        </span>
        <div className="flex gap-2 flex-1">
          {sorted.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                p.player_id === currentPlayerId
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-white/70 text-gray-600'
              }`}
            >
              <span>{p.player?.name}</span>
              <span className="font-bold text-rose-500">{p.score || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
