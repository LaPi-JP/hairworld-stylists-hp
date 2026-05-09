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

  // === チャットボット ===
  const chatbot = document.getElementById("chatbot");
  const chatToggle = document.getElementById("chatbot-toggle");
  const chatMessages = document.getElementById("chatbot-messages");
  const chatInput = document.getElementById("chatbot-input-field");
  const chatSend = document.getElementById("chatbot-send");

  // FAQ応答データ
  const faqResponses = {
    hours: {
      keywords: ["hours", "open", "close", "time", "schedule", "営業"],
      answer: "We are open daily from 10:00 to 21:00. We look forward to welcoming you!"
    },
    location: {
      keywords: ["location", "where", "address", "map", "direction", "場所"],
      answer: "We are located at เลขที่ 55/11 Rama II Soi 50, แสมดำ Bang Khun Thian, Bangkok 10150."
    },
    services: {
      keywords: ["service", "offer", "do", "menu", "what", "サービス"],
      answer: "We offer three main services:\n• Hair — Cut, Color, Perm, Treatment\n• Makeup — Bridal, Special Occasion, Everyday\n• Nail — Gel, Acrylic, Nail Art, Hand & Foot Care"
    },
    booking: {
      keywords: ["book", "reserve", "appointment", "予約"],
      answer: "To make a booking, please call us at 063-961-2999 or send us a message via LINE or Instagram. We'll be happy to schedule your appointment!"
    },
    price: {
      keywords: ["price", "cost", "how much", "fee", "rate", "料金"],
      answer: "Our prices vary depending on the service and stylist. Please contact us at 063-961-2999 or visit our salon for a detailed price list."
    },
    phone: {
      keywords: ["phone", "call", "number", "contact", "電話"],
      answer: "You can reach us at 063-961-2999. We're available during our business hours (10:00 - 21:00)."
    }
  };

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
      const question = btn.dataset.question;
      const response = faqResponses[question];
      if (response) {
        addMessage(btn.textContent, "user");
        setTimeout(() => addMessage(response.answer, "bot"), 500);
      }
    });
  });

  // メッセージ送信
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatInput.value = "";

    const reply = findAnswer(text);
    setTimeout(() => addMessage(reply, "bot"), 600);
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

  // 入力テキストからFAQ応答を検索
  function findAnswer(input) {
    const lower = input.toLowerCase();
    for (const key in faqResponses) {
      const faq = faqResponses[key];
      if (faq.keywords.some(kw => lower.includes(kw))) {
        return faq.answer;
      }
    }
    return "Thank you for your message! For more details, please call us at 063-961-2999 or visit our salon. We'd love to help you!";
  }
});
