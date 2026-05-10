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
    const { name, phone, date, time, service, message, lineUserId, lineDisplayName, lang } = req.body;

    if (!name || !phone || !date || !time || !service) {
      return res.status(400).json({ error: "必須項目が入力されていません。" });
    }

    const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const GROUP_ID = process.env.LINE_GROUP_ID;
    const SALON_USER_ID = process.env.LINE_USER_ID;

    // サロンへの通知メッセージ（タイ語）
    const salonMessage = [
      "📋 คำขอจองคิวใหม่",
      "━━━━━━━━━━━━━━",
      `👤 ชื่อ: ${name}`,
      `📞 เบอร์โทร: ${phone}`,
      `📅 วันที่ต้องการ: ${date}`,
      `🕐 เวลาที่ต้องการ: ${time}`,
      `💇 บริการ: ${service}`,
      message ? `💬 ข้อความ: ${message}` : "",
      lineDisplayName ? `💬 LINE: ${lineDisplayName}` : "",
      "━━━━━━━━━━━━━━",
      "※ ยังไม่ได้ยืนยันการจอง",
      "กรุณาตรวจสอบและติดต่อลูกค้าค่ะ"
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

    // お客様への確認メッセージ（選択言語に応じて）
    if (lineUserId) {
      const customerMessages = {
        ja: {
          title: "✅ 予約リクエストを受け付けました",
          thanks: "Hairworld Stylists をご利用いただきありがとうございます。",
          accepted: "以下の内容で予約リクエストを承りました。",
          date: "日付", time: "時間", service: "サービス", message: "メッセージ",
          notConfirmed: "※ この予約はまだ確定ではありません。",
          willContact: "スタッフが確認後、確定のご連絡をいたします。",
          question: "ご不明な点がございましたら、",
          phone: "📞 063-961-2999 までお気軽にご連絡ください。"
        },
        en: {
          title: "✅ Reservation request received",
          thanks: "Thank you for choosing Hairworld Stylists.",
          accepted: "We have received your reservation request with the following details.",
          date: "Date", time: "Time", service: "Service", message: "Message",
          notConfirmed: "※ This reservation is not yet confirmed.",
          willContact: "Our staff will contact you to confirm your booking.",
          question: "If you have any questions,",
          phone: "📞 Please feel free to call 063-961-2999."
        },
        th: {
          title: "✅ รับคำขอจองคิวเรียบร้อยแล้ว",
          thanks: "ขอบคุณที่เลือกใช้บริการ Hairworld Stylists ค่ะ",
          accepted: "เราได้รับคำขอจองคิวของคุณด้วยรายละเอียดดังนี้",
          date: "วันที่", time: "เวลา", service: "บริการ", message: "ข้อความ",
          notConfirmed: "※ การจองนี้ยังไม่ได้รับการยืนยัน",
          willContact: "พนักงานจะติดต่อกลับเพื่อยืนยันการจองค่ะ",
          question: "หากมีข้อสงสัย",
          phone: "📞 กรุณาโทร 063-961-2999 ค่ะ"
        }
      };

      const t = customerMessages[lang] || customerMessages.en;

      const customerMessage = [
        t.title, "",
        t.thanks, t.accepted, "",
        "━━━━━━━━━━━━━━",
        `📅 ${t.date}: ${date}`,
        `🕐 ${t.time}: ${time}`,
        `💇 ${t.service}: ${service}`,
        message ? `💬 ${t.message}: ${message}` : "",
        "━━━━━━━━━━━━━━", "",
        t.notConfirmed, t.willContact, "",
        t.question, t.phone, "",
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
