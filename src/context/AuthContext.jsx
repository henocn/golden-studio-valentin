import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem('sv_player')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (player) {
      localStorage.setItem('sv_player', JSON.stringify(player))
    } else {
      localStorage.removeItem('sv_player')
    }
  }, [player])

  const register = async (name, pin) => {
    const { data, error } = await supabase
      .from('players')
      .insert({ name, pin })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') throw new Error('Ce nom est déjà pris')
      throw error
    }
    setPlayer({ id: data.id, name: data.name })
    return data
  }

  const login = async (name, pin) => {
    const { data, error } = await supabase
      .from('players')
      .select()
      .eq('name', name)
      .eq('pin', pin)
      .single()

    if (error || !data) throw new Error('Nom ou code PIN incorrect')
    setPlayer({ id: data.id, name: data.name })
    return data
  }

  const logout = () => {
    setPlayer(null)
  }

  return (
    <AuthContext.Provider value={{ player, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
