import { motion } from 'framer-motion'
import { MOODS } from '../lib/moods'

/**
 * MoodPicker — Grid kartu mood visual dengan animasi.
 * 10 mood (5 negatif + 5 positif), responsive:
 *   - Mobile kecil: 2 kolom (kartu besar)
 *   - Mobile: 3 kolom
 *   - Tablet+: 5 kolom (2 baris)
 *
 * @param {string|null} selected - ID mood yang sedang dipilih
 * @param {(moodId: string) => void} onSelect - Callback saat mood dipilih
 * @param {boolean} disabled - Disable interaction
 */
export default function MoodPicker({ selected, onSelect, disabled = false }) {
  const negativeMoods = MOODS.filter((m) => m.group === 'negative')
  const positiveMoods = MOODS.filter((m) => m.group === 'positive')

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Negatif */}
      <div>
        <p className="text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2 px-1">
          Lagi nggak enak
        </p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
          {negativeMoods.map((mood, index) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              index={index}
              isSelected={selected === mood.id}
              onSelect={onSelect}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      {/* Positif */}
      <div>
        <p className="text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2 px-1">
          Lagi positif ✨
        </p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
          {positiveMoods.map((mood, index) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              index={index + negativeMoods.length}
              isSelected={selected === mood.id}
              onSelect={onSelect}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function MoodCard({ mood, index, isSelected, onSelect, disabled }) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(mood.id)}
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.04,
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={!disabled ? { scale: 1.06, y: -3 } : {}}
      whileTap={!disabled ? { scale: 0.94 } : {}}
      className="flex flex-col items-center gap-1 py-3 px-2 rounded-[var(--radius-lg)] border-2 transition-all duration-200 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden basis-[calc(33.333%-0.5rem)] sm:basis-[calc(20%-0.5rem)]"
      style={{
        backgroundColor: isSelected ? mood.colorLight : 'rgba(255,255,255,0.65)',
        borderColor: isSelected ? mood.color : 'transparent',
        boxShadow: isSelected
          ? `0 6px 20px ${mood.color}35, 0 2px 6px ${mood.color}20`
          : '0 1px 4px rgba(0,0,0,0.04)',
      }}
      id={`mood-btn-${mood.id}`}
    >
      {/* Gradient shimmer on selected */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${mood.color}15 0%, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Emoji */}
      <motion.span
        className="text-3xl sm:text-[2rem] leading-none select-none relative z-10"
        animate={{
          scale: isSelected ? 1.25 : 1,
          rotate: isSelected ? [0, -8, 8, 0] : 0,
        }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {mood.emoji}
      </motion.span>

      {/* Label */}
      <span
        className="text-[11px] sm:text-xs font-semibold leading-tight text-center relative z-10"
        style={{
          color: isSelected ? mood.colorDark : 'var(--color-text-secondary)',
        }}
      >
        {mood.label}
      </span>
    </motion.button>
  )
}
