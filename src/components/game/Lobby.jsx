import { motion } from 'framer-motion'

export default function Lobby({ room, players, isAdmin, onStart }) {
  const isFull = players.length >= room.max_players

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 w-full"
    >
      <div className="text-center mb-6">
        <span className="text-4xl">🎮</span>
        <h2 className="text-xl font-bold mt-3 text-gray-800">Salle d'attente</h2>
        <div className="mt-3 bg-rose-50 rounded-xl p-4 inline-block">
          <p className="text-xs text-gray-500 mb-1">Code d'invitation</p>
          <p className="text-3xl font-mono font-bold tracking-widest text-rose-600">
            {room.code}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600">Joueurs</span>
          <span
            className={`text-sm font-bold ${isFull ? 'text-green-500' : 'text-rose-500'}`}
          >
            {players.length} / {room.max_players}
          </span>
        </div>

        <div className="space-y-2">
          {players.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 bg-white/60 rounded-xl p-3"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                {p.player?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-700">
                {p.player?.name}
              </span>
              {p.player_id === room.admin_id && (
                <span className="ml-auto text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-medium">
                  Admin
                </span>
              )}
            </motion.div>
          ))}

          {Array.from({ length: room.max_players - players.length }).map(
            (_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-3 bg-white/30 rounded-xl p-3 border-2 border-dashed border-rose-200"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  ?
                </div>
                <span className="text-gray-400 text-sm">En attente...</span>
              </div>
            )
          )}
        </div>
      </div>

      {isAdmin && (
        <button onClick={onStart} disabled={!isFull} className="btn-primary w-full">
          {isFull
            ? '🚀 Lancer la partie !'
            : `En attente de ${room.max_players - players.length} joueur(s)...`}
        </button>
      )}

      {!isAdmin && (
        <div className="text-center p-4 bg-rose-50/50 rounded-xl">
          <p className="text-sm text-gray-500">
            {isFull
              ? "L'admin va bientôt lancer la partie..."
              : 'En attente des autres joueurs...'}
          </p>
          <div className="flex justify-center mt-2 gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
