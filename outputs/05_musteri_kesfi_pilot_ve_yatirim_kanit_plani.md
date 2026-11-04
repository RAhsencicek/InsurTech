# Müşteri Keşfi, Pilot ve Yatırım Kanıt Planı

Bu planın amacı ürün özelliklerini doğrulamak değil; acentelerin ve brokerlerin gerçekten nerede zaman/gelir kaybettiğini, mevcut araçların hangi adımda yetersiz kaldığını ve bunun için ödeme yapıp yapmayacağını ölçmektir. Türkiye ana öğrenme pazarı; Katar birinci Körfez pazar doğrulamasıdır. Diğer ülkeler sonraki aşamada ayrı ülke hipotezleri olarak ele alınmalı.

## 1. Araştırma önceliği

### Aşama A — Türkiye’de gerçek iş akışını gör

İlk örneklemde küçük, orta ve çok şubeli acenteleri; mümkünse farklı branş ve farklı yazılım setlerini kapsayın. 8–12 acente sahibi/operasyon çalışanıyla 45 dakikalık görüşme yapın. Görüşme sayısı pazar temsili değildir; yalnız ilk problem keşfi içindir. Sonraki aşamada örneklem genişletilebilir.

Görüşmenin başında “komisyonunuz çalınıyor mu?” gibi yönlendirici soru sormayın. Şunları isteyin:

1. Son tamamlanan teklif veya poliçeyi adım adım anlatın ve mümkünse ekran paylaşımıyla gösterin.
2. Son yenileme çevrimini gösterin: müşteri ne zaman uyarıldı, teklif ne zaman gönderildi, son karar nerede kaydedildi?
3. Son ay sonu sigorta şirketi ekstresinin mutabakatını gösterin. Dosya anonimleştirilebilir; hangi format geldi, kim ne kadar sürdü, hangi fark bulundu?
4. Bir iptal, zeyil veya tahsilat istisnasının nasıl kapatıldığını gösterin.
5. Son 90 günde yazılım/portal kesintisi, veri aktarımı, destek bekleme veya yanlış kayıt yaşandı mı? Gerçek tarih ve kayıt üzerinden konuşun.
6. Hangi lisanslı sistem/portallar kullanılıyor? Hangi modüllere gerçekten giriliyor, hangileri Excel/e-posta ile yapılıyor?
7. Yazılım satın alımını kim kararlaştırıyor? Aylık/yıllık ücret, kurulum, destek ve veri taşıma nasıl değerlendiriliyor?
8. Bu süreci iyileştirmek için bugüne kadar ne denendi? Hangi adım başarısız oldu?

**Görüşme kaydı:** izin alın; müşteri/şirket/kişi isimlerini rapordan çıkarın. Veri örneği alınırsa kişisel veriyi maskeleyin, veri minimizasyonu ve erişim süresini yazılı belirleyin.

### Aşama B — Katar’da broker gözlemi

QIC’nin dijital kanalı sigortacı/son kullanıcı tarafında kanıtlıdır; bağımsız broker yönetim yazılımı ve kullanıcı acısı henüz kanıtlanmış değildir. Bu nedenle Katar’daki görüşme hedefi Türkiye’deki deneyimi doğrulatmak değil, yerel iş akışını ayrı öğrenmektir.

Önerilen ilk keşif ağı: 5–10 lisanslı broker/insurance intermediary; en az iki operasyon/finans karar vericisi; iki sigortacı veya broker portal/entegrasyon muhatabı; mümkünse QFC/QFCRA/QCB lisanslama veya ürün sınıflandırması konusunda yetkili bir uzman. Bu örneklem de temsilî pazar tahmini değildir.

Katar’a özel sorular:

