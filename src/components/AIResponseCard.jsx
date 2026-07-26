import { motion } from 'framer-motion'
import { renderFormattedText } from '../lib/formatText'

/**
 * AIResponseCard — Kartu hasil saran micro-intervention dari LLM.
 * Muncul dengan animasi fade-in supaya terasa personal.
 * @param {string} response - Teks response dari AI
 * @param {object} mood - Objek mood yang dipilih (untuk styling)
 * @param {function} onNewCheckin - Callback untuk memulai check-in baru
 * @param {function} onViewHistory - Callback untuk navigasi ke riwayat
 */
export default function AIResponseCard({ response, mood, onNewCheckin, onViewHistory }) {
  // Format paragraf dari response (split by newlines)
  const paragraphs = response
    .split('\n')
    .filter((p) => p.trim().length > 0)

  return (
    <motion.div
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* Header — "Saran untukmu" */}
      <motion.div
        className="flex items-center gap-2 mb-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ backgroundColor: mood?.colorLight, color: mood?.colorDark }}
        >
          💬
        </div>
        <span
          className="text-sm font-semibold"
          style={{ color: mood?.colorDark || 'var(--color-text-primary)' }}
        >
          Saran untukmu
        </span>
      </motion.div>

      {/* Response card */}
      <motion.div
        className="p-5 rounded-[var(--radius-xl)] border"
        style={{
          backgroundColor: `${mood?.colorLight}CC` || 'var(--color-bg-card)',
          borderColor: `${mood?.color}40`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="space-y-3">
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-text-primary)' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4 + index * 0.15,
                duration: 0.4,
              }}
            >
              {renderFormattedText(paragraph)}
            </motion.p>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 mt-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <button
          onClick={onNewCheckin}
          className="flex-1 py-3 px-4 rounded-[var(--radius-md)] font-medium text-sm transition-all duration-200 cursor-pointer border-2"
          style={{
            backgroundColor: mood?.colorLight,
            borderColor: mood?.color,
            color: mood?.colorDark,
          }}
          id="btn-new-checkin"
        >
          Check-in lagi
        </button>
        <button
          onClick={onViewHistory}
          className="flex-1 py-3 px-4 rounded-[var(--radius-md)] font-medium text-sm transition-all duration-200 cursor-pointer text-white"
          style={{
            backgroundColor: mood?.colorDark,
          }}
          id="btn-view-history"
        >
          Lihat riwayat →
        </button>
      </motion.div>
    </motion.div>
  )
}
