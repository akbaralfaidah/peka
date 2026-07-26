import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMoodById } from '../lib/moods'
import { supabase } from '../lib/supabase'

/**
 * MoodEntryCard — Menampilkan satu entry riwayat mood.
 * @param {object} entry - Data entry dari Supabase
 */
export default function MoodEntryCard({ entry }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [helpful, setHelpful] = useState(entry.helpful)
  const mood = getMoodById(entry.mood)

  if (!mood) return null

  const date = new Date(entry.created_at).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })

  const handleFeedback = async (isHelpful) => {
    // Optimistic update
    setHelpful(isHelpful)
    
    // Update db
    const { error } = await supabase
      .from('mood_entries')
      .update({ helpful: isHelpful })
      .eq('id', entry.id)

    if (error) {
      console.error('Failed to update feedback:', error)
      setHelpful(entry.helpful) // Revert on error
    }
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full glass rounded-[var(--radius-xl)] p-4 sm:p-5 border-l-4 overflow-hidden"
      style={{ borderLeftColor: mood.color }}
    >
      {/* Header: Emoji, Mood, Date */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 shadow-sm"
            style={{ backgroundColor: mood.colorLight }}
          >
            {mood.emoji}
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] leading-none mb-1">
              {mood.label}
            </h3>
            <p className="text-[10px] sm:text-xs text-[var(--color-text-muted)]">
              {date}
            </p>
          </div>
        </div>
      </div>

      {/* Trigger Text (if any) */}
      {entry.trigger_text && (
        <div className="mb-4">
          <p className="text-sm italic text-[var(--color-text-secondary)] border-l-2 border-[var(--color-border)] pl-3">
            "{entry.trigger_text}"
          </p>
        </div>
      )}

      {/* AI Response Preview / Full */}
      <div className="mt-3">
        <div 
          className={`text-sm text-[var(--color-text-primary)] leading-relaxed relative ${!isExpanded ? 'line-clamp-2' : ''}`}
        >
          {entry.ai_response}
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium mt-1 cursor-pointer hover:underline"
          style={{ color: mood.colorDark }}
        >
          {isExpanded ? 'Tutup selengkapnya' : 'Baca selengkapnya'}
        </button>
      </div>

      {/* Feedback Section (only show when expanded) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-[var(--color-border-light)]"
          >
            <p className="text-[11px] text-[var(--color-text-secondary)] mb-2 text-center">
              Apakah saran AI ini membantu?
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleFeedback(true)}
                className={`px-3 py-1.5 text-xs rounded-[var(--radius-full)] font-medium transition-colors cursor-pointer border ${
                  helpful === true 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-white/50 text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-white'
                }`}
              >
                👍 Membantu
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className={`px-3 py-1.5 text-xs rounded-[var(--radius-full)] font-medium transition-colors cursor-pointer border ${
                  helpful === false 
                    ? 'bg-red-100 text-red-700 border-red-200' 
                    : 'bg-white/50 text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-white'
                }`}
              >
                👎 Kurang
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
