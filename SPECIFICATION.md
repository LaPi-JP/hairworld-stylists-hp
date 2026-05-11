# Hairworld Stylists HP - 仕様書

## 1. プロジェクト概要

バンコクの美容サロン「Hairworld Stylists」の公式ホームページ。
静的HTML/CSS/JSで構成され、Vercelでホスティング。LINE連携・AIチャットボット・予約システム・会員管理機能を搭載。

- **本番URL**: https://hairworld-stylists-hp.vercel.app/
- **管理画面URL**: https://hairworld-stylists-hp.vercel.app/admin.html
- **GitHub**: https://github.com/LaPi-JP/hairworld-stylists-hp

---

## 2. サロン基本情報

| 項目 | 内容 |
|------|------|
| サロン名 | Hairworld Stylists (Hair & Makeup Salon) |
| 住所 | 55/11 Rama II Soi 50, Saen Dam, Bang Khun Thian, Bangkok 10150 |
| 電話番号 | 063-961-2999 |
| 営業時間 | 毎日 10:00 - 21:00 |
| サービス | ヘア / メイク / ネイル |
| SNS | TikTok / LINE / Facebook / Instagram |

---

## 3. ファイル構成

```
index.html          - メインページ（ランディングページ）
style.css           - スタイルシート
script.js           - ナビ・チャットボット・アニメーション・i18n
admin.html          - 管理ダッシュボード（LINE登録者管理）
profile.html        - スタイリスト紹介ページ
server.js           - ローカル開発用サーバー
generate-qr.js      - QRコード生成スクリプト
vercel.json         - Vercel設定
api/
  chat.js           - AIチャットボット API
  reserve.js        - 予約受付 API（LINE通知）
  webhook.js        - LINE Webhook（友だち追加・クーポン配布・会員番号付与）
  friends.js        - 登録者一覧・メッセージ送信 API
logo.png            - サロンロゴ
qrcode-hairworld.png - サイトURL QRコード（ロゴ入り）
review1.png         - テスティモニアル写真1
review2.png         - テスティモニアル写真2
review3.png         - テスティモニアル写真3
video-salon.mp4     - ヒーローセクション動画
video-training.mp4  - トレーニング動画
```

---

## 4. ページ構成（index.html）

### 4.1 セクション一覧

| # | セクション | 説明 |
|---|-----------|------|
| 1 | Header / Navigation | ロゴ、ナビメニュー、言語セレクター（EN/TH/JP）、ハンバーガーメニュー |
| 2 | Hero | フルスクリーン動画背景、サロン名、キャッチコピー、予約CTAボタン |
| 3 | About | サロン紹介文、コンセプト |
| 4 | Services | ヘア/メイク/ネイルの3カテゴリ（カード形式） |
| 5 | Gallery | 施術写真グリッド |
| 6 | Testimonials | お客様レビュー3件（写真付き、実際のレビュー） |
| 7 | Access / Map | Google Maps埋め込み、住所・営業時間・電話 |
| 8 | Reservation | 予約フォーム（LINE連携対応） |
| 9 | Contact / Footer | 問い合わせ情報、SNSリンク |
| 10 | Chatbot | 右下フローティングAIチャットボット |

### 4.2 デザイン仕様

- **配色**: 黒（`#0a0a0a` ~ `#1a1a1a`）× ゴールド（`#d4a853` ~ `#c9a84c`）× 白
- **フォント**: Playfair Display（見出し）/ Inter + Noto Sans JP（本文）
- **スタイル**: グラスモーフィズム、グラデーション、余白を活かしたミニマルデザイン
- **アニメーション**: スクロール時フェードイン（Intersection Observer）
- **レスポンシブ**: モバイルファースト設計（ブレイクポイント: 768px / 1024px）

---

## 5. 多言語対応（i18n）

### 対応言語
- **EN**（英語）- デフォルト
- **TH**（タイ語）
- **JP**（日本語）

### 翻訳対象
- ナビゲーション、全セクションのテキスト
- サービス説明
- テスティモニアル（レビュー本文・著者名・サービス名）
- チャットボットUI
- LINE友だち追加ボタン
- フッター

### 実装方式
- `data-i18n` 属性でHTML要素にキーを付与
- `script.js` 内の `translations` オブジェクトに3言語のデータを定義
- `setLanguage()` 関数で即時切替
- `localStorage` で選択言語を保存・復元

