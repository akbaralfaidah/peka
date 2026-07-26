import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getMoodById } from '../lib/moods'

export default function MoodChart({ entries }) {
  const [timeFilter, setTimeFilter] = useState('7days')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const distribution = useMemo(() => {
    if (!entries || entries.length === 0) return []

    // Filter by time
    const filteredEntries = entries.filter(entry => {
      if (timeFilter === 'all') return true
      
      const entryDate = new Date(entry.created_at)
      const now = new Date()

      if (timeFilter === 'today') {
        return entryDate.toDateString() === now.toDateString()
      }

      if (timeFilter === 'custom') {
        if (!startDate || !endDate) return true
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        return entryDate >= start && entryDate <= end
      }
      
      const diffTime = Math.abs(now - entryDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (timeFilter === '7days') return diffDays <= 7
      if (timeFilter === '30days') return diffDays <= 30
      return true
    })

    if (filteredEntries.length === 0) return []

    const counts = filteredEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {})

    const total = filteredEntries.length
    
    // Convert to array and sort by percentage descending
    const data = Object.keys(counts).map(moodId => {
      const moodDef = getMoodById(moodId)
      const perc = Math.round((counts[moodId] / total) * 100)
      return {
        ...moodDef,
        count: counts[moodId],
        percentage: Math.max(1, perc) // Ensure at least 1% so it's visible
      }
    }).sort((a, b) => b.count - a.count)

    return data
  }, [entries, timeFilter])

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-[var(--color-border-light)] mt-6">
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <span>📊</span> Distribusi
          </h3>
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="text-xs bg-white/50 border border-gray-200 rounded-full px-3 py-1.5 text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] cursor-pointer"
          >
            <option value="today">Hari Ini</option>
            <option value="7days">7 Hari Terakhir</option>
            <option value="30days">30 Hari Terakhir</option>
            <option value="all">Semua Waktu</option>
            <option value="custom">Kustom Waktu</option>
          </select>
        </div>

        {timeFilter === 'custom' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]"
          >
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white/50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[var(--color-accent)] w-full"
            />
            <span>-</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white/50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[var(--color-accent)] w-full"
            />
          </motion.div>
        )}
      </div>
      
      {/* Segmented Bar */}
      {distribution.length > 0 ? (
        <div className="h-6 w-full rounded-full overflow-hidden flex shadow-inner bg-gray-100 mb-6">
          {distribution.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ width: 0 }}
              animate={{ width: `${item.percentage}%` }}
              transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
              className="h-full first:rounded-l-full last:rounded-r-full border-r border-white/20 last:border-0 min-w-[4px]"
              style={{ backgroundColor: item.color }}
              title={`${item.label}: ${item.percentage}%`}
            />
          ))}
        </div>
      ) : (
        <div className="h-6 w-full rounded-full bg-gray-100 mb-6 flex items-center justify-center">
          <span className="text-[10px] text-gray-400">Belum ada data</span>
        </div>
      )}

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
