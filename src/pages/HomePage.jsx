import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getMoodById } from '../lib/moods'
import { generateIntervention } from '../lib/gemini'
import { supabase } from '../lib/supabase'
import MoodPicker from '../components/MoodPicker'
import TriggerInput from '../components/TriggerInput'
import AIResponseCard from '../components/AIResponseCard'
import LoadingAI from '../components/LoadingAI'
import StreakBadge from '../components/StreakBadge'
import { calculateStreak } from '../lib/streak'

/**
 * HomePage — Halaman utama Mood Check-in.
 *
 * Flow:
 * 1. User pilih mood dari MoodPicker
 * 2. User isi pemicu (opsional) di TriggerInput
 * 3. Tekan "Kirim" → generate micro-intervention via Gemini
 * 4. Tampilkan AIResponseCard dengan saran
 * 5. Simpan entry ke Supabase
 */

const STEP = {
  SELECT: 'select',
  LOADING: 'loading',
  RESULT: 'result',
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

export default function HomePage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(STEP.SELECT)
  const [selectedMood, setSelectedMood] = useState(null)
  const [triggerText, setTriggerText] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [error, setError] = useState(null)
  
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const [streak, setStreak] = useState(0)

  const currentMood = selectedMood ? getMoodById(selectedMood) : null
  const greeting = useMemo(() => getGreeting(), [])

  useEffect(() => {
    if (!user) return
    const fetchStreak = async () => {
      const { data } = await supabase
        .from('mood_entries')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (data) {
        setStreak(calculateStreak(data.map(d => d.created_at)))
      }
    }
    fetchStreak()
  }, [user])

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!selectedMood) return

    setStep(STEP.LOADING)
    setError(null)

    try {
      const response = await generateIntervention(selectedMood, triggerText || '(tidak disebutkan)')

      const { error: dbError } = await supabase.from('mood_entries').insert({
        user_id: user.id,
        mood: selectedMood,
        trigger_text: triggerText || null,
        ai_response: response,
      })

      if (dbError) {
        console.error('Supabase insert error:', dbError)
      }

      setAiResponse(response)
      setStep(STEP.RESULT)
    } catch (err) {
      console.error('Check-in failed:', err)
      setError(err.message || 'Gagal mendapatkan saran. Coba lagi ya.')
      setStep(STEP.SELECT)
    }
  }, [selectedMood, triggerText, user])

  const handleNewCheckin = useCallback(() => {
    setStep(STEP.SELECT)
    setSelectedMood(null)
    setTriggerText('')
    setAiResponse('')
    setError(null)
  }, [])

  const handleViewHistory = useCallback(() => {
    navigate('/history')
  }, [navigate])

  // Display name dari metadata (jika ada) atau fallback ke email
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || ''

  return (
    <div className="min-h-[100dvh] flex flex-col gradient-warm relative overflow-hidden">

      {/* Decorative blobs — animasi warna mengikuti mood */}
      <motion.div
        className="absolute top-[-20%] right-[-15%] w-[55vw] h-[55vw] rounded-full blur-[80px] opacity-30 pointer-events-none"
        animate={{
          backgroundColor: currentMood?.colorLight || '#F0EBF8',
        }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        className="absolute bottom-[-15%] left-[-12%] w-[45vw] h-[45vw] rounded-full blur-[80px] opacity-30 pointer-events-none"
        animate={{
          backgroundColor: currentMood?.color || '#FFF3E6',
        }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        className="absolute top-[30%] left-[50%] w-[25vw] h-[25vw] rounded-full blur-[60px] opacity-20 pointer-events-none"
        animate={{
          backgroundColor: currentMood?.colorDark || '#B5A3D4',
          x: currentMood ? -20 : 0,
        }}
        transition={{ duration: 1.5 }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <img src="/peka.png" alt="Peka" className="w-9 h-9 object-contain" />
          <span className="font-bold text-[var(--color-text-primary)] text-lg tracking-tight">Peka</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleViewHistory}
            className="px-3.5 py-2 text-xs font-medium rounded-[var(--radius-full)] glass text-[var(--color-text-secondary)] hover:bg-white/80 transition-all cursor-pointer"
            id="btn-header-history"
          >
            📋 Riwayat
          </button>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="px-3.5 py-2 text-xs font-medium rounded-[var(--radius-full)] bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-100 hover:border-red-500 transition-all cursor-pointer"
            id="btn-signout"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col px-4 sm:px-6 py-4 sm:py-6">

        <AnimatePresence mode="wait">

          {/* ========================= STEP: SELECT ========================= */}
          {step === STEP.SELECT && (
            <motion.div
              key="select"
              className="w-full max-w-xl mx-auto flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Greeting card */}
              <motion.div
                className="glass rounded-[var(--radius-xl)] p-5 sm:p-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="text-4xl sm:text-5xl select-none"
                    animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                    transition={{ duration: 2.5, delay: 0.5 }}
                  >
                    👋
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h1 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] leading-snug truncate">
                        {greeting}, {displayName}!
                      </h1>
                      <StreakBadge streak={streak} />
                    </div>
                    <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                      Apa yang kamu rasakan sekarang? Pilih mood di bawah dan ceritakan sedikit — kita cari jalan keluarnya bareng.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="p-3 rounded-[var(--radius-md)] text-sm text-center"
                    style={{
                      backgroundColor: 'var(--color-mood-kesal-light)',
                      color: 'var(--color-mood-kesal-dark)',
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mood Picker */}
              <MoodPicker
                selected={selectedMood}
                onSelect={setSelectedMood}
                disabled={false}
              />

              {/* Mood description */}
              <AnimatePresence mode="wait">
                {currentMood && (
                  <motion.div
                    key={currentMood.id}
                    className="text-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p
                      className="text-xs italic py-1"
                      style={{ color: currentMood.colorDark }}
                    >
                      „{currentMood.description}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trigger Input — muncul setelah mood dipilih */}
              <AnimatePresence>
                {selectedMood && (
                  <motion.div
                    className="w-full"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <TriggerInput
                      value={triggerText}
                      onChange={setTriggerText}
                      selectedMood={currentMood}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <AnimatePresence>
                {selectedMood && (
                  <motion.button
                    onClick={handleSubmit}
                    className="w-full py-3.5 px-6 rounded-[var(--radius-md)] font-semibold text-sm text-white cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                    style={{
                      backgroundColor: currentMood?.colorDark || 'var(--color-accent)',
                      boxShadow: `0 4px 16px ${currentMood?.color || 'var(--color-accent)'}45`,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.08, duration: 0.3 }}
                    id="btn-submit-checkin"
                  >
                    Kirim & Dapatkan Saran ✨
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ========================= STEP: LOADING ========================= */}
          {step === STEP.LOADING && (
            <motion.div
              key="loading"
              className="flex-1 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingAI mood={currentMood} />
            </motion.div>
          )}

          {/* ========================= STEP: RESULT ========================= */}
          {step === STEP.RESULT && (
            <motion.div
              key="result"
              className="w-full max-w-xl mx-auto py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AIResponseCard
                response={aiResponse}
                mood={currentMood}
                onNewCheckin={handleNewCheckin}
                onViewHistory={handleViewHistory}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 text-center px-4 py-3 shrink-0">
        <p className="text-[10px] text-[var(--color-text-muted)] max-w-sm mx-auto leading-relaxed">
          Bukan pengganti bantuan profesional. Kalau kamu butuh dukungan lebih, hubungi profesional kesehatan mental atau hubungi 119.
        </p>
      </footer>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center relative z-50"
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="text-5xl mb-4">🚪</div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Yakin ingin keluar?</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Sesi kamu akan diakhiri. Kamu harus login kembali untuk mencatat mood atau melihat riwayatmu.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 px-4 rounded-[var(--radius-full)] bg-gray-100 text-[var(--color-text-secondary)] font-medium hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setShowLogoutModal(false)
                    signOut()
                  }}
                  className="flex-1 py-3 px-4 rounded-[var(--radius-full)] bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
                >
                  Ya, Keluar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
