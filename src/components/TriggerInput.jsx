import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * TriggerInput — Text area untuk user mengetik pemicu mood.
 * @param {string} value - Nilai input saat ini
 * @param {(value: string) => void} onChange - Callback saat value berubah
 * @param {boolean} disabled - Disable input saat loading
 * @param {object|null} selectedMood - Objek mood yang dipilih (untuk styling dinamis)
 */
export default function TriggerInput({ value, onChange, disabled = false, selectedMood }) {
  const [isFocused, setIsFocused] = useState(false)
  const maxLength = 280

  const dynamicPlaceholders = {
    'kewalahan': 'Tugas numpuk, bingung mau mulai dari mana...',
    'cemas': 'Besok ada presentasi, takut salah ngomong...',
    'kesal': 'Abis dimarahin bos padahal bukan salahku...',
    'sedih': 'Merasa kesepian karena diputusin pacar...',
    'capek': 'Kerja dari pagi sampai malam, nggak ada berhentinya...',
    'senang': 'Baru dapet kabar baik hari ini! Yay!',
    'bersemangat': 'Hari pertama mulai project impian!',
    'santai': 'Lagi ngopi sambil dengerin playlist favorit...',
    'percaya-diri': 'Baru aja berhasil nyelesaiin tantangan besar!',
    'romantis': 'Pasangan ngasih kejutan manis banget hari ini...',
  }

  const genericPlaceholders = [
    'Lagi overthinking soal masa depan...',
    'Temen-temen pada jalan, aku nggak diajak...',
  ]

  const placeholder = selectedMood?.id 
    ? dynamicPlaceholders[selectedMood.id] || genericPlaceholders[0]
    : genericPlaceholders[Math.floor(Date.now() / 60000) % genericPlaceholders.length]

  return (
    <motion.div
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <label
        htmlFor="trigger-input"
        className="block text-sm font-medium mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Apa yang bikin kamu merasa begitu? 
        <span className="text-[var(--color-text-muted)] font-normal ml-1">(opsional)</span>
      </label>

      <div className="relative">
        <textarea
          id="trigger-input"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3 rounded-[var(--radius-md)] border-2 bg-white/60 resize-none transition-all duration-200 outline-none text-sm leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: isFocused
              ? (selectedMood?.color || 'var(--color-accent)')
              : 'var(--color-border-light)',
            boxShadow: isFocused
              ? `0 0 0 3px ${selectedMood?.color || 'var(--color-accent)'}20`
              : 'none',
          }}
        />

        {/* Character count */}
        <div className="absolute bottom-2 right-3 text-[10px] tabular-nums" style={{ color: 'var(--color-text-muted)' }}>
          {value.length}/{maxLength}
        </div>
      </div>
    </motion.div>
  )
}
