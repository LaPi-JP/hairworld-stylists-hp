// Vercelサーバーレス関数: 予約受付 → LINE通知（サロン＋お客様）
module.exports = async function handler(req, res) {
  // POSTメソッドのみ許可
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, date, time, service, message, lineUserId, lineDisplayName, lang } = req.body;

    // 必須項目チェック
    if (!name || !phone || !date || !time || !service) {
      return res.status(400).json({ error: "必須項目が入力されていません。" });
    }

    const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const GROUP_ID = process.env.LINE_GROUP_ID;
    const SALON_USER_ID = process.env.LINE_USER_ID;

    // --- 1. サロンへの通知メッセージ（タイ語） ---
    const salonMessage = [
      "📋 คำขอจองคิวใหม่",
      "━━━━━━━━━━━━━━",
      `👤 ชื่อ: ${name}`,
      `📞 เบอร์โทร: ${phone}`,
      `📅 วันที่ต้องการ: ${date}`,
      `🕐 เวลาที่ต้องการ: ${time}`,
      `💇 บริการ: ${service}`,
      message ? `💬 ข้อความ: ${message}` : "",
      lineDisplayName ? `💬 LINE: ${lineDisplayName}` : "",
      "━━━━━━━━━━━━━━",
      "※ ยังไม่ได้ยืนยันการจอง",
      "กรุณาตรวจสอบและติดต่อลูกค้าค่ะ"
    ].filter(Boolean).join("\n");

    // サロンにLINE通知を送信
    const salonResponse = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        to: GROUP_ID || SALON_USER_ID,
        messages: [{ type: "text", text: salonMessage }]
      })
    });

    if (!salonResponse.ok) {
      const errorData = await salonResponse.text();
      console.error("LINE API Error (salon):", errorData);
      throw new Error("LINE notification to salon failed");
    }

    // --- 2. お客様への確認メッセージ（LINE IDがある場合のみ） ---
    if (lineUserId) {
      // お客様の選択言語に応じたメッセージテンプレート
      const customerMessages = {
        ja: {
          greeting: "この度はHairworld Stylistsへのご予約をいただき誠にありがとうございます。",
          detailsTitle: "【お客様のご予約内容】",
          date: "日付",
          time: "時間",
          service: "サービス",
          message: "メッセージ",
          welcome: "上記日時にお客様のお越しをお待ち申し上げております。",
          cancelPolicy: "尚、ご予約のお時間の変更やキャンセルが必要な場合は、ご予約日の2日前までにお電話にてご連絡いただきたく宜しくお願い申し上げます。",
          phone: "📞 063-961-2999"
        },
        en: {
          greeting: "Thank you very much for making a reservation at Hairworld Stylists.",
          detailsTitle: "【Your Reservation Details】",
          date: "Date",
          time: "Time",
          service: "Service",
          message: "Message",
          welcome: "We look forward to welcoming you at the above date and time.",
          cancelPolicy: "If you need to change or cancel your reservation, please contact us by phone at least 2 days before your appointment.",
          phone: "📞 063-961-2999"
        },
        th: {
          greeting: "ขอบคุณที่จองคิวกับ Hairworld Stylists ค่ะ",
          detailsTitle: "【รายละเอียดการจองของคุณ】",
          date: "วันที่",
          time: "เวลา",
          service: "บริการ",
          message: "ข้อความ",
          welcome: "เรารอต้อนรับคุณตามวันและเวลาข้างต้นค่ะ",
          cancelPolicy: "หากต้องการเปลี่ยนแปลงหรือยกเลิกการจอง กรุณาโทรแจ้งล่วงหน้าอย่างน้อย 2 วันก่อนวันนัดหมายค่ะ",
          phone: "📞 063-961-2999"
        }
      };

      const t = customerMessages[lang] || customerMessages.en;

      const customerMessage = [
        t.greeting,
        "",
        t.detailsTitle,
        "━━━━━━━━━━━━━━",
        `📅 ${t.date}: ${date}`,
        `🕐 ${t.time}: ${time}`,
        `💇 ${t.service}: ${service}`,
        message ? `💬 ${t.message}: ${message}` : "",
        "━━━━━━━━━━━━━━",
        "",
        t.welcome,
        "",
        t.cancelPolicy,
        "",
        t.phone,
        "",
        "Hairworld Stylists 🌟"
      ].filter(Boolean).join("\n");

      try {
        const customerResponse = await fetch("https://api.line.me/v2/bot/message/push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOKEN}`
          },
          body: JSON.stringify({
            to: lineUserId,
            messages: [{ type: "text", text: customerMessage }]
          })
        });

        if (!customerResponse.ok) {
          const errorData = await customerResponse.text();
          console.error("LINE API Error (customer):", errorData);
          // お客様への送信失敗はエラーにしない（サロンには通知済み）
        }
      } catch (customerError) {
        console.error("Customer LINE notification error:", customerError.message);
      }
    }

    res.json({ success: true, message: "予約リクエストを受け付けました。" });
  } catch (error) {
    console.error("Reserve Error:", error.message);
    res.status(500).json({
      error: "予約の送信に失敗しました。お電話（063-961-2999）でお問い合わせください。"
    });
  }
};
