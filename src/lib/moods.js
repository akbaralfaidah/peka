/**
 * Konfigurasi mood untuk seluruh aplikasi Peka.
 * Setiap mood punya warna, emoji, dan label yang konsisten.
 */
export const MOODS = [
  {
    id: 'kewalahan',
    label: 'Kewalahan',
    emoji: '😵‍💫',
    color: '#F4A261',       // Oranye lembut
    colorLight: '#FFF3E6',  // Background light
    colorDark: '#E76F51',   // Accent dark
    description: 'Rasanya terlalu banyak yang harus diurus',
  },
  {
    id: 'cemas',
    label: 'Cemas',
    emoji: '😰',
    color: '#B5A3D4',       // Ungu muda
    colorLight: '#F0EBF8',  // Background light
    colorDark: '#7C5CBF',   // Accent dark
    description: 'Ada yang bikin gelisah atau khawatir',
  },
  {
    id: 'kesal',
    label: 'Kesal',
    emoji: '😤',
    color: '#D4A0A0',       // Merah muda dusty
    colorLight: '#FBE8E8',  // Background light
    colorDark: '#C0635F',   // Accent dark
    description: 'Sesuatu bikin jengkel atau frustrasi',
  },
  {
    id: 'sedih',
    label: 'Sedih',
    emoji: '😢',
    color: '#89B4D4',       // Biru muda
    colorLight: '#E6F0FA',  // Background light
    colorDark: '#4A7FB5',   // Accent dark
    description: 'Hati terasa berat atau murung',
  },
  {
    id: 'capek',
    label: 'Capek',
    emoji: '😮‍💨',
    color: '#A3B9A8',       // Abu-abu kehijauan
    colorLight: '#EDF3EE',  // Background light
    colorDark: '#6B8E6B',   // Accent dark
    description: 'Energi habis, butuh istirahat',
  },
]

/**
 * Helper untuk mendapatkan data mood berdasarkan ID
 */
export function getMoodById(id) {
  return MOODS.find((mood) => mood.id === id)
}
