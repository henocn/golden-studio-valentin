import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'

export default function WritingPhase({ room, player, players, phrases, isAdmin, onAdvance }) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const myPhrase = phrases.find((p) => p.player_id === player.id)
  const hasSubmitted = !!myPhrase || submitted
  const allSubmitted = phrases.length >= players.length

  const handleSubmit = async () => {
    if (!text.trim() || loading) return
    setLoading(true)

    try {
      await supabase.from('phrases').insert({
        room_id: room.id,
        player_id: player.id,
        content: text.trim(),
      })
      setSubmitted(true)
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
        <span className="text-4xl">✍️</span>
        <h2 className="text-xl font-bold mt-3 text-gray-800">
          Écris ta phrase secrète
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Écris quelque chose que les autres devront deviner !
        </p>
      </div>

      {!hasSubmitted ? (
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-field min-h-30 resize-none"
            placeholder="Ta phrase mystère..."
            maxLength={200}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{text.length}/200</span>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || loading}
              className="btn-primary"
            >
              {loading ? 'Envoi...' : '💌 Envoyer'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <span className="text-3xl">✅</span>
          <p className="text-green-600 font-medium mt-2">Phrase envoyée !</p>
          <p className="text-sm text-gray-500 mt-1">
            En attente des autres joueurs...
          </p>
        </div>
      )}

      {/* Admin: submission tracker */}
      {isAdmin && (
        <div className="mt-6 pt-6 border-t border-rose-100">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Soumissions ({phrases.length}/{players.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {players.map((p) => {
              const hasPhrase = phrases.some(
                (ph) => ph.player_id === p.player_id
              )
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                    hasPhrase
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <span>{hasPhrase ? '✅' : '⏳'}</span>
                  <span>{p.player?.name}</span>
                </div>
              )
            })}
          </div>

          {allSubmitted && (
            <button onClick={onAdvance} className="btn-primary w-full mt-4">
              📖 Passer à la lecture
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
