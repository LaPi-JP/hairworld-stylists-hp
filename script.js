document.addEventListener("DOMContentLoaded", () => {

  // === ヘッダーのスクロール制御 ===
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 60);
  });

  // === ハンバーガーメニュー ===
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("open");
    document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
  });

  // ナビリンクをクリックしたらメニューを閉じる
  nav.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      nav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  // === アクティブなナビリンクの更新 ===
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      }
    });
  }, { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" });

  sections.forEach(section => observerNav.observe(section));

  // === フェードインアニメーション ===
  const fadeElements = document.querySelectorAll(".fade-in");

  const observerFade = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observerFade.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeElements.forEach(el => observerFade.observe(el));

  // === AIチャットボット（Claude API + FAQフォールバック） ===
  const chatbot = document.getElementById("chatbot");
  const chatToggle = document.getElementById("chatbot-toggle");
  const chatMessages = document.getElementById("chatbot-messages");
  const chatInput = document.getElementById("chatbot-input-field");
  const chatSend = document.getElementById("chatbot-send");
  const sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).slice(2);

  // FAQ応答データ（フォールバック用）
  const faqResponses = {
    hours: {
      keywords: ["hours", "open", "close", "time", "schedule", "営業", "何時", "いつ"],
      answer: "営業時間は毎日 10:00〜21:00 です。ご来店をお待ちしております！\nWe are open daily from 10:00 to 21:00."
    },
    location: {
      keywords: ["location", "where", "address", "map", "direction", "場所", "住所", "どこ", "アクセス"],
      answer: "住所: เลขที่ 55/11 Rama II Soi 50, แสมดำ Bang Khun Thian, Bangkok 10150\nGoogle Mapsで「Hairworld Stylists Rama 2」と検索してください。"
    },
    services: {
      keywords: ["service", "offer", "do", "menu", "what", "サービス", "メニュー", "何が"],
      answer: "3つのサービスをご提供しています：\n• ヘア — カット、カラー、パーマ、トリートメント\n• メイク — ブライダル、特別な日、日常メイク\n• ネイル — ジェル、アクリル、ネイルアート、ハンド＆フットケア"
    },
    booking: {
      keywords: ["book", "reserve", "appointment", "予約", "よやく"],
      answer: "ご予約はお電話またはLINEで承っております。\n📞 063-961-2999\n💬 LINE: @hairworld"
    },
    price: {
      keywords: ["price", "cost", "how much", "fee", "rate", "料金", "値段", "いくら", "価格"],
      answer: "料金はサービス・スタイリストにより異なります。\n詳しくはお電話（063-961-2999）またはご来店時にお尋ねください。"
    },
    phone: {
      keywords: ["phone", "call", "number", "contact", "電話", "連絡", "問い合わせ"],
      answer: "お電話はこちらです：063-961-2999\n営業時間（10:00〜21:00）にお気軽にお電話ください。"
    }
  };

  // FAQ応答を検索
  function findFaqAnswer(input) {
    const lower = input.toLowerCase();
    for (const key in faqResponses) {
      const faq = faqResponses[key];
      if (faq.keywords.some(kw => lower.includes(kw))) {
        return faq.answer;
      }
    }
    return "お問い合わせありがとうございます！\n詳しくはお電話（063-961-2999）またはLINE（@hairworld）でお気軽にご連絡ください。";
  }

  // チャットボットの開閉
  chatToggle.addEventListener("click", () => {
    chatbot.classList.toggle("open");
    if (chatbot.classList.contains("open")) {
      chatInput.focus();
    }
  });

  // クイックボタンのクリック
  document.querySelectorAll(".quick-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const questionText = btn.textContent;
      sendChat(questionText);
    });
  });

  // メッセージ送信
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = "";
    sendChat(text);
  }

  // チャット送信（API優先、失敗時FAQフォールバック）
  async function sendChat(text) {
    addMessage(text, "user");
    showTypingIndicator();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: sessionId }),
      });

      removeTypingIndicator();

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      addMessage(data.reply, "bot");
    } catch (error) {
      // APIが使えない場合、FAQフォールバック
      removeTypingIndicator();
      const fallbackReply = findFaqAnswer(text);
      addMessage(fallbackReply, "bot");
    }
  }

  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });

  // メッセージをチャットに追加
  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = "chat-message " + sender;
    msg.innerHTML = "<p>" + text.replace(/\n/g, "<br>") + "</p>";
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 入力中インジケーター表示
  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "chat-message bot typing-indicator";
    indicator.innerHTML = "<p><span class='dot'></span><span class='dot'></span><span class='dot'></span></p>";
    indicator.id = "typing-indicator";
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 入力中インジケーター削除
  function removeTypingIndicator() {
    const indicator = document.getElementById("typing-indicator");
    if (indicator) indicator.remove();
  }
});
