# STRATEJİK İNOVASYON & ÜRÜN DOKÜMANI
## OTONOM KOMİSYON AVCISI (REVENUE RECONCILIATION ENGINE)
### Sigorta Sektöründeki Görünmeyen Gelir Kaçaklarının Tespiti, Global Başarı Örnekleri, Hukuki Dayanak (TTK 102) ve Sistem Entegrasyon Stratejisi

---

### 🚀 Temel Satış Tezi (Value Proposition)
> **"Bu sistem klasik bir yazılım gideri (Cost Center) değildir; sigorta şirketlerinin acentelerden kestiği haksız veya hatalı komisyonları kuruşu kuruşuna geri kazandıran, kendi lisans maliyetini ilk 30 günde çıkaran ve acentenin doğrudan kâr hanesine yazılan Otonom Komisyon Avcısı'dır."**

---

### 1. Otonom Komisyon Avcısı Nedir? (Basit Tanım & Canlı Senaryo)

#### 💡 En Basit Anlatımıyla: Bu Sistem Nedir?
Otonom Komisyon Avcısı; acentenizin kasasını 7/24 bekleyen **dijital bir mali dedektiftir**.

Günlük hayattan düşünelim: Markete gidip alışveriş yaptığınızda fişe bakarsınız; rafta 50 TL yazan bir ürün kasadan 70 TL geçmişse hemen itiraz edip paranızı geri alırsınız.

İşte bu sistem de tam olarak bunu yapar: Sigorta şirketlerinin her ay acentenize ödediği komisyonları tek tek denetler. Şirketlerin gözden kaçırdığı, eksik hesapladığı veya "sistem kesti" diyerek sessizce buharlaştırdığı paraları kuruşu kuruşuna bulur ve acentenin kasasına geri kazandırır.

---

#### 📖 Canlı Senaryo: Kadıköy Acentesi Ahmet Bey'in Masada Kalan 42.000 ₺'si

1. **Satış & Beklenti:**
   Ahmet Bey bu ay 1.000 adet poliçe (kasko, konut, trafik) kesti. Sözleşmesindeki komisyon oranlarına göre sigorta şirketinden **150.000 ₺** komisyon bekliyor.
2. **Şirketten Gelen Para:**
   Ay sonu sigorta şirketi banka hesabına **108.000 ₺** yatırıyor ve arkasından 2.000 satırlık karmaşık bir Excel ekstresi yolluyor: *"Net hakedişiniz budur."*
3. **Geleneksel Çaresizlik:**
   Ahmet Bey'in 2.000 satırlık o devasa Excel'i tek tek gözle kontrol etmesi günler sürer. *"Koca şirket, yanlış yapmaz herhalde"* deyip **42.000 ₺ farkı** sineye çekiyor.
4. **Komisyon Avcısı Devrede (3 Saniye!):**
   Ahmet Bey o Excel'i sisteme yüklüyor. Sistem 3 saniyede 42.000 ₺'nin nereye gittiğini satır satır buluyor ve tek tıkla TTK 102 resmi itiraz dilekçesini basıyor!

#### 🔍 Sistemin 3 Saniyede Yakaladığı Gizli Kaçaklar:
* **Tarife Hatası (-18.000 ₺):** Doktorlara satılan kaskolarda sözleşme komisyonu %15 iken şirket sisteme sehven %10 girmiş.
* **Haksız İptal Kesintisi (-14.000 ₺):** Müşteri 5. günde poliçeyi iptal etmiş; şirket Ahmet Bey'den 5 günlük yerine 1 yıllık komisyon düşmüş!
* **Keyfi Havuz Kesintisi (-10.000 ₺):** Sözleşmede yer almayan Tramer altyapı bedeli acentenin hakedişinden kesilmiş.

➔ **Sonuç:** Ahmet Bey tek bir e-postayla kesilen **42.000 ₺ net parasını** sigorta şirketinden geri tahsil etti!

---

#### ❓ Bu Gerçekten Acenteler İçin Hayati Bir İhtiyaç mı?
**Kesinlikle EVET.** Bu sektörün en büyük "sessiz kanaması"dır.

Yılda 50-100 Milyon ₺ prim üreten orta-büyük bir acente, şirket ekstrelerindeki hatalar, eksik tarife basımları ve gün hesabı yanlış yapılan iptaller yüzünden yılda **250.000 ₺ ila 600.000 ₺** arasında net komisyonunu masada unutmaktadır. Bu para acentenin direkt cebine girecek net kârdır.

| Metrik | Değer | Açıklama |
| :--- | :---: | :--- |
| **Ortalama Kaçak Oranı** | **%3.8** | Şirket ekstrelerindeki hatalar & haksız kesintiler |
| **Yıllık Kayıp Komisyon (Ort.)** | **420.000 ₺** | Orta-büyük ölçekli acente ortalaması |
| **Yazılım ROI Geri Dönüşü** | **< 30 Gün** | Yazılım kendi lisans bedelini ilk aydan amorti eder |

---

### 2. Rakiplerin Durumu & Saha Gerçekleri (Polisoft, Polixir, PİVO)

