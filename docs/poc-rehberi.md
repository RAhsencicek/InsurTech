# PoC Oluşturma Rehberi — İhtiyaçlar ve Adım Adım Yol
> Bu doküman, "Otonom Komisyon Avcısı"nın ilk **gerçek** kanıtını (PoC) üretmek için neye ihtiyacımız olduğunu ve hangi sırayla ilerleyeceğimizi anlatır.
> Tarih: Ekim 2026 · İlgili dosyalar: [Katar Fonlama Yol Haritası](/Users/mac/InsurTech/docs/katar-fonlama-yol-haritasi.md) · [Katar Giriş Rehberi](/Users/mac/InsurTech/docs/katar-giris-rehberi.md) · [Hibe Yol Haritası](/Users/mac/InsurTech/docs/hibe-yol-haritasi.md)

---

## 1. PoC Ne, Bizde Neden Lazım? (Tek Paragraf Hatırlatma)

Elimizdeki uygulama bir "vitrin": tüm ekranları var ama veriler uydurma, hesaplar simülasyon. Katar girişim programının şartı "çalışan kanıt (PoC) veya en küçük gerçek ürün (MVP)". Jüri ya da yatırımcı karşısında **"program gerçek bir bordroyu yükledim, gerçek eksik ödemeyi buldu"** diyebilmemiz gerekiyor. Bu doküman tam bunu planlıyor.

**PoC'nin tek cümlelik tanımı (sunumlarda aynen kullanılacak):**
> "Gerçek bir sigorta şirketi komisyon bordrosunu yükleyen, acentenin beklediği komisyonlarla karşılaştıran ve eksik/yanlış ödemeleri dakikalar içinde raporlayan motor."

---

## 2. Başarı Kriteri — "PoC bitti" derken neyi kastediyoruz?

PoC, şu üç ölçümü sağladığında biter. Bunlar olmadan "bitti" denmez:

| Ölçüm | Hedef | Neden önemli |
|---|---|---|
| **Yakalama oranı** | Elle bulunan hataların en az %90'ını program da bulsun | "Program hata buluyor" kanıtı |
| **Hız** | Tek bordro için elle: yarım gün → program: 5 dakikanın altı | "Zaman kazandırıyor" kanıtı |
| **Format sayısı** | En az 2 farklı sigorta şirketinin bordrosuyla çalışsın | "Tek şirkete mahkûm değiliz" kanıtı |

Bu üç sayı, hem Katar sunumuna hem hibe dosyasına aynen girer. Demo videosunun son sahnesi de bu tabloyu gösterir.

---

## 3. Kapsam — Ne Yapılacak, Ne Yapılmayacak?

