# Roadmap: A1 → C1 English Learning Journey

## Yaklasim
- Her unite 7 adimli: Kelimeler → Dilbilgisi → Okuma → Dinleme → Alistirmalar → Kaynaklar → Tamamla
- Spaced repetition (Leitner) ile kelime tekrari
- Gercek hayat senaryolari (restoran, otel, is gorusmesi, e-ticaret, lojistik...)
- Amerikan aksani (en-US), erkek/kadin ses ayirt etme
- Seviye sonu test ile gecis onaylanir

---

## Tamamlanan Ozellikler
- [x] Vocabulary cards (flip + ses + 2 ornek cumle per kelime)
- [x] Grammar tables (Turkce aciklama)
- [x] Reading comprehension
- [x] Fill in the blanks
- [x] Multiple choice
- [x] Matching exercise (toast + shake + seri takibi + istatistikler)
- [x] Sentence ordering
- [x] Translation (TR→EN)
- [x] Text-to-Speech telaffuz (Web Speech API)
- [x] Dialog/Conversation dinleme (chat bubble UI, hover ile metin, karakter bazli ses)
- [x] Karakter bazli ses: her karakter farkli pitch/rate (Eyup=derin erkek, Emma=parlak kadin vb.)
- [x] Kaynak onerileri (BBC, British Council vb.)
- [x] 7 adimli unite akisi
- [x] Skor takibi (localStorage, exercise bazli)
- [x] Streak (gun serisi) takibi
- [x] Otomatik seviye hesaplama
- [x] Modul aciklamalari (skills listesi)
- [x] Design system dokumantasyonu
- [x] Vercel Analytics + Speed Insights
- [x] GitHub entegrasyonu
- [x] 🃏 Flashcard / Hafiza Karti (Leitner 5-kutu, flip + yazma modu, feedback badge)
- [x] 🔄 Turkce ceviri accordion sistemi (TranslationToggle — reusable)
- [x] 📱 Mobile responsive layout (hamburger menu + slide-in sidebar)
- [x] 🔐 Firebase entegrasyonu (Auth + Firestore)
  - Firebase Auth (email/sifre kayit + giris)
  - Login/Register sayfasi + korunmus rotalar (ProtectedRoute)
  - Firestore'a ilerleme verisi (skorlar, flashcard, streak, seviye)
  - localStorage → Firestore otomatik goc
  - Cihazlar arasi senkronizasyon (telefon ↔ bilgisayar)
  - Offline persistence (IndexedDB)
  - Sidebar'da kullanici adi + cikis butonu

## Yapilacaklar
- [x] 📝 Unit 04-08 icerikleri (Module 1 tamam!)
- [x] 🚀 Vercel deploy (english-learning-app-six-cyan.vercel.app)
- [x] 🎨 UX/UI modernizasyon (animasyonlar, responsive, student-friendly)
- [x] 📝 Unit 09-16 icerikleri (Module 2 tamam! A1→A2)
- [x] 📝 Unit 17-24 icerikleri (Module 3 tamam! A2→B1)
- [x] 🃏 Flashcard sistemi refactor (8 modüler bileşen, zamanlı oturum, pas geçme, seviye filtresi)
- [x] ⚡ Performans: anında kart yükleme, React.memo, Firestore modern API
- [x] 📝 Unit 25-32 icerikleri (Module 4 tamam! B1)
- [ ] 📝 **Unit 33-48 icerikleri (Module 5-6: B1→B2)** ← SIRADAKI
- [ ] 📝 Unit 49-64 icerikleri (Module 7-8: B2→C1)
- [ ] 📚 Kelime listesi sayfasi + filtreleme
- [ ] 🎤 Speech-to-Text pronunciation practice
- [ ] 📊 Seviye olcme testi (placement test)
- [ ] 📊 Modul sonu testleri
- [ ] 🌙 Dark mode

---

## STAGE 1: A1 → A2 (Temel Iletisim)

