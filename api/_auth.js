// 共通認証ヘルパー: Supabaseのパスワード OR 環境変数のパスワード、どちらでも認証OK
async function verifyAdmin(req) {
  const inputPassword = req.headers["x-admin-password"];
  if (!inputPassword) return false;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const ENV_PASSWORD = process.env.ADMIN_PASSWORD;

  // 環境変数のパスワード（開発者用マスターパスワード）で常にアクセス可能
  if (ENV_PASSWORD && inputPassword === ENV_PASSWORD) {
    return true;
  }

  // Supabaseのパスワード（オーナーが変更した場合）
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/admin_settings?key=eq.admin_password&select=value`,
        {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
          }
        }
      );
      const data = await res.json();
      if (data && data.length > 0 && data[0].value) {
        return inputPassword === data[0].value;
      }
    } catch (e) {
      console.error("Auth check error:", e.message);
    }
  }

  return false;
}

module.exports = { verifyAdmin };
