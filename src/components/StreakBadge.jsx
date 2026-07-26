import { motion } from 'framer-motion'

export default function StreakBadge({ streak }) {
  if (streak === 0) return null

  // Tentukan tingkatan (tier) dari streak
  let tier = 'normal'
  if (streak >= 500) tier = 'legendary'
  else if (streak >= 200) tier = 'epic'
  else if (streak >= 100) tier = 'rare'
  else if (streak >= 30) tier = 'advanced'
  else if (streak >= 10) tier = 'hot'

  const styles = {
    normal: { bg: 'bg-orange-100', text: 'text-orange-600', shadow: '', icon: '🔥', animation: {} },
    hot: { bg: 'bg-orange-500', text: 'text-white', shadow: 'shadow-lg shadow-orange-500/40', icon: '🔥', animation: { scale: [1, 1.05, 1] } },
    advanced: { bg: 'bg-red-500', text: 'text-white', shadow: 'shadow-lg shadow-red-500/50', icon: '☄️', animation: { scale: [1, 1.1, 1] } },
    rare: { bg: 'bg-purple-600', text: 'text-white', shadow: 'shadow-xl shadow-purple-600/50', icon: '🔮', animation: { scale: [1, 1.1, 1] } },
    epic: { bg: 'bg-gradient-to-r from-yellow-400 to-yellow-600', text: 'text-white', shadow: 'shadow-2xl shadow-yellow-500/60', icon: '👑', animation: { scale: [1, 1.15, 1] } },
    legendary: { bg: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500', text: 'text-white', shadow: 'shadow-2xl shadow-pink-500/60', icon: '🌌', animation: { scale: [1, 1.2, 1] } },
  }

  const currentStyle = styles[tier]

  return (
    <motion.div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm ${currentStyle.bg} ${currentStyle.text} ${currentStyle.shadow}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      title={`${streak} Hari Berturut-turut!`}
    >
      <motion.span
        animate={currentStyle.animation}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {currentStyle.icon}
      </motion.span>
      <span>{streak} Hari</span>
    </motion.div>
  )
}
