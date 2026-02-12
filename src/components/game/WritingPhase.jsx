import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import { PenLine, Send, CheckCircle2, Clock, BookOpen } from 'lucide-react'

const PLACEHOLDERS = [
  "J'ai un crush inavouable sur...",
  "Si j'étais un dessert, je serais...",
  "Mon talent caché c'est de...",
  "Le truc le plus gênant qui m'est arrivé...",
  "Mon excuse bidon préférée c'est...",
  "Si Hadassa me connaissait vraiment, elle saurait que...",
  "Le pire date de ma vie c'était quand...",
  "Mon péché mignon secret c'est...",
]

export default function WritingPhase({ room, player, players, phrases, isAdmin, onAdvance }) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [placeholder] = useState(
    () => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  )

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
        <PenLine className="w-10 h-10 mx-auto text-rose-500" />
        <h2 className="text-xl font-bold mt-3 text-gray-800">
          Balance ta phrase secrète
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Écris un truc que personne ne devinera... ou pas 😏
        </p>
      </div>

      {!hasSubmitted ? (
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-field min-h-30 resize-none"
            placeholder={placeholder}
            maxLength={200}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{text.length}/200</span>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || loading}
              className="btn-primary flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <CheckCircle2 className="w-10 h-10 mx-auto text-green-500" />
          <p className="text-green-600 font-medium mt-2">
            Message envoyé dans le secret des dieux !
          </p>
          <p className="text-sm text-gray-500 mt-1">
            On attend les autres... certains réfléchissent encore 🤔
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
                  {hasPhrase ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  <span>{p.player?.name}</span>
                </div>
              )
            })}
          </div>

          {allSubmitted && (
            <button onClick={onAdvance} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" /> On passe à la lecture !
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
