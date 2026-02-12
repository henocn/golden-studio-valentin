import { motion } from 'framer-motion'
import { Drama, Target, Frown, ArrowRight, Trophy, Heart, Download } from 'lucide-react'

export default function RevealPhase({
  players,
  votes,
  currentPhrase,
  phrases,
  isAdmin,
  onNext,
}) {
  const author = players.find((p) => p.player_id === currentPhrase?.player_id)
  const correctVoters = votes.filter(
    (v) => v.voted_for_id === currentPhrase?.player_id
  )
  const correctVoterNames = correctVoters
    .map((v) => {
      const p = players.find((pl) => pl.player_id === v.voter_id)
      return p?.player?.name
    })
    .filter(Boolean)

  // Count remaining phrases
  const usedCount = phrases.filter((p) => p.used).length
  const totalPhrases = phrases.length
  const remaining = totalPhrases - usedCount

  const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  const drawHeart = (ctx, cx, cy, size, color) => {
    ctx.save()
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(cx, cy + size * 0.4)
    ctx.bezierCurveTo(cx - size, cy - size * 0.5, cx - size * 0.5, cy - size, cx, cy - size * 0.4)
    ctx.bezierCurveTo(cx + size * 0.5, cy - size, cx + size, cy - size * 0.5, cx, cy + size * 0.4)
    ctx.fill()
    ctx.restore()
  }

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ')
    const lines = []
    let current = ''
    words.forEach((word) => {
      const test = current ? current + ' ' + word : word
      if (ctx.measureText(test).width > maxWidth) {
        if (current) lines.push(current)
        current = word
      } else {
        current = test
      }
    })
    if (current) lines.push(current)
    return lines
  }

  const downloadCard = () => {
    const canvas = document.createElement('canvas')
    const W = 800, H = 1100
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H)
    bg.addColorStop(0, '#fff0f3')
    bg.addColorStop(0.4, '#ffe4ec')
    bg.addColorStop(1, '#ffd6e0')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Outer decorative border
    ctx.strokeStyle = '#e11d4825'
    ctx.lineWidth = 10
    roundRect(ctx, 20, 20, W - 40, H - 40, 24)
    ctx.stroke()

    // Inner border
    ctx.strokeStyle = '#e11d4840'
    ctx.lineWidth = 1.5
    roundRect(ctx, 44, 44, W - 88, H - 88, 16)
    ctx.stroke()

    // Corner hearts
    const corners = [[80, 80], [W - 80, 80], [80, H - 80], [W - 80, H - 80]]
    corners.forEach(([x, y]) => drawHeart(ctx, x, y, 14, '#e11d4820'))

    // Top heart
    drawHeart(ctx, W / 2, 130, 36, '#e11d48')

    // Logo + separator drawn after image loads (or fallback)
    const drawRest = () => {
      // Line under logo/title
      ctx.beginPath()
      ctx.moveTo(240, 235)
      ctx.lineTo(560, 235)
      ctx.strokeStyle = '#e11d4830'
      ctx.lineWidth = 1
      ctx.stroke()

    // Opening guillemet
    ctx.font = '100px Georgia, serif'
    ctx.fillStyle = '#e11d4812'
    ctx.textAlign = 'left'
    ctx.fillText('\u00AB', 90, 370)

    // Phrase
    ctx.font = 'italic 28px Georgia, serif'
    ctx.fillStyle = '#881337'
    ctx.textAlign = 'center'
    const phraseText = currentPhrase?.content || ''
    const lines = wrapText(ctx, phraseText, 540)
    const lineH = 46
    const phraseStartY = 440 - ((lines.length - 1) * lineH / 2)
    lines.forEach((line, i) => {
      ctx.fillText(line, W / 2, phraseStartY + i * lineH)
    })

    // Closing guillemet
    ctx.font = '100px Georgia, serif'
    ctx.fillStyle = '#e11d4812'
    ctx.textAlign = 'right'
    ctx.fillText('\u00BB', W - 90, phraseStartY + (lines.length - 1) * lineH + 60)

    // Separator with heart
    const sepY = phraseStartY + lines.length * lineH + 90
    ctx.beginPath()
    ctx.moveTo(260, sepY)
    ctx.lineTo(W / 2 - 18, sepY)
    ctx.moveTo(W / 2 + 18, sepY)
    ctx.lineTo(540, sepY)
    ctx.strokeStyle = '#e11d48'
    ctx.lineWidth = 1.5
    ctx.stroke()
    drawHeart(ctx, W / 2, sepY, 10, '#e11d48')

    // Author
    const authorName = author?.player?.name || 'Anonyme'
    ctx.font = 'bold 30px Georgia, serif'
    ctx.fillStyle = '#9f1239'
    ctx.textAlign = 'center'
    ctx.fillText(`\u2014 ${authorName} \u2014`, W / 2, sepY + 60)

    // Date
    ctx.font = '16px Georgia, serif'
    ctx.fillStyle = '#be123c90'
    ctx.fillText('Saint-Valentin 2026', W / 2, sepY + 100)

    // Decorative hearts row
    for (let i = 0; i < 5; i++) {
      drawHeart(ctx, W / 2 - 48 + i * 24, H - 200, 6, '#e11d4830')
    }

    // Hadassa branding
    ctx.font = 'bold 26px Georgia, serif'
    ctx.fillStyle = '#e11d48'
    ctx.textAlign = 'center'
    const hadText = 'Hadassa'
    const hadW = ctx.measureText(hadText).width
    ctx.fillText(hadText, W / 2 - 10, H - 130)
    drawHeart(ctx, W / 2 + hadW / 2 + 2, H - 138, 12, '#e11d48')

    ctx.font = 'italic 14px Georgia, serif'
    ctx.fillStyle = '#be123c70'
    ctx.fillText('Henoc Dev', W / 2, H - 100)

    // Trigger download
    const a = document.createElement('a')
    a.download = `valentin-${authorName.replace(/\s+/g, '-')}.png`
    a.href = canvas.toDataURL('image/png')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    } // end drawRest

    // Load logo and draw
    const logo = new Image()
    logo.crossOrigin = 'anonymous'
    logo.onload = () => {
      const logoH = 50
      const logoW = logo.width * (logoH / logo.height)
      ctx.drawImage(logo, (W - logoW) / 2, 175, logoW, logoH)
      drawRest()
    }
    logo.onerror = () => {
      ctx.font = 'italic 22px Georgia, serif'
      ctx.fillStyle = '#be123c'
      ctx.textAlign = 'center'
      ctx.fillText('Studio Valentin', W / 2, 210)
      drawRest()
    }
    logo.src = '/logo.png'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 w-full"
    >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="inline-block"
        >
          <Drama className="w-12 h-12 mx-auto text-rose-500" />
        </motion.div>
        <h2 className="text-xl font-bold mt-3 text-gray-800">Révélation !</h2>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="bg-linear-to-br from-rose-100 to-pink-100 rounded-2xl p-6 text-center border-2 border-rose-300"
      >
        <p className="text-sm text-gray-500 mb-2">La phrase était de...</p>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
            {author?.player?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-2xl font-bold text-rose-600">
            {author?.player?.name}
          </span>
        </div>
        <p className="text-gray-600 italic text-sm">
          &ldquo;{currentPhrase?.content}&rdquo;
        </p>
      </motion.div>

      {correctVoterNames.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 p-4 bg-green-50 rounded-xl text-center"
        >
          <Target className="w-6 h-6 mx-auto text-green-600 mb-1" />
          <p className="text-green-700 font-medium">
            Bien joué {correctVoterNames.join(', ')} !
          </p>
          <p className="text-sm text-green-600 mt-1">
            +1 point pour avoir démasqué le coupable
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 p-4 bg-amber-50 rounded-xl text-center"
        >
          <Frown className="w-6 h-6 mx-auto text-amber-600 mb-1" />
          <p className="text-amber-700 font-medium">
            Personne n'a trouvé ! Agent secret niveau max !
          </p>
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={downloadCard}
        className="w-full mt-5 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-linear-to-r from-rose-100 to-pink-100 text-rose-600 font-medium hover:from-rose-200 hover:to-pink-200 transition-all border border-rose-200 cursor-pointer"
      >
        <Download className="w-5 h-5" /> Télécharger la carte souvenir
      </motion.button>

      <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
        <Heart className="w-3 h-3 text-rose-300 fill-rose-300" />
        {remaining > 0
          ? `${remaining} phrase${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}`
          : 'C\'était la dernière phrase !'}
      </p>

      {isAdmin && (
        <button onClick={onNext} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
          {remaining > 0 ? (
            <>
              <ArrowRight className="w-5 h-5" /> Phrase suivante
            </>
          ) : (
            <>
              <Trophy className="w-5 h-5" /> Classement final
            </>
          )}
        </button>
      )}

      {!isAdmin && (
        <div className="text-center mt-4 p-3 bg-rose-50/50 rounded-xl">
          <p className="text-sm text-gray-500">
            {remaining > 0
              ? "L'admin passe à la suite..."
              : "L'admin va afficher le classement..."}
          </p>
        </div>
      )}
    </motion.div>
  )
}
