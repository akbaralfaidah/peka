import { useRef, useState, useMemo } from 'react'
import { toPng } from 'html-to-image'
import { motion } from 'framer-motion'
import { getMoodById } from '../lib/moods'

export default function RecapCardGenerator({ entries }) {
  const cardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)

  // Calculate stats for the last 7 days
  const recapData = useMemo(() => {
    if (!entries || entries.length === 0) return null

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const recentEntries = entries.filter(e => new Date(e.created_at) >= sevenDaysAgo)
    if (recentEntries.length === 0) return null

    // Count frequencies
    const moodCounts = {}
    let topMoodId = null
    let maxCount = 0

    recentEntries.forEach(e => {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1
      if (moodCounts[e.mood] > maxCount) {
        maxCount = moodCounts[e.mood]
        topMoodId = e.mood
      }
    })

    const topMood = getMoodById(topMoodId)
    const totalEntries = recentEntries.length

    return { topMood, totalEntries, recentEntries }
  }, [entries])

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      })
      
      const link = document.createElement('a')
      link.download = `peka-mood-recap-${new Date().toISOString().split('T')[0]}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to generate image:', err)
      alert('Maaf, gagal membuat gambar recap.')
    } finally {
      setDownloading(false)
    }
  }

  if (!recapData || !recapData.topMood) return null

  const { topMood, totalEntries } = recapData
  const isPositive = topMood.group === 'positive'

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[var(--color-text-primary)]">Recap Mingguan Kamu</h3>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="text-xs font-medium px-4 py-2 bg-[var(--color-accent)] text-white rounded-[var(--radius-full)] hover:bg-[var(--color-accent-dark)] transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          {downloading ? 'Memproses...' : '⬇️ Download Recap'}
        </button>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-md)]">
        {/* The Card to be captured */}
        <div 
          ref={cardRef} 
          className="relative w-full aspect-square sm:aspect-[4/3] p-8 flex flex-col items-center justify-center text-center overflow-hidden"
          style={{ background: topMood.colorLight }}
        >
          {/* Decorative background blobs */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-[40px] opacity-60" style={{ background: topMood.color }} />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-[40px] opacity-40" style={{ background: topMood.colorDark }} />
          
          <div className="relative z-10 glass px-6 py-8 rounded-[var(--radius-xl)] w-full max-w-sm border-2" style={{ borderColor: topMood.color }}>
            <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
              Minggu ini di Peka
            </p>
            <div className="text-6xl mb-4">{topMood.emoji}</div>
            <h4 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              Lagi sering ngerasa <br/>
              <span style={{ color: topMood.colorDark }}>{topMood.label}</span>
            </h4>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Kamu check-in {totalEntries} kali minggu ini.
              <br/>
              {isPositive 
                ? 'Wah, energi positifmu lagi bersinar! ✨ Terus pertahankan ya.' 
                : 'Nggak apa-apa kok kalau lagi berat. Peluk jauh buat kamu. 🫂'}
            </p>

            <div className="pt-4 border-t border-black/5 flex items-center justify-center gap-2">
              <img src="/peka.png" alt="Peka Logo" className="w-5 h-5 object-contain opacity-80" />
              <span className="text-xs font-bold text-[var(--color-text-muted)]">Peka</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