### Module 1: First Steps (A1 Core) 🌱
**Hedef:** Hayatta kalma Ingilizcesi — tanisma, temel sorular, gunluk hayat
**Senaryo temalari:** Kafe, okul, sinif, market, otel, restoran

- [x] Unit 01: Greetings & Introductions — *Kafede tanisma* (30 kelime, 13 satirlik dialog)
- [x] Unit 02: Numbers, Days & Months — *Okul kayit ofisi* (30 kelime, 14 satirlik dialog)
- [x] Unit 03: Present Simple - Be — *Ofiste ilk gun* (30 kelime, 10 satirlik dialog, lojistik senaryo)
- [x] Unit 04: Present Simple - Do/Does — *Markette alisveris* (30 kelime, 13 satirlik dialog)
- [x] Unit 05: Basic Questions (WH) — *Otelde check-in* (30 kelime, otel senaryosu)
- [x] Unit 06: Daily Routines — *YouTube vlogger "Bir gunum"* (30 kelime, rutin anlatma)
- [x] Unit 07: Food & Drinks — *Restoranda siparis verme* (30 kelime, restoran senaryosu)
- [x] Unit 08: A1 Core Review & Test — *Karma senaryo testi* (30 kelime, tum A1 tekrari)

### Module 2: Expanding Basics (A1 → A2) 🌿
**Hedef:** Gunluk hayat — seyahat, alisveris, gecmis zaman
**Senaryo temalari:** Havaalani, araba kiralama, Airbnb, online alisveris, sehir turu

- [x] Unit 09: Present Continuous — *Havalimaninda bekleme* (30 kelime)
- [x] Unit 10: Can / Can't — *Araba kiralama* (30 kelime)
- [x] Unit 11: There is / There are — *Airbnb evi tarifi* (30 kelime)
- [x] Unit 12: Past Simple (Regular) — *Tatil anisi anlatma* (30 kelime)
- [x] Unit 13: Past Simple (Irregular top 30) — *Istanbul seyahat blogu* (30 kelime)
- [x] Unit 14: Adjectives & Comparatives — *Online urun karsilastirma* (30 kelime)
- [x] Unit 15: Shopping, Money, Directions — *Sehirde kaybolma + alisveris* (30 kelime)
- [x] Unit 16: A2 Level Test — *1 gunluk seyahat senaryosu* (30 kelime)

---

## STAGE 2: A2 → B1 (Bagimsiz Iletisim)

### Module 3: Grammar Expansion (A2 → B1) 🌳
**Hedef:** Is dunyasina giris — CV, gorusme, freelance, startup
**Senaryo temalari:** Is gorusmesi, LinkedIn, e-ticaret, lojistik, freelancing, startup

- [x] Unit 17: Future (will & going to) — *Is gorusmesine hazirlik* (30 kelime)
- [x] Unit 18: Present Perfect — *CV ve is deneyimi anlatma* (30 kelime)
- [x] Unit 19: Present Perfect vs Past Simple — *LinkedIn profili yazma* (30 kelime)
- [x] Unit 20: First Conditional — *E-ticaret siparis problemi* (30 kelime)
- [x] Unit 21: Modal Verbs — *Lojistik kargo takibi* (30 kelime)
- [x] Unit 22: Adverbs & Frequency — *Freelancer gunlugu* (30 kelime)
- [x] Unit 23: Phrasal Verbs Set 1 — *Startup kurma hikayesi* (30 kelime)
- [x] Unit 24: B1 Entry Test — *Is dunyasi karma testi* (30 kelime)

### Module 4: Real Communication (B1) 🌲
**Hedef:** Profesyonel iletisim — e-posta, toplanti, sunum, musteri
**Senaryo temalari:** Is teklifi, urun iade, toplanti, sirket yazismasi, musteri sikayeti

