import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

/**
 * Inline SVG icons for password visibility toggle
 */
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

export default function LoginPage() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
            emailRedirectTo: window.location.origin + '/home',
          },
        })
        if (error) throw error
        setMessage('Cek email kamu untuk link login ajaib! ✨ Kalau belum punya akun, akun baru akan otomatis dibuat.')
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
    <div className="h-[100dvh] flex flex-col gradient-warm relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-mood-cemas-light)] blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[var(--color-mood-kewalahan-light)] blur-3xl opacity-60 pointer-events-none" />

      {/* Card container — centers card vertically */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md p-8 glass rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]">
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
                id="input-email"
              />
            </div>

            {!useMagicLink && (
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white/50 focus:bg-white focus:border-[var(--color-accent)] transition-all outline-none"
                    placeholder="Minimal 6 karakter"
                    id="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer p-0.5"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    id="btn-toggle-password"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[var(--color-text-primary)] text-white rounded-[var(--radius-md)] font-medium hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              id="btn-auth-submit"
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
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                id="btn-toggle-signup"
              >
                {isSignUp ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar dulu'}
              </button>
            )}

            <div className="w-full h-px bg-[var(--color-border-light)] my-2 relative">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/70 backdrop-blur px-2 text-[var(--color-text-muted)] text-xs">
                ATAU
              </span>
            </div>

            <button
              onClick={() => {
                setUseMagicLink(!useMagicLink)
                setError(null)
                setMessage(null)
              }}
              className="text-[var(--color-accent)] font-medium hover:text-[var(--color-accent-dark)] transition-colors cursor-pointer"
              id="btn-toggle-magic-link"
            >
              {useMagicLink ? 'Gunakan password biasa' : 'Masuk tanpa password'}
            </button>

            {useMagicLink && (
              <p className="text-[11px] text-[var(--color-text-muted)] text-center leading-relaxed">
                Magic link bisa dipakai untuk login <strong>dan</strong> daftar akun baru. Tinggal masukkan email, link akan dikirim.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Disclaimer — sits at the bottom */}
      <div className="relative z-10 text-center px-4 py-4 shrink-0">
        <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
          Bukan pengganti bantuan profesional. Kalau kamu butuh dukungan lebih, hubungi profesional kesehatan mental.
        </p>
      </div>
    </div>
  )
}
