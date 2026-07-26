import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  )
}

const emojis = [
  { char: '😊', name: 'senang', color: '#F2C85B' },
  { char: '😡', name: 'marah', color: '#F26D5B' },
  { char: '😢', name: 'sedih', color: '#5B9CF2' },
  { char: '😫', name: 'capek', color: '#A3B9A8' },
  { char: '🥰', name: 'romantis', color: '#F285B1' }
]

export default function LoginPage() {
  const { user } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const [emojiIndex, setEmojiIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setEmojiIndex((prev) => (prev + 1) % emojis.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  if (user) {
    return <Navigate to="/home" replace />
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: name
            }
          }
        })
        if (error) throw error
        setIsSignUp(false)
        setMessage('Pendaftaran berhasil! Silakan cek email untuk verifikasi atau langsung masuk.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (err) {
      if (err.message === 'Email not confirmed') {
        setError('Email Anda belum terverifikasi. Silakan buka kotak masuk email Anda dan klik link verifikasi untuk melanjutkan.')
      } else {
        setError(err.message || 'Terjadi kesalahan saat otentikasi.')
      }
    } finally {
      setLoading(false)
    }
  }

  const currentEmoji = emojis[emojiIndex]

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 p-4 sm:p-8">
      {/* Main Container - 2 columns on desktop */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden h-auto min-h-[600px] md:h-[700px]">

        {/* LEFT COLUMN: Branding & 3D Animation */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#FFE3E8] via-[#EAE1FF] to-[#D5F0FF] relative flex flex-col p-10 sm:p-12 md:p-16 overflow-hidden">
          {/* Logo */}
          <div className="relative z-10 flex justify-center mb-auto">
            <img src="/peka.png" alt="Peka Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-sm" />
          </div>

          {/* 3D Emoji Animation Area */}
          <div className="relative z-10 flex-1 flex items-center justify-center py-20 md:py-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEmoji.name}
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -30 }}
                transition={{ duration: 0.5 }}
                className="absolute"
              >
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotate: [-5, 5, -5]
                  }}
                  transition={{
                    y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="text-9xl md:text-[140px] drop-shadow-2xl select-none"
                  style={{ filter: `drop-shadow(0 20px 30px ${currentEmoji.color}60)` }}
                >
                  {currentEmoji.char}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 mt-auto flex justify-center">
            <p className="text-[#2B2353]/70 font-medium text-lg leading-snug text-center">
              Pahami perasaanmu, <br className="hidden md:block" />
              karena setiap mood itu penting.
            </p>
          </div>

          {/* Background Decorative Blurs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C8C2FF]/40 blur-3xl rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        </div>

        {/* RIGHT COLUMN: Form */}
        <div className="w-full md:w-7/12 bg-white flex flex-col justify-center p-8 sm:p-12 lg:p-20 relative">
          <div className="max-w-md w-full mx-auto">
            {/* Header Form */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {isSignUp ? 'Sign up' : 'Log in'}
              </h2>
              <div className="text-sm text-gray-500">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError(null)
                    setMessage(null)
                  }}
                  className="font-bold text-gray-900 hover:underline"
                >
                  {isSignUp ? 'Log in' : 'Sign up'}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100">
                {message}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              {/* Name Field (Only on Signup) */}
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required={isSignUp}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm outline-none focus:border-gray-400 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Email address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm outline-none focus:border-gray-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-5 py-3.5 pr-12 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm outline-none focus:border-gray-400 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              {isSignUp && (
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[#111] focus:ring-[#111] cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                    Saya menyetujui <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-[var(--color-accent)] font-bold hover:underline">Kebijakan Privasi</button> dan mengizinkan data mood saya dianalisis oleh AI untuk dukungan personalisasi.
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-[#0B0A1A] hover:bg-black text-white rounded-2xl font-semibold shadow-lg shadow-black/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    isSignUp ? 'Create account' : 'Log in'
                  )}
                </button>
              </div>
            </form>

            {/* Social Login Separator */}
            <div className="mt-10 mb-8 relative flex items-center justify-center">
              <div className="w-full h-px bg-gray-200 absolute"></div>
              <span className="bg-white px-4 text-xs font-medium text-gray-400 relative z-10">
                {isSignUp ? 'or sign up with' : 'or log in with'}
              </span>
            </div>

            {/* Social Buttons */}
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex items-start gap-3 w-full">
                <input
                  type="checkbox"
                  id="google-terms"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked)
                    if (e.target.checked) setError(null)
                  }}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#111] focus:ring-[#111] cursor-pointer shrink-0"
                />
                <label htmlFor="google-terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer text-left">
                  Untuk melanjutkan dengan Google, saya menyetujui <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-[var(--color-accent)] font-bold hover:underline">Kebijakan Privasi</button> AI.
                </label>
              </div>

              <button
                type="button"
                className="w-full py-3.5 px-6 border border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700"
                onClick={async () => {
                  if (!termsAccepted) {
                    setError('Kamu harus menyetujui Kebijakan Privasi terlebih dahulu untuk melanjutkan dengan Google.')
                    return
                  }
                  try {
                    setLoading(true)
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: `${window.location.origin}/home`
                      }
                    })
                    if (error) throw error
                  } catch (err) {
                    setError(err.message)
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Lanjutkan dengan Google
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-[var(--radius-xl)] p-6 max-w-lg w-full shadow-[var(--shadow-xl)] relative max-h-[80vh] flex flex-col"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
            >
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Kebijakan Privasi & AI Peka</h3>
              <div className="overflow-y-auto pr-2 space-y-4 text-sm text-[var(--color-text-secondary)] flex-1">
                <p>
                  Halo! Terima kasih sudah percaya pada <strong>Peka</strong>. Kami sangat peduli dengan privasi dan keamanan datamu.
                </p>
                <div className="bg-[var(--color-mood-senang-light)] p-4 rounded-xl border border-orange-100">
                  <h4 className="font-bold text-[var(--color-text-primary)] mb-2">Bagaimana AI Memproses Datamu?</h4>
                  <ul className="list-disc pl-4 space-y-2 text-orange-900/80">
                    <li>Peka menggunakan teknologi <strong>AI (Large Language Model)</strong> untuk menganalisis curhatanmu dan memberikan dukungan emosional.</li>
                    <li>Teks curhatan dan riwayat mood harianmu dikirimkan ke server AI secara <strong>anonim</strong> sesaat, hanya untuk tujuan membaca konteks keseharianmu.</li>
                    <li>Kami <strong>tidak</strong> merekam data ini untuk pengiklan dan <strong>tidak</strong> menjual data privasimu.</li>
                  </ul>
                </div>
                <p>
                  Dengan mencentang atau menggunakan aplikasi ini, kamu mengizinkan sistem kami membaca riwayat moodmu di hari yang sama untuk memberikan respons yang lebih mengerti kondisimu ("Context-Aware AI").
                </p>
                <p>
                  Kamu berhak menghapus riwayatmu kapan saja jika kamu merasa tidak nyaman. Jaga kesehatan mentalmu! 💛
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-[var(--color-border-light)] flex justify-end">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-[var(--radius-full)] hover:bg-gray-800 transition-colors"
                >
                  Saya Mengerti
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
