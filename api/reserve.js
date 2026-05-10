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
          title: "✅ 予約リクエストを受け付けました",
          thanks: "Hairworld Stylists をご利用いただきありがとうございます。",
          accepted: "以下の内容で予約リクエストを承りました。",
          date: "日付",
          time: "時間",
          service: "サービス",
          message: "メッセージ",
          notConfirmed: "※ この予約はまだ確定ではありません。",
          willContact: "スタッフが確認後、確定のご連絡をいたします。",
          question: "ご不明な点がございましたら、",
          phone: "📞 063-961-2999 までお気軽にご連絡ください。"
        },
        en: {
          title: "✅ Reservation request received",
          thanks: "Thank you for choosing Hairworld Stylists.",
          accepted: "We have received your reservation request with the following details.",
          date: "Date",
          time: "Time",
          service: "Service",
          message: "Message",
          notConfirmed: "※ This reservation is not yet confirmed.",
          willContact: "Our staff will contact you to confirm your booking.",
          question: "If you have any questions,",
          phone: "📞 Please feel free to call 063-961-2999."
        },
        th: {
          title: "✅ รับคำขอจองคิวเรียบร้อยแล้ว",
          thanks: "ขอบคุณที่เลือกใช้บริการ Hairworld Stylists ค่ะ",
          accepted: "เราได้รับคำขอจองคิวของคุณด้วยรายละเอียดดังนี้",
          date: "วันที่",
          time: "เวลา",
          service: "บริการ",
          message: "ข้อความ",
          notConfirmed: "※ การจองนี้ยังไม่ได้รับการยืนยัน",
          willContact: "พนักงานจะติดต่อกลับเพื่อยืนยันการจองค่ะ",
          question: "หากมีข้อสงสัย",
          phone: "📞 กรุณาโทร 063-961-2999 ค่ะ"
        }
      };

      const t = customerMessages[lang] || customerMessages.en;

      const customerMessage = [
        t.title,
        "",
        t.thanks,
        t.accepted,
        "",
        "━━━━━━━━━━━━━━",
        `📅 ${t.date}: ${date}`,
        `🕐 ${t.time}: ${time}`,
        `💇 ${t.service}: ${service}`,
        message ? `💬 ${t.message}: ${message}` : "",
        "━━━━━━━━━━━━━━",
        "",
        t.notConfirmed,
        t.willContact,
        "",
        t.question,
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
