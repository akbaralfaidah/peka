import { useEffect, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MoodEntryCard from '../components/MoodEntryCard'

export default function HistoryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (err) {
      console.error('Failed to fetch history:', err)
      setError('Gagal memuat riwayat. Coba refresh halaman.')
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return (
    <div className="min-h-[100dvh] flex flex-col gradient-warm relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[var(--color-mood-capek-light)] blur-[80px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-mood-senang-light)] blur-[80px] opacity-40 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 pt-4 pb-2 border-b border-[var(--color-border-light)] bg-white/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/home')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white text-[var(--color-text-secondary)] transition-colors cursor-pointer"
          >
            ←
          </button>
          <span className="font-bold text-[var(--color-text-primary)] text-lg">Riwayat Mood</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <div className="max-w-xl mx-auto w-full">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-[var(--radius-md)] text-sm text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-3 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[var(--color-text-muted)]">Memuat riwayatmu...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="text-5xl mb-4 opacity-50">🍃</div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">Belum ada catatan</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Riwayat mood kamu masih kosong. Yuk, mulai check-in pertamamu!
              </p>
              <Link 
                to="/home"
                className="inline-block py-2.5 px-6 rounded-[var(--radius-full)] bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-dark)] transition-colors"
              >
                Check-in Sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <MoodEntryCard entry={entry} />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* End of list indicator */}
              <div className="text-center py-8">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Itu saja catatanmu sejauh ini. ✨
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
