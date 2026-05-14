// Vercelサーバーレス関数: 指定月の予約空き状況を返す
module.exports = async function handler(req, res) {
  // GETメソッドのみ許可
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // CORSヘッダー
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { month } = req.query;

  // monthパラメータの形式チェック (YYYY-MM)
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: "month パラメータが必要です（形式: YYYY-MM）" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: "サーバー設定エラー" });
  }

  try {
    // 指定月の開始日と終了日を計算
    const startDate = `${month}-01`;
    const [year, mon] = month.split("-").map(Number);
    const lastDay = new Date(year, mon, 0).getDate();
    const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;

    // Supabaseから予約データを取得（キャンセル以外）
    const url = `${SUPABASE_URL}/rest/v1/reservations?select=preferred_date,preferred_time&preferred_date=gte.${startDate}&preferred_date=lte.${endDate}&status=neq.cancelled`;

    const response = await fetch(url, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase API Error:", errorText);
      throw new Error("予約データの取得に失敗しました");
    }

    const reservations = await response.json();

    // 日付×時間帯ごとの予約件数を集計
    const availability = {};
    for (const r of reservations) {
      const date = r.preferred_date;
      const time = r.preferred_time;
      if (!date || !time) continue;

      if (!availability[date]) {
        availability[date] = {};
      }
      // 時間を HH:MM 形式に正規化（秒がある場合は除去）
      const normalizedTime = time.slice(0, 5);
      availability[date][normalizedTime] = (availability[date][normalizedTime] || 0) + 1;
    }

    // 1時間キャッシュ
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    res.json(availability);
  } catch (error) {
    console.error("Availability Error:", error.message);
    res.status(500).json({ error: "予約状況の取得に失敗しました" });
  }
};
