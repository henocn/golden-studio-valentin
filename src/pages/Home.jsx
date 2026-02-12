import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { Mail, Sparkles, Rocket, Plus, LogIn } from 'lucide-react'

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function Home() {
  const { player } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('create')
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const createRoom = async () => {
    setError('')
    setLoading(true)
    try {
      const code = generateRoomCode()

      const { data: room, error: roomErr } = await supabase
        .from('rooms')
        .insert({
          code,
          admin_id: player.id,
          max_players: maxPlayers,
          status: 'waiting',
        })
        .select()
        .single()

      if (roomErr) throw roomErr

      const { error: joinErr } = await supabase
        .from('room_players')
        .insert({ room_id: room.id, player_id: player.id })

      if (joinErr) throw joinErr

      navigate(`/room/${code}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const joinRoom = async () => {
    setError('')
    if (!joinCode.trim()) return setError("Entre un code d'invitation")

    setLoading(true)
    try {
      const { data: room, error: roomErr } = await supabase
        .from('rooms')
        .select()
        .eq('code', joinCode.trim().toUpperCase())
        .single()

      if (roomErr || !room) throw new Error('Room introuvable')
      if (room.status !== 'waiting')
        throw new Error('Cette partie a déjà commencé')

      const { count } = await supabase
        .from('room_players')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', room.id)

      if (count >= room.max_players) throw new Error('La room est pleine')

      // Check if already joined
      const { data: existing } = await supabase
        .from('room_players')
        .select()
        .eq('room_id', room.id)
        .eq('player_id', player.id)
        .maybeSingle()

      if (!existing) {
        const { error: joinErr } = await supabase
          .from('room_players')
          .insert({ room_id: room.id, player_id: player.id })

        if (joinErr) throw joinErr
      }

      navigate(`/room/${joinCode.trim().toUpperCase()}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="glass-card p-8">
        <div className="text-center mb-8">
          <Mail className="w-12 h-12 mx-auto text-rose-500" />
          <h2 className="text-2xl font-bold mt-4 bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            Salut {player.name} !
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Crée une salle ou rejoins les autres
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setTab('create')
              setError('')
            }}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
              tab === 'create'
                ? 'bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200'
                : 'bg-white/50 text-gray-500 hover:bg-white/70'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Créer une room
          </button>
          <button
            onClick={() => {
              setTab('join')
              setError('')
            }}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
              tab === 'join'
                ? 'bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200'
                : 'bg-white/50 text-gray-500 hover:bg-white/70'
            }`}
          >
            <LogIn className="w-4 h-4 inline mr-1" />
            Rejoindre
          </button>
        </div>

        {tab === 'create' ? (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre de joueurs (toi inclus)
              </label>
              <div className="flex gap-2">
                {[3, 4, 5, 6, 7, 8].map((n) => (
                  <button
                    key={n}
                    onClick={() => setMaxPlayers(n)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                      maxPlayers === n
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-white/70 text-gray-600 hover:bg-rose-50 border border-rose-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={createRoom}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Création...' : 'Créer la partie'}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Code d'invitation
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="input-field text-center text-xl tracking-widest font-mono uppercase"
                placeholder="ABC123"
                maxLength={6}
              />
            </div>

            <button
              onClick={joinRoom}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              {loading ? 'Connexion...' : 'Rejoindre la partie'}
            </button>
          </div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center bg-red-50 rounded-lg p-2 mt-4"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
