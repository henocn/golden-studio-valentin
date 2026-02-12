import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function FloatingHeart({ style }) {
  return (
    <span
      className="fixed pointer-events-none animate-float-heart text-rose-300/30 select-none"
      style={style}
    >
      <Heart className="fill-current w-full h-full" />
    </span>
  )
}

function HadassaWhisper() {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 70 + 10,
        y: Math.random() * 70 + 10,
      })
      setVisible(true)
      setTimeout(() => setVisible(false), 3000)
    }, 25000 + Math.random() * 20000)

    // First apparition after 8s
    const firstTimeout = setTimeout(() => {
      setPosition({
        x: Math.random() * 70 + 10,
        y: Math.random() * 70 + 10,
      })
      setVisible(true)
      setTimeout(() => setVisible(false), 3000)
    }, 8000)

    return () => {
      clearInterval(interval)
      clearTimeout(firstTimeout)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 0.12, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="fixed pointer-events-none z-0 select-none"
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
        >
          <span className="text-3xl font-bold italic text-rose-400 tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
            Hadassa
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function FloatingHearts({ count = 18 }) {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 24 + 10}px`,
        height: `${Math.random() * 24 + 10}px`,
        animationDuration: `${Math.random() * 12 + 8}s`,
        animationDelay: `${Math.random() * 12}s`,
      },
    }))
    setHearts(generated)
  }, [count])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map((heart) => (
        <FloatingHeart key={heart.id} style={heart.style} />
      ))}
      <HadassaWhisper />
    </div>
  )
}
