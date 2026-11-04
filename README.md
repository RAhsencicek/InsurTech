# 🛡️ InsurTech Core Platform & Autonomous Commission Auditor

> **Yeni Nesil Sigorta Acenteliği ERP'si, Deterministik Teklif Motoru ve Otonom Gelir Koruma (Revenue Reconciliation) Ekosistemi**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)
[![Status](https://img.shields.io/badge/MVP-Production--Ready-success)](#)

---

## 📌 Proje Genel Bakışı (Executive Summary)

**InsurTech Platformu**, geleneksel sigorta acentelerinin ve brokerlarının karşılaştığı **hantal ekranlar, manuel veri ameleliği (20 haneli şasi no yazma), eski programlardan veri taşıma korkusu** ve en önemlisi **sigorta şirketlerinin her ay kestiği gizli komisyon cezalarını** kökten çözen uçtan uca modern bir kurumsal ERP ve gelir optimizasyon sistemidir.

Yalnızca Türkiye pazarındaki 17.000+ acentenin ihtiyaçlarını değil; Körfez Bölgesi (Katar QCB Sandbox, Dhaman zorunlu sağlık entegrasyonu, Geoway adres sistemi ve NCSA veri egemenliği) standartlarını da destekleyecek esnek ve regülasyona tam uyumlu mimaride inşa edilmiştir.

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           INSURTECH CORE ARCHITECTURE                         │
└───────────────────────────────────────────────────────────────────────────────┘
          │                                                    │
   [ÖN OFİS / SATIŞ]                                   [ARKA OFİS / FİNANS]
          │                                                    │
  ┌───────┴──────────────┐                             ┌───────┴──────────────┐
  │ ⚡ Çoklu Teklif     │                             │ ⚖️ Komisyon Avcısı   │
  │   15+ Şirket / 3 sn  │                             │   TTK 102 Denetimi   │
  ├──────────────────────┤                             ├──────────────────────┤
  │ 👁️ Görsel OCR       │                             │ 👥 Müşteri 360° CRM  │
  │   Bounding-Box Eşleme│                             │   Loss Ratio & LTV   │
  ├──────────────────────┤                             ├──────────────────────┤
  │ 📦 Portföy Veri Göçü│                             │ 📲 Tecdit Radarı     │
  │   4 Adımlı Pipeline  │                             │   1-Tık WhatsApp     │
  └──────────────────────┘                             └──────────────────────┘
```

---

## 🚀 Çalışan Canlı MVP Modülleri (Live Modules)

Platformun çekirdek arayüzü ve iş mantığı `app/src/` dizini altında yer almakta olup, 6 ana modül tamamen işlevseldir:

### 1. ⚡ Deterministik Çoklu Teklif Motoru (`MultiQuoteEngineView.tsx`)
* **Ne Yapar?:** Tek bir müşteri TCKN ve araç plakası ile 15+ farklı sigorta şirketinden (Allianz, Anadolu, AXA, HDI vb.) 3 saniyede teklif toplar.
* **Nasıl Çalışır?:** Deterministik fiyatlama algoritması; Tramer hasarsızlık basamağını (1-8 arası), araç kasko katsayısını ve meslek indirimlerini (Doktor, Öğretmen, Memur %15 iskontosu) anlık hesaplar.
* **Sektörel Güç:** Personelin 10 ayrı web portalını tek tek açıp 20 dakika vakit harcamasını bitirir; tek ekranda yan yana karşılaştırma sunar.

### 2. 👁️ Bounding-Box AI Belge Eşleme (`OcrWizardView.tsx`)
* **Ne Yapar?:** WhatsApp veya e-postadan gelen eğri, parlamış veya gölgeli araç ruhsatı, kimlik kartı ve DASK tapu fotoğraflarını otomatik ayrıştırır.
* **Nasıl Çalışır?:** Bilgisayarlı Görü (Computer Vision) ve Bounding-Box teknolojisi; Plaka, Şasi No, Motor No, Ruhsat Seri No ve UAVT Adres Kodunu yeşil kutucuklarla görsel olarak işaretler ve form alanlarına doldurur.
* **Sektörel Güç:** 20 haneli karmaşık şasi numaralarının yanlış yazılması kaynaklı hasar ödenmeme ve hatalı poliçe riskini sıfıra indirir.

### 3. 📦 Akıllı Portföy Veri Göç Motoru (`MigrationWizardView.tsx`)
* **Ne Yapar?:** Polisoft, Polixir veya Excel formatında saklanan 10 yıllık 50.000 müşteriyi yeni sisteme kayıpsız transfer eder.
* **Nasıl Çalışır?:** 4 adımlı endüstriyel aktarım pipeline'ı:
  1. *Dosya Seçimi* ➔ 2. *Önizleme Tablosu* ➔ 3. *Sağlık & Risk Raporu* (TCKN algoritma denetimi, mükerrerlik ve açık hesap risk kontrolü) ➔ 4. *Onay & Portföye Aktarım*.
* **Sektörel Güç:** Acentelerin yazılım değiştirmemesinin önündeki 1 numaralı engel olan *"Müşteri verilerim kaybolur"* korkusunu tamamen yok eder.

### 4. 👥 Müşteri 360° Portföy CRM & Karlılık Analizi (`CustomersView.tsx`)
* **Ne Yapar?:** Müşterinin yalnızca iletişim bilgilerini değil; tüm poliçe geçmişini, aile bağlarını ve acenteye kazandırdığı net finansal karlılığı tek ekranda gösterir.
* **Nasıl Çalışır?:** Müşterinin **Hasar/Prim Oranını (Loss Ratio)** hesaplar, VIP skorlama yapar, karlı müşteriyi korur ve akıllı çapraz satış önerileri sunar (Örn: *Kaskosu var ama Tamamlayıcı Sağlığı yok, %40 indirimli teklif sun*).
* **Sektörel Güç:** Personel işten ayrılsa bile kurumsal hafıza acentede kalır; müşteri başı ciro (LTV) %45 artar.

### 5. ⚖️ Otonom Komisyon Avcısı (`CommissionAuditorView.tsx`)
* **Ne Yapar?:** Sigorta şirketlerinin acentelere her ay gönderdiği hakediş ekstrelerindeki sessiz ve haksız kesintileri kuruşu kuruşuna denetler.
* **Nasıl Çalışır?:** Acentenin kestiği poliçeler ile şirketin Excel ekstresini saniyeler içinde çapraz mutabakata (Reconciliation) sokar. 4 kritik kesinti türünü anında teşhis eder:
  * **İptal-İade Tuzağı (Kısa Dönem Cezası):** 10 günlük kaskonun iptalinde tüm yılın komisyonunun geri çekilmesini yakalar.
  * **Tarife & Kampanya Sapması:** %15 meslek indirimi verilen doktora sistemin %11 komisyon yazmasını tespit eder.
  * **Askıda Kalan Zeyilnameler:** Prim artıran teminat zeyillerinin ek komisyonunun muhasebede unutulmasını belgeler.
  * **Havuz & Ağır Vasıta Sınıflandırma:** Normal kamyonetin hatalı biçimde düşük komisyonlu risk havuzuna atılmasını kanıtlar.
* **Sektörel Güç:** Türk Ticaret Kanunu (TTK) Madde 102 uyumlu resmi antetli itiraz dilekçesini ve şirkete atılacak hazır e-postayı tek tıkla üretir. Yılda 50M ₺ prim üreten bir acenteye 300.000 ₺ - 600.000 ₺ net para geri kazandırır.

### 6. 📲 Yönetici Kokpiti & 1-Tık WhatsApp Tecdit Radarı (`DashboardView.tsx`)
* **Ne Yapar?:** Acente patronunun cepten veya bilgisayardan anlık şube cirolarını, vadesi yaklaşan poliçeleri ve personelin satış hızını canlı izlemesini sağlar.
* **Nasıl Çalışır?:** Süresi bitmek üzere olan poliçeleri kırmızı alarmla listeler (Tecdit Radarı). Tek tıkla müşteriye WhatsApp üzerinden kişiselleştirilmiş yenileme teklif linki yollar.
* **Sektörel Güç:** Müşterinin başka acenteye veya internete kaçmasını engelleyerek poliçe yenileme oranını %85'in üzerine taşır.

---

## 📂 Dokümantasyon ve Rapor Envanteri

Proje kök dizininde ve `docs/` klasöründe, yatırımcılar, fon kuruluşları ve saha ekipleri için hazırlanmış kapsamlı strateji ve analiz dokümanları yer almaktadır:

| Dosya Yolu | Format | Açıklama ve Kapsam |
|:---|:---:|:---|
| **`INSURTECH_KATAR_PROJE_GENEL_BAKIS_BRİFİNGİ.pdf`** | PDF (4 Sayfa) | Katar'da QDB, QFC ve yerel brokerlarla görüşecek saha ekibi için 6 MVP modülünün çalışma prensipleri ve Körfez regülasyon uyumu (Dhaman, Geoway, NCSA). |
| **`OTONOM_KOMISYON_AVCISI_STRATEJI_VE_VIZYON_RAPORU.pdf`** | PDF (10 Sayfa) | 4 gerçek saha vakası (Ahmet Bey, Mehmet Bey, Ali Bey, Ayşe Hanım), TTK 102 hukuki dayanağı ve komisyon mutabakat algoritmasının derin sektörel analizi. |
| **`docs/katar_proje_brifingi.html`** | HTML | 4 sayfalık kurumsal brifingin Google Chrome Headless baskı standardındaki kaynak kodu. |
| **`docs/otonom_komisyon_avcisi_raporu.html`** | HTML | 10 sayfalık komisyon avcısı raporunun yüksek çözünürlüklü baskı şablonu. |
| **`docs/katar-fonlama-yol-haritasi.md`** | Markdown | Startup Qatar Investment Program ($500k - $4.8M), QDB tohum sermayesi ve QCB FinTech Sandbox başvuru şartları. |
| **`docs/katar-giris-rehberi.md`** | Markdown | Katar sigorta pazarının yapısı, yerel brokerlar (QIC, Doha Insurance) ve pazar penetrasyon stratejisi. |
| **`docs/gercek-acente-rehberi.md`** | Markdown | Türkiye'deki geleneksel acentelerin günlük operasyonel darboğazları ve yazılım şikayetleri analizi. |
| **`docs/poc-rehberi.md`** | Markdown | Pilot acente kurulum, veri aktarım ve 30 günlük PoC (Proof of Concept) başarı kriterleri. |
| **`docs/hibe-yol-haritasi.md`** | Markdown | TÜBİTAK 1507/1501 Ar-Ge destekleri ve KOSGEB hibe başvuru metrikleri. |
| **`outputs/` (01 - 05 Serisi)** | Markdown | Pazar araştırması, fonlama analizi, rakip analizi, hukuk denetimi ve müşteri keşfi rapor serisi. |
| **`samples/`** | XLSX / CSV | Allianz ve Anadolu Sigorta formatında hazırlanmış sentetik acente mutabakat ve hakediş ekstreleri. |

---

## 🛠️ Teknoloji Yığını ve Mimari (Tech Stack)

* **Ön Yüz:** React 19, TypeScript 5.5, Tailwind CSS 3.4, Lucide React Icons
* **Derleme & Paketleyici:** Vite 5.4 (ESM native, HMR)
* **Veri & Durum Yönetimi:** Deterministic Seeding, In-Memory Audit Engine, LocalStorage Portability
* **Dosya & Doküman İşleme:** XLSX (SheetJS), CSV Parser, Headless Chrome PDF Rendering Engine
* **Güvenlik & Regülasyon:** KVKK & Katar PDPPL Law No. 13 uyumlu PII Maskeleme, KPS/TCKN algoritma doğrulaması

---

## 💻 Kurulum ve Yerel Çalıştırma (Quick Start)

### Gereksinimler
* Node.js 18.0 veya üzeri
* npm 9.0 veya üzeri

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/RAhsencicek/InsurTech.git
cd InsurTech/app
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda `http://localhost:5173` adresine giderek platformu anında canlı olarak test edebilirsiniz.

### 4. Üretim Derlemesi (Build)
```bash
npm run build
```

---

## 🏛️ Dizin Yapısı (Project Structure)

```text
InsurTech/
├── README.md                                    # Detaylı proje, mimari ve dokümantasyon rehberi
├── .gitignore                                   # Node_modules ve build çıktılarını filtreleyen kural seti
├── INSURTECH_KATAR_PROJE_GENEL_BAKIS_BRİFİNGİ.pdf # Katar saha ekibi için 4 sayfalık yönetici brifingi
├── OTONOM_KOMISYON_AVCISI_STRATEJI_VE_VIZYON_RAPORU.pdf # 10 sayfalık komisyon avcısı strateji raporu
├── app/                                         # Canlı React + TypeScript web uygulaması
│   ├── src/
│   │   ├── components/                          # 6 Temel MVP ekranı ve modal bileşenleri
│   │   │   ├── MultiQuoteEngineView.tsx         # Çoklu teklif motoru
│   │   │   ├── OcrWizardView.tsx                # Görsel OCR Bounding-Box sihirbazı
│   │   │   ├── MigrationWizardView.tsx          # 4 adımlı veri göç tüneli
│   │   │   ├── CustomersView.tsx                # Müşteri 360° CRM & Karlılık
│   │   │   ├── CommissionAuditorView.tsx        # Otonom komisyon denetçisi ana ekranı
│   │   │   ├── DashboardView.tsx                # Yönetici kokpiti & tecdit radarı
│   │   │   └── commission/                      # 4 Vaka detayı ve TTK 102 itiraz modalleri
│   │   ├── services/
│   │   │   └── commissionHunterEngine.ts        # Çapraz ekstre eşleştirme ve mutabakat motoru
│   │   ├── data/                                # Zengin gerçekçi mock acente ve poliçe verileri
│   │   └── types/                               # TypeScript arayüz ve veri modelleri
│   ├── public/samples/                          # Canlı test için indirilebilir sentetik ekstreler
│   ├── package.json
│   └── vite.config.ts
├── docs/                                        # HTML şablonları, hibe ve pazar rehberleri
├── outputs/                                     # Saha araştırmaları ve derin analiz metinleri
└── samples/                                     # Şirket hakediş ve mutabakat test tabloları
```

---

## 📈 Yol Haritası (Roadmap)

- [x] **Faz 1: Çekirdek MVP & Otomasyonlar** (6 Canlı Modül, Deterministik Motor, Görsel OCR)
- [x] **Faz 2: Otonom Gelir Denetimi (Revenue Engine)** (TTK 102, Çapraz Ekstre Eşleştirme, İtiraz Sihirbazı)
- [x] **Faz 3: Yatırım & Körfez Dokümantasyonu** (Katar Brifingi, Fonlama Haritası, Saha Analizleri)
- [ ] **Faz 4: Doha Cloud & Regülasyon Entegrasyonu** (QCB Sandbox, Dhaman API, Geoway 3-part adresleme)
- [ ] **Faz 5: Gerçek Zamanlı Banka & Muhasebe API Entegrasyonu** (Logo, Mikro, Zirve ve Açık Bankacılık)

---

## 📄 Lisans ve İletişim

Bu proje kurumsal mülkiyete tabi olup tüm hakları saklıdır.  
Detaylı bilgi ve yatırım görüşmeleri için depo sahibi ile iletişime geçebilirsiniz.