### Google Maps言語連動
- 言語切替時にGoogle Maps iframeの `hl` パラメータを動的に変更
- EN → `en` / TH → `th` / JP → `ja`

---

## 6. AIチャットボット

### 概要
ページ右下にフローティング配置。Anthropic Claude APIを使用した多言語FAQ応答。

### 技術詳細
- **API**: `/api/chat`（Vercelサーバーレス関数）
- **モデル**: Claude Sonnet 4.6
- **最大トークン**: 300
- **セッション管理**: `conversationHistory` Map（sessionId単位、最大20メッセージ保持）

### 対応内容
- 営業時間、予約方法、アクセス、サービス内容の問い合わせ
- 日本語・英語・タイ語で自動対応（お客様の言語に合わせて返答）
- サロンに関係のない質問は丁寧にお断り

---

## 7. 予約システム

### 予約フロー
1. お客様が予約フォームに入力（名前、電話番号、日付、時間、サービス、メッセージ）
2. 「LINEで予約確認」ボタンでLIFF経由でLINEログイン（任意）
3. 「Submit Reservation」で予約送信
4. サロンのLINEグループに予約通知（タイ語）
5. お客様のLINEに予約確認メッセージ（選択言語で送信）

### API
- **エンドポイント**: `/api/reserve`
- **送信先**: LINE Messaging API Push Message

### サロン通知（タイ語固定）
- 予約者名、電話番号、希望日時、サービス、メッセージ
- LINE表示名（ログイン時）

### お客様確認メッセージ（多言語）
- 予約内容の確認
- キャンセルポリシー（2日前までに電話連絡）
- 言語: お客様の選択言語（EN/TH/JP）に自動対応

---

## 8. LINE連携

### チャネル構成
| チャネル | 種類 | 用途 |
|---------|------|------|
| Hairworld 予約 | LINE Login | LIFF（LINE Front-end Framework）によるログイン |
| Hairworld Stylists | Messaging API | メッセージ送信（通知・クーポン・メッセージ配信） |

### LIFF設定
- **LIFF ID**: `2010031564-epVCX2tp`
- **Endpoint URL**: `https://hairworld-stylists-hp.vercel.app/`
- **サイズ**: Full
- **Scope**: profile

### LINE友だち追加
- サイト内にQRコード + 友だち追加ボタンを設置
- ボタンテキストは選択言語に応じて切替（EN/TH/JP）

### 予約通知グループ
- LINEグループ「Reservation」に予約情報を自動送信
- 複数スタッフが同時に通知を受け取れる

---

## 9. クーポン自動配布システム

### 概要
LINE公式アカウントを友だち追加した人に、15%割引クーポンを自動配布。

### トリガー
- LINE Webhookの `follow` イベント（友だち追加時）

### クーポン仕様
| 項目 | 内容 |
|------|------|
| 割引率 | 15% OFF |
| 対象 | 全サービス |
| 有効期間 | 登録月の翌月1日 ~ 2ヶ月後の末日 |
| コード形式 | `HW` + 年月(YYMM) + ランダム4桁（例: `HW26056644`） |

### お客様へのメッセージ
- 3言語対応（EN/TH/JP）同時表示
- 会員番号、クーポンコード、有効期間、利用方法、予約電話番号

### サロンへの通知（タイ語）
- 新規友だち追加のお知らせ
- 会員番号、お客様のLINE表示名、ステータスメッセージ
- クーポンコード、割引率、有効期間
- プロフィール画像URL

---

## 10. 会員番号システム

### 形式
`HW-YYMM-NNNNN`

- **HW**: Hairworld プレフィックス
- **YYMM**: 登録年月（例: 2605 = 2026年5月）
- **NNNNN**: 5桁連番（00001から）

### 例
- 1人目: `HW-2605-00001`
- 2人目: `HW-2605-00002`

### 付与タイミング
- 友だち追加時にSupabaseの連番から自動生成
- お客様メッセージ・サロン通知・管理画面すべてに表示

---

## 11. 管理ダッシュボード（admin.html）

### アクセス
- **URL**: https://hairworld-stylists-hp.vercel.app/admin.html
- **認証**: パスワード認証（環境変数 `ADMIN_PASSWORD`）

