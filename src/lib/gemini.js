const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

/**
 * Generate micro-intervention dari Gemini API berdasarkan mood dan trigger user.
 * @param {string} mood - Mood yang dipilih user (kewalahan, cemas, kesal, sedih, capek, senang, bersemangat, santai, percaya-diri, romantis)
 * @param {string} trigger - Teks pemicu yang diketik user
 * @returns {Promise<string>} - Saran/micro-intervention dari AI
 */
export async function generateIntervention(mood, trigger, todayHistory = []) {
  const systemPrompt = `Kamu adalah Peka, seorang teman dan pendengar yang sangat berempati, hangat, dan pengertian. 
Tugasmu:
1. Pahami dan validasi spesifik masalah atau ceritanya secara mendalam.
2. Berikan respons yang sangat nyambung, relevan, dan "human" (tidak kaku seperti template robot).
3. Berikan 1-2 saran praktis (micro-intervention) yang relevan dan bisa dilakukan saat ini juga.
4. Gunakan bahasa Indonesia santai (gue/lu atau aku/kamu yang kasual), hangat, dan seperti sedang chatting dengan sahabat.
5. DILARANG memberikan nasihat klise/toxic positivity.
6. Maksimal 3-4 paragraf pendek. Jangan berlebihan memakai emoji.`

  let historyContext = ""
  if (todayHistory && todayHistory.length > 0) {
    historyContext = `[KONTEKS PERJALANAN EMOSI HARI INI]:\nSebelumnya pada hari ini, pengguna sudah merasa:\n`
    todayHistory.forEach(entry => {
      const time = new Date(entry.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      historyContext += `- Jam ${time}: merasa "${entry.mood}" karena "${entry.trigger_text || 'tidak disebutkan'}"\n`
    })
    historyContext += `Jadikan perjalanan emosi hari ini sebagai pemahaman latar belakangmu agar balasanmu lebih pengertian dan menyentuh, seolah kamu tahu apa yang dia lalui seharian ini.\n\n`
  }

  const userPrompt = `${historyContext}KONDISI SAAT INI:\nTemanmu sedang merasa "${mood}". Alasan perasaannya: "${trigger}". Berikan tanggapanmu!`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.8,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Gemini API response error:', errorData)
      throw new Error(`Gemini API error (${response.status}): ${errorData?.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Format response dari Gemini tidak valid')
    }
    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error('Gemini API failed:', error)
    // Lemparkan pesan error asli agar terlihat di UI
    throw new Error(error.message || 'Gagal menghubungi server AI.')
  }
}
