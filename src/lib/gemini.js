const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

/**
 * Generate micro-intervention dari Gemini API berdasarkan mood dan trigger user.
 * @param {string} mood - Mood yang dipilih user (kewalahan, cemas, kesal, sedih, capek, senang, bersemangat, santai, percaya-diri, romantis)
 * @param {string} trigger - Teks pemicu yang diketik user
 * @returns {Promise<string>} - Saran/micro-intervention dari AI
 */
export async function generateIntervention(mood, trigger) {
  const prompt = `Kamu adalah Peka, seorang teman dan pendengar yang sangat berempati, hangat, dan pengertian. 
Seorang temanmu sedang merasa "${mood}". 
Dia bercerita bahwa alasan perasaannya adalah: "${trigger}".

Tugasmu:
1. Pahami dan validasi spesifik masalah atau ceritanya (misal: jika dia putus cinta, akui rasa sakit putus cinta tersebut, jangan hanya bilang "wajar kalau sedih").
2. Berikan respons yang sangat nyambung, relevan, dan "human" (tidak kaku seperti template robot).
3. Setelah memvalidasi perasaannya secara mendalam, berikan 1-2 saran praktis (micro-intervention) yang relevan dan bisa dilakukan saat ini juga untuk membantunya merasa lebih baik atau menikmati momen tersebut.
4. Gunakan bahasa Indonesia santai (gue/lu atau aku/kamu yang kasual), hangat, dan seperti sedang chatting dengan sahabat.
5. DILARANG memberikan nasihat klise/toxic positivity seperti "selalu semangat ya", "jangan sedih", "semua akan indah pada waktunya".
6. Maksimal 3-4 paragraf pendek. Jangan berlebihan memakai emoji.`

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
      const errorData = await response.json().catch(() => ({}))
      console.error('Gemini API response error:', errorData)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Format response dari Gemini tidak valid')
    }
    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error('Gemini API failed:', error)
    // Melemparkan error agar HomePage bisa menangkapnya dan menampilkan pesan error ke user
    throw new Error('AI sedang kelebihan beban atau API limit tercapai. Mohon coba beberapa saat lagi.')
  }
}
