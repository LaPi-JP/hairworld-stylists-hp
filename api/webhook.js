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

        // ユーザープロフィールを取得
        let displayName = "Unknown";
        let pictureUrl = "";
        let statusMessage = "";
        if (TOKEN) {
          try {
            const profileRes = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
              headers: { "Authorization": `Bearer ${TOKEN}` }
            });
            if (profileRes.ok) {
              const profile = await profileRes.json();
              displayName = profile.displayName || "Unknown";
              pictureUrl = profile.pictureUrl || "";
              statusMessage = profile.statusMessage || "";
            }
          } catch (e) {
            console.error("Profile fetch error:", e.message);
          }
        }

        console.log("=== NEW FRIEND ADDED ===");
        console.log("User ID:", userId);
        console.log("Display Name:", displayName);
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

        // 会員番号を生成（HW-YYMM-00001形式）
        let memberNumber = "";
        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
        if (SUPABASE_URL && SUPABASE_KEY) {
          try {
            const countRes = await fetch(
              `${SUPABASE_URL}/rest/v1/line_friends?select=id&order=id.desc&limit=1`,
              {
                headers: {
                  "apikey": SUPABASE_KEY,
                  "Authorization": `Bearer ${SUPABASE_KEY}`
                }
              }
            );
            const countData = await countRes.json();
            const nextNum = (countData && countData.length > 0) ? countData[0].id + 1 : 1;
            const yyMm = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
            memberNumber = `HW-${yyMm}-${String(nextNum).padStart(5, "0")}`;
          } catch (e) {
            console.error("Member number generation error:", e.message);
            memberNumber = `HW-${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}-00000`;
          }
        }

        // クーポンメッセージ（タイ語）
        const couponMessage = [
          "🎉 ยินดีต้อนรับสู่ Hairworld Stylists!",
          "",
          "━━━━━━━━━━━━━━",
          "🎁 คูปองส่วนลด 15%",
          "━━━━━━━━━━━━━━",
          "",
          memberNumber ? `🆔 เลขสมาชิก: ${memberNumber}` : "",
          `🔖 รหัสคูปอง: ${couponCode}`,
          `📅 ใช้ได้: ${startStr} - ${endStr}`,
          "",
          "💇 ใช้ได้เมื่อซื้อเคมีหรือทรีตเมนต์",
          "  (ทำสี / ดัด / ยืด / ทรีตเมนต์)",
          "",
          "📌 วิธีใช้:",
          "แสดงข้อความนี้เมื่อมาใช้บริการที่ร้าน",
          "",
          "📞 จองคิว: 063-961-2999",
          "",
          "รอต้อนรับค่ะ 🌟"
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
              memberNumber ? `🆔 เลขสมาชิก: ${memberNumber}` : "",
              `👤 ชื่อ: ${displayName}`,
              statusMessage ? `💬 สถานะ: ${statusMessage}` : "",
              `🎁 คูปอง: ${couponCode}`,
              "💰 ส่วนลด: 15% OFF (ทุกบริการ)",
              `📅 ใช้ได้: ${startStr} - ${endStr}`,
              pictureUrl ? `🖼️ รูปโปรไฟล์: ${pictureUrl}` : "",
              "━━━━━━━━━━━━━━"
            ].filter(Boolean).join("\n");

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

        // Supabaseにデータを保存
        if (SUPABASE_URL && SUPABASE_KEY) {
          try {
            const dbStartStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
            const dbEndStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

            await fetch(`${SUPABASE_URL}/rest/v1/line_friends`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Prefer": "resolution=merge-duplicates"
              },
              body: JSON.stringify({
                user_id: userId,
                display_name: displayName,
                picture_url: pictureUrl,
                status_message: statusMessage,
                coupon_code: couponCode,
                coupon_start: dbStartStr,
                coupon_end: dbEndStr,
                member_number: memberNumber || null
              })
            });
            console.log("Saved to Supabase:", displayName);
          } catch (e) {
            console.error("Supabase save error:", e.message);
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
