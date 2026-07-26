const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

/**
 * Generate micro-intervention dari Gemini API berdasarkan mood dan trigger user.
 * @param {string} mood - Mood yang dipilih user (kewalahan, cemas, kesal, sedih, capek, senang, bersemangat, santai, percaya-diri, romantis)
 * @param {string} trigger - Teks pemicu yang diketik user
 * @returns {Promise<string>} - Saran/micro-intervention dari AI
 */
export async function generateIntervention(mood, trigger) {
  const prompt = `Kamu adalah teman yang hangat dan penuh empati. Seseorang sedang merasa "${mood}" karena: "${trigger}".

Berikan saran micro-intervention yang bisa dilakukan dalam 2 menit. Aturan:
- Gunakan bahasa Indonesia santai, panggil "kamu"
- Validasi perasaannya dulu sebelum memberi saran
- Jangan menghakimi atau terlalu positif-toxic ("selalu semangat ya!")
- Saran harus spesifik dan actionable, bukan generik
- Kalau mood-nya positif (senang, bersemangat, santai, percaya diri, romantis), apresiasi perasaannya dan beri saran untuk menikmati/mempertahankan momen itu
- Maksimal 3-4 paragraf pendek
- Jangan pakai emoji berlebihan`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 512,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackResponse(mood)
  } catch (error) {
    console.error('Gemini API failed:', error)
    return getFallbackResponse(mood)
  }
}

/**
 * Fallback response jika Gemini API gagal/timeout
 */
function getFallbackResponse(mood) {
  const fallbacks = {
    kewalahan: 'Wajar banget kalau kamu merasa kewalahan. Coba tarik napas dalam 4 detik, tahan 4 detik, keluarkan 4 detik. Ulangi 3 kali. Kadang yang kita butuhkan cuma jeda sebentar untuk mengatur ulang pikiran.',
    cemas: 'Rasa cemas itu sinyal dari tubuhmu bahwa ada sesuatu yang perlu diperhatikan. Coba tulis 3 hal yang bisa kamu kontrol sekarang, dan 3 hal yang di luar kendalimu. Fokus ke yang bisa kamu kontrol dulu.',
    kesal: 'Kesal itu wajar, dan kamu nggak harus langsung "baik-baik aja". Coba gerakkan badanmu — jalan kaki sebentar, stretching, atau cuci muka dengan air dingin. Kadang emosi butuh dilepaskan lewat fisik.',
    sedih: 'Sedih itu bukan kelemahan. Kalau kamu butuh nangis, nangis aja. Coba dengarkan satu lagu yang kamu suka sambil merem sebentar. Beri dirimu izin untuk nggak apa-apa dulu.',
    capek: 'Capek itu tubuhmu ngasih tahu bahwa kamu butuh istirahat. Kalau bisa, istirahat 10 menit — bukan scroll HP, tapi beneran tutup mata. Kamu nggak harus produktif terus-terusan.',
    senang: 'Seneng banget ya dengernya! Momen kayak gini berharga. Coba tulis atau screenshot perasaan ini — biar nanti kalau lagi down, kamu bisa baca lagi dan ingat bahwa hal-hal baik itu ada.',
    bersemangat: 'Wah, energi positif kamu lagi tinggi banget! Manfaatin momentum ini — kerjain satu hal yang udah lama kamu tunda. Tapi jangan lupa tetap stay hydrated dan jaga ritme ya.',
    santai: 'Nikmatilah momen tenang ini. Nggak harus selalu sibuk kok. Coba senderan sebentar, hirup udara dalam-dalam, dan rasakan betapa enaknya punya waktu buat diri sendiri.',
    'percaya-diri': 'Keren banget! Percaya diri itu aset yang berharga. Coba tuliskan apa yang bikin kamu merasa begini — biar bisa kamu baca ulang di hari-hari yang kurang yakin.',
    romantis: 'Aww, hati lagi berbunga-bunga ya? Nikmati perasaan hangat ini. Kalau ada orang yang bikin kamu merasa begini, mungkin ini saat yang pas buat bilang terima kasih atau kirim pesan kecil.',
  }
  return fallbacks[mood] || 'Perasaanmu valid. Coba tarik napas dalam beberapa kali dan beri dirimu jeda sebentar. Kamu nggak harus punya jawaban sekarang.'
}
