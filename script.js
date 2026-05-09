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

  // === AIチャットボット（Claude API） ===
  const chatbot = document.getElementById("chatbot");
  const chatToggle = document.getElementById("chatbot-toggle");
  const chatMessages = document.getElementById("chatbot-messages");
  const chatInput = document.getElementById("chatbot-input-field");
  const chatSend = document.getElementById("chatbot-send");
  const sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).slice(2);

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
      sendToAPI(questionText);
    });
  });

  // メッセージ送信
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = "";
    sendToAPI(text);
  }

  // Claude APIへ送信
  async function sendToAPI(text) {
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
      removeTypingIndicator();
      addMessage("申し訳ございません。現在応答できません。お電話（063-961-2999）でお問い合わせください。", "bot");
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
