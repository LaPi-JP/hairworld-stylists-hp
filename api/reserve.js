// Vercelサーバーレス関数: 予約受付 → LINE通知（サロン＋お客様）
module.exports = async function handler(req, res) {
  // POSTメソッドのみ許可
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, date, time, service, message, lineUserId, lineDisplayName } = req.body;

    // 必須項目チェック
    if (!name || !phone || !date || !time || !service) {
      return res.status(400).json({ error: "必須項目が入力されていません。" });
    }

    const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const GROUP_ID = process.env.LINE_GROUP_ID;
    const SALON_USER_ID = process.env.LINE_USER_ID;

    // --- 1. サロンへの通知メッセージ ---
    const salonMessage = [
      "📋 新しい予約リクエスト",
      "━━━━━━━━━━━━━━",
      `👤 お名前: ${name}`,
      `📞 電話番号: ${phone}`,
      `📅 希望日: ${date}`,
      `🕐 希望時間: ${time}`,
      `💇 サービス: ${service}`,
      message ? `💬 メッセージ: ${message}` : "",
      lineDisplayName ? `💬 LINE: ${lineDisplayName}` : "",
      "━━━━━━━━━━━━━━",
      "※ 予約確定ではありません。",
      "確認後、お客様にご連絡ください。"
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
      const customerMessage = [
        "✅ 予約リクエストを受け付けました",
        "",
        "Hairworld Stylists をご利用いただきありがとうございます。",
        "以下の内容で予約リクエストを承りました。",
        "",
        "━━━━━━━━━━━━━━",
        `📅 日付: ${date}`,
        `🕐 時間: ${time}`,
        `💇 サービス: ${service}`,
        message ? `💬 メッセージ: ${message}` : "",
        "━━━━━━━━━━━━━━",
        "",
        "※ この予約はまだ確定ではありません。",
        "スタッフが確認後、確定のご連絡をいたします。",
        "",
        "ご不明な点がございましたら、",
        "📞 063-961-2999 までお気軽にご連絡ください。",
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
