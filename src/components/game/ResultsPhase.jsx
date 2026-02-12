import { motion } from 'framer-motion'
import { BarChart3, Medal, Eye } from 'lucide-react'

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

  const medalColors = [
    'from-yellow-50 to-amber-50 border-2 border-yellow-200',
    'from-gray-50 to-slate-50 border border-gray-200',
    'from-orange-50 to-amber-50 border border-orange-200',
  ]
  const medalLabels = ['1er suspect', '2e suspect', '3e suspect']

  const firstSuspectPhrases = [
    "Je savais que c'est lui... mon intuition est toujours bonne 🎯",
    "Je me demande pourquoi tant de personnes le suspectent... ah non en fait je sais 🤔",
    "Et moi qui pensais qu'il ne pouvait pas dire cela... je dois réajuster mes pouvoirs de divination 🔮",
    "Le suspect n°1 ! Même la voyante du quartier l'avait prédit",
    "Si c'est vraiment lui, je deviens détective professionnel dès demain matin",
    "Tout le monde l'a vu venir... sauf lui apparemment 😂",
    "Le peuple a parlé, et le peuple a souvent raison... ou pas du tout",
    "Son karma l'a rattrapé plus vite que prévu 💨",
    "Champion du monde des suspects, médaille d'or assurée 🥇",
    "Même avec un déguisement, on l'aurait reconnu",
  ]

  const otherSuspectPhrases = [
    "Pas mal de gens pensent que c'est toi aussi... méfiance 👀",
    "Tu es dans le viseur mais ça reste jouable pour toi",
    "Suspect secondaire, mais ne te réjouis pas trop vite",
    "On te surveille du coin de l'œil... discrètement",
    "Tu pensais passer inaperçu ? Raté ! 😅",
    "Les enquêteurs hésitent encore te concernant...",
    "T'as failli passer sous le radar, presque !",
    "Un soupçon plane... léger mais persistant comme un parfum",
    "La rumeur court que c'est peut-être toi aussi 🏃",
    "Ni innocent ni coupable... pour l'instant",
  ]

  const getSuspectPhrase = (index, playerId) => {
    const arr = index === 0 ? firstSuspectPhrases : otherSuspectPhrases
    let h = 0
    const s = String(playerId)
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i)
      h |= 0
    }
    return arr[Math.abs(h) % arr.length]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 w-full"
    >
      <div className="text-center mb-6">
        <BarChart3 className="w-10 h-10 mx-auto text-rose-500" />
        <h2 className="text-xl font-bold mt-3 text-gray-800">
          Les plus suspects !
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          On vous a grillés... ou pas ?
        </p>
      </div>

      <div className="space-y-3">
        {ranked.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className={`flex items-center gap-4 p-4 rounded-xl bg-linear-to-r ${medalColors[i]}`}
          >
            <Medal className={`w-8 h-8 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-orange-400'}`} />
            <div className="flex-1">
              <p className="font-bold text-gray-800">{p.player?.name}</p>
              <p className="text-xs text-gray-500">{medalLabels[i]}</p>
              <p className="text-xs text-gray-400 italic mt-0.5">{getSuspectPhrase(i, p.player_id)}</p>
            </div>
            <div className="text-2xl font-bold text-rose-500">
              {p.voteCount}
              <span className="text-xs font-normal text-gray-400 ml-1">
                vote{p.voteCount > 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        ))}

        {ranked.length === 0 && (
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-500">
              Aucun vote ? Vous aviez peur de balancer ? 😂
            </p>
          </div>
        )}
      </div>

      {isAdmin && (
        <button onClick={onReveal} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
          <Eye className="w-5 h-5" /> Révéler le vrai coupable !
        </button>
      )}

      {!isAdmin && (
        <div className="text-center mt-6 p-3 bg-rose-50/50 rounded-xl">
          <p className="text-sm text-gray-500">
            L'admin va dévoiler la vérité... moment de vérité !
          </p>
        </div>
      )}
    </motion.div>
  )
}
