document.addEventListener("DOMContentLoaded", () => {

  // === 多言語翻訳データ ===
  const translations = {
    en: {
      "nav.home": "Home",
      "nav.about": "About",
      "nav.services": "Services",
      "nav.gallery": "Gallery",
      "nav.testimonials": "Testimonials",
      "nav.access": "Access",
      "nav.contact": "Contact",
      "hero.subtitle": "Hair & Makeup Salon",
      "hero.tagline": "Luxury Beauty Experience in Bangkok",
      "hero.hours": "Open Daily 10:00 - 21:00",
      "hero.cta": "Book Now",
      "about.label": "About Us",
      "about.title": "Where Beauty<br>Meets Excellence",
      "about.lead": "Hairworld Stylists is a premium beauty salon located in the heart of Bangkok, offering exceptional hair, makeup, and nail services.",
      "about.text1": "Our team of skilled stylists combines international expertise with a deep understanding of the latest trends to deliver personalized beauty experiences. We believe that every client deserves to feel confident and beautiful.",
      "about.text2": "Using only the finest products and techniques, we create looks that enhance your natural beauty while ensuring the health of your hair, skin, and nails.",
      "about.exp": "Years of Experience",
      "about.clients": "Happy Clients",
      "about.stylists": "Expert Stylists",
      "video.label": "Our Story",
      "video.title": "Professional Training",
      "services.label": "Our Services",
      "services.title": "Premium Beauty<br>Services",
      "services.hair.desc": "Cut, Color, Perm, Treatment, Keratin — Expert styling tailored to your unique look and lifestyle.",
      "services.hair.item1": "Cut & Styling",
      "services.hair.item2": "Color & Highlights",
      "services.hair.item3": "Perm & Straightening",
      "services.hair.item4": "Hair Treatment",
      "services.makeup.desc": "From bridal looks to everyday glam — professional makeup that brings out your best features.",
      "services.makeup.item1": "Bridal Makeup",
      "services.makeup.item2": "Special Occasion",
      "services.makeup.item3": "Everyday Glam",
      "services.makeup.item4": "Makeup Lesson",
      "services.nail.desc": "Gel, Acrylic, Art — Beautiful nails crafted with precision and creativity.",
      "services.nail.item1": "Gel Nail",
      "services.nail.item2": "Acrylic Nail",
      "services.nail.item3": "Nail Art & Design",
      "services.nail.item4": "Hand & Foot Care",
      "gallery.label": "Gallery",
      "gallery.title": "Our Work",
      "testimonials.label": "Testimonials",
      "testimonials.title": "What Our<br>Clients Say",
      "access.label": "Access",
      "access.title": "Visit Us",
      "access.address": "Address",
      "access.addressText": "55/11 Rama II Soi 50,<br>Saen Dam, Bang Khun Thian,<br>Bangkok 10150",
      "access.hours": "Hours",
      "access.hoursText": "Open Daily<br>10:00 - 21:00",
      "access.phone": "Phone",
      "footer.tagline": "Luxury Beauty Experience in Bangkok",
      "footer.contact": "Contact",
      "footer.addressText": "55/11 Rama II Soi 50,<br>Saen Dam, Bang Khun Thian, Bangkok 10150",
      "footer.hours": "Open Daily 10:00 - 21:00",
      "footer.followUs": "Follow Us",
      "chat.subtitle": "How can we help you?",
      "chat.welcome": "Hello! Welcome to Hairworld Stylists. How can I help you today?",
      "chat.btn.hours": "Business Hours",
      "chat.btn.location": "Location",
      "chat.btn.services": "Services",
      "chat.btn.booking": "Booking",
      "chat.btn.price": "Price",
      "chat.placeholder": "Type a message..."
    },
    th: {
      "nav.home": "หน้าแรก",
      "nav.about": "เกี่ยวกับเรา",
      "nav.services": "บริการ",
      "nav.gallery": "ผลงาน",
      "nav.testimonials": "รีวิว",
      "nav.access": "การเดินทาง",
      "nav.contact": "ติดต่อ",
      "hero.subtitle": "Hair & Makeup Salon",
      "hero.tagline": "ประสบการณ์ความงามระดับพรีเมียมในกรุงเทพฯ",
      "hero.hours": "เปิดให้บริการทุกวัน 10:00 - 21:00",
      "hero.cta": "จองคิว",
      "about.label": "เกี่ยวกับเรา",
      "about.title": "ที่ซึ่งความงาม<br>พบกับความเป็นเลิศ",
      "about.lead": "Hairworld Stylists เป็นร้านเสริมสวยระดับพรีเมียมใจกลางกรุงเทพฯ ให้บริการด้านผม เมคอัพ และเล็บอย่างมืออาชีพ",
      "about.text1": "ทีมช่างผู้เชี่ยวชาญของเราผสมผสานความเชี่ยวชาญระดับสากลเข้ากับเทรนด์ล่าสุด เพื่อมอบประสบการณ์ความงามที่ออกแบบมาเฉพาะสำหรับคุณ เราเชื่อว่าลูกค้าทุกท่านสมควรได้รับความมั่นใจและความสวยงาม",
      "about.text2": "ด้วยผลิตภัณฑ์และเทคนิคชั้นเลิศ เราสร้างสรรค์ลุคที่เสริมความงามตามธรรมชาติของคุณ พร้อมดูแลสุขภาพผม ผิว และเล็บอย่างดีที่สุด",
      "about.exp": "ปีแห่งประสบการณ์",
      "about.clients": "ลูกค้าที่พึงพอใจ",
      "about.stylists": "ช่างผู้เชี่ยวชาญ",
      "video.label": "เรื่องราวของเรา",
      "video.title": "การฝึกอบรมมืออาชีพ",
      "services.label": "บริการของเรา",
      "services.title": "บริการความงาม<br>ระดับพรีเมียม",
      "services.hair.desc": "ตัด ทำสี ดัด ทรีตเมนต์ เคราติน — สไตลิ่งระดับมืออาชีพที่ออกแบบมาเพื่อคุณ",
      "services.hair.item1": "ตัดผม & จัดทรง",
      "services.hair.item2": "ทำสี & ไฮไลท์",
      "services.hair.item3": "ดัดผม & ยืดผม",
      "services.hair.item4": "ทรีตเมนต์ผม",
      "services.makeup.desc": "ตั้งแต่ลุคเจ้าสาวไปจนถึงแต่งหน้าประจำวัน — เมคอัพมืออาชีพที่ดึงความสวยของคุณออกมา",
      "services.makeup.item1": "เมคอัพเจ้าสาว",
      "services.makeup.item2": "โอกาสพิเศษ",
      "services.makeup.item3": "แต่งหน้าประจำวัน",
      "services.makeup.item4": "สอนแต่งหน้า",
      "services.nail.desc": "เจล อะครีลิค ลายเล็บ — เล็บสวยด้วยฝีมือและความคิดสร้างสรรค์",
      "services.nail.item1": "ทำเล็บเจล",
      "services.nail.item2": "ทำเล็บอะครีลิค",
      "services.nail.item3": "ออกแบบลายเล็บ",
      "services.nail.item4": "ดูแลมือ & เท้า",
      "gallery.label": "ผลงาน",
      "gallery.title": "ผลงานของเรา",
      "testimonials.label": "รีวิว",
      "testimonials.title": "ลูกค้าของเรา<br>พูดอย่างไร",
      "access.label": "การเดินทาง",
      "access.title": "มาเยี่ยมเรา",
      "access.address": "ที่อยู่",
      "access.addressText": "เลขที่ 55/11 พระราม 2 ซอย 50,<br>แสมดำ บางขุนเทียน,<br>กรุงเทพฯ 10150",
      "access.hours": "เวลาเปิดให้บริการ",
      "access.hoursText": "เปิดทุกวัน<br>10:00 - 21:00",
      "access.phone": "โทรศัพท์",
      "footer.tagline": "ประสบการณ์ความงามระดับพรีเมียมในกรุงเทพฯ",
      "footer.contact": "ติดต่อเรา",
      "footer.addressText": "เลขที่ 55/11 พระราม 2 ซอย 50,<br>แสมดำ บางขุนเทียน กรุงเทพฯ 10150",
      "footer.hours": "เปิดทุกวัน 10:00 - 21:00",
      "footer.followUs": "ติดตามเรา",
      "chat.subtitle": "มีอะไรให้ช่วยไหมคะ?",
      "chat.welcome": "สวัสดีค่ะ! ยินดีต้อนรับสู่ Hairworld Stylists มีอะไรให้ช่วยไหมคะ?",
      "chat.btn.hours": "เวลาเปิด-ปิด",
      "chat.btn.location": "ที่ตั้งร้าน",
      "chat.btn.services": "บริการ",
      "chat.btn.booking": "จองคิว",
      "chat.btn.price": "ราคา",
      "chat.placeholder": "พิมพ์ข้อความ..."
    },
    ja: {
      "nav.home": "ホーム",
      "nav.about": "サロン紹介",
      "nav.services": "サービス",
      "nav.gallery": "ギャラリー",
      "nav.testimonials": "お客様の声",
      "nav.access": "アクセス",
      "nav.contact": "お問い合わせ",
      "hero.subtitle": "Hair & Makeup Salon",
      "hero.tagline": "バンコクで極上のビューティー体験",
      "hero.hours": "毎日営業 10:00 - 21:00",
      "hero.cta": "ご予約はこちら",
      "about.label": "サロン紹介",
      "about.title": "美しさと<br>卓越性の融合",
      "about.lead": "Hairworld Stylistsは、バンコクの中心に位置するプレミアム美容サロンです。ヘア、メイク、ネイルの卓越したサービスを提供しています。",
      "about.text1": "国際的な専門知識と最新トレンドへの深い理解を兼ね備えた熟練のスタイリストチームが、お客様一人ひとりに合わせたビューティー体験をお届けします。すべてのお客様が自信に満ち、美しくあるべきだと私たちは信じています。",
      "about.text2": "最高品質の製品と技術のみを使用し、髪・肌・爪の健康を守りながら、あなたの自然な美しさを引き出すスタイルを創り上げます。",
      "about.exp": "年の経験",
      "about.clients": "お客様の笑顔",
      "about.stylists": "熟練スタイリスト",
      "video.label": "私たちのストーリー",
      "video.title": "プロフェッショナル研修",
      "services.label": "サービス",
      "services.title": "プレミアム<br>ビューティーサービス",
      "services.hair.desc": "カット、カラー、パーマ、トリートメント、ケラチン — あなただけのスタイルを熟練の技で。",
      "services.hair.item1": "カット & スタイリング",
      "services.hair.item2": "カラー & ハイライト",
      "services.hair.item3": "パーマ & ストレート",
      "services.hair.item4": "ヘアトリートメント",
      "services.makeup.desc": "ブライダルからデイリーメイクまで — あなたの魅力を最大限に引き出すプロのメイク。",
      "services.makeup.item1": "ブライダルメイク",
      "services.makeup.item2": "特別なシーンに",
      "services.makeup.item3": "デイリーメイク",
      "services.makeup.item4": "メイクレッスン",
      "services.nail.desc": "ジェル、アクリル、ネイルアート — 精密な技術と創造力で美しい指先を。",
      "services.nail.item1": "ジェルネイル",
      "services.nail.item2": "アクリルネイル",
      "services.nail.item3": "ネイルアート & デザイン",
      "services.nail.item4": "ハンド & フットケア",
      "gallery.label": "ギャラリー",
      "gallery.title": "施術実績",
      "testimonials.label": "お客様の声",
      "testimonials.title": "お客様から<br>いただいた声",
      "access.label": "アクセス",
      "access.title": "お店へのアクセス",
      "access.address": "住所",
      "access.addressText": "55/11 Rama II Soi 50,<br>แสมดำ Bang Khun Thian,<br>Bangkok 10150",
      "access.hours": "営業時間",
      "access.hoursText": "毎日営業<br>10:00 - 21:00",
      "access.phone": "電話番号",
      "footer.tagline": "バンコクで極上のビューティー体験",
      "footer.contact": "お問い合わせ",
      "footer.addressText": "55/11 Rama II Soi 50,<br>แสมดำ Bang Khun Thian, Bangkok 10150",
      "footer.hours": "毎日営業 10:00 - 21:00",
      "footer.followUs": "フォローする",
      "chat.subtitle": "何かお手伝いできますか？",
      "chat.welcome": "こんにちは！Hairworld Stylistsへようこそ。何かお手伝いできますか？",
      "chat.btn.hours": "営業時間",
      "chat.btn.location": "アクセス",
      "chat.btn.services": "サービス",
      "chat.btn.booking": "ご予約",
      "chat.btn.price": "料金",
      "chat.placeholder": "メッセージを入力..."
    }
  };

  // 現在の言語（localStorageから復元、デフォルトは英語）
  let currentLang = localStorage.getItem("hwLang") || "en";

  // 言語切り替え関数
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("hwLang", lang);

    // data-i18n属性を持つ全要素を更新
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const text = translations[lang] && translations[lang][key];
      if (text) {
        if (el.getAttribute("data-i18n-html") === "true") {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // placeholder属性の更新
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const text = translations[lang] && translations[lang][key];
      if (text) {
        el.placeholder = text;
      }
    });

    // 言語ボタンのアクティブ状態を更新
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    // HTML lang属性を更新
    document.documentElement.lang = lang;
  }

  // 言語ボタンのクリックイベント
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setLanguage(btn.getAttribute("data-lang"));
    });
  });

  // 初期言語を適用
  setLanguage(currentLang);

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
