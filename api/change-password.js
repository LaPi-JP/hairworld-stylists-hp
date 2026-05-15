// 管理者パスワード・オーナーPIN変更API
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const ENV_PASSWORD = process.env.ADMIN_PASSWORD;
  const ENV_OWNER_PIN = process.env.OWNER_PIN || "0000";

  const { action, ownerPin, currentPassword, newPassword, newPin } = req.body || {};

  // --- Supabaseから値を取得するヘルパー ---
  async function getSettingValue(key, fallback) {
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const r = await fetch(
          `${SUPABASE_URL}/rest/v1/admin_settings?key=eq.${key}&select=value`,
          { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
        );
        const d = await r.json();
        if (d && d.length > 0 && d[0].value) return d[0].value;
      } catch (e) {
        console.error(`Get ${key} error:`, e.message);
      }
    }
    return fallback;
  }

  // --- Supabaseに値を保存するヘルパー ---
  async function setSettingValue(key, value) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/admin_settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify({ key, value })
    });
    return r.ok;
  }

  try {
    // オーナーPINを検証
    const storedPin = await getSettingValue("owner_pin", ENV_OWNER_PIN);
    if (!ownerPin || ownerPin !== storedPin) {
      return res.status(401).json({ error: "owner_pin_invalid" });
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(500).json({ error: "データベースが設定されていません。" });
    }

    // === パスワード変更 ===
    if (action === "change_password") {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "missing_fields" });
      }
      if (newPassword.length < 4) {
        return res.status(400).json({ error: "password_too_short" });
      }

      const storedPassword = await getSettingValue("admin_password", ENV_PASSWORD);
      if (currentPassword !== storedPassword) {
        return res.status(401).json({ error: "current_password_invalid" });
      }

      if (await setSettingValue("admin_password", newPassword)) {
        return res.status(200).json({ success: true, type: "password" });
      }
      return res.status(500).json({ error: "save_failed" });
    }

    // === オーナーPIN変更 ===
    if (action === "change_pin") {
      if (!newPin) {
        return res.status(400).json({ error: "missing_fields" });
      }
      if (newPin.length < 4) {
        return res.status(400).json({ error: "pin_too_short" });
      }

      if (await setSettingValue("owner_pin", newPin)) {
        return res.status(200).json({ success: true, type: "pin" });
      }
      return res.status(500).json({ error: "save_failed" });
    }

    return res.status(400).json({ error: "invalid_action" });

  } catch (e) {
    console.error("Change password/pin error:", e.message);
    return res.status(500).json({ error: "server_error" });
  }
};
