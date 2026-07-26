import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''

serve(async (req) => {
  try {
    // 1. Inisialisasi Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 2. Ambil daftar semua user dari Supabase Auth
    // Ambil maksimal 1000 user untuk dikirimi email
    const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    })

    if (authError) throw authError

    const emails = users.map(u => u.email).filter(Boolean)

    if (emails.length === 0) {
      return new Response(JSON.stringify({ message: "No users found" }), { headers: { "Content-Type": "application/json" } })
    }

    // 3. Kirim email menggunakan REST API Resend
    // Menggunakan Bcc (Atau dikirim ke array) agar antar user tidak saling melihat email
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Peka Reminder <onboarding@resend.dev>',
        to: ['onboarding@resend.dev'], // Wajib ada 1 penerima (bisa dirimu sendiri)
        bcc: emails, // Mengirim ke seluruh user via BCC agar privasi terjaga
        subject: 'Waktunya Check-in Mood Kamu Hari Ini! 🍃',
        html: `
          <div style="font-family: sans-serif; text-align: center; padding: 20px; max-width: 500px; margin: 0 auto; background-color: #f9fafb; border-radius: 16px;">
            <h2 style="color: #111827;">Halo! Bagaimana perasaanmu pagi ini?</h2>
            <p style="color: #4b5563; line-height: 1.6;">Yuk, luangkan waktu 1 menit untuk mencatat mood kamu hari ini dan pelihara <strong>streak api</strong> kamu! Peka punya pesan dan saran baru untukmu hari ini.</p>
            <a href="https://peka-app.vercel.app/home" style="display: inline-block; padding: 12px 24px; background-color: #111827; color: white; text-decoration: none; border-radius: 999px; margin-top: 15px; font-weight: bold;">Check-in Sekarang</a>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">Kamu menerima email ini karena mendaftar di aplikasi Peka.</p>
          </div>
        `
      })
    })

    const resData = await res.json()

    if (!res.ok) {
      throw new Error(JSON.stringify(resData))
    }

    return new Response(
      JSON.stringify({ message: `Successfully sent emails to ${emails.length} users`, data: resData }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