- [x] Unit 25: Second Conditional — *Is teklifi degerlendirme* (30 kelime)
- [x] Unit 26: Passive Voice — *Urun iade sureci* (30 kelime)
- [x] Unit 27: Reported Speech — *Toplanti ozeti* (30 kelime)
- [x] Unit 28: Relative Clauses — *Entegrasyon uzmani email* (30 kelime)
- [x] Unit 29: Connectors — *Ceyreklik sunum* (30 kelime)
- [x] Unit 30: Email & Formal Writing — *Kurumsal yazisma* (30 kelime)
- [x] Unit 31: Phrasal Verbs Set 2 — *Musteri sikayeti cozme* (30 kelime)
- [x] Unit 32: B1 Level Test — *Tam is gunu senaryosu* (30 kelime, 27 satirlik dialog)

---

## STAGE 3: B1 → B2 (Akici Iletisim)

### Module 5: Complex Grammar (B1 → B2)
**Hedef:** Karmasik gramer — gecmis analizi, koşullar, idiomlar
- [ ] Unit 33: Past Perfect — *Gecmiste yapilmayan is plani*
- [ ] Unit 34: Third Conditional — *Kacirilmis firsatlar*
- [ ] Unit 35: Mixed Conditionals — *Kariyer planlama*
- [ ] Unit 36: Gerunds vs Infinitives — *Proje yonetimi*
- [ ] Unit 37: Advanced Passive — *Sirket surecleri*
- [ ] Unit 38: Collocations Set 1 — *Is dunyasi collocations*
- [ ] Unit 39: Idioms & Expressions Set 1 — *Ofis hayati*
- [ ] Unit 40: B2 Entry Test

### Module 6: Fluency Building (B2)
**Hedef:** Akicilik — tartisma, essay, haber, formal/informal
- [ ] Unit 41: Wish & If only
- [ ] Unit 42: Formal vs Informal register
- [ ] Unit 43: Essay structure & Opinion writing
- [ ] Unit 44: Phrasal Verbs Set 3
- [ ] Unit 45: Debate & Argumentation
- [ ] Unit 46: News & Media vocabulary
- [ ] Unit 47: Collocations Set 2
- [ ] Unit 48: B2 Level Test

---

## STAGE 4: B2 → C1 (Ileri Seviye)

### Module 7: Advanced Grammar (B2 → C1)
**Hedef:** Akademik/profesyonel yeterlilik
- [ ] Unit 49: Inversion — *TED Talk tarzi sunum*
- [ ] Unit 50: Cleft sentences — *Haber analizi*
- [ ] Unit 51: Advanced modals — *Gecmis hatalari analiz*
- [ ] Unit 52: Participle clauses — *Rapor yazma*
- [ ] Unit 53: Ellipsis & Substitution
- [ ] Unit 54: Academic vocabulary
- [ ] Unit 55: Idioms & Expressions Set 2
- [ ] Unit 56: C1 Entry Test

### Module 8: Proficiency (C1)
**Hedef:** Ustaca Ingilizce — nüans, ton, diplomatik dil
- [ ] Unit 57: Nuance & Tone — *Diplomatik dil*
- [ ] Unit 58: Hedging language — *Akademik tartisma*
- [ ] Unit 59: Advanced discourse markers
- [ ] Unit 60: Formal report writing
- [ ] Unit 61: Phrasal Verbs mastery
- [ ] Unit 62: Cultural context & pragmatics
- [ ] Unit 63: Advanced reading & inference
- [ ] Unit 64: C1 Final Test

---

## Her Unite Standart Yapisi (7 Adim)
1. **Kelimeler** — 12-15 kelime, Turkce okunus, ornek cumle, ses butonu
2. **Dilbilgisi** — Kural + tablo + ipuclari + Turkce aciklama
3. **Okuma** — Gercek hayat metni + anlama sorulari
4. **Dinleme** — Sesli diyalog (erkek/kadin ses) + anlama sorulari
5. **Alistirmalar** — 5 tip: bosluk, coktan secmeli, eslestirme, siralama, ceviri
6. **Kaynaklar** — Ucretsiz dis kaynaklar (BBC, British Council vb.)
7. **Tamamla** — Skor ozeti + sonraki uniteye gecis
