/**
 * Konfigurasi mood untuk seluruh aplikasi Peka.
 * Setiap mood punya warna, emoji, dan label yang konsisten.
 * 
 * Dibagi jadi 2 grup: mood negatif (butuh support) dan positif (celebratory).
 */
export const MOODS = [
  // === Mood Negatif ===
  {
    id: 'kewalahan',
    label: 'Kewalahan',
    emoji: '😵‍💫',
    color: '#F4A261',
    colorLight: '#FFF3E6',
    colorDark: '#E76F51',
    description: 'Rasanya terlalu banyak yang harus diurus',
    group: 'negative',
  },
  {
    id: 'cemas',
    label: 'Cemas',
    emoji: '😰',
    color: '#B5A3D4',
    colorLight: '#F0EBF8',
    colorDark: '#7C5CBF',
    description: 'Ada yang bikin gelisah atau khawatir',
    group: 'negative',
  },
  {
    id: 'kesal',
    label: 'Kesal',
    emoji: '😤',
    color: '#D4A0A0',
    colorLight: '#FBE8E8',
    colorDark: '#C0635F',
    description: 'Sesuatu bikin jengkel atau frustrasi',
    group: 'negative',
  },
  {
    id: 'sedih',
    label: 'Sedih',
    emoji: '😢',
    color: '#89B4D4',
    colorLight: '#E6F0FA',
    colorDark: '#4A7FB5',
    description: 'Hati terasa berat atau murung',
    group: 'negative',
  },
  {
    id: 'capek',
    label: 'Capek',
    emoji: '😮‍💨',
    color: '#A3B9A8',
    colorLight: '#EDF3EE',
    colorDark: '#6B8E6B',
    description: 'Energi habis, butuh istirahat',
    group: 'negative',
  },

  // === Mood Positif ===
  {
    id: 'senang',
    label: 'Senang',
    emoji: '😊',
    color: '#F2C85B',
    colorLight: '#FFF9E6',
    colorDark: '#D4A017',
    description: 'Ada hal baik yang bikin hati hangat',
    group: 'positive',
  },
  {
    id: 'bersemangat',
    label: 'Semangat',
    emoji: '🤩',
    color: '#FF8A80',
    colorLight: '#FFF0EE',
    colorDark: '#E04E3E',
    description: 'Penuh energi dan antusias!',
    group: 'positive',
  },
  {
    id: 'santai',
    label: 'Santai',
    emoji: '😌',
    color: '#7EC8B8',
    colorLight: '#E8F6F2',
    colorDark: '#3D9B85',
    description: 'Tenang, damai, nggak buru-buru',
    group: 'positive',
  },
  {
    id: 'percaya-diri',
    label: 'PD',
    emoji: '😎',
    color: '#6FA3D4',
    colorLight: '#E8F0FA',
    colorDark: '#3A6FA0',
    description: 'Merasa yakin dan bangga sama diri sendiri',
    group: 'positive',
  },
  {
    id: 'romantis',
    label: 'Romantis',
    emoji: '🥰',
    color: '#E8A0C0',
    colorLight: '#FDF0F5',
    colorDark: '#C4557A',
    description: 'Hati berbunga-bunga, penuh kasih sayang',
    group: 'positive',
  },
]

/**
 * Helper untuk mendapatkan data mood berdasarkan ID
 */
export function getMoodById(id) {
  return MOODS.find((mood) => mood.id === id)
}

/**
 * Helper untuk mendapatkan mood negatif saja
 */
export function getNegativeMoods() {
  return MOODS.filter((m) => m.group === 'negative')
}

/**
 * Helper untuk mendapatkan mood positif saja
 */
export function getPositiveMoods() {
  return MOODS.filter((m) => m.group === 'positive')
}