**Yapılacaklar (PoC'nin sınırları):**
1. Excel/çevrimiçi PDF formatındaki sigorta bordrosu yükleme ve satırlara ayırma
2. Acentenin beklenen komisyon listesiyle (Excel) karşılaştırma
3. Fark raporu: eksik ödeme, fazla kesinti, kayıp poliçe, şüpheli iptal
4. İtiraz mektubu taslağı üretme
5. Bu motoru mevcut vitrindeki "Komisyon Denetçisi" ekranına bağlama

**Kasıtlı olarak yapılmayacaklar (kapsam dışı — bu yüzden zarar yok):**
- Sigorta şirketleriyle sistem entegrasyonu → fon parasından sonra. Bordrolar zaten PDF/Excel gelir.
- Arapça bordro okuma → PoC'de sadece **1 örnek Arapça dosyayla ön test** yapılır; tam destek MVP sonrası.
- Fotoğraf/taranmış (görüntü halindeki) PDF okuma → kapsam dışı. PoC'de "dijital temiz dosya" şartı koyarız; taranmış dosya yapay zekâ işi olduğundan MVP sonrasına bırakılır.
- Kullanıcı girişi, çok kullanıcı, veritabanı kalıcılığı → MVP fazına. PoC'de veri hafızada kalabilir (oturum bitince gider — bu PoC için kabul edilebilir).
- Mobil uyum, güvenlik sertifikasyonu, KVKK altyapısı → MVP+.

Bu kapsam dışı listesi, bizi "her şeyi yapan süper program" tuzağından korur. PoC'nin işi her şeyi yapmak değil, **tek bir sözü kanıtlamaktır.**

---

## 4. İhtiyaçlar Listesi

### A. Veri ihtiyaçları (EN KRİTİK — her şey buna bağlı)

PoC'nin yakıtı gerçek dosyalardır. Bunlar olmadan motor yazılsa bile kanıt olmaz.

| İhtiyaç | Miktar | Nereden | Not |
|---|---|---|---|
| Sigortacı komisyon bordrosu (Excel veya dijital PDF) | **En az 2 farklı şirketten, her şirketten 2 örnek** | Tanıdık acenteler, yatırımcının acentelik ilişkileri | En az 1'inde bilinen eksik ödeme/kesinti olsun (elle bulup not edeceğiz — bu, "doğru cevap kağıdı" olur) |
| Acentenin kendi beklenen komisyon listesi | 2 örnek | Aynı acentelerden | Excel'de poliçe no, tutar, şirket kolonları olsun; yoksa biz şablon veririz |
| İptal (storno) satırı içeren bordro | 1 örnek | Acenteler | İptal komisyonu geri alma senaryosunu test eder |
| Arapça bordro örneği | 1 örnek (önem: düşük, aciliyet: sonra) | Katar brokeri temasları kurulunca | Şu an sadece "dosya bekliyor" kutusu |
| Anonimleştirme onayı | Yazılı onay | Acentelerden | Müşteri isimleri kodla değiştirilir (örn. "M-102"); gerçek isim programda saklanmaz |

> **Bu listenin tek gerçek bağımlılığı burası:** Gerçek dosya gelmezse PoC yapılamaz. Plan B: formatlar gecikirse, "örnek bordro üreticisi" yazarız — yani gerçek formatı taklit eden deneme dosyası üreten küçük araç. Bu, motorun test edilmesini sağlar ama kanıt değerini düşürür (jüriye "deneme verisiyle çalıştık, gerçek dosyada da test ettik" diyemeyiz). O yüzden dosya toplama, faz 1 ile aynı anda başlar, sırayı beklemeyi ço.

### B. Teknik ihtiyaçlar (elimizde olanlar + eklenecekler)

| İhtiyaç | Durum | Ne yapılacak |
|---|---|---|
| Mevcut web uygulaması (React + Vite + TypeScript) | **Elimizde** | Vitrin aynen korunacak; motor ona bağlanacak |
| Excel okuma kütüphanesi (SheetJS/xlsx) | Kurulacak | Bordroyu ve beklenen listeyi satırlara ayırır |
| PDF okuma (dijital PDF için pdf.js) | Kurulacak | Excel gelmezse PDF bordrolar için |
| Bordro satır modeli (ortak veri şeması) | Yazılacak | Farklı şirketlerin farklı formatları tek ortak şekle dökülür: şirket adı, poliçe no, dönem, brüt prim, komisyon oranı, komisyon tutarı, satır türü (normal/iptal) |
| Eşleştirme kuralları | Yazılacak | Aşağıdaki 5. bölümde anlatılıyor |
| İtiraz mektubu şablonu | Yazılacak | Türkçe; firma başlığına, tarihine, tutar toplamına otomatik doldurulur |

### C. Karar ihtiyaçları (kurucudan — yani senden — beklenenler)

1. **Hangi acentelerden dosya isteyeceğiz?** (En az 2 acente; yatırımcı ilişkileri üzerinden ilk kapı)
2. **Hangi şirketlerin bordrosu öncelikli?** (Öneri: trafik/kasko satışı yoğun 2 büyük şirket)
3. **Acenteyle hangi dille konuşacağız?** (Öneri: "ücretsiz pilot + sonucu rapor olarak paylaşırız" teklifi)
4. **PoC bittiğinde gösterilecek ilk kişi kim?** (Öneri: dosyayı veren acente sahibi — ilk kullanıcımız aynı zamanda ilk kanıt kaynağımız olur)

### D. Kanıt/paket ihtiyaçları (PoC bitince üretilenler)

- [ ] 90 saniyelik demo videosu: "gerçek bordro yükle → buldu → rapor → itiraz mektubu"
- [ ] Ölçüm tablosu (2. bölümdeki üç metrik)
- [ ] "Bilinen hata listesi vs programın buldukları" karşılaştırma ekran görüntüleri
- [ ] Katar versiyonuna giden not: "aynı motor Arapça dosya ile şu kadar sorunsuz okudu" (ön test sonucu)

---

## 5. Motor Nasıl Çalışacak? (Eşleştirme Mantığı, Günlük Dil)

İki liste elendi:

- **Beklenen liste:** "Şu poliçelerden şu tutarlarda komisyon bekliyorum" (acentenin kendi kaydı)
- **Gelen bordro:** "Şu poliçelerden şu tutarları ödedim" (şirketin kaydı)

Program her poliçeyi iki listede arar ve şu 5 durumdan birine koyar:

| Durum | Anlamı | Acentenin hissi |
|---|---|---|
| 1. İki listede de var, tutarlar aynı | Ödeme tamam | ✅ Sorun yok |
| 2. Beklenen var, bordroda yok | **Kayıp ödeme** — şirket ödemeyi unutmuş | "Nerede param?" |
| 3. İkisi de var ama bordro tutarı düşük | **Fazla kesinti** (vergi, storno, kırmızı payı vs.) | "Neden az ödediler?" |
| 4. İkisi de var ama komisyon oranı farklı | **Oran hatası** — anlaşmadaki oran uygulanmamış | "Anlaşmamıza bakın" |
| 5. Bordroda var, beklenen listede yok | **Farkında olunmayan satır** — belki iptal iadesi, belki yanlış poliçe | "Bu neyin parası?" |

Durum 2-3-4 için program itiraz taslağı üretir. **PoC'nin sihri tam burada:** acente birinciyi zaten biliyor; onu yormayan iş, 2-3-4-5'leri bulmaktır — çünkü elle kontrolde bu dördünün %60-70'i gözden kaçıyor (kaynak: [UnlockedCRM mutabakat istatistiği](https://unlockedcrm.ai/blog/ai-commission-reconciliation-insurance)).

Eşleştirme basit iki anahtarla yapılır: **şirket adı + poliçe numarası** (birincil), uyuşmazsa **plaka/müşteri kimlik + dönem** (ikincil). Tutarlarda küçük kuruş farklarına tolerans tanınır; oran karşılaştırması için anlaşma oranı elden girilir.

---

## 6. Adım Adım Yol (Fazlar ve Süreler)

Toplam hedef: **4-6 hafta.** Fonlama planındaki "4 ayda MVP" takviminin ilk yarısını bu işler.

| Faz | İş | Süre | Çıkışı |
|---|---|---|---|
| **Faz 0 — Hazırlık** | Acente teması + dosya toplama (paralel yürür); bordro satır modeli tanımlanır; itiraz şablonu yazılır | 1 hafta | Ortak veri şeması + ilk gerçek dosyalar + "doğru cevap kağıdı" (elle bulunan hata listesi) |
| **Faz 1 — Excel okuma** | SheetJS kurulur; yüklenen bordro satırlara ayrılır; satır modeline dökülür; vitrindeki OCR ekranına "gerçek dosya" modu eklenir | 1 hafta | "Dosyayı yükledim, satırlar doğru görünüyor" |
| **Faz 2 — Mutabakat motoru** | 5 durumlu eşleştirme kuralları; kuruş toleransı; oran kontrolü; iptal satırı özel işleme | 1-1,5 hafta | "Fark listesi çıktı" |
| **Faz 3 — Rapor ve itiraz mektubu** | Fark raporu ekranı (gruplu: kayıp/kesinti/oran); Excel ve yazdırılabilir çıktı; itiraz mektubu üretimi | 0,5 hafta | "İtiraz mektubunu aldım, imzalıp gönderebilirim" |
| **Faz 4 — Vitrine bağlama** | Mevcut Komisyon Denetçisi ekranı simülasyondan gerçek motora geçer; sahte veri sadece "tanıtım modunda" kalır | 0,5 hafta | "Demoda gerçek dosya da oynatılabiliyor" |
| **Faz 5 — Doğrulama ve ölçüm** | Dosyayı veren acenteye canlı test; üç metrik ölçülür (yakalama oranı, hız, format sayısı); demo videosu çekilir | 1 hafta | **PoC tamamlandı raporu** |
| **Faz 6 — PDF + Arapça ön testi** | Dijital PDF desteği; eldeki 1 Arapça örnek (varsa) ile okuma testi | 1-2 hafta (paralel) | Katar dosyasına "Arapça yolda" notu |

**Kritik çalışma düzeni:** Faz 0 dosya toplama, faz 1-2-3'ün geliştirmesiyle aynı anda yürür. Geliştirme dosyayı beklemez; dosya gelince motor o dosyayla canlı test edilir.

---

## 7. Riskler ve Plan B'ler

| Risk | Ne kadar olası | Plan B |
|---|---|---|
| Acenteler dosyayı vermez (gizlilik korkusu) | Orta | Anonimleştirme sözü + kendi yatırımcı ilişkileri + "sadece raporu paylaşırsın" teklifi; en kötü durum: formatı taklit eden örnek dosya üreticisi (kanıt değeri düşer ama gelişim durmaz) |
| Bordro formatları şirketten şirkete çok farklı | Yüksek (kesin gibi) | PoC'de 2 formatla sınırlıyız; ortak satır modeli zaten farklılıkları emmek için var |
| PDF taranmış/görüntü halinde gelir | Orta | "Dijital dosya şartı" baştan söylenir; taranmış dosya MVP sonrası yapay zekâ fazına |
| Eşleştirmede poliçe numaraları format uyuşmazlığı (ön sıfır, tire) | Yüksek | Numaraları normalize eden temizleme adımı (tire/boşluk/sıfır düzeltme) faz 2'nin içinde |
| Elle "doğru cevap kağıdı" hatalı çıkar | Düşük | İkinci göz: aynı bordroyu iki kez elle kontrol |

---

## 8. PoC Bitince Ne Olacak? (Sonraki Duraklar)

1. **MVP fazı (4-8 hafta):** kullanıcı girişi + veritabanı + kayıt kalıcılığı + çok bordro yönetimi + yenileme radarı (acentenin Excel poliçe listesinden) + temel güvenlik. PoC motoru aynen taşınır, etrafı gerçek ürüne çevrilir.
2. **Türkiye pilotu:** dosyayı veren acente(ler) ilk canlı kullanıcı olur; "40 saatlik işi 30 dakikaya indirdik" ölçümü kayda geçer.
3. **Katar dosyasına girişler:** demo videosu + ölçüm tablosu + Arapça ön test sonucu → Startup Qatar dosyasının "çalışan kanıt" kutusu doldurulur.
4. **Hibe dosyalarına girişler:** (Katar öncelikli olduğumuz için not olarak) aynı paket, Türkiye programlarında "Ar-Ge kanıtı" olarak kullanılır.

---

## 9. Başlangıç Çeklisti (Bugünden)

- [ ] Acente listesi (2-3 isim) ve kim arayacak kararı
- [ ] "Bordro paylaşım" yazılı teklif metni (anonimleştirme sözü dahil)
- [ ] İlk dosyaların alınması (2 şirket × 2 örnek)
- [ ] Elle kontrol: "doğru cevap kağıdı" (bilinen hata listesi)
- [ ] Ortak satır modeli (veri şeması) onayı
- [ ] Faz 1 geliştirmesinin başlatılması

---

## 10. Bu Dokümanın Yenilenme Kuralı

Fazlar ilerledikçe bu dosya güncellenir: tamamlanan faz işaretlenir, ölçüm tablosuna gerçek sayılar yazılır. Böylece hem ekip hem yatırımcı sunumu için "neredeyiz" sorusunun cevabı hep tek dosyada olur.
