import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">
        Home — Mood Check-in (Coming in Tahap 5)
      </h1>
      <p className="mb-8 text-gray-500">Logged in as: {user?.email}</p>
      <button 
        onClick={signOut}
        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
      >
        Keluar
      </button>
    </div>
  )
}
