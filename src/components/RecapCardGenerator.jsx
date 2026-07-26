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

      <div className="overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] flex justify-center bg-gray-50/50 p-4">
        {/* The Card to be captured - fixed 9:16 aspect ratio */}
        <div 
          ref={cardRef} 
          className="relative w-full max-w-[360px] aspect-[9/16] p-8 flex flex-col items-center justify-center text-center overflow-hidden rounded-3xl"
          style={{ background: topMood.colorLight }}
        >
          {/* Decorative background blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-[60px] opacity-60" style={{ background: topMood.color }} />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-[60px] opacity-40" style={{ background: topMood.colorDark }} />
          
          <div className="relative z-10 glass px-6 py-10 rounded-[var(--radius-xl)] w-full border-2 flex flex-col items-center" style={{ borderColor: topMood.color }}>
            <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-6">
              Minggu ini di Peka
            </p>
            <div className="text-7xl mb-6 drop-shadow-md">{topMood.emoji}</div>
            <h4 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3 leading-tight">
              Lagi sering ngerasa <br/>
              <span style={{ color: topMood.colorDark }} className="text-3xl">{topMood.label}</span>
            </h4>
            <p className="text-sm text-[var(--color-text-secondary)] mb-8 leading-relaxed px-2">
              Kamu check-in <span className="font-bold text-[var(--color-text-primary)]">{totalEntries}</span> kali minggu ini.
              <br/><br/>
              {isPositive 
                ? 'Wah, energi positifmu lagi bersinar! ✨ Terus pertahankan ya.' 
                : 'Nggak apa-apa kok kalau lagi berat. Peluk jauh buat kamu. 🫂'}
            </p>

            <div className="pt-5 w-full border-t border-black/10 flex items-center justify-center gap-2">
              <img src="/peka.png" alt="Peka Logo" className="w-6 h-6 object-contain opacity-80" />
              <span className="text-sm font-bold text-[var(--color-text-muted)] tracking-wide">Peka</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
