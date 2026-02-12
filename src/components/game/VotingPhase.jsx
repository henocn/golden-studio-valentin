import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'

export default function VotingPhase({
  room,
  player,
  players,
  votes,
  currentPhrase,
  isAdmin,
  onCloseVoting,
}) {
  const [selectedId, setSelectedId] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  const myVote = votes.find((v) => v.voter_id === player.id)
  const alreadyVoted = !!myVote || hasVoted
  const allVoted = votes.length >= players.length

  const handleVote = async () => {
    if (!selectedId || loading) return
    setLoading(true)

    try {
      await supabase.from('votes').insert({
        room_id: room.id,
        phrase_id: currentPhrase.id,
        voter_id: player.id,
        voted_for_id: selectedId,
      })
      setHasVoted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 w-full"
    >
      <div className="text-center mb-6">
        <span className="text-4xl">🗳️</span>
        <h2 className="text-xl font-bold mt-3 text-gray-800">Phase de vote</h2>
        <div className="bg-rose-50 rounded-xl p-3 mt-3">
          <p className="text-sm text-gray-700 italic">
            &ldquo;{currentPhrase?.content}&rdquo;
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Qui a écrit cette phrase ? Vote pour ton suspect !
        </p>
      </div>

      {!alreadyVoted ? (
        <div className="space-y-3">
          {players
            .filter((p) => p.player_id !== player.id)
            .map((p) => (
              <motion.button
                key={p.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedId(p.player_id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer ${
                  selectedId === p.player_id
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    selectedId === p.player_id
                      ? 'bg-white/30 text-white'
                      : 'bg-linear-to-br from-rose-400 to-pink-400 text-white'
                  }`}
                >
                  {p.player?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{p.player?.name}</span>
                {selectedId === p.player_id && (
                  <span className="ml-auto">👆</span>
                )}
              </motion.button>
            ))}

          <button
            onClick={handleVote}
            disabled={!selectedId || loading}
            className="btn-primary w-full mt-4"
          >
            {loading ? 'Envoi...' : '✅ Confirmer mon vote'}
          </button>
        </div>
      ) : (
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <span className="text-3xl">✅</span>
          <p className="text-green-600 font-medium mt-2">Vote enregistré !</p>
          <p className="text-sm text-gray-500 mt-1">
            En attente des autres votes...
          </p>
        </div>
      )}

      {/* Admin: vote tracker */}
      {isAdmin && (
        <div className="mt-6 pt-6 border-t border-rose-100">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Votes ({votes.length}/{players.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {players.map((p) => {
              const voted = votes.some((v) => v.voter_id === p.player_id)
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                    voted
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <span>{voted ? '✅' : '⏳'}</span>
                  <span>{p.player?.name}</span>
                </div>
              )
            })}
          </div>

          {allVoted && (
            <button onClick={onCloseVoting} className="btn-primary w-full mt-4">
              📊 Voir les résultats
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