- Günlük işte hangi broker management, CRM, accounting, claims, renewal ve carrier portal sistemleri kullanılıyor?
- Müşteri teklifinden poliçe issue’a kadar aynı bilginin kaç kez tekrar girilmesi gerekiyor?
- Arapça/İngilizce belge, çalışan listesi, claim ve yenileme iletişimi nasıl yönetiliyor?
- Teklifler ve poliçe kayıtları hangi portal, API, CSV, e-posta veya PDF ile geliyor?
- Taşıyıcı ekstresi ve komisyon/prim mutabakatı nasıl yapılıyor? Hacim, süre ve fark türleri nelerdir?
- Üçüncü taraf yazılıma hangi müşteri/poliçe verisinin aktarımı izinli? Taşıyıcıdan yazılı API/portal erişimi almak nasıl mümkün?
- Broker hangi yazılıma bütçe ayırıyor? Hangi fiyatı onaylayabilecek karar verici var?
- Brokerin dijital ürünü teklif toplama, müşteri tavsiyesi, poliçe bağlama, prim tahsilatı veya yalnız arka ofis işlevlerinden hangilerini yapıyor?

Görüşme öncesinde ürünün QCB, QFC/QFCRA veya saf teknoloji sağlayıcısı sınıfında olup olmadığını yerel hukuk/uyum uzmanıyla yazılı netleştirin. Brokerlik, sigorta riski üstlenme, agregasyon ve yalnız SaaS aynı faaliyet değildir.

## 2. Pilot A: komisyon mutabakatı

**Başlangıç koşulu:** Acentenin izni olan, anonimleştirilmiş gerçek carrier statement; sözleşme/komisyon oranı tablosu; karşılık gelen poliçe/zeyil/iptal verisi. İlk prototipte API şart koşmayın. XLSX/CSV/PDF yüklemeyle gerçek eşleme hipotezini test edin.

**İzlenecek metrikler:**

- Toplam satır, otomatik eşleşen satır, belirsiz/istisna satırı.
- Doğru eşleşme precision’ı ve yanlış pozitif sayısı.
- Eksik eşleşme/kaçırılan fark oranı.
- Carrier formatını ilk kurma süresi ve ikinci dosyayı işlem süresi.
- İnsan incelemesine düşen istisna yüzdesi ve kapatma süresi.
- Aylık mutabakat için harcanan başlangıç saati ve pilot sonrası saat.
- Sözleşme/ekstre/poliçe ile doğrulanan tutarsal fark; bunun ne kadarının karşı tarafça kabul edildiği ve fiilen tahsil edildiği.
- Kullanıcının yanlış alarm, açıklama ve güven seviyesine ilişkin değerlendirmesi.

**Yatırım dosyasına uygun ifade örneği:** “X pilot müşteride, Y carrier statement satırının Z’si otomatik eşleşti; yanlış pozitif oranı A olarak ölçüldü; manuel süre B saatten C saate indi. Bulunan farkların D tutarı henüz teyit, E tutarı karşı tarafça kabul, F tutarı tahsil edildi.” Yalnız gerçek ve izinli kayıtlarla yazın.

## 3. Pilot B: yenileme hunisi

Sadece SMS/WhatsApp hatırlatmasıyla başlamayın; yenilemenin aşamalarını görünür kılın: vade yaklaşımı, müşteriyle temas, teklif gönderimi, karar, yenilendi/kaybedildi ve gerekçe. Başarıyı aynı branş/benzer acente dönemindeki başlangıç değeriyle kıyaslayın.

Metrikler: doğru vade kapsamı, müşteriye erişim, teklif hazırlanma süresi, teklif→yenileme dönüşümü, yenilenmeyen iş ve kayıtlı kayıp nedeni, hatırlatma/iletişim izni, çalışan başına işlem, yanlış/tekrarlı mesaj oranı.

## 4. Kapsam ve fiyat testleri

En az iki fiyat yapısını test edin:

- **Acente başına sabit abonelik:** bütçe ve kullanım kolaylığı; düşük hacimli/küçük acentelerin ödeme isteğini ölçün.
- **Hacim veya işlem temelli:** ekstre satırı, poliçe, kullanıcı veya modül bazlı; fiyatın üretilen değere bağlanmasını test edin.

