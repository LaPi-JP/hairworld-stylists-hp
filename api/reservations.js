// 予約管理API: 一覧取得・ステータス変更・編集
module.exports = async function handler(req, res) {
  // 簡易認証
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

  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };

  // GET: 予約一覧を取得（ステータスフィルター可能）
  if (req.method === "GET") {
    try {
      let url = `${SUPABASE_URL}/rest/v1/reservations?select=*&order=preferred_date.asc,preferred_time.asc`;
      // ステータスフィルター
      const status = req.query.status;
      if (status && status !== "all") {
        url += `&status=eq.${status}`;
      }
      const response = await fetch(url, { headers });
      const data = await response.json();
      return res.json(data);
    } catch (e) {
      console.error("Fetch reservations error:", e.message);
      return res.status(500).json({ error: "Failed to fetch reservations" });
    }
  }

  // PATCH: 予約ステータスを変更
  if (req.method === "PATCH") {
    const { id, status, preferred_date, preferred_time, service, message } = req.body;
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    // 更新データを構築
    const updateData = {};
    if (status) updateData.status = status;
    if (preferred_date) updateData.preferred_date = preferred_date;
    if (preferred_time) updateData.preferred_time = preferred_time;
    if (service !== undefined) updateData.service = service;
    if (message !== undefined) updateData.message = message;

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/reservations?id=eq.${id}`,
        {
          method: "PATCH",
          headers: { ...headers, "Prefer": "return=representation" },
          body: JSON.stringify(updateData)
        }
      );
      if (!response.ok) {
        const errText = await response.text();
        console.error("Update reservation error:", errText);
        return res.status(500).json({ error: "Failed to update reservation" });
      }
      const saved = await response.json();
      return res.json({ success: true, data: saved });
    } catch (e) {
      console.error("Update reservation error:", e.message);
      return res.status(500).json({ error: "Failed to update reservation" });
    }
  }

  // DELETE: 予約を削除
  if (req.method === "DELETE") {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${id}`, {
        method: "DELETE",
        headers
      });
      return res.json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: "Failed to delete reservation" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
