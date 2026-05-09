// Vercelサーバーレス関数: チャットボットAPI
const Anthropic = require("@anthropic-ai/sdk").default;

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

// セッション履歴をメモリに保持（サーバーレスのため一時的）
const conversationHistory = new Map();

module.exports = async function handler(req, res) {
  // POSTメソッドのみ許可
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, sessionId } = req.body;

    if (!conversationHistory.has(sessionId)) {
      conversationHistory.set(sessionId, []);
    }
    const history = conversationHistory.get(sessionId);

    history.push({ role: "user", content: message });

    // 履歴を最大20件に制限
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
};