Bunlar önerilen fiyatlama deneyleridir, pazardaki mevcut ödeme isteği değildir. Ücretsiz demo, “ilgileniyorum” cevabı veya indirme sayısı ödeme kanıtı sayılmaz. Fiyatlı pilot, LOI veya imzalı sözleşme daha güçlü sinyaldir.

Teklifte kurulum, ilk veri mapping, kullanıcı eğitimi, destek, entegrasyon, veri dışa aktarımı, vergi, lisans süresi ve olası ek ücretleri açıkça ayırın. Yerel sağlayıcıların bazıları açık TL fiyat veriyor, çoğu teklif usulü; Katar ve diğer GCC pazarları için fiyat seviyesi bu araştırmada doğrulanmadı.

## 5. Startup Qatar başvuru dosyasında göstermemiz gerekenler

1. **Problem doğrulama:** her ülke için ayrı müşteri görüşmesi ve örnek süreç. Katar’a ilişkin doğrulanmamış varsayımları açık yazın.
2. **Çözüm ve farklılaşma:** mevcut AMS, teklif motoru, mutabakat ve producer payout ürünlerine karşı tam hangi adımda daha iyi olduğunuzu gösterin. “Rakipsiz” demeyin.
3. **MVP/PoC:** çalışır ürün akışı, veri güvenliği ve izinli örneklerle ölçülmüş sonuç.
4. **Müşteri kanıtı:** fiyatlı pilot, LOI, tasarım ortağı veya satın alma niyetinin kapsamı. Sadece kurumsal tanışma/etkinlik değil.
5. **Katar’a giriş planı:** lisanslı broker ve taşıyıcı erişimi, yerel rol ayrımı, Arapça/İngilizce, şirket/ekip yerleşimi, regülasyon sınıflandırması ve ilk 12–18 ay planı.
6. **Teknik yol haritası:** önce dosya tabanlı çalışabilirlik; sonra sözleşmeli API/portal bağlantısı; sonra ülkeye özgü analitik. Yetkisiz ekran kazıma varsaymayın.
7. **Gelir ve birim ekonomi:** ücretli pilot, müşteri başı gelir, onboarding maliyeti, brüt marj, destek yükü, yenileme ve satış süresi. Genel SaaS çarpanını değerleme garantisi gibi sunmayın.
8. **Ekip:** sigorta operasyonu, yazılım ve entegrasyon, satış/uyum, Katar’da yerel ilişki ve tam zamanlı çalışma kapasitesini belgeleyin.
9. **Fon kullanım planı:** her tranche için teslim edilebilir milestone: örneğin carrier mapping, güvenlik denetimi, ücretli pilot, belirli otomasyon doğruluğu, belirli gelir ve yerel işe alım.
10. **Program şartları:** START/GROW üst limitleri, yatırım aracı, yerel tescil ve teşviklerin geçerli kapsamını QDB’den yazılı teyit edin; limitleri hak edilmiş fon gibi göstermeyin.

## 6. Karar kapıları

**Kapı 1 — Acı var mı?** En az 5 farklı acente aynı son işi gerçek dosyalarla gösteriyor mu?  
**Kapı 2 — Veri erişimi var mı?** Pilot için poliçe/ekstre/veri işleme izni alınabiliyor mu?  
**Kapı 3 — Ürün doğru mu?** Doğruluk ve manuel süre ölçümleri kullanıcı için anlamlı mı?  
**Kapı 4 — Ödeme var mı?** Müşteri fiyatlı pilot veya abonelik imzalıyor mu?  
**Kapı 5 — Katar uygulanabilir mi?** Broker, taşıyıcı erişimi, lisans ve veri işleme yolu yazılı teyit edildi mi?  
**Kapı 6 — Yatırım tezi kanıtlı mı?** Fon kullanım milestone’ları gerçek müşteri/ürün sonuçlarına bağlı mı?

İlk beş kapıdan geçmeden “%3,8 komisyon kaybı”, “30 günde ROI”, “yıllık ortalama kayıp” veya “Katar’da kesin pazar erişimi” gibi iddiaları dış sunumda kullanmayın.
