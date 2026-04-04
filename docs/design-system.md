# Design System - English Learning App

## Prensipler
1. **Sadelik** — Karışık değil, her şey tek bakışta anlaşılmalı
2. **Tutarlılık** — Aynı element her yerde aynı görünmeli
3. **Geri bildirim** — Kullanıcı her aksiyonda görsel tepki almalı
4. **Erişilebilirlik** — Kontrast 4.5:1 min, touch target 44px min

---

## Renkler

### Semantic (Anlamsal)
| Kullanım | Renk | Tailwind | Ne zaman |
|---|---|---|---|
| Primary | Koyu gri | `bg-primary` `text-primary` | Ana aksiyonlar, aktif state, CTA |
| Success | Yeşil | `bg-green-50` `text-green-600` `border-green-200` | Doğru cevap, tamamlandı |
| Error | Kırmızı | `bg-red-50` `text-red-600` `border-red-200` | Yanlış cevap, hata |
| Warning/Info | Amber | `bg-amber-50` `text-amber-800` `border-amber-200` | İpuçları, okuma alanları |
| Muted | Gri | `text-muted-foreground` `bg-muted` | İkincil metin, ipuçları |

### Ikon Arka Plan Renkleri (Stat kartları)
- Primary: `bg-primary/10` + `text-primary`
- Green: `bg-green-500/10` + `text-green-600`
- Amber: `bg-amber-500/10` + `text-amber-600`
- Orange: `bg-orange-500/10` + `text-orange-500`
- Blue: `bg-blue-100` + `text-blue-700`
- Purple: `bg-purple-100` + `text-purple-700`

---

## Typography

### Font
- Geist Variable (sans-serif)

### Sizes
| Kullanım | Class | Örnek |
|---|---|---|
| Sayfa başlığı | `text-2xl font-bold tracking-tight` | "English Learning Journey" |
| Kart başlığı | `text-base font-medium` veya `text-sm font-semibold` | "Module 1" |
| Body text | `text-sm` | Normal metin |
| Küçük metin | `text-xs text-muted-foreground` | İpuçları, açıklamalar |
| Etiket/Label | `text-[11px] text-muted-foreground` | Stat etiketleri |
| Skor | `text-3xl font-bold` | Alıştırma sonuçları |
| Kelime | `text-lg font-semibold text-primary` | Vocabulary kartları |

---

## Spacing

### Standart Aralıklar
| Kullanım | Değer |
|---|---|
| Kartlar arası | `gap-3` veya `space-y-6` |
| Kart iç padding | `p-4` veya `p-5` |
| Bölümler arası | `space-y-8` |
| Element grupları | `space-y-2` veya `space-y-3` |
| Buton içi | `px-4 py-2.5` |
| Badge içi | `px-2 py-0.5` |

---

## İkon Boyutları

| Boyut | Class | Kullanım |
|---|---|---|
| XS | `h-3 w-3` | Badge içi, link yanı |
| SM | `h-4 w-4` | Buton ikonları, başlık yanı |
| MD | `h-5 w-5` | Stat ikonları |
| LG | `h-8 w-8` | Ses butonu |
| XL | `h-9 w-9` | Dialog konuşmacı avatarı |

### İkon Container
- Küçük: `h-8 w-8 rounded-full` (ses butonu)
- Orta: `h-9 w-9 rounded-lg` (stat ikonu)
- Büyük: `h-10 w-10 rounded-xl` (ünite numarası, kaynak ikonu)

---

## Border Radius
| Class | Kullanım |
|---|---|
| `rounded-lg` | Butonlar, input, küçük kartlar |
| `rounded-xl` | Ana kartlar, soru kutuları, container'lar |
| `rounded-full` | Badge, avatar, chip |

---

## Buton Kullanımı

| Variant | Ne zaman |
|---|---|
| `default` (Primary) | Ana aksiyon: Başla, Kontrol Et, Sonraki |
| `outline` | İkincil aksiyon: Tekrar Dene, Geri |
| `ghost` | Navigasyon linkleri |
| `destructive` | Durdur, Sil |
| Size `sm` | Adım navigasyonu, küçük kontroller |
| Size `lg` | CTA butonları (Başla, Üniteyi Tamamla) |

---

## Kart Yapıları

### Stat Kartı
```
Card > CardContent (p-4, flex items-center gap-3)
  └ İkon container (h-9 w-9 rounded-lg bg-{renk}/10)
  └ Değer (text-lg font-bold) + Label (text-[11px] muted)
```

### Ünite Listesi Kartı
```
Link (flex items-center gap-4 p-4 rounded-xl border)
  └ Numara/İkon (h-10 w-10 rounded-xl)
  └ Başlık + Açıklama
  └ Skor Badge + Arrow
```

### Alıştırma Kartı
```
Card > CardHeader (emoji + başlık) > CardContent
  └ Soru kutuları (rounded-xl border p-4 space-y-3)
  └ Seçenekler (grid grid-cols-2 gap-2)
  └ Kontrol butonu
  └ Skor sonucu
```

---

## Etkileşim State'leri

### Seçenek Butonları
- **Default**: `border-border hover:border-primary/50 hover:bg-accent`
- **Selected**: `border-primary bg-primary/5 text-primary`
- **Correct**: `border-green-500 bg-green-50 text-green-700`
- **Wrong**: `border-red-500 bg-red-50 text-red-700`

### Ünite Kartları
- **Tamamlandı**: `border-green-200 bg-green-50/30` + yeşil tik
- **Sıradaki**: `border-primary/40 bg-primary/5` + play ikonu
- **Bekleyen**: `border-border` + gri numara

### Genel
- Hover: `transition-all` her yerde
- Focus: `ring-3 ring-ring/50`
- Disabled: `opacity-50 cursor-not-allowed`

---

## Skor Gösterimi
- **Başarılı** (>=%50): `bg-green-50 border border-green-200`, yeşil skor
- **Başarısız** (<%50): `bg-red-50 border border-red-200`, kırmızı skor
- **Mükemmel** (100%): Varsayılan yeşil + kutlama mesajı

---

## Responsive
- Mobile-first: `grid-cols-1` → `md:grid-cols-2`
- Stat kartları: `grid-cols-2 md:grid-cols-4`
- Sidebar: Gizli mobile'da (ileride hamburger menu)
- Max content width: `max-w-4xl`
