import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { AnimatePresence } from 'framer-motion'

import Lobby from '../components/game/Lobby'
import WritingPhase from '../components/game/WritingPhase'
import ReadingPhase from '../components/game/ReadingPhase'
import VotingPhase from '../components/game/VotingPhase'
import ResultsPhase from '../components/game/ResultsPhase'
import RevealPhase from '../components/game/RevealPhase'
import FinalScoreboard from '../components/game/FinalScoreboard'
import ScoreBar from '../components/game/ScoreBar'

export default function Room() {
  const { code } = useParams()
  const { player } = useAuth()
  const navigate = useNavigate()

  const [room, setRoom] = useState(null)
  const [players, setPlayers] = useState([])
  const [phrases, setPhrases] = useState([])
  const [votes, setVotes] = useState([])
  const [currentPhrase, setCurrentPhrase] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = room?.admin_id === player?.id
  const currentVotes = votes.filter(
    (v) => v.phrase_id === room?.current_phrase_id
  )

  // ---- Fetch helpers ----

  async function loadPlayers(roomId) {
    const { data } = await supabase
      .from('room_players')
      .select('*, player:players(id, name)')
      .eq('room_id', roomId)
    setPlayers(data || [])
  }

  async function loadPhrases(roomId) {
    const { data } = await supabase
      .from('phrases')
      .select()
      .eq('room_id', roomId)
    setPhrases(data || [])
  }

  async function loadVotes(roomId) {
    const { data } = await supabase
      .from('votes')
      .select()
      .eq('room_id', roomId)
    setVotes(data || [])
  }

  async function loadCurrentPhrase(phraseId) {
    if (!phraseId) {
      setCurrentPhrase(null)
      return
    }
    const { data } = await supabase
      .from('phrases')
      .select()
      .eq('id', phraseId)
      .single()
    setCurrentPhrase(data)
  }

  // ---- Initial load ----

  useEffect(() => {
    async function init() {
      const { data: roomData } = await supabase
        .from('rooms')
        .select()
        .eq('code', code)
        .single()

      if (!roomData) {
        navigate('/')
        return
      }

      setRoom(roomData)

      await Promise.all([
        loadPlayers(roomData.id),
        loadPhrases(roomData.id),
        loadVotes(roomData.id),
      ])

      if (roomData.current_phrase_id) {
        await loadCurrentPhrase(roomData.current_phrase_id)
      }

      setLoading(false)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  // ---- Realtime subscriptions ----

  useEffect(() => {
    if (!room?.id) return
    const roomId = room.id

    const channel = supabase
      .channel(`game-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const newRoom = payload.new
          setRoom(newRoom)
          // Reload current phrase if it changed
          if (newRoom.current_phrase_id) {
            loadCurrentPhrase(newRoom.current_phrase_id)
          } else {
            setCurrentPhrase(null)
          }
          // Also refresh votes when status changes (new round)
          loadVotes(roomId)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_players',
          filter: `room_id=eq.${roomId}`,
        },
        () => loadPlayers(roomId)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'phrases',
          filter: `room_id=eq.${roomId}`,
        },
        () => loadPhrases(roomId)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
          filter: `room_id=eq.${roomId}`,
        },
        () => loadVotes(roomId)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id])

  // ---- Admin Actions ----

  const handleStart = async () => {
    await supabase
      .from('rooms')
      .update({ status: 'writing' })
      .eq('id', room.id)
  }

  const handleAdvanceToReading = async () => {
    // Fetch fresh unused phrases from DB
    const { data: unusedPhrases } = await supabase
      .from('phrases')
      .select()
      .eq('room_id', room.id)
      .eq('used', false)

    if (!unusedPhrases || unusedPhrases.length === 0) return

    const randomPhrase =
      unusedPhrases[Math.floor(Math.random() * unusedPhrases.length)]

    await supabase
      .from('phrases')
      .update({ used: true })
      .eq('id', randomPhrase.id)

    await supabase
      .from('rooms')
      .update({ status: 'reading', current_phrase_id: randomPhrase.id })
      .eq('id', room.id)
  }

  const handleStartVoting = async () => {
    await supabase
      .from('rooms')
      .update({ status: 'voting' })
      .eq('id', room.id)
  }

  const handleCloseVoting = async () => {
    await supabase
      .from('rooms')
      .update({ status: 'results' })
      .eq('id', room.id)
  }

  const handleReveal = async () => {
    // Calculate scores for this round
    if (currentPhrase) {
      const authorId = currentPhrase.player_id

      // Fetch current votes from DB to be sure
      const { data: roundVotes } = await supabase
        .from('votes')
        .select()
        .eq('room_id', room.id)
        .eq('phrase_id', currentPhrase.id)

      const correctVoters = (roundVotes || []).filter(
        (v) => v.voted_for_id === authorId
      )

      // Update scores for correct voters
      for (const vote of correctVoters) {
        const playerRecord = players.find(
          (p) => p.player_id === vote.voter_id
        )
        if (playerRecord) {
          await supabase
            .from('room_players')
            .update({ score: (playerRecord.score || 0) + 1 })
            .eq('id', playerRecord.id)
        }
      }
    }

    await supabase
      .from('rooms')
      .update({ status: 'reveal' })
      .eq('id', room.id)
  }

  const handleNext = async () => {
    // Fetch fresh phrases to check remaining
    const { data: freshPhrases } = await supabase
      .from('phrases')
      .select()
      .eq('room_id', room.id)

    const unusedPhrases = (freshPhrases || []).filter((p) => !p.used)

    if (unusedPhrases.length === 0) {
      await supabase
        .from('rooms')
        .update({ status: 'finished', current_phrase_id: null })
        .eq('id', room.id)
    } else {
      const randomPhrase =
        unusedPhrases[Math.floor(Math.random() * unusedPhrases.length)]

      await supabase
        .from('phrases')
        .update({ used: true })
        .eq('id', randomPhrase.id)

      await supabase
        .from('rooms')
        .update({ status: 'reading', current_phrase_id: randomPhrase.id })
        .eq('id', room.id)
    }
  }

  // ---- Render ----

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        <p className="text-rose-400">Chargement...</p>
      </div>
    )
  }

  if (!room) return null

  const showScoreBar = [
    'writing',
    'reading',
    'voting',
    'results',
    'reveal',
  ].includes(room.status)

  return (
    <div className="w-full max-w-2xl mx-auto">
      {showScoreBar && (
        <ScoreBar players={players} currentPlayerId={player.id} />
      )}

      <AnimatePresence mode="wait">
        {room.status === 'waiting' && (
          <Lobby
            key="lobby"
            room={room}
            players={players}
            isAdmin={isAdmin}
            onStart={handleStart}
          />
        )}
        {room.status === 'writing' && (
          <WritingPhase
            key="writing"
            room={room}
            player={player}
            players={players}
            phrases={phrases}
            isAdmin={isAdmin}
            onAdvance={handleAdvanceToReading}
          />
        )}
        {room.status === 'reading' && (
          <ReadingPhase
            key="reading"
            currentPhrase={currentPhrase}
            isAdmin={isAdmin}
            onStartVoting={handleStartVoting}
          />
        )}
        {room.status === 'voting' && (
          <VotingPhase
            key="voting"
            room={room}
            player={player}
            players={players}
            votes={currentVotes}
            currentPhrase={currentPhrase}
            isAdmin={isAdmin}
            onCloseVoting={handleCloseVoting}
          />
        )}
        {room.status === 'results' && (
          <ResultsPhase
            key="results"
            players={players}
            votes={currentVotes}
            isAdmin={isAdmin}
            onReveal={handleReveal}
          />
        )}
        {room.status === 'reveal' && (
          <RevealPhase
            key="reveal"
            players={players}
            votes={currentVotes}
            currentPhrase={currentPhrase}
            phrases={phrases}
            isAdmin={isAdmin}
            onNext={handleNext}
          />
        )}
        {room.status === 'finished' && (
          <FinalScoreboard key="finished" players={players} />
        )}
      </AnimatePresence>
    </div>
  )
}
