// リマインドAPI: 対象者取得・リマインド送信・設定更新
module.exports = async function handler(req, res) {
  // 簡易認証
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers["x-admin-password"];
  if (!ADMIN_PASS || authHeader !== ADMIN_PASS) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: "Supabase not configured" });
  }

  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };

  // GET: リマインド対象者を取得
  if (req.method === "GET") {
    const today = new Date().toISOString().split("T")[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    try {
      // タイプA: 1週間以内の予約（ステータスがnewまたはconfirmed）
      const resA = await fetch(
        `${SUPABASE_URL}/rest/v1/reservations?select=*&status=in.(new,confirmed)&preferred_date=gte.${today}&preferred_date=lte.${nextWeek}&order=preferred_date.asc`,
        { headers }
      );
      const upcomingReservations = await resA.json();

      // タイプB: next_reminder_dateが今日以前で、まだ送信していない会員
      const resB = await fetch(
        `${SUPABASE_URL}/rest/v1/line_friends?select=*&reminder_months=not.is.null&next_reminder_date=lte.${today}&order=next_reminder_date.asc`,
        { headers }
      );
      const allReminders = await resB.json();

      // last_reminded_atがnext_reminder_date以降のものは除外（送信済み）
      const revisitReminders = allReminders.filter(f => {
        if (!f.last_reminded_at) return true;
        const remindedDate = f.last_reminded_at.split("T")[0];
        return remindedDate < f.next_reminder_date;
      });

      return res.json({
        reservationReminders: upcomingReservations,
        revisitReminders
      });
    } catch (e) {
      console.error("Fetch reminders error:", e.message);
      return res.status(500).json({ error: "Failed to fetch reminders" });
    }
  }

  // POST: リマインドメッセージを送信
  if (req.method === "POST") {
    const { type, targetId, userId, lang } = req.body;

    if (!TOKEN) {
      return res.status(500).json({ error: "LINE token not configured" });
    }

    // リマインドメッセージテンプレート
    const messages = {
      // タイプA: 予約リマインド
      reservation: {
        en: (name, date, time, service) => [
          "📋 Reservation Reminder",
          "━━━━━━━━━━━━━━",
          `Hi ${name}! 👋`,
          "",
          "This is a reminder for your upcoming appointment at Hairworld Stylists.",
          "",
          `📅 Date: ${date}`,
          `🕐 Time: ${time}`,
          `💇 Service: ${service}`,
          "",
          "We look forward to seeing you!",
          "",
          "Need to reschedule? Please call us:",
          "📞 063-961-2999",
          "",
          "Hairworld Stylists 🌟"
        ].join("\n"),
        th: (name, date, time, service) => [
          "📋 แจ้งเตือนการจอง",
          "━━━━━━━━━━━━━━",
          `สวัสดีค่ะ คุณ${name}! 👋`,
          "",
          "ขอแจ้งเตือนนัดหมายที่ Hairworld Stylists ค่ะ",
          "",
          `📅 วันที่: ${date}`,
          `🕐 เวลา: ${time}`,
          `💇 บริการ: ${service}`,
          "",
          "รอต้อนรับค่ะ!",
          "",
          "หากต้องการเปลี่ยนแปลง กรุณาโทร:",
          "📞 063-961-2999",
          "",
          "Hairworld Stylists 🌟"
        ].join("\n"),
        ja: (name, date, time, service) => [
          "📋 ご予約リマインド",
          "━━━━━━━━━━━━━━",
          `${name}様 👋`,
          "",
          "Hairworld Stylistsのご予約が近づいております。",
          "",
          `📅 日付: ${date}`,
          `🕐 時間: ${time}`,
          `💇 サービス: ${service}`,
          "",
          "ご来店をお待ちしております！",
          "",
          "変更・キャンセルはお電話にて:",
          "📞 063-961-2999",
          "",
          "Hairworld Stylists 🌟"
        ].join("\n")
      },
      // タイプB: 再来店リマインド
      revisit: {
        en: (name) => [
          "💇 Time for a visit!",
          "━━━━━━━━━━━━━━",
          `Hi ${name}! 👋`,
          "",
          "It's been a while since your last visit to Hairworld Stylists.",
          "We'd love to see you again! ✨",
          "",
          "📞 Book now: 063-961-2999",
          "🌐 Or visit: hairworld-stylists-hp.vercel.app",
          "",
          "Hairworld Stylists 🌟"
        ].join("\n"),
        th: (name) => [
          "💇 ถึงเวลามาทำผมแล้ว!",
          "━━━━━━━━━━━━━━",
          `สวัสดีค่ะ คุณ${name}! 👋`,
          "",
          "ไม่ได้เจอกันนานเลย ที่ Hairworld Stylists",
          "อยากเจอคุณอีกค่ะ! ✨",
          "",
          "📞 จองคิว: 063-961-2999",
          "🌐 หรือ: hairworld-stylists-hp.vercel.app",
          "",
          "Hairworld Stylists 🌟"
        ].join("\n"),
        ja: (name) => [
          "💇 そろそろお手入れの時期です！",
          "━━━━━━━━━━━━━━",
          `${name}様 👋`,
          "",
          "前回のご来店からしばらく経ちました。",
          "またのお越しをお待ちしております！✨",
          "",
          "📞 ご予約: 063-961-2999",
          "🌐 Web: hairworld-stylists-hp.vercel.app",
          "",
          "Hairworld Stylists 🌟"
        ].join("\n")
      }
    };

    try {
      let messageText = "";
      let sendTo = userId;

      if (type === "reservation") {
        // 予約リマインド
        const resRes = await fetch(
          `${SUPABASE_URL}/rest/v1/reservations?id=eq.${targetId}&select=*`,
          { headers }
        );
        const [reservation] = await resRes.json();
        if (!reservation) {
          return res.status(404).json({ error: "Reservation not found" });
        }
        if (!reservation.user_id) {
          return res.status(400).json({ error: "No LINE user ID for this reservation" });
        }
        sendTo = reservation.user_id;
        const msgLang = lang || reservation.language || "en";
        const template = messages.reservation[msgLang] || messages.reservation.en;
        messageText = template(
          reservation.name,
          reservation.preferred_date,
          reservation.preferred_time,
          reservation.service
        );
      } else if (type === "revisit") {
        // 再来店リマインド
        if (!userId) {
          return res.status(400).json({ error: "userId is required" });
        }
        const friendRes = await fetch(
          `${SUPABASE_URL}/rest/v1/line_friends?user_id=eq.${userId}&select=*`,
          { headers }
        );
        const [friend] = await friendRes.json();
        if (!friend) {
          return res.status(404).json({ error: "Friend not found" });
        }
        const msgLang = lang || friend.preferred_lang || "th";
        const template = messages.revisit[msgLang] || messages.revisit.en;
        messageText = template(friend.display_name);
      } else {
        return res.status(400).json({ error: "Invalid type" });
      }

      // LINE送信
      const lineRes = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
          to: sendTo,
          messages: [{ type: "text", text: messageText }]
        })
      });

      if (!lineRes.ok) {
        const errText = await lineRes.text();
        console.error("LINE send error:", errText);
        return res.status(500).json({ error: "Failed to send LINE message" });
      }

      // タイプBの場合、last_reminded_atを更新
      if (type === "revisit") {
        await fetch(
          `${SUPABASE_URL}/rest/v1/line_friends?user_id=eq.${userId}`,
          {
            method: "PATCH",
            headers,
            body: JSON.stringify({ last_reminded_at: new Date().toISOString() })
          }
        );
      }

      return res.json({ success: true });
    } catch (e) {
      console.error("Reminder send error:", e.message);
      return res.status(500).json({ error: "Failed to send reminder" });
    }
  }

  // PATCH: リマインド設定を更新（line_friendsのreminder_months等）
  if (req.method === "PATCH") {
    const { userId, reminderMonths, preferredLang, lastVisitDate } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const updateData = {};
    if (preferredLang) updateData.preferred_lang = preferredLang;
    if (reminderMonths !== undefined) {
      updateData.reminder_months = reminderMonths || null;
      // next_reminder_dateを計算
      if (reminderMonths && lastVisitDate) {
        const visitDate = new Date(lastVisitDate);
        visitDate.setMonth(visitDate.getMonth() + parseInt(reminderMonths));
        updateData.next_reminder_date = visitDate.toISOString().split("T")[0];
      } else if (!reminderMonths) {
        updateData.next_reminder_date = null;
      }
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/line_friends?user_id=eq.${userId}`,
        {
          method: "PATCH",
          headers: { ...headers, "Prefer": "return=representation" },
          body: JSON.stringify(updateData)
        }
      );
      const saved = await response.json();
      return res.json({ success: true, data: saved });
    } catch (e) {
      console.error("Update reminder settings error:", e.message);
      return res.status(500).json({ error: "Failed to update settings" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
