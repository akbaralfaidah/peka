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
  const [isSignUp, setIsSignUp] = useState(true)
  
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
        setMessage('Pendaftaran berhasil! Silakan cek email untuk verifikasi atau langsung masuk.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat otentikasi.')
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
          <div className="relative z-10 flex items-center gap-3 mb-auto">
            <img src="/peka.png" alt="Peka Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
            <span className="font-extrabold text-3xl tracking-tight text-[#2B2353]">Peka</span>
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

          <div className="relative z-10 mt-auto">
            <p className="text-[#2B2353]/70 font-medium text-lg leading-snug">
              Pahami perasaanmu, <br/>
              karena setiap mood itu valid.
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
                  onClick={() => setIsSignUp(!isSignUp)}
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
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[#111] focus:ring-[#111]"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                    I agree to the <a href="#" className="text-pink-500 font-medium hover:underline">Platform's Terms of Service</a> and <a href="#" className="text-pink-500 font-medium hover:underline">Privacy Policies</a>
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
            <div className="flex justify-center gap-4">
              <button 
                type="button"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                title="Google Login (Coming Soon)"
                onClick={() => alert("Google Login akan segera hadir!")}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
