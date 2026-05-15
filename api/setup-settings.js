// admin_settingsテーブル作成用（一度だけ実行）
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

  try {
    // SQLでテーブル作成
    const sqlRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS admin_settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      })
    });

    // RPC方式が使えない場合、直接テーブルに初期値をinsertしてテスト
    if (!sqlRes.ok) {
      // テーブルが既に存在するか確認
      const checkRes = await fetch(
        `${SUPABASE_URL}/rest/v1/admin_settings?select=key&limit=1`,
        {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
          }
        }
      );

      if (checkRes.ok) {
        return res.status(200).json({
          success: true,
          message: "Table already exists.",
          note: "テーブルは既に存在します。"
        });
      } else {
        return res.status(500).json({
          error: "Table does not exist. Please create it manually in Supabase Dashboard.",
          sql: "CREATE TABLE admin_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());",
          note: "SupabaseダッシュボードのSQL Editorで上記SQLを実行してください。"
        });
      }
    }

    return res.status(200).json({ success: true, message: "Table created successfully." });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
