import { motion } from 'framer-motion'

/**
 * LoadingAI — Animasi loading saat menunggu response dari Gemini API.
 * Menampilkan animasi titik-titik dan pesan yang menenangkan.
 * @param {object|null} mood - Objek mood yang dipilih
 */
export default function LoadingAI({ mood }) {
  const messages = [
    'Sedang memahami perasaanmu...',
    'Menyiapkan saran yang pas...',
    'Sebentar ya, lagi mikir...',
  ]

  return (
    <motion.div
      className="w-full max-w-lg mx-auto text-center py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated emoji */}
      <motion.div
        className="text-5xl mb-6 select-none"
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {mood?.emoji || '🤔'}
      </motion.div>

      {/* Loading dots */}
      <div className="flex items-center justify-center gap-1.5 mb-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: mood?.color || 'var(--color-accent)' }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Rotating messages */}
      <motion.p
        className="text-sm"
        style={{ color: mood?.colorDark || 'var(--color-text-secondary)' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {messages[Math.floor(Date.now() / 3000) % messages.length]}
      </motion.p>
    </motion.div>
  )
}
