# English Learning App - AI Context

## Amac
Eyup'un A1'den C1'e Ingilizce ogrenme yolculugu. Web app ogrenme araci.
**Oncelik: Ogrenme > Icerik > App**
**Aksan: Amerikan Ingilizcesi (en-US)**

## Ogrenci Profili
- Mevcut seviye: A1 (Beginner)
- Hedef seviye: C1 (Advanced)
- Ana dil: Turkce
- Yazilimci degil - teknik detay verme, sadece calistir
- Gercek hayat senaryolari istiyor (is, e-ticaret, seyahat, lojistik)

## Icerik Standartlari
- Her unite gercek hayat senaryosu icermeli (restoran, otel, is gorusmesi, alisveris vb.)
- Kelimeler gunluk hayattan, pratik ve kullanisli
- IPA fonetik KULLANMA → Turkce okunus yaz (ornek: "gud-BAY", "MOR-ning")
- Ornek cumleler dogal konusma dili, ders kitabi tarzi degil
- Turkce aciklama A1-A2'de tam, B1'den itibaren azalir
- Dialog'larda Speaker A = kadin sesi, Speaker B (Eyup) = erkek sesi

## Tech Stack
- React + Vite + shadcn/ui + Tailwind CSS v4
- Lucide React ikonlari
- Web Speech API (text-to-speech, erkek/kadin ses)
- localStorage (DB yok, backend yok)
- Vercel Analytics + Speed Insights
- GitHub: eyupcbkc/english-learning-app

## Mimari
- Icerik: `src/data/units/unit-XX.json` (JSON-driven)
- Yeni unite = JSON dosyasi + unitIndex.js'e import
- Shared components: tum alistirma tipleri tekrar kullanilabilir
- Design system: `docs/design-system.md`

## Unite Akisi (7 Adim)
1. Kelimeler (Vocabulary) - flip kartlar + ses
2. Dilbilgisi (Grammar) - tablo + ipuclari
3. Okuma (Reading) - metin + anlama sorulari
4. Dinleme (Dialog) - sesli diyalog + anlama
5. Alistirmalar (Exercises) - 5 tip: fill blanks, MC, matching, ordering, translation
6. Kaynaklar (Resources) - ucretsiz dis kaynaklar
7. Tamamla (Complete) - skor ozeti + sonraki unite

## Planlanan Ozellikler (Oncelik sirasina gore)
1. **Flashcard / Hafiza Karti sistemi** (Leitner spaced repetition) → docs/flashcard-system.md
2. **Unit 04-08 icerikleri** → docs/content-plan.md
3. Kelime listesi sayfasi + filtreleme
4. Gunluk hedefler ve hatirlatma
5. Seviye belirleme testi
6. Dark mode
7. Vercel deploy

## Session Protokolu
1. Bu dosyayi oku → genel context
2. `docs/progress.md` oku → neredeyiz?
3. Sadece ilgili dosyalari ac
4. Gereksiz dosya okuma YAPMA
5. Icerik eklerken `docs/content-plan.md` kontrol et

## Dosya Rehberi
| Dosya | Amac |
|---|---|
| CLAUDE.md | Bu dosya - AI context |
| docs/roadmap.md | 64 unite yol haritasi |
| docs/content-plan.md | Unite icerik detaylari + senaryolar |
| docs/flashcard-system.md | Kelime ezber sistemi plani |
| docs/design-system.md | UI/UX standartlari |
| docs/progress.md | Ilerleme takibi |
| docs/scenario-plan.md | Senaryo plani |
| docs/session-guide.md | Session komutlari |
