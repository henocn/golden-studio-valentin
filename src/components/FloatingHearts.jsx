import { useEffect, useState } from 'react'

const HEART_CHARS = ['♥', '♡', '❤', '💕', '💗', '💖', '💘', '💝']

function Heart({ style }) {
  const [char] = useState(() => HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)])
  return (
    <span
      className="fixed pointer-events-none animate-float-heart text-rose-300/40 select-none"
      style={style}
    >
      {char}
    </span>
  )
}

export default function FloatingHearts({ count = 18 }) {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        fontSize: `${Math.random() * 24 + 10}px`,
        animationDuration: `${Math.random() * 12 + 8}s`,
        animationDelay: `${Math.random() * 12}s`,
      },
    }))
    setHearts(generated)
  }, [count])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map((heart) => (
        <Heart key={heart.id} style={heart.style} />
      ))}
    </div>
  )
}