### 言語対応
- EN（英語）/ TH（タイ語）切替

### 機能一覧

| 機能 | 説明 |
|------|------|
| 登録者一覧 | プロフィール画像、会員番号、名前、ステータス、クーポン情報、登録日 |
| 統計表示 | Total Friends（総登録者数）、Active Coupons（有効クーポン数） |
| クーポン状態 | Active（有効）/ Upcoming（開始前）/ Expired（期限切れ）を色分け表示 |
| 個別メッセージ送信 | 各登録者の「Send」ボタンから個別にLINEメッセージを送信 |
| 一斉配信 | 「Broadcast Message」で全登録者にメッセージ一斉送信 |
| 選択送信 | チェックボックスで選択した登録者にのみメッセージ送信 |
| 全選択 | 「Select All」チェックボックスで全選択/全解除 |

---

## 12. データベース（Supabase）

### プロジェクト情報
- **プロジェクト名**: hairworld-stylists
- **リージョン**: South Asia (Mumbai)
- **プラン**: Free

### テーブル: `line_friends`

| カラム | 型 | 説明 |
|--------|------|------|
| id | SERIAL (PK) | 自動連番 |
| user_id | TEXT (UNIQUE) | LINE ユーザーID |
| display_name | TEXT | LINE表示名 |
| picture_url | TEXT | プロフィール画像URL |
| status_message | TEXT | LINEステータスメッセージ |
| coupon_code | TEXT | クーポンコード |
| coupon_start | DATE | クーポン開始日 |
| coupon_end | DATE | クーポン終了日 |
| member_number | TEXT (UNIQUE) | 会員番号 |
| registered_at | TIMESTAMPTZ | 登録日時（自動） |

### セキュリティ
- Row Level Security (RLS) 有効
- サーバーサイドからのみアクセス（Secret Key使用）

---

## 13. 外部サービス・API

| サービス | 用途 | プラン |
|---------|------|--------|
| Vercel | ホスティング・サーバーレス関数 | Hobby（無料） |
| Supabase | データベース（PostgreSQL） | Free |
| Anthropic Claude API | AIチャットボット | 従量課金 |
| LINE Messaging API | メッセージ送信・Webhook | フリー（200通/月） |
| LINE Login (LIFF) | ユーザー認証・プロフィール取得 | 無料 |
| Google Maps | 地図埋め込み | 無料 |
| Google Fonts | Webフォント | 無料 |

---

## 14. 環境変数（Vercel）

| 変数名 | 用途 |
|--------|------|
| `ANTHROPIC_API_KEY` | Claude API キー |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging API トークン |
| `LINE_USER_ID` | サロンオーナーのLINE ID |
| `LINE_GROUP_ID` | 予約通知グループのID |
| `SUPABASE_URL` | Supabase プロジェクトURL |
| `SUPABASE_SERVICE_KEY` | Supabase Secret Key |
| `ADMIN_PASSWORD` | 管理画面パスワード |

---

## 15. テスティモニアル（実際のレビュー）

### レビュー1（左カード）
- **サービス**: Shampoo & Conditioning, Blow Dry, Make-up
- **写真**: review1.png（金髪の女性）

### レビュー2（中央カード）
- **サービス**: Color & Cut（スタイリスト: ช่างไอซ์）
- **写真**: review2.png（ショートカット後ろ姿）

### レビュー3（右カード）
- **サービス**: Cut, Perm & Bridal Services
- **来店きっかけ**: TikTokレビュー
- **写真**: review3.png（黒髪ロングの女性）

---

## 16. QRコード

- **ファイル**: qrcode-hairworld.png
- **URL**: https://hairworld-stylists-hp.vercel.app/
- **デザイン**: 茶系カラー（`#3C2415`）、中央にサロンロゴ（円形、ゴールドボーダー）
- **生成ツール**: Node.js（qrcode + sharp パッケージ）

---

## 17. 今後の拡張候補

- Instagram連携（現在リンク未設定）
- ギャラリー画像の差し替え（現在プレースホルダー）
- クーポン使用状況の追跡機能
- 予約カレンダー連携
- LINE Official Account Managerとの連携強化
- 登録者セグメント配信（登録月別、クーポン状態別）
