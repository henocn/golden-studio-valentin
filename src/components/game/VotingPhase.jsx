import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import { Vote, CheckCircle2, Clock, BarChart3, ThumbsUp } from 'lucide-react'

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

  const votingHints = [
    "Tu peux voter celui-ci, il a un visage à dire ça 👀",
    "Non il est pas trop du genre à dire ça...",
    "Lui, les dés me disent qu'il est capable de le dire 🎲",
    "Tu peux le voter mais ne dis à personne que je t'ai aidé à tricher 🤫",
    "Son regard dit tout... ou rien du tout",
    "Celui-là ? Il a l'air trop innocent pour être honnête",
    "Mon sixième sens me dit que c'est peut-être lui...",
    "L'intuition divine me souffle son nom 🌬️",
    "Si c'est pas lui, je mange mon chapeau 🎩",
    "Attention, voter pour lui c'est risqué... mais tentant",
    "Il transpire la culpabilité... ou c'est juste la chaleur ?",
    "Ce sourire en coin ne trompe personne 😏",
    "Voter pour lui, c'est parier sur le favori",
    "Il a le profil parfait du coupable romantique 💘",
    "Lui ? Jamais de la vie... sauf si c'est lui",
    "C'est le genre à écrire ça en rigolant tout seul",
    "La police des phrases le surveille de près 🚔",
    "Il nie sûrement en ce moment même...",
    "Mon petit doigt me dit que c'est lui... mon gros doigt aussi 🤭",
    "Choisis-le, tu auras au moins une bonne histoire à raconter",
    "Franchement, ça lui ressemble trop pour être faux",
    "Même sa mère le soupçonnerait sur ce coup-là 😂",
    "Si tu votes pour lui et que t'as raison, t'es un génie",
    "Il a cette tête de quelqu'un qui écrit des phrases comme ça",
    "Le suspect parfait n'existe p... ah attends 👀",
    "Regarde-le bien... tu vois ? Moi aussi je vois 🔍",
    "Entre nous, c'est clairement son style d'écriture",
    "Voter ici c'est un acte de bravoure, fonce !",
    "Il faut du courage pour dénoncer... mais t'en as, non ?",
    "Celui-ci ? Hmm, mes sources sont formelles 📰",
  ]

  const getHintIndex = (pid, phid, len) => {
    let h = 0
    const s = `${pid}-${phid}`
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i)
      h |= 0
    }
    return Math.abs(h) % len
  }

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
        <Vote className="w-10 h-10 mx-auto text-rose-500" />
        <h2 className="text-xl font-bold mt-3 text-gray-800">Phase de vote</h2>
        <div className="bg-rose-50 rounded-xl p-3 mt-3">
          <p className="text-sm text-gray-700 italic">
            &ldquo;{currentPhrase?.content}&rdquo;
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Désigne le coupable ! (oui, tu peux te dénoncer toi-même 🫣)
        </p>
      </div>

      {!alreadyVoted ? (
        <div className="space-y-3">
          {players.map((p) => (
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
              <div className="flex-1 text-left min-w-0">
                <span className="font-medium">
                  {p.player?.name}
                  {p.player_id === player.id && (
                    <span className="text-xs ml-1.5 opacity-70">(moi)</span>
                  )}
                </span>
                <p className={`text-xs mt-0.5 italic leading-tight ${
                  selectedId === p.player_id ? 'text-white/70' : 'text-gray-400'
                }`}>
                  {votingHints[getHintIndex(p.player_id, currentPhrase?.id, votingHints.length)]}
                </p>
              </div>
              {selectedId === p.player_id && (
                <ThumbsUp className="w-5 h-5 shrink-0" />
              )}
            </motion.button>
          ))}

          <button
            onClick={handleVote}
            disabled={!selectedId || loading}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {loading ? 'Envoi...' : 'Confirmer mon vote'}
          </button>
        </div>
      ) : (
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <CheckCircle2 className="w-10 h-10 mx-auto text-green-500" />
          <p className="text-green-600 font-medium mt-2">
            Vote enregistré, bien joué détective !
          </p>
          <p className="text-sm text-gray-500 mt-1">
            On attend les indécis...
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
                  {voted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  <span>{p.player?.name}</span>
                </div>
              )
            })}
          </div>

          {allVoted && (
            <button onClick={onCloseVoting} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5" /> Verdict !
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
