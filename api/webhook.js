// LINE Webhook: 友だち追加クーポン配布 + グループID取得
module.exports = async function handler(req, res) {
  // GETリクエスト → Webhook稼働確認
  if (req.method === "GET") {
    return res.status(200).json({
      message: "LINE Webhook is active.",
      features: ["follow → coupon", "group → ID detection"]
    });
  }

  // POSTリクエスト → LINEからのWebhookイベントを処理
  if (req.method === "POST") {
    const events = req.body.events || [];
    const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const results = [];

    for (const event of events) {

      // === 友だち追加イベント → クーポン自動送信 ===
      if (event.type === "follow" && event.source && event.source.type === "user") {
        const userId = event.source.userId;
        console.log("=== NEW FRIEND ADDED ===");
        console.log("User ID:", userId);
        console.log("========================");

        // 有効期間を計算：翌月1日〜2ヶ月後の末日
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1); // 翌月1日
        const endDate = new Date(now.getFullYear(), now.getMonth() + 3, 0);   // 2ヶ月後の末日

        // 日付フォーマット（YYYY/MM/DD）
        const formatDate = (d) => {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${y}/${m}/${day}`;
        };

        const startStr = formatDate(startDate);
        const endStr = formatDate(endDate);

        // クーポンコード生成（HW + 年月 + ランダム4桁）
        const couponCode = `HW${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${Math.floor(1000 + Math.random() * 9000)}`;

        // クーポンメッセージ（3言語対応）
        const couponMessage = [
          "🎉 Welcome to Hairworld Stylists!",
          "ยินดีต้อนรับสู่ Hairworld Stylists!",
          "Hairworld Stylistsへようこそ！",
          "",
          "━━━━━━━━━━━━━━",
          "🎁 15% OFF COUPON",
          "━━━━━━━━━━━━━━",
          "",
          `🔖 Code: ${couponCode}`,
          `📅 Valid: ${startStr} - ${endStr}`,
          "",
          "💇 All services / ทุกบริการ / 全サービス対象",
          "",
          "📌 How to use / วิธีใช้ / ご利用方法:",
          "Show this message when you visit.",
          "แสดงข้อความนี้เมื่อมาใช้บริการ",
          "ご来店時にこのメッセージをご提示ください。",
          "",
          "📞 Reservation / จองคิว / ご予約:",
          "063-961-2999",
          "",
          "We look forward to seeing you! 🌟",
          "รอต้อนรับค่ะ 🌟",
          "ご来店をお待ちしております！🌟"
        ].join("\n");

        // クーポンを送信
        if (TOKEN) {
          try {
            await fetch("https://api.line.me/v2/bot/message/reply", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN}`
              },
              body: JSON.stringify({
                replyToken: event.replyToken,
                messages: [{
                  type: "text",
                  text: couponMessage
                }]
              })
            });
            console.log("Coupon sent to:", userId, "Code:", couponCode);
          } catch (e) {
            console.error("Coupon send error:", e.message);
          }
        }

        // サロンにも通知（新規友だち追加 + クーポンコード）
        const GROUP_ID = process.env.LINE_GROUP_ID;
        const SALON_USER_ID = process.env.LINE_USER_ID;
        const notifyTo = GROUP_ID || SALON_USER_ID;

        if (TOKEN && notifyTo) {
          try {
            const salonNotify = [
              "🆕 เพื่อนใหม่เพิ่มบัญชี LINE!",
              "━━━━━━━━━━━━━━",
              `👤 User ID: ${userId}`,
              `🎁 คูปอง: ${couponCode}`,
              `📅 ใช้ได้: ${startStr} - ${endStr}`,
              "━━━━━━━━━━━━━━"
            ].join("\n");

            await fetch("https://api.line.me/v2/bot/message/push", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN}`
              },
              body: JSON.stringify({
                to: notifyTo,
                messages: [{ type: "text", text: salonNotify }]
              })
            });
          } catch (e) {
            console.error("Salon notify error:", e.message);
          }
        }

        results.push({ type: "follow", userId, couponCode });
      }

      // === グループイベント → グループID取得 ===
      if (event.source && event.source.type === "group") {
        const groupId = event.source.groupId;
        console.log("=== GROUP ID FOUND ===");
        console.log("Group ID:", groupId);
        console.log("Event type:", event.type);
        console.log("======================");
        results.push({ type: "group", groupId, eventType: event.type });

        // グループIDをLINEメッセージで返信
        if (TOKEN && event.replyToken && event.type === "message") {
          try {
            await fetch("https://api.line.me/v2/bot/message/reply", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN}`
              },
              body: JSON.stringify({
                replyToken: event.replyToken,
                messages: [{
                  type: "text",
                  text: `✅ グループID取得成功！\n\nGroup ID:\n${groupId}\n\nこのIDをVercelの環境変数に設定してください。`
                }]
              })
            });
          } catch (e) {
            console.error("Reply error:", e.message);
          }
        }
      }
    }

    return res.status(200).json({ status: "ok", results });
  }

  return res.status(405).json({ error: "Method not allowed" });
};
