import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function ReminderBanner() {
  const { user } = useAuth()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkLastEntry() {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from('mood_entries')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching last entry:', error)
          return
        }

        if (!data) {
          // No entries yet! Let's show it to encourage first check-in
          setShow(true)
        } else {
          const lastEntryDate = new Date(data.created_at)
          const now = new Date()
          const diffTime = now - lastEntryDate
          const diffDays = diffTime / (1000 * 60 * 60 * 24)

          // Show banner if it's been more than 2 days
          if (diffDays >= 2) {
            setShow(true)
          }
        }
      } catch (err) {
        console.error('Error checking reminder:', err)
      } finally {
        setLoading(false)
      }
    }

    checkLastEntry()
  }, [user])

  if (loading || !show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, scale: 0.95, height: 0 }}
        className="w-full max-w-xl mx-auto mb-6 p-4 rounded-[var(--radius-lg)] bg-gradient-to-r from-[#E8F0FA] to-[#E8F6F2] border border-[#6FA3D4]/30 shadow-sm relative overflow-hidden"
      >
        <div className="flex items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl origin-bottom-right animate-pulse">👋</span>
            <div>
              <h4 className="text-sm font-bold text-[var(--color-text-primary)]">Sudah lama nggak cerita</h4>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Yuk check-in mood kamu hari ini, biar nggak numpuk di kepala!</p>
            </div>
          </div>
          <button 
            onClick={() => setShow(false)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1 cursor-pointer"
            aria-label="Tutup pengingat"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
