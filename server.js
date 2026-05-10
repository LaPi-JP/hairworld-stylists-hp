require("dotenv").config();
const express = require("express");
const Anthropic = require("@anthropic-ai/sdk").default;
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const client = new Anthropic();

const SYSTEM_PROMPT = `あなたはバンコクの美容サロン「Hairworld Stylists」のAIアシスタントです。
お客様からのお問い合わせに、丁寧かつフレンドリーに対応してください。

【サロン情報】
- サロン名: Hairworld Stylists (Hair & Makeup Salon)
- 住所: เลขที่ 55/11 Rama II Soi 50, แสมดำ Bang Khun Thian, Bangkok 10150
- 電話番号: 063-961-2999
- 営業時間: 毎日 10:00 - 21:00
- サービス: ヘア（カット、カラー、パーマ、トリートメント）、メイク（ブライダル、特別な日、日常メイク）、ネイル（ジェル、アクリル、ネイルアート、ハンド＆フットケア）

【対応ルール】
- 日本語、英語、タイ語のいずれでも対応可能です。お客様の言語に合わせて返答してください。
- 予約はお電話（063-961-2999）またはLINE（@hairworld）で受け付けていることをご案内してください。
- 料金についてはサービスやスタイリストによって異なるため、お電話またはご来店時にお尋ねいただくようご案内してください。
- 回答は簡潔に、2〜3文程度でお答えください。長くなりすぎないようにしてください。
- サロンに関係のない質問には、丁寧にサロン関連の質問のみ対応できる旨を伝えてください。`;

const conversationHistory = new Map();

app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!conversationHistory.has(sessionId)) {
      conversationHistory.set(sessionId, []);
    }
    const history = conversationHistory.get(sessionId);

    history.push({ role: "user", content: message });

    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",

      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: history,
    });

    const assistantMessage = response.content[0].text;
    history.push({ role: "assistant", content: assistantMessage });

    res.json({ reply: assistantMessage });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({
      reply: "申し訳ございません。現在応答できません。お電話（063-961-2999）でお問い合わせください。",
    });
  }
});

// 予約APIエンドポイント
app.post("/api/reserve", async (req, res) => {
  try {
    const { name, phone, date, time, service, message, lineUserId, lineDisplayName } = req.body;

    if (!name || !phone || !date || !time || !service) {
      return res.status(400).json({ error: "必須項目が入力されていません。" });
    }

    const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const GROUP_ID = process.env.LINE_GROUP_ID;
    const SALON_USER_ID = process.env.LINE_USER_ID;

    // サロンへの通知メッセージ
    const salonMessage = [
      "📋 新しい予約リクエスト",
      "━━━━━━━━━━━━━━",
      `👤 お名前: ${name}`,
      `📞 電話番号: ${phone}`,
      `📅 希望日: ${date}`,
      `🕐 希望時間: ${time}`,
      `💇 サービス: ${service}`,
      message ? `💬 メッセージ: ${message}` : "",
      lineDisplayName ? `💬 LINE: ${lineDisplayName}` : "",
      "━━━━━━━━━━━━━━",
      "※ 予約確定ではありません。",
      "確認後、お客様にご連絡ください。"
    ].filter(Boolean).join("\n");

    // サロンにLINE通知
    const salonResponse = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        to: GROUP_ID || SALON_USER_ID,
        messages: [{ type: "text", text: salonMessage }]
      })
    });

    if (!salonResponse.ok) {
      const errorData = await salonResponse.text();
      console.error("LINE API Error (salon):", errorData);
      throw new Error("LINE notification to salon failed");
    }

    // お客様への確認メッセージ（LINE IDがある場合のみ）
    if (lineUserId) {
      const customerMessage = [
        "✅ 予約リクエストを受け付けました",
        "",
        "Hairworld Stylists をご利用いただきありがとうございます。",
        "以下の内容で予約リクエストを承りました。",
        "",
        "━━━━━━━━━━━━━━",
        `📅 日付: ${date}`,
        `🕐 時間: ${time}`,
        `💇 サービス: ${service}`,
        message ? `💬 メッセージ: ${message}` : "",
        "━━━━━━━━━━━━━━",
        "",
        "※ この予約はまだ確定ではありません。",
        "スタッフが確認後、確定のご連絡をいたします。",
        "",
        "ご不明な点がございましたら、",
        "📞 063-961-2999 までお気軽にご連絡ください。",
        "",
        "Hairworld Stylists 🌟"
      ].filter(Boolean).join("\n");

      try {
        await fetch("https://api.line.me/v2/bot/message/push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOKEN}`
          },
          body: JSON.stringify({
            to: lineUserId,
            messages: [{ type: "text", text: customerMessage }]
          })
        });
      } catch (customerError) {
        console.error("Customer LINE notification error:", customerError.message);
      }
    }

    res.json({ success: true, message: "予約リクエストを受け付けました。" });
  } catch (error) {
    console.error("Reserve Error:", error.message);
    res.status(500).json({
      error: "予約の送信に失敗しました。お電話（063-961-2999）でお問い合わせください。"
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
