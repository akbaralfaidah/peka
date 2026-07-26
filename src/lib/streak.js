/**
 * Menghitung streak berdasarkan array tanggal.
 * @param {Array<string>} dates - Array of ISO date strings (misal '2026-07-26')
 * @returns {number} - Jumlah streak dalam hari
 */
export function calculateStreak(dates) {
  if (!dates || dates.length === 0) return 0

  // Buat set untuk tanggal unik (hanya format YYYY-MM-DD)
  const uniqueDates = [...new Set(dates.map((d) => new Date(d).toISOString().split('T')[0]))]
  
  // Sort descending (terbaru dulu)
  uniqueDates.sort((a, b) => new Date(b) - new Date(a))

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  const mostRecent = uniqueDates[0]

  // Jika check-in terakhir bukan hari ini dan bukan kemarin, streak hangus (0)
  if (mostRecent !== todayStr && mostRecent !== yesterdayStr) {
    return 0
  }

  let streak = 0
  let expectedDate = new Date(mostRecent)

  for (let i = 0; i < uniqueDates.length; i++) {
    const d = new Date(uniqueDates[i])
    const expectedStr = expectedDate.toISOString().split('T')[0]
    const currentStr = d.toISOString().split('T')[0]

    if (currentStr === expectedStr) {
      streak++
      expectedDate.setDate(expectedDate.getDate() - 1) // mundur 1 hari
    } else {
      break // Streak putus
    }
  }

  return streak
}
