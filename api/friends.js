// 登録者一覧API: Supabaseからline_friendsデータを取得
module.exports = async function handler(req, res) {
  // 簡易認証（管理者パスワード）
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers["x-admin-password"];

  if (!ADMIN_PASS || authHeader !== ADMIN_PASS) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: "Supabase not configured" });
  }

  // GET: 登録者一覧を取得
  if (req.method === "GET") {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/line_friends?select=*&order=registered_at.desc`,
        {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
          }
        }
      );
      const data = await response.json();
      return res.json(data);
    } catch (e) {
      console.error("Fetch error:", e.message);
      return res.status(500).json({ error: "Failed to fetch data" });
    }
  }

  // POST: 特定ユーザーにメッセージ送信
  if (req.method === "POST") {
    const { userId, message } = req.body;
    const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message are required" });
    }

    try {
      const lineRes = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
          to: userId,
          messages: [{ type: "text", text: message }]
        })
      });

      if (!lineRes.ok) {
        const errText = await lineRes.text();
        console.error("LINE push error:", errText);
        return res.status(500).json({ error: "Failed to send message" });
      }

      return res.json({ success: true });
    } catch (e) {
      console.error("Send error:", e.message);
      return res.status(500).json({ error: "Failed to send message" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