#### ❓ Başka firmalarda (Polisoft, Polixir, PİVO vb.) bu özellik var mı?
**HAYIR, piyasada bu seviyede bir denetim motoru YOKTUR:**
* **Polisoft / Polixir:** Sadece kaba "Cari Hesap" tutarlar (örn: *"Allianz'dan alacağın: 200.000 ₺, ödenen: 184.250 ₺, bakiye: 15.750 ₺"*). Ancak Allianz'ın ekstresindeki 2.000 satırı tek tek poliçelerle eşleştirip *"Şu poliçede oran %15 yerine %11 uygulanmış, 450 TL eksik yatmış"* analizini yapamazlar. 20 yıllık eski monolitik mimarileri buna uygun değildir.
* **PİVO / Doğanium:** Bunlar sadece ekrandan teklif çeken "fiyat botlarıdır"; arkalarında muhasebe veya mutabakat mekanizması hiç yoktur.
* **Sigorta Şirketleri:** Hiçbir sigorta şirketi kendi aleyhine çalışacak ve acenteye *"Biz sana bu ay 15.000 ₺ eksik ödemişiz"* diyecek bir denetim aracını sisteme koymaz.

#### ❓ Şu an bir acente çalışanı bunu elle manuel kontrol ediyor olabilir mi?
Sahada iki acı tablo var:
1. **Acentelerin %80'i KONTROL ETMİYOR:** Çünkü ayda 2.000 poliçeyi 10 şirketin farklı formatlardaki ekstreleriyle gözle eşleştirmek insan gücünü aşar. Patron sadece bankaya yatan paraya bakar, paranın eksildiğini anlamaz bile.
2. **Titiz %20'lik Kesim:** Yanındaki kıdemli muhasebecisine günlerce Excel'de DÜŞEYARA (VLOOKUP) yaptırır. Personel 3-4 gün gözleri kan çanağı gibi çalışır, 5-10 tane bariz hatayı yakalar ama karmaşık zeyil ve havuz kesintilerinin %70'i yine gözden kaçar.

---

### 3. Global Kıyaslama: Dünyada Bu Modeli Uygulayan Başarı Örnekleri

| Şirket | Ülke / Bölge | İş Modeli & Başarısı | Müşteri Memnuniyeti |
| :--- | :--- | :--- | :---: |
| **AgentSync** | ABD (Unicorn) | Sigorta brokerlarının komisyon mutabakatlarını ve yasal uyumlarını otomatikleştirerek **1.2 Milyar $** değerlemeye ulaştı. | **%98** Kurumsal Memnuniyet |
| **Commissionly** | İngiltere & AB | *"Excel ameleliğine son verin, gelir kaçağınızı geri kazanın"* mottosuyla binlerce sigorta ve finans aracısına hizmet veriyor. | **%95+** Retansiyon Oranı |
| **Vymo / Performio** | Global Enterprise | Büyük sigorta acentelerinde bağımsız komisyon denetim motorları kurarak satış personeli ve şirket mutabakatlarını çözüyor. | Fortune 500 Tercihi |

---

### 4. Sektörel Şikayetler & Hukuki Kalkan (TTK 102)

#### ⚖ Hukuki Kalkan: Türk Ticaret Kanunu (TTK) Madde 102
> *"Acente, aracılık ettiği veya sözleşmenin kurulmasına aracı olduğu işlemler dolayısıyla hak kazandığı ücrete (komisyona), sözleşmenin kurulması anında hak kazanır. Müvekkil (sigorta şirketi), hakediş dönemini izleyen en geç üç ay içinde acenteye komisyon bordrosunu vermekle yükümlüdür. Yapılan haksız kesintilere karşı acentenin itiraz ve tahsil hakkı saklıdır."*

#### Sektörel Tepkiler:
* **TÜSAF & SAİK:** Kürsüye çıkan her acente başkanının ortak isyanı: *"Şirketler havuz kesintilerini keyfi yapıyor, hakediş oranlarımızla oynuyor, komisyonlarımız sürekli eriyor."*
* **Acente Forumları & WhatsApp Grupları:** *"Aylık bakım parası ödüyoruz ama hala ekstreleri elimizde Excel'le satır satır ayıklamak zorunda kalıyoruz."*

---

### 5. Teknik Mimari & Sistem Entegrasyonu (3 Adım)

1. **İçe Aktarma Katmanı (Statement Ingestion):**
   Sigorta şirketinden gelen Excel/CSV ekstresi sürükle-bırak ile sisteme yüklenir. Sistem; Allianz, Anadolu, AXA gibi şirketlerin farklı sütun yapılarını otomatik tanır.
2. **Akıllı Çapraz Eşleme Motoru (Cross-Match Engine):**
   Sistemdeki poliçe veritabanı ile ekstre Poliçe No + Zeyil No üzerinden eşleştirilir. Oran kontrolü, gün esaslı iptal kontrolü ve havuz kesintisi denetimi 3 saniyede tamamlanır.
3. **Hukuki İtiraz & İade Bordrosu (Autonomous Recovery):**
   Bulunan kaçaklar tek tıkla resmi TTK 102 itiraz dilekçesine ve sigorta şirketinin bölge temsilcisine atılacak hazır e-postaya dönüştürülür.

---
*InsurTech Core ERP Platform • Gizli & Kurumsal • Tüm Hakları Saklıdır © 2026*
