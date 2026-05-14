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
      "hero.tagline": "Your Neighborhood Beauty Salon in Bangkok",
      "hero.hours": "Open Daily 10:00 - 21:00",
      "hero.cta": "Book Now",
      "about.label": "About Us",
      "about.title": "Our Salon,<br>Your Style",
      "about.lead": "Hairworld Stylists is a friendly hair salon in Bangkok offering hair, makeup, and nail services for everyone.",
      "about.text1": "Our stylists listen carefully to what you want and work with you to find the right style. We welcome all customers and aim to make every visit a comfortable and enjoyable experience.",
      "about.text2": "We use quality professional products to take care of your hair, skin, and nails, so you can leave the salon feeling refreshed and happy with your look.",
      "about.exp": "Years of Experience",
      "about.clients": "Happy Clients",
      "about.stylists": "Stylists",
      "video.label": "Our Story",
      "video.title": "Professional Training",
      "services.label": "Our Services",
      "services.title": "Our Beauty<br>Services",
      "services.hair.desc": "Cut, Color, Perm, Treatment, Keratin — Styling tailored to your look and lifestyle.",
      "services.hair.item1": "Cut & Styling",
      "services.hair.item2": "Color & Highlights",
      "services.hair.item3": "Perm & Straightening",
      "services.hair.item4": "Hair Treatment",
      "services.makeup.desc": "From bridal looks to everyday styles — makeup that helps you look and feel your best.",
      "services.makeup.item1": "Bridal Makeup",
      "services.makeup.item2": "Special Occasion",
      "services.makeup.item3": "Everyday Glam",
      "services.makeup.item4": "Makeup Lesson",
      "services.nail.desc": "Gel, Acrylic, Art — Neat and stylish nails done with care.",
      "services.nail.item1": "Gel Nail",
      "services.nail.item2": "Acrylic Nail",
      "services.nail.item3": "Nail Art & Design",
      "services.nail.item4": "Hand & Foot Care",
      "gallery.label": "Gallery",
      "gallery.title": "Our Work",
      "testimonials.label": "Testimonials",
      "testimonials.title": "What Our<br>Clients Say",
      "testimonials.review1.text": "\"The haircuts here are absolutely beautiful. The owner does amazing makeup. Every staff member is highly professional and experienced, with impeccable manners. Everyone speaks so kindly and is fun to talk to. The salon has a luxurious atmosphere and uses only high-quality products. I love my hair every time — never once have I left unimpressed.\"",
      "testimonials.review1.name": "Regular Client",
      "testimonials.review1.role": "Shampoo & Conditioning, Blow Dry, Make-up",
      "testimonials.review2.text": "\"This salon is amazing, highly recommend! The stylists are so kind and sweet. You can even bring your work and sit comfortably at the salon. The color and layer cut turned out gorgeous. I come here almost every week. The cut perfectly suits my face shape, and the color lasts beautifully.\"",
      "testimonials.review2.name": "Regular Client — Stylist Ice",
      "testimonials.review2.role": "Color & Cut",
      "testimonials.review3.text": "\"So beautiful! I came after seeing TikTok reviews. Even before the cut was finished, it already looked amazing. Highly recommend — great service in every way. Just a haircut completely transformed me. They even taught me how to style and set my hair. Such wonderful care — this salon forever!\"",
      "testimonials.review3.name": "New Client — from TikTok",
      "testimonials.review3.role": "Cut, Perm & Bridal Services",
      "access.label": "Access",
      "access.title": "Visit Us",
      "access.address": "Address",
      "access.addressText": "55/11 Rama II Soi 50,<br>Saen Dam, Bang Khun Thian,<br>Bangkok 10150",
      "access.hours": "Hours",
      "access.hoursText": "Open Daily<br>10:00 - 21:00",
      "access.phone": "Phone",
      "footer.tagline": "Your Neighborhood Beauty Salon in Bangkok",
      "footer.contact": "Contact",
      "footer.addressText": "55/11 Rama II Soi 50,<br>Saen Dam, Bang Khun Thian, Bangkok 10150",
      "footer.hours": "Open Daily 10:00 - 21:00",
      "footer.followUs": "Follow Us",
      "line.floatBtn": "Add Friend",
      "chat.subtitle": "How can we help you?",
      "chat.welcome": "Hello! Welcome to Hairworld Stylists. How can I help you today?",
      "chat.btn.hours": "Business Hours",
      "chat.btn.location": "Location",
      "chat.btn.services": "Services",
      "chat.btn.booking": "Booking",
      "chat.btn.price": "Price",
      "chat.placeholder": "Type a message...",
      "nav.reservation": "Reservation",
      "reservation.label": "Reservation",
      "reservation.title": "Book Your<br>Appointment",
      "reservation.info": "Please fill out the form below and we will confirm your appointment. If the requested time is unavailable, we will contact you by phone.",
      "reservation.noteTitle": "Business Hours",
      "reservation.noteText": "Open Daily 10:00 - 21:00",
      "reservation.phoneTitle": "Phone Reservation",
      "reservation.name": "Name *",
      "reservation.namePh": "Your name",
      "reservation.phone": "Phone Number *",
      "reservation.phonePh": "e.g. 063-961-2999",
      "reservation.date": "Preferred Date *",
      "reservation.time": "Preferred Time *",
      "reservation.timePh": "Select time",
      "reservation.service": "Service *",
      "reservation.servicePh": "Select service",
      "reservation.svc.cut": "Hair - Cut & Styling",
      "reservation.svc.color": "Hair - Color & Highlights",
      "reservation.svc.perm": "Hair - Perm & Straightening",
      "reservation.svc.treatment": "Hair - Treatment",
      "reservation.svc.bridal": "Makeup - Bridal",
      "reservation.svc.occasion": "Makeup - Special Occasion",
      "reservation.svc.daily": "Makeup - Everyday",
      "reservation.svc.gel": "Nail - Gel",
      "reservation.svc.acrylic": "Nail - Acrylic",
      "reservation.svc.art": "Nail - Art & Design",
      "reservation.svc.care": "Nail - Hand & Foot Care",
      "reservation.message": "Message (optional)",
      "reservation.messagePh": "Any special requests or notes",
      "reservation.submit": "Submit Reservation",
      "reservation.success": "Your reservation request has been submitted! We will contact you shortly to confirm.",
      "reservation.error": "Failed to submit. Please call 063-961-2999 to make a reservation.",
      "reservation.lineFriendTitle": "Step 1: Add us on LINE",
      "reservation.lineFriendDesc": "Scan the QR code or tap the button below to add us as a friend first.",
      "reservation.lineConnectTitle": "Step 2: Connect your LINE",
      "reservation.lineConnect": "Receive confirmation via LINE",
      "reservation.lineConnected": "LINE confirmation enabled",
      "reservation.successLine": "Reservation submitted! A confirmation has been sent to your LINE.",
      "calendar.available": "Available",
      "calendar.busy": "Busy",
      "calendar.full": "Full",
      "calendar.warning": "This time slot is busy. Your preferred time may not be available. You can also book by phone: 063-961-2999",
      "calendar.sun": "Sun",
      "calendar.mon": "Mon",
      "calendar.tue": "Tue",
      "calendar.wed": "Wed",
      "calendar.thu": "Thu",
      "calendar.fri": "Fri",
      "calendar.sat": "Sat"
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
      "hero.tagline": "ร้านทำผมที่คุณไว้วางใจในกรุงเทพฯ",
      "hero.hours": "เปิดให้บริการทุกวัน 10:00 - 21:00",
      "hero.cta": "จองคิว",
      "about.label": "เกี่ยวกับเรา",
      "about.title": "ร้านเรา<br>สไตล์คุณ",
      "about.lead": "Hairworld Stylists เป็นร้านทำผมในกรุงเทพฯ ให้บริการด้านผม เมคอัพ และเล็บ สำหรับทุกคน",
      "about.text1": "ช่างของเราตั้งใจฟังความต้องการของคุณ และช่วยหาสไตล์ที่เหมาะกับคุณ เรายินดีต้อนรับลูกค้าทุกท่าน และตั้งใจให้ทุกครั้งที่มาเป็นประสบการณ์ที่สบายใจและน่าประทับใจ",
      "about.text2": "เราใช้ผลิตภัณฑ์คุณภาพระดับมืออาชีพในการดูแลผม ผิว และเล็บของคุณ เพื่อให้คุณออกจากร้านด้วยความสดชื่นและพอใจกับลุคใหม่",
      "about.exp": "ปีแห่งประสบการณ์",
      "about.clients": "ลูกค้าที่พึงพอใจ",
      "about.stylists": "ช่าง",
      "video.label": "เรื่องราวของเรา",
      "video.title": "การฝึกอบรมมืออาชีพ",
      "services.label": "บริการของเรา",
      "services.title": "บริการความงาม<br>ของเรา",
      "services.hair.desc": "ตัด ทำสี ดัด ทรีตเมนต์ เคราติน — จัดทรงที่เหมาะกับคุณ",
      "services.hair.item1": "ตัดผม & จัดทรง",
      "services.hair.item2": "ทำสี & ไฮไลท์",
      "services.hair.item3": "ดัดผม & ยืดผม",
      "services.hair.item4": "ทรีตเมนต์ผม",
      "services.makeup.desc": "ตั้งแต่ลุคเจ้าสาวไปจนถึงแต่งหน้าประจำวัน — เมคอัพที่ช่วยให้คุณดูดีและมั่นใจ",
      "services.makeup.item1": "เมคอัพเจ้าสาว",
      "services.makeup.item2": "โอกาสพิเศษ",
      "services.makeup.item3": "แต่งหน้าประจำวัน",
      "services.makeup.item4": "สอนแต่งหน้า",
      "services.nail.desc": "เจล อะครีลิค ลายเล็บ — เล็บสวยเรียบร้อยดูแลอย่างใส่ใจ",
      "services.nail.item1": "ทำเล็บเจล",
      "services.nail.item2": "ทำเล็บอะครีลิค",
      "services.nail.item3": "ออกแบบลายเล็บ",
      "services.nail.item4": "ดูแลมือ & เท้า",
      "gallery.label": "ผลงาน",
      "gallery.title": "ผลงานของเรา",
      "testimonials.label": "รีวิว",
      "testimonials.title": "ลูกค้าของเรา<br>พูดอย่างไร",
      "testimonials.review1.text": "\"ที่นี่ตัดผมสวยมาก ตัดตรงเรฟ เจ้าของร้านแต่งหน้าสวยมาก พนักงานทุกคน ทำงานเป็นมืออาชีพมีประสบการณ์มาก professional และมารยาทดีสุดสุด พี่พนักงานทุกคนพูดเพราะ คุยสนุก บรรยากาศร้านหรูหรา ที่ร้านใช้แต่ของดีๆ คุณภาพสูง ทำผมถูกใจมากๆ ทุกครั้งที่เข้ารับบริการไม่มีครั้งไหนเลยที่ไม่ประทับใจ\"",
      "testimonials.review1.name": "ลูกค้าประจำ",
      "testimonials.review1.role": "สระผม & ทรีตเมนต์, เป่าผม, แต่งหน้า",
      "testimonials.review2.text": "\"ดีมากค่ะร้านนี้แนะนำเลย ช่างใจดี น่ารักทุกคนเลย เราเอางานมานั่งทำที่ร้านได้ด้วย ทำสี และซอยสวยมว้าก ค่ะ ดีเลิศ มาประจำเกือบอาทิตย์ ตัดสวย เข้ากับหน้ามาก ทำสี ติดทน สวย\"",
      "testimonials.review2.name": "ลูกค้าประจำ — ช่างไอซ์",
      "testimonials.review2.role": "ทำสี & ตัดผม",
      "testimonials.review3.text": "\"สวยมากกก ตามมาจากรีวิวติ้กต็อก ตัดยังไม่เสร็จแต่คือสวยแล้ว แนะนำมาก บริการดีทุกอย่าง แค่ตัดผมก็เปลี่ยนเป็นคนละคน แนะนำวิธีเซตจัดทรง ดูแลดีมาก ที่นี่ตลอดไป\"",
      "testimonials.review3.name": "ลูกค้าใหม่ — จาก TikTok",
      "testimonials.review3.role": "ตัดผม, ดัดผม & บริการเจ้าสาว",
      "access.label": "การเดินทาง",
      "access.title": "มาเยี่ยมเรา",
      "access.address": "ที่อยู่",
      "access.addressText": "เลขที่ 55/11 พระราม 2 ซอย 50,<br>แสมดำ บางขุนเทียน,<br>กรุงเทพฯ 10150",
      "access.hours": "เวลาเปิดให้บริการ",
      "access.hoursText": "เปิดทุกวัน<br>10:00 - 21:00",
      "access.phone": "โทรศัพท์",
      "footer.tagline": "ร้านทำผมที่คุณไว้วางใจในกรุงเทพฯ",
      "footer.contact": "ติดต่อเรา",
      "footer.addressText": "เลขที่ 55/11 พระราม 2 ซอย 50,<br>แสมดำ บางขุนเทียน กรุงเทพฯ 10150",
      "footer.hours": "เปิดทุกวัน 10:00 - 21:00",
      "footer.followUs": "ติดตามเรา",
      "line.floatBtn": "เพิ่มเพื่อน",
      "chat.subtitle": "มีอะไรให้ช่วยไหมคะ?",
      "chat.welcome": "สวัสดีค่ะ! ยินดีต้อนรับสู่ Hairworld Stylists มีอะไรให้ช่วยไหมคะ?",
      "chat.btn.hours": "เวลาเปิด-ปิด",
      "chat.btn.location": "ที่ตั้งร้าน",
      "chat.btn.services": "บริการ",
      "chat.btn.booking": "จองคิว",
      "chat.btn.price": "ราคา",
      "chat.placeholder": "พิมพ์ข้อความ...",
      "nav.reservation": "จองคิว",
      "reservation.label": "จองคิว",
      "reservation.title": "นัดหมาย<br>ล่วงหน้า",
      "reservation.info": "กรุณากรอกแบบฟอร์มด้านล่าง เราจะติดต่อกลับเพื่อยืนยันนัดหมาย หากเวลาที่เลือกไม่ว่าง เราจะโทรแจ้งท่านค่ะ",
      "reservation.noteTitle": "เวลาเปิดให้บริการ",
      "reservation.noteText": "เปิดทุกวัน 10:00 - 21:00",
      "reservation.phoneTitle": "จองทางโทรศัพท์",
      "reservation.name": "ชื่อ *",
      "reservation.namePh": "ชื่อของคุณ",
      "reservation.phone": "เบอร์โทรศัพท์ *",
      "reservation.phonePh": "เช่น 063-961-2999",
      "reservation.date": "วันที่ต้องการ *",
      "reservation.time": "เวลาที่ต้องการ *",
      "reservation.timePh": "เลือกเวลา",
      "reservation.service": "บริการ *",
      "reservation.servicePh": "เลือกบริการ",
      "reservation.svc.cut": "ผม - ตัดผม & จัดทรง",
      "reservation.svc.color": "ผม - ทำสี & ไฮไลท์",
      "reservation.svc.perm": "ผม - ดัดผม & ยืดผม",
      "reservation.svc.treatment": "ผม - ทรีตเมนต์",
      "reservation.svc.bridal": "เมคอัพ - เจ้าสาว",
      "reservation.svc.occasion": "เมคอัพ - โอกาสพิเศษ",
      "reservation.svc.daily": "เมคอัพ - แต่งหน้าประจำวัน",
      "reservation.svc.gel": "เล็บ - เจล",
      "reservation.svc.acrylic": "เล็บ - อะครีลิค",
      "reservation.svc.art": "เล็บ - ออกแบบลายเล็บ",
      "reservation.svc.care": "เล็บ - ดูแลมือ & เท้า",
      "reservation.message": "ข้อความ (ไม่บังคับ)",
      "reservation.messagePh": "ข้อความเพิ่มเติมหรือคำขอพิเศษ",
      "reservation.submit": "ส่งคำขอจองคิว",
      "reservation.success": "ส่งคำขอจองคิวเรียบร้อยแล้ว! เราจะติดต่อกลับเพื่อยืนยันค่ะ",
      "reservation.error": "ส่งไม่สำเร็จ กรุณาโทร 063-961-2999 เพื่อจองคิวค่ะ",
      "reservation.lineFriendTitle": "ขั้นตอนที่ 1: เพิ่มเราเป็นเพื่อนใน LINE",
      "reservation.lineFriendDesc": "สแกน QR โค้ดหรือกดปุ่มด้านล่างเพื่อเพิ่มเราเป็นเพื่อนก่อนค่ะ",
      "reservation.lineConnectTitle": "ขั้นตอนที่ 2: เชื่อมต่อ LINE ของคุณ",
      "reservation.lineConnect": "รับการยืนยันผ่าน LINE",
      "reservation.lineConnected": "เปิดใช้งานการยืนยันผ่าน LINE แล้ว",
      "reservation.successLine": "ส่งคำขอจองคิวเรียบร้อยแล้ว! ข้อความยืนยันถูกส่งไปยัง LINE ของคุณแล้วค่ะ",
      "calendar.available": "ว่าง",
      "calendar.busy": "ค่อนข้างเต็ม",
      "calendar.full": "เต็ม",
      "calendar.warning": "ช่วงเวลานี้มีคิวค่อนข้างเยอะ อาจไม่สามารถรับได้ตามเวลาที่ต้องการ สามารถโทรจองได้ที่: 063-961-2999",
      "calendar.sun": "อา",
      "calendar.mon": "จ",
      "calendar.tue": "อ",
      "calendar.wed": "พ",
      "calendar.thu": "พฤ",
      "calendar.fri": "ศ",
      "calendar.sat": "ส"
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
      "hero.tagline": "バンコクの街の美容室",
      "hero.hours": "毎日営業 10:00 - 21:00",
      "hero.cta": "ご予約はこちら",
      "about.label": "サロン紹介",
      "about.title": "私たちのサロン、<br>あなたのスタイル",
      "about.lead": "Hairworld Stylistsは、バンコクにある美容室です。ヘア、メイク、ネイルのサービスを、どなたにも気軽にご利用いただけます。",
      "about.text1": "スタイリストがお客様のご要望をしっかり伺い、一緒にぴったりのスタイルを見つけます。どなたでも大歓迎です。毎回のご来店が心地よく、楽しいひとときになるよう心がけています。",
      "about.text2": "プロ仕様の良質な製品を使い、髪・肌・爪をしっかりケア。すっきりした気分でお帰りいただけるよう努めています。",
      "about.exp": "年の経験",
      "about.clients": "お客様の笑顔",
      "about.stylists": "スタイリスト",
      "video.label": "私たちのストーリー",
      "video.title": "プロフェッショナル研修",
      "services.label": "サービス",
      "services.title": "ビューティー<br>サービス",
      "services.hair.desc": "カット、カラー、パーマ、トリートメント、ケラチン — あなたに合ったスタイルをご提案します。",
      "services.hair.item1": "カット & スタイリング",
      "services.hair.item2": "カラー & ハイライト",
      "services.hair.item3": "パーマ & ストレート",
      "services.hair.item4": "ヘアトリートメント",
      "services.makeup.desc": "ブライダルからデイリーメイクまで — あなたらしさを活かすメイクをご提供します。",
      "services.makeup.item1": "ブライダルメイク",
      "services.makeup.item2": "特別なシーンに",
      "services.makeup.item3": "デイリーメイク",
      "services.makeup.item4": "メイクレッスン",
      "services.nail.desc": "ジェル、アクリル、ネイルアート — 丁寧な仕上がりで綺麗な指先に。",
      "services.nail.item1": "ジェルネイル",
      "services.nail.item2": "アクリルネイル",
      "services.nail.item3": "ネイルアート & デザイン",
      "services.nail.item4": "ハンド & フットケア",
      "gallery.label": "ギャラリー",
      "gallery.title": "施術実績",
      "testimonials.label": "お客様の声",
      "testimonials.title": "お客様から<br>いただいた声",
      "testimonials.review1.text": "\"ここはカットがとても上手で、レイヤーもぴったり。オーナーのメイクも素晴らしいです。スタッフ全員がプロフェッショナルで経験豊富、マナーも最高です。皆さん言葉遣いが丁寧で、おしゃべりも楽しい。店内は高級感があり、高品質な製品だけを使用。毎回大満足で、一度も期待を裏切られたことがありません。\"",
      "testimonials.review1.name": "常連のお客様",
      "testimonials.review1.role": "シャンプー & トリートメント、ブロー、メイク",
      "testimonials.review2.text": "\"このサロンは本当におすすめです！スタイリストさんが優しくて可愛い方ばかり。仕事を持ち込んで座って作業もできます。カラーとレイヤーカットがすごく綺麗でした。ほぼ毎週通っています。カットが顔の形にぴったり合って、カラーも長持ちして美しいです。\"",
      "testimonials.review2.name": "常連のお客様 — スタイリスト アイス",
      "testimonials.review2.role": "カラー & カット",
      "testimonials.review3.text": "\"めっちゃ綺麗！TikTokのレビューを見て来ました。カットが終わる前からもう綺麗でした。すごくおすすめ、全てのサービスが素晴らしい。カットだけで別人のように変われました。スタイリングやセットの仕方も教えてくれて、本当に丁寧。ずっとここに通います！\"",
      "testimonials.review3.name": "新規のお客様 — TikTokから",
      "testimonials.review3.role": "カット、パーマ & ブライダルサービス",
      "access.label": "アクセス",
      "access.title": "お店へのアクセス",
      "access.address": "住所",
      "access.addressText": "55/11 Rama II Soi 50,<br>แสมดำ Bang Khun Thian,<br>Bangkok 10150",
      "access.hours": "営業時間",
      "access.hoursText": "毎日営業<br>10:00 - 21:00",
      "access.phone": "電話番号",
      "footer.tagline": "バンコクの街の美容室",
      "footer.contact": "お問い合わせ",
      "footer.addressText": "55/11 Rama II Soi 50,<br>แสมดำ Bang Khun Thian, Bangkok 10150",
      "footer.hours": "毎日営業 10:00 - 21:00",
      "footer.followUs": "フォローする",
      "line.floatBtn": "友だち追加",
      "chat.subtitle": "何かお手伝いできますか？",
      "chat.welcome": "こんにちは！Hairworld Stylistsへようこそ。何かお手伝いできますか？",
      "chat.btn.hours": "営業時間",
      "chat.btn.location": "アクセス",
      "chat.btn.services": "サービス",
      "chat.btn.booking": "ご予約",
      "chat.btn.price": "料金",
      "chat.placeholder": "メッセージを入力...",
      "nav.reservation": "ご予約",
      "reservation.label": "ご予約",
      "reservation.title": "ご予約は<br>こちらから",
      "reservation.info": "下記フォームにご記入ください。ご予約内容を確認し、折り返しご連絡いたします。ご希望の日時が空いていない場合は、お電話にてご連絡いたします。",
      "reservation.noteTitle": "営業時間",
      "reservation.noteText": "毎日営業 10:00 - 21:00",
      "reservation.phoneTitle": "お電話でのご予約",
      "reservation.name": "お名前 *",
      "reservation.namePh": "お名前を入力",
      "reservation.phone": "電話番号 *",
      "reservation.phonePh": "例: 063-961-2999",
      "reservation.date": "ご希望日 *",
      "reservation.time": "ご希望時間 *",
      "reservation.timePh": "時間を選択",
      "reservation.service": "サービス *",
      "reservation.servicePh": "サービスを選択",
      "reservation.svc.cut": "ヘア — カット & スタイリング",
      "reservation.svc.color": "ヘア — カラー & ハイライト",
      "reservation.svc.perm": "ヘア — パーマ & ストレート",
      "reservation.svc.treatment": "ヘア — トリートメント",
      "reservation.svc.bridal": "メイク — ブライダル",
      "reservation.svc.occasion": "メイク — 特別なシーンに",
      "reservation.svc.daily": "メイク — デイリーメイク",
      "reservation.svc.gel": "ネイル — ジェル",
      "reservation.svc.acrylic": "ネイル — アクリル",
      "reservation.svc.art": "ネイル — アート & デザイン",
      "reservation.svc.care": "ネイル — ハンド & フットケア",
      "reservation.message": "メッセージ（任意）",
      "reservation.messagePh": "ご要望やご質問がありましたらご記入ください",
      "reservation.submit": "予約リクエストを送信",
      "reservation.success": "予約リクエストを送信しました！確認後、折り返しご連絡いたします。",
      "reservation.error": "送信に失敗しました。お電話（063-961-2999）でご予約ください。",
      "reservation.lineFriendTitle": "ステップ1: LINE友だち追加",
      "reservation.lineFriendDesc": "QRコードをスキャンするか、下のボタンをタップして友だち追加してください。",
      "reservation.lineConnectTitle": "ステップ2: LINEを連携する",
      "reservation.lineConnect": "LINEで予約確認を受け取る",
      "reservation.lineConnected": "LINE確認が有効です",
      "reservation.successLine": "予約リクエストを送信しました！LINEに確認メッセージをお送りしました。",
      "calendar.available": "空き",
      "calendar.busy": "やや混雑",
      "calendar.full": "混雑",
      "calendar.warning": "この時間帯は予約が混み合っています。ご希望の時間に対応できない場合がございます。お電話でもご予約いただけます: 063-961-2999",
      "calendar.sun": "日",
      "calendar.mon": "月",
      "calendar.tue": "火",
      "calendar.wed": "水",
      "calendar.thu": "木",
      "calendar.fri": "金",
      "calendar.sat": "土"
    }
  };

  // 現在の言語（localStorageから復元、デフォルトはタイ語）
  let currentLang = localStorage.getItem("hwLang") || "th";

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

    // LINE友だち追加ボタンの言語切替
    const lineFriendBtnImg = document.getElementById("line-friend-btn-img");
    if (lineFriendBtnImg) {
      const lineLangMap = { en: "en", th: "th", ja: "ja" };
      const lineLang = lineLangMap[lang] || "en";
      lineFriendBtnImg.src = `https://scdn.line-apps.com/n/line_add_friends/btn/${lineLang}.png`;
    }

    // Google Mapの言語切替
    const googleMap = document.getElementById("google-map");
    if (googleMap) {
      const mapLangMap = { en: "en", th: "th", ja: "ja" };
      const mapLang = mapLangMap[lang] || "en";
      googleMap.src = `https://maps.google.com/maps?q=Hairworld+Stylists+Rama+2&hl=${mapLang}&z=16&output=embed`;
    }

    // ミニカレンダーを再描画（言語切替時）
    if (typeof renderCalendar === "function" && document.getElementById("cal-grid")) {
      renderCalendar();
    }
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

  // === LIFF初期化（LINE連携用） ===
  const LIFF_ID = "2010031564-epVCX2tp";
  let lineUserProfile = null;
  let liffReady = false;

  async function initLiffForWebsite() {
    try {
      await liff.init({ liffId: LIFF_ID });
      liffReady = true;
      console.log("LIFF init success, isLoggedIn:", liff.isLoggedIn());

      // LINEログインからのリダイレクト直後かチェック
      // URLに#reservationがあり、ログイン済みならプロフィールを表示
      if (liff.isLoggedIn() && window.location.hash.includes("reservation")) {
        lineUserProfile = await liff.getProfile();
        showLineConnected();
        // 予約セクションにスクロール
        const reservationSection = document.getElementById("reservation");
        if (reservationSection) {
          setTimeout(() => reservationSection.scrollIntoView({ behavior: "smooth" }), 500);
        }
      }
    } catch (error) {
      console.error("LIFF init error:", error.message);
      liffReady = false;
    }
  }

  // LINE連携済みの表示
  function showLineConnected() {
    if (!lineUserProfile) return;
    const connectDiv = document.getElementById("line-connect");
    const connectedDiv = document.getElementById("line-connected");
    const avatar = document.getElementById("line-user-avatar");
    const name = document.getElementById("line-user-name");

    if (connectDiv && connectedDiv) {
      avatar.src = lineUserProfile.pictureUrl || "";
      name.textContent = lineUserProfile.displayName;
      connectDiv.classList.add("hidden");
      connectedDiv.classList.remove("hidden");
    }
  }

  // LINE連携を解除（表示をリセット）
  function disconnectLine() {
    lineUserProfile = null;
    const connectDiv = document.getElementById("line-connect");
    const connectedDiv = document.getElementById("line-connected");
    if (connectDiv && connectedDiv) {
      connectedDiv.classList.add("hidden");
      connectDiv.classList.remove("hidden");
    }
  }

  // LINEログインボタン
  const lineLoginBtn = document.getElementById("line-login-btn");
  if (lineLoginBtn) {
    lineLoginBtn.addEventListener("click", async () => {
      console.log("LINE button clicked, liffReady:", liffReady);

      if (!liffReady) {
        // LIFF未初期化 → エラー表示
        alert("LINE連携の準備ができていません。ページを再読み込みしてお試しください。");
        return;
      }

      try {
        if (liff.isLoggedIn()) {
          // 既にログイン済み → プロフィール取得して表示
          console.log("Already logged in, getting profile...");
          lineUserProfile = await liff.getProfile();
          showLineConnected();
        } else {
          // 未ログイン → LINEログインを実行
          console.log("Not logged in, redirecting to LINE login...");
          liff.login({ redirectUri: window.location.href.split("#")[0] + "#reservation" });
        }
      } catch (error) {
        console.error("LINE login error:", error.message);
        alert("LINE連携でエラーが発生しました: " + error.message);
      }
    });
  }

  // LINE連携解除ボタン
  const lineDisconnectBtn = document.getElementById("line-disconnect-btn");
  if (lineDisconnectBtn) {
    lineDisconnectBtn.addEventListener("click", disconnectLine);
  }

  // LIFF初期化実行
  if (typeof liff !== "undefined") {
    initLiffForWebsite();
  }

  // === ミニカレンダー（予約空き状況） ===
  const calGrid = document.getElementById("cal-grid");
  const calMonthLabel = document.getElementById("cal-month-label");
  const calPrev = document.getElementById("cal-prev");
  const calNext = document.getElementById("cal-next");
  const availabilityWarning = document.getElementById("availability-warning");
  const availabilityWarningText = document.getElementById("availability-warning-text");

  // カレンダーの状態管理
  let calYear = new Date().getFullYear();
  let calMonth = new Date().getMonth(); // 0始まり
  let availabilityData = {}; // { "YYYY-MM-DD": { "HH:MM": count } }
  let availabilityCache = {}; // キャッシュ { "YYYY-MM": data }

  // 予約空き状況APIから指定月のデータを取得
  async function fetchAvailability(year, month) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    if (availabilityCache[key]) {
      availabilityData = availabilityCache[key];
      return;
    }
    try {
      const res = await fetch(`/api/availability?month=${key}`);
      if (res.ok) {
        const data = await res.json();
        availabilityCache[key] = data;
        availabilityData = data;
      } else {
        availabilityData = {};
      }
    } catch (e) {
      console.error("空き状況取得エラー:", e.message);
      availabilityData = {};
    }
  }

  // 日付の予約件数合計を取得
  function getDayBookingCount(dateStr) {
    const dayData = availabilityData[dateStr];
    if (!dayData) return 0;
    return Object.values(dayData).reduce((sum, c) => sum + c, 0);
  }

  // 特定の日付・時間の予約件数を取得
  function getTimeBookingCount(dateStr, timeStr) {
    const dayData = availabilityData[dateStr];
    if (!dayData) return 0;
    return dayData[timeStr] || 0;
  }

  // カレンダーを描画
  async function renderCalendar() {
    if (!calGrid) return;
    await fetchAvailability(calYear, calMonth);

    const t = (key) => (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key;

    // 月ラベル更新
    const monthNames = {
      en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      th: ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"],
      ja: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
    };
    const names = monthNames[currentLang] || monthNames.en;
    calMonthLabel.textContent = `${names[calMonth]} ${calYear}`;

    // 曜日ヘッダー
    const dayKeys = ["calendar.sun","calendar.mon","calendar.tue","calendar.wed","calendar.thu","calendar.fri","calendar.sat"];
    let html = "";
    dayKeys.forEach(k => {
      html += `<div class="cal-day-header">${t(k)}</div>`;
    });

    // 月の初日と最終日
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const lastDate = new Date(calYear, calMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 前月の空白セル
    for (let i = 0; i < firstDay; i++) {
      html += `<div class="cal-day cal-empty"></div>`;
    }

    // 日付セル
    for (let d = 1; d <= lastDate; d++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const cellDate = new Date(calYear, calMonth, d);
      const isPast = cellDate < today;
      const count = getDayBookingCount(dateStr);

      let statusClass = "cal-available";
      let statusIcon = "○";
      if (count >= 3) {
        statusClass = "cal-full";
        statusIcon = "×";
      } else if (count >= 1) {
        statusClass = "cal-busy";
        statusIcon = "△";
      }

      if (isPast) {
        html += `<div class="cal-day cal-past"><span class="cal-day-num">${d}</span></div>`;
      } else {
        html += `<div class="cal-day ${statusClass}" data-date="${dateStr}"><span class="cal-day-num">${d}</span><span class="cal-status">${statusIcon}</span></div>`;
      }
    }

    calGrid.innerHTML = html;

    // 日付セルのクリックイベント
    calGrid.querySelectorAll(".cal-day[data-date]").forEach(cell => {
      cell.addEventListener("click", () => {
        const dateInput = document.getElementById("res-date");
        if (dateInput) {
          dateInput.value = cell.getAttribute("data-date");
          // 日付変更時に警告をチェック
          checkAvailabilityWarning();
        }
        // 選択状態を更新
        calGrid.querySelectorAll(".cal-day").forEach(c => c.classList.remove("cal-selected"));
        cell.classList.add("cal-selected");
      });
    });
  }

  // 時間帯選択時の警告チェック
  function checkAvailabilityWarning() {
    const dateInput = document.getElementById("res-date");
    const timeSelect = document.getElementById("res-time");
    if (!dateInput || !timeSelect || !availabilityWarning) return;

    const dateVal = dateInput.value;
    const timeVal = timeSelect.value;

    if (!dateVal || !timeVal) {
      availabilityWarning.classList.add("hidden");
      return;
    }

    const count = getTimeBookingCount(dateVal, timeVal);
    if (count >= 1) {
      const t = (key) => (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key;
      availabilityWarningText.textContent = t("calendar.warning");
      availabilityWarning.classList.remove("hidden");
    } else {
      availabilityWarning.classList.add("hidden");
    }
  }

  // カレンダー初期化
  if (calGrid) {
    renderCalendar();

    // 前月・次月ボタン
    if (calPrev) {
      calPrev.addEventListener("click", () => {
        calMonth--;
        if (calMonth < 0) { calMonth = 11; calYear--; }
        renderCalendar();
      });
    }
    if (calNext) {
      calNext.addEventListener("click", () => {
        calMonth++;
        if (calMonth > 11) { calMonth = 0; calYear++; }
        renderCalendar();
      });
    }

    // 日付・時間帯変更時に警告チェック
    const dateInput2 = document.getElementById("res-date");
    const timeSelect2 = document.getElementById("res-time");
    if (dateInput2) {
      dateInput2.addEventListener("change", async () => {
        // 選択された日付の月のデータを取得
        const [y, m] = dateInput2.value.split("-").map(Number);
        if (y && m) {
          await fetchAvailability(y, m - 1);
        }
        checkAvailabilityWarning();
      });
    }
    if (timeSelect2) {
      timeSelect2.addEventListener("change", checkAvailabilityWarning);
    }
  }

  // === 予約フォーム ===
  const reservationForm = document.getElementById("reservation-form");
  const reservationResult = document.getElementById("reservation-result");
  const reservationSubmit = document.getElementById("reservation-submit");

  // 日付の最小値を今日に設定
  const dateInput = document.getElementById("res-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }

  if (reservationForm) {
    reservationForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // 送信中の状態
      reservationSubmit.disabled = true;
      reservationSubmit.textContent = "...";
      reservationResult.className = "reservation-result";
      reservationResult.textContent = "";

      const formData = {
        name: document.getElementById("res-name").value.trim(),
        phone: document.getElementById("res-phone").value.trim(),
        date: document.getElementById("res-date").value,
        time: document.getElementById("res-time").value,
        service: document.getElementById("res-service").selectedOptions[0].textContent,
        message: document.getElementById("res-message").value.trim(),
        lineUserId: lineUserProfile ? lineUserProfile.userId : null,
        lineDisplayName: lineUserProfile ? lineUserProfile.displayName : null,
        lang: currentLang
      };

      try {
        const response = await fetch("/api/reserve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          // 成功（LINE連携済みなら別メッセージ）
          const msgKey = lineUserProfile ? "reservation.successLine" : "reservation.success";
          const successMsg = translations[currentLang][msgKey] || translations.en[msgKey];
          reservationResult.className = "reservation-result success";
          reservationResult.textContent = successMsg;
          reservationForm.reset();
        } else {
          throw new Error(data.error || "送信失敗");
        }
      } catch (error) {
        // エラー
        const errorMsg = translations[currentLang]["reservation.error"] || translations.en["reservation.error"];
        reservationResult.className = "reservation-result error";
        reservationResult.textContent = errorMsg;
      } finally {
        // ボタンを元に戻す
        reservationSubmit.disabled = false;
        const submitText = translations[currentLang]["reservation.submit"] || translations.en["reservation.submit"];
        reservationSubmit.textContent = submitText;
      }
    });
  }

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

// ギャラリービデオの再生/停止
function toggleGalleryVideo() {
  const video = document.getElementById("galleryVideoEl");
  const container = document.getElementById("galleryVideo");
  if (video.paused) {
    video.play();
    container.classList.add("playing");
  } else {
    video.pause();
    container.classList.remove("playing");
  }
}

// ライトボックス: 写真拡大表示
function openLightbox(el) {
  const img = el.querySelector("img");
  if (!img) return;
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("galleryLightbox");
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}
