import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // State toggles
  const [isSignUp, setIsSignUp] = useState(false)
  const [useMagicLink, setUseMagicLink] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  // Redirect to home if already logged in
  if (user) {
    return <Navigate to="/home" replace />
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (useMagicLink) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            // Ini asumsi URL yang dipakai untuk redirect balik
            emailRedirectTo: window.location.origin + '/home',
          },
        })
        if (error) throw error
        setMessage('Cek email kamu untuk link login ajaib! ✨')
      } else {
        if (isSignUp) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
          })
          if (error) throw error
          setMessage('Pendaftaran berhasil! Silakan cek email untuk verifikasi (jika diaktifkan) atau langsung login.')
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (error) throw error
          // Kalau berhasil, onAuthStateChange di AuthContext akan ke-trigger
          // dan komponen ini akan re-render, memicu <Navigate to="/home" />
        }
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat otentikasi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-warm">

      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-mood-cemas-light)] blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[var(--color-mood-kewalahan-light)] blur-3xl opacity-60 pointer-events-none" />

      <div className="w-full max-w-md p-8 glass rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] relative z-10">
        <div className="text-center mb-8">
          <img src="/peka.png" alt="Peka Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />
          <p className="text-[var(--color-text-secondary)]">
            Ruang aman untuk jujur pada perasaanmu.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[var(--color-mood-kesal-light)] text-[var(--color-mood-kesal-dark)] rounded-[var(--radius-md)] text-sm text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-[var(--color-mood-capek-light)] text-[var(--color-mood-capek-dark)] rounded-[var(--radius-md)] text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white/50 focus:bg-white focus:border-[var(--color-accent)] transition-all outline-none"
              placeholder="nama@email.com"
            />
          </div>

          {!useMagicLink && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white/50 focus:bg-white focus:border-[var(--color-accent)] transition-all outline-none"
                placeholder="Minimal 6 karakter"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[var(--color-text-primary)] text-white rounded-[var(--radius-md)] font-medium hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : useMagicLink ? (
              'Kirim Magic Link ✨'
            ) : isSignUp ? (
              'Daftar'
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3 text-sm">
          {!useMagicLink && (
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
                setMessage(null)
              }}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {isSignUp ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar dulu'}
            </button>
          )}

          <div className="w-full h-px bg-[var(--color-border-light)] my-2 relative">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-bg-primary)] px-2 text-[var(--color-text-muted)] text-xs">
              ATAU
            </span>
          </div>

          <button
            onClick={() => {
              setUseMagicLink(!useMagicLink)
              setError(null)
              setMessage(null)
            }}
            className="text-[var(--color-accent)] font-medium hover:text-[var(--color-accent-dark)] transition-colors"
          >
            {useMagicLink ? 'Gunakan password biasa' : 'Masuk tanpa password (Magic Link)'}
          </button>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="absolute bottom-4 left-0 w-full text-center px-4">
        <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
          Bukan pengganti bantuan profesional. Kalau kamu butuh dukungan lebih, hubungi profesional kesehatan mental.
        </p>
      </div>
    </div>
  )
}
