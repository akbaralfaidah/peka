import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { getMoodById } from '../lib/moods'

export default function MoodChart({ entries }) {
  const distribution = useMemo(() => {
    if (!entries || entries.length === 0) return []

    const counts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {})

    const total = entries.length
    
    // Convert to array and sort by percentage descending
    const data = Object.keys(counts).map(moodId => {
      const moodDef = getMoodById(moodId)
      return {
        ...moodDef,
        count: counts[moodId],
        percentage: Math.round((counts[moodId] / total) * 100)
      }
    }).sort((a, b) => b.count - a.count)

    return data
  }, [entries])

  if (distribution.length === 0) return null

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-[var(--color-border-light)] mt-6">
      <h3 className="font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
        <span>📊</span> Distribusi Mood
      </h3>
      
      {/* Segmented Bar */}
      <div className="h-6 w-full rounded-full overflow-hidden flex shadow-inner bg-gray-100 mb-6">
        {distribution.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ width: 0 }}
            animate={{ width: `${item.percentage}%` }}
            transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
            className="h-full first:rounded-l-full last:rounded-r-full border-r border-white/20 last:border-0"
            style={{ backgroundColor: item.color }}
            title={`${item.label}: ${item.percentage}%`}
          />
        ))}
      </div>

      {/* Legend / Details */}
      <div className="space-y-3">
        {distribution.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-[var(--color-text-primary)]">{item.label}</span>
            </div>
            <div className="text-[var(--color-text-secondary)]">
              <span className="font-bold text-[var(--color-text-primary)]">{item.percentage}%</span>
              <span className="text-xs ml-1 opacity-60">({item.count}x)</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
