// 管理者パスワード変更API
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const ENV_PASSWORD = process.env.ADMIN_PASSWORD;

  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "現在のパスワードと新しいパスワードを入力してください。" });
  }

  if (newPassword.length < 4) {
    return res.status(400).json({ error: "新しいパスワードは4文字以上にしてください。" });
  }

  try {
    // 現在のパスワードを検証（Supabase優先、なければ環境変数）
    let currentStoredPassword = ENV_PASSWORD;

    if (SUPABASE_URL && SUPABASE_KEY) {
      const checkRes = await fetch(
        `${SUPABASE_URL}/rest/v1/admin_settings?key=eq.admin_password&select=value`,
        {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
          }
        }
      );
      const data = await checkRes.json();
      if (data && data.length > 0 && data[0].value) {
        currentStoredPassword = data[0].value;
      }
    }

    // 現在のパスワードが一致しない場合
    if (currentPassword !== currentStoredPassword) {
      return res.status(401).json({ error: "現在のパスワードが正しくありません。" });
    }

    // 新しいパスワードをSupabaseに保存
    if (SUPABASE_URL && SUPABASE_KEY) {
      const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/admin_settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify({
          key: "admin_password",
          value: newPassword
        })
      });

      if (!upsertRes.ok) {
        const errText = await upsertRes.text();
        console.error("Password update error:", errText);
        return res.status(500).json({ error: "パスワードの更新に失敗しました。" });
      }

      return res.status(200).json({ success: true, message: "パスワードを変更しました。" });
    } else {
      return res.status(500).json({ error: "データベースが設定されていません。" });
    }
  } catch (e) {
    console.error("Change password error:", e.message);
    return res.status(500).json({ error: "パスワード変更中にエラーが発生しました。" });
  }
};
