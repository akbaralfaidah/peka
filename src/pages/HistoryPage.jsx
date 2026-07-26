import { useEffect, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MoodEntryCard from '../components/MoodEntryCard'
import RecapCardGenerator from '../components/RecapCardGenerator'
import MoodChart from '../components/MoodChart'

export default function HistoryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [statsEntries, setStatsEntries] = useState([])
  const [historyEntries, setHistoryEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('id, created_at, mood')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setStatsEntries(data || [])
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }, [user.id])

  const fetchHistory = useCallback(async (pageNumber = 0) => {
    try {
      if (pageNumber === 0) setLoading(true)
      else setLoadingMore(true)
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(pageNumber * 10, (pageNumber + 1) * 10 - 1)

      if (error) throw error
      
      if (data) {
        if (pageNumber === 0) {
          setHistoryEntries(data)
        } else {
          setHistoryEntries(prev => [...prev, ...data])
        }
        setHasMore(data.length === 10)
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
      if (pageNumber === 0) setError('Gagal memuat riwayat. Coba refresh halaman.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [user.id])

  useEffect(() => {
    fetchStats()
    fetchHistory(0)
  }, [fetchStats, fetchHistory])

  // Group history by date
  const groupedHistory = useMemo(() => {
    return historyEntries.reduce((acc, entry) => {
      const date = new Date(entry.created_at)
      const dateString = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
      if (!acc[dateString]) acc[dateString] = []
      acc[dateString].push(entry)
      return acc
    }, {})
  }, [historyEntries])

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
      <main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-6 pb-20 max-w-6xl mx-auto w-full">
        <div className="w-full">
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
          ) : historyEntries.length === 0 ? (
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Kolom Kiri: Sticky */}
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 space-y-6">
                <RecapCardGenerator entries={statsEntries} />
                <MoodChart entries={statsEntries} />
              </div>

              {/* Kolom Kanan: Scrollable */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                <h3 className="font-bold text-[var(--color-text-primary)] mb-4 px-1">Riwayat Lengkap</h3>
                
                {Object.entries(groupedHistory).map(([dateLabel, dayEntries]) => (
                  <div key={dateLabel} className="mb-6 relative">
                    {/* Date Header */}
                    <div className="sticky top-[60px] z-20 backdrop-blur-xl bg-white/70 py-2.5 px-4 mb-3 rounded-xl border border-[var(--color-border-light)] shadow-sm">
                      <h4 className="font-bold text-[var(--color-text-secondary)] text-sm tracking-wide">{dateLabel}</h4>
                    </div>
                    
                    {/* Entries for the Date */}
                    <div className="space-y-4">
                      <AnimatePresence>
                        {dayEntries.map((entry, index) => (
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
                    </div>
                  </div>
                ))}
                
                {hasMore ? (
                  <div className="text-center py-6">
                    <button 
                      onClick={() => {
                        const nextPage = page + 1
                        setPage(nextPage)
                        fetchHistory(nextPage)
                      }}
                      disabled={loadingMore}
                      className="px-6 py-2.5 rounded-[var(--radius-full)] bg-white/60 hover:bg-white text-sm font-bold text-[var(--color-text-primary)] transition-all shadow-sm border border-[var(--color-border-light)] disabled:opacity-50"
                    >
                      {loadingMore ? 'Memuat...' : 'Muat Lebih Banyak ↓'}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xs font-medium text-[var(--color-text-muted)]">
                      Itu saja catatanmu sejauh ini. ✨
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
