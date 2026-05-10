// LINE Webhook: グループIDを取得するためのエンドポイント
module.exports = async function handler(req, res) {
  // GETリクエスト → 最新のグループIDを表示
  if (req.method === "GET") {
    return res.status(200).json({
      message: "LINE Webhook is active. Send a message in the group to get the Group ID.",
      hint: "POST events will be logged here."
    });
  }

  // POSTリクエスト → LINEからのWebhookイベントを処理
  if (req.method === "POST") {
    const events = req.body.events || [];
    const results = [];

    for (const event of events) {
      if (event.source && event.source.type === "group") {
        const groupId = event.source.groupId;
        console.log("=== GROUP ID FOUND ===");
        console.log("Group ID:", groupId);
        console.log("Event type:", event.type);
        console.log("======================");
        results.push({ groupId, eventType: event.type });

        // グループIDをLINEメッセージで返信
        const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        if (TOKEN && event.replyToken) {
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
