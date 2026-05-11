// お客様カルテAPI: 施術履歴の取得・追加・写真アップロード
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

  // GET: 特定ユーザーの施術履歴を取得
  if (req.method === "GET") {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/customer_notes?user_id=eq.${userId}&order=visit_date.desc`,
        { headers }
      );
      const data = await response.json();
      return res.json(data);
    } catch (e) {
      console.error("Fetch notes error:", e.message);
      return res.status(500).json({ error: "Failed to fetch notes" });
    }
  }

  // POST: 施術履歴を追加
  if (req.method === "POST") {
    const { userId, stylist, service, note, visitDate, photoData } = req.body;

    if (!userId || !stylist) {
      return res.status(400).json({ error: "userId and stylist are required" });
    }

    let photoUrl = "";

    // 写真がある場合はSupabase Storageにアップロード
    if (photoData) {
      try {
        // Base64データからバイナリに変換
        const base64Data = photoData.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const ext = photoData.match(/^data:image\/(\w+);/)?.[1] || "jpg";
        const fileName = `${userId}/${Date.now()}.${ext}`;

        const uploadRes = await fetch(
          `${SUPABASE_URL}/storage/v1/object/customer-photos/${fileName}`,
          {
            method: "POST",
            headers: {
              "apikey": SUPABASE_KEY,
              "Authorization": `Bearer ${SUPABASE_KEY}`,
              "Content-Type": `image/${ext}`,
              "x-upsert": "true"
            },
            body: buffer
          }
        );

        if (uploadRes.ok) {
          photoUrl = `${SUPABASE_URL}/storage/v1/object/public/customer-photos/${fileName}`;
        } else {
          const errText = await uploadRes.text();
          console.error("Photo upload error:", errText);
        }
      } catch (e) {
        console.error("Photo upload error:", e.message);
      }
    }

    // DBに保存
    try {
      const noteData = {
        user_id: userId,
        stylist,
        service: service || "",
        note: note || "",
        photo_url: photoUrl,
        visit_date: visitDate || new Date().toISOString().split("T")[0]
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/customer_notes`, {
        method: "POST",
        headers: { ...headers, "Prefer": "return=representation" },
        body: JSON.stringify(noteData)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("DB save error:", errText);
        return res.status(500).json({ error: "Failed to save note" });
      }

      const saved = await response.json();
      return res.json({ success: true, data: saved });
    } catch (e) {
      console.error("Save note error:", e.message);
      return res.status(500).json({ error: "Failed to save note" });
    }
  }

  // DELETE: 施術履歴を削除
  if (req.method === "DELETE") {
    const noteId = req.query.id;
    if (!noteId) {
      return res.status(400).json({ error: "id is required" });
    }

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/customer_notes?id=eq.${noteId}`, {
        method: "DELETE",
        headers
      });
      return res.json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: "Failed to delete note" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
