# Flashcard & Vocabulary System Plan

## Genel Bakis
Kelime ezber sistemi = uygulamanin kalbi. Uniteler icerik ogretir, ama kelimeleri KALICI yapan sey tekrar sistemidir.

---

## 1. Spaced Repetition (Aralikli Tekrar) - Leitner System

### Nasil Calisir
Her kelime 5 kutudan birinde:
- **Kutu 1**: Yeni / yanlis bilinen → Her gun tekrar
- **Kutu 2**: 1 kez dogru → 2 gunde bir tekrar
- **Kutu 3**: 2 kez dogru → 4 gunde bir tekrar
- **Kutu 4**: 3 kez dogru → 7 gunde bir tekrar
- **Kutu 5**: 4+ kez dogru → 14 gunde bir tekrar (ogrenilmis!)

### Kurallar
- Dogru cevap → kelime bir ust kutuya cikar
- Yanlis cevap → kelime Kutu 1'e geri doner
- Her gun "Bugun tekrar edilecek kelimeler" listesi olusur
- localStorage'da her kelimenin kutusu + son tekrar tarihi tutulur

---

## 2. Flashcard (Hafiza Karti) Modlari

### Mod 1: Klasik Flip Card
- On yuz: Ingilizce kelime + telaffuz butonu
- Arka yuz: Turkce anlam + ornek cumle
- Kullanici "Biliyorum" / "Bilmiyorum" secer
- Sonuc Leitner kutusunu gunceller

### Mod 2: Yazarak Cevapla
- Ekranda Turkce kelime gosterilir
- Kullanici Ingilizce karsiligini yazar
- Dogru/yanlis kontrolu yapilir

### Mod 3: Sesli Cevapla (ileri seviye, ileride)
- Kelime sesli okunur
- Kullanici ne duyduğunu yazar
- Dinleme + yazma birlikte calısır

### Mod 4: Cumle Tamamlama
- Ornek cumle bosluklu gosterilir
- Kullanici kelimeyi yazar

### Mod 5: Resimli Kartlar (ileride)
- Kelimeyle ilgili gorsel
- Gorselden kelimeyi tahmin etme

---

## 3. Kelime Listesi Ozellikleri

### Filtreleme
- Seviyeye gore (A1, A2, B1...)
- Uniteye gore (Unit 01, Unit 02...)
- Kutuya gore (Kutu 1 = zayif, Kutu 5 = guclu)
- Kategoriye gore (Gunluk, Is, Seyahat, Yemek...)

### Siralama
- Alfabe
- En zor (en cok yanlis)
- En eski (en uzun suredir tekrar edilmeyen)
- Rastgele

### Istatistikler
- Toplam ogrenilen kelime
- Bugun tekrar edilen
- Bu hafta ogrenilen yeni kelime
- En zor 10 kelime
- Kelime dagilimi (kac kelime hangi kutuda)

---

## 4. Gunluk Hedefler

- Varsayilan: Gunde 10 kelime tekrar, 5 yeni kelime
- Kullanici ayarlayabilir
- Streak (gun serisi) takibi → motivasyon
- Haftalik rapor: "Bu hafta 35 kelime tekrar ettin, 15 yeni ogrendin"

---

## 5. Kelime Karti Veri Yapisi (localStorage)

```json
{
  "flashcards": {
    "hello": {
      "box": 3,
      "lastReview": "2026-04-04",
      "nextReview": "2026-04-08",
      "timesCorrect": 5,
      "timesWrong": 1,
      "addedFrom": "unit-01"
    }
  },
  "settings": {
    "dailyGoal": 10,
    "newWordsPerDay": 5
  },
  "stats": {
    "totalReviewed": 150,
    "streakDays": 7
  }
}
```

---

## 6. UI/UX Plani

### Ana Sayfa Entegrasyonu
- Dashboard'da "Bugun X kelime tekrar bekliyor" karti
- Kirmizi badge ile acil tekrar gereken kelime sayisi

### Flashcard Sayfasi (/flashcards)
- Buyuk flip kart ortada
- Alt kisimda "Biliyorum" (yesil) / "Bilmiyorum" (kirmizi) butonlari
- Ilerleme cubugu (kac kelime kaldi)
- Mod secimi (flip, yazma, cumle)

### Kelime Listesi Sayfasi (/vocabulary)
- Tum kelimelerin listesi
- Filtre + siralama
- Her kelimenin yaninda kutu numarasi ve son tekrar tarihi
- Tiklayinca detay: anlam, ornek, telaffuz, istatistik

### Sidebar Entegrasyonu
- "Flashcards" linki + bekleyen kelime sayisi badge
- "Kelimelerim" linki

---

## 7. Implementasyon Sirasi

1. Flashcard veri yapisi + Leitner algoritmasi (useFlashcards hook)
2. Flashcard sayfasi - Flip Card modu
3. Dashboard'a "bekleyen tekrar" karti
4. Yazarak cevapla modu
5. Kelime listesi sayfasi
6. Filtreleme ve istatistikler
7. Gunluk hedef ve hatirlatma
