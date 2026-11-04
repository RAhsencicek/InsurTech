# Türkiye ve Körfez Sigorta Aracılığı: Saha, Yazılım ve Fırsat Araştırması

**Araştırma tarihi:** 26 Ekim 2026  
**Kapsam:** Türkiye ana pazar; Katar ilk Körfez önceliği; Suudi Arabistan, BAE, Bahreyn, Kuveyt ve Umman karşılaştırmalı olarak.

## Araştırmanın ana sonucu

Türkiye’de acente yazılımı kategorileri, yerel ürünler ve işlevler görece görünür. Buna rağmen bağımsız acentelerin hangi ürünü ne kadar kullandığı, çalışanların hangi ekranlardan şikâyet ettiği, yazılım penetrasyonu, gerçek komisyon kaybı ve ödeme isteği hakkında yeterli temsilî veri bulunmuyor. Ürün satıcılarının özellik listeleri ve “kullanıcı sayısı” beyanları pazar kanıtı olarak kabul edilemez.

Katar’da QIC gibi sigortacıların doğrudan dijital satış, yenileme, hasar ve müşteri uygulamaları var. QIC’nin broker-agent girişi de bulunuyor. Ancak bu, Katar brokerlerinin hangi acente yönetim sistemi veya muhasebe uygulamasını kullandığını göstermiyor. Katar’da broker yazılımı yorumları, lisanslı brokerlerin günlük araçları, fiyatları ve API erişimi kamuya açık kaynaklardan belirlenemedi. Bu yüzden Katar için en değerli sonraki adım yeni bir feature listesi çıkarmak değil, broker operasyonlarını yerinde/uzaktan gözlemleyip izinli örnek dosyalarla problem doğrulamak.

## “Gerçek kullanıcı” kanıtını nasıl okumalıyız?

Bu araştırmada kanıtlar dört sınıfa ayrıldı:

1. **Düzenleyici ve sektör verisi:** pazar büyüklüğü, aracılık kuralları, şikâyet toplamları, lisans ve resmi program koşulları. Ürün kullanımını tek başına kanıtlamaz.
2. **Kullanıcı tarafından yazılan yorum/şikâyet:** gerçek bir kişinin deneyim iddiasıdır; olay her zaman doğrulanmış değildir ve seçilim yanlılığı taşır. Tüketici yorumu, acente çalışanının yazılım şikâyeti değildir.
3. **Satıcı ürün sayfası:** ürünün sunduğunu iddia ettiği modülleri gösterir. Kullanım oranı, doğruluk veya memnuniyetin bağımsız kanıtı sayılmaz.
4. **İş ilanı ve uygulama mağazası sinyali:** istenen görevleri veya tüketici uygulamasının erişimini gösterir; broker ofisinde hangi sistemin yaygın olduğunu göstermez.

Bu ayrımlar kritik. Örneğin uygulama mağazasında 100 bin indirme, aktif broker kullanıcısı veya acente yazılımı pazar payı demek değildir. Benzer şekilde bir ürünün sayfasında WhatsApp bağlantısı olması, acentelerin günlük iletişiminin çoğunu WhatsApp üzerinden yürüttüğünü ispatlamaz.

## Türkiye: ürünler ne yapıyor, kullanıcı kanıtı ne söylüyor?

Türkiye Sigorta Birliği’nin 2024 sektör raporunda acenteler hayat dışı sigorta dağıtımının yaklaşık %59,6’sını yapıyor; hayat sigortalarında banka kanalı baskın. Bu, hayat dışı alanda acente kanalının önemini doğruluyor; sigorta yazılımı kullanım oranını veya acentelerin tüm branşlardaki payını değil. SEDDK’nın erişilebilen yıl sonu aracılık verisinde 2023 için 18.031 acente ve 195 broker yer alıyor; bunu 2026 toplamı diye sunmamak gerekir. [1] [2]

Kamuya açık ürün sayfalarında öne çıkan yazılım aileleri şunlar:

- **Polisoft:** SKPS acente yönetimi, MHS muhasebe, LiveLink satış/yenileme ve OPS hızlı teklif. Şirket transferi, cari, tahsilat, komisyon, teklif, bildirim ve raporlama özellikleri tanıtılıyor.
- **Polixir:** acente işletim sistemi, hızlı teklif, şirket ekran erişim aracı PolPort, mobil uygulama ve müşteri teklif kanalları; cari, tahsilat, hasar, yenileme ve mesajlaşma özellikleri sunucu beyanında mevcut.
- **Ada Yazılım / Sigorta Adası:** poliçe, cari, tahsilat, hasar, muhasebe, yenileme ve şirket transferi. “600 acente/50 broker” gibi adetler şirket beyanıdır; bağımsız ölçüm değildir.
- **PSPforSQL:** poliçe aktarımı, cari/kasa/banka, komisyon, tahsilat, çek-senet/POS, hatırlatma ve raporlama. İncelenen sayfada ana kullanıcı için 30.000 TL + KDV ve ek kullanıcı için fiyat listesi görünüyordu; fiyatın güncelliği, lisans süresi ve destek kapsamı teklif alınarak teyit edilmeli.
- **Acente Kolay, Acente365, AcentePlus, Acente Takip ve SigortaPro:** web tabanlı CRM/poliçe/yenileme/teklif, mesajlaşma, Excel içe aktarma, tahsilat, komisyon ve bazı ürünlerde PDF/OCR özellikleri tanıtılıyor. Açık fiyatlar ve entegrasyonların kapsamı markaya göre değişiyor. Satıcıların kullanıcı sayıları doğrulanmış pazar payı değil. [3] [4] [5] [6]

Gerçek kullanıcı sesi tarafında önemli bir sınırlılık var: yerel acente yazılımlarının çoğu için güncel, bağımsız, çok sayıda uygulama mağazası yorumu veya doğrulanabilir forum tartışması bulunamadı. Şikayetvar’daki Open Yazılım sayfasında erişim, proxy/IP izni, güncelleme sonrası performans ve destek yanıtına ilişkin kullanıcı iddiaları var. Bunlar üretim işinin durması gibi güvenilirlik risklerine dikkat çekiyor; ancak küçük, kendiliğinden seçilmiş örneklerdir, pazar ortalaması ya da bugünkü hata oranı değildir. [7]

Yerel yazılım sağlayıcılarının ürün mesajlarında tekrar eden işler; şirket ekranları arasında geçiş, Excel ve dosya aktarımı, poliçe ve zeyil verisinin aktarılması, yenileme takibi, tahsilat/cari, komisyon ve şirket ekstresi mutabakatı. Bu tekrarlar ürün keşfi için hipotez üretir. Bunları “acentelerin çoğu böyle şikâyet ediyor” biçiminde anlatmak için acente çalışanlarıyla görüşme ve süreç gözlemi gerekir.

## Katar: dijital kanal var, broker arka ofisi görünmüyor

QIC, qic.online ve mobil uygulamasında doğrudan teklif/satın alma, yenileme, hasar takibi ve müşteri desteği sunuyor. Web yüzeyinde müşteri ve broker-agent kullanıcıları için ayrı girişler de var. App Store’da görünen puan/yorumlar QIC’nin tüketici uygulamasına ait; broker yazılımı değerlendirmesi değildir. Görünen kullanıcı sayıları ve şirketin müşteri/Google yorum adetleri şirket veya platform beyanı olarak ele alınmalı. [8] [9]

Kamuya açık kaynaklarda Katar brokerlerinin kullandığı AMS/CRM markası, muhasebe/komisyon yazılımı, abonelik fiyatı, entegrasyon formatı veya kullanım payı doğrulanamadı. Sigortacı portalı ile bağımsız broker iç sistemi aynı kategori değildir. Katar’da QCB’nin ülke içi düzenleyici çerçevesi ile QFC/QFCRA’nın QFC içindeki çerçevesi de ayrı tutulmalı; broker, sigorta şirketi, aracı/agent, aggregator ve yalnızca SaaS sağlayıcısı aynı lisans rolü değildir. İş modeline göre QCB/QFCRA ön görüşü gerekebilir. [10] [11]

**Saha hipotezleri:** broker müşterisi/işveren kartı, çoklu taşıyıcı teklif dosyası, yenileme takvimi, sağlık çalışan listesi, hasar belgesi takibi, carrier portal durumu ve komisyon/tahsilat mutabakatını tek denetlenebilir iş akışına almak. Bunlar henüz Katar’da doğrulanmış kullanıcı acısı değil; broker görüşmesiyle sınanacak hipotezlerdir.

## Diğer Körfez pazarları

### Suudi Arabistan

Insurance Authority’nin 2025 raporunda brüt yazılan prim yaklaşık SAR 84,3 milyar. Broker dağıtım payı 2025’te yaklaşık %47’ye yükselmiş; rapordaki toplam şikâyetlerin yaklaşık %76’sı hasar kategorilerinde. Bu, broker kanalının ve hasar iletişiminin pazar düzeyindeki önemini gösterir; hasar şikâyetlerini broker yazılımına atfetmez. Tameeni ve BCare gibi karşılaştırma/satın alma uygulamaları görünür; uygulama indirme ve yorumları tüketici kanalına aittir, arka ofis sistemi kullanımına değil. IA ayrıca broker/agent/aggregator lisans kategorilerini ve elektronik entegrasyon süreçlerini tanımlıyor. [12] [13] [14]

### Birleşik Arap Emirlikleri

CBUAE broker kuralları operasyonu doğrudan etkiliyor: broker müşterinin primini sigortacı adına tutmamalı; komisyon ödemesi sigortacı prim ödemesini aldıktan sonra belirlenen sürede yapılmalı; yenileme ve şikâyet/hasar süreçleri için bildirim ve kayıt yükümlülükleri var. Policybazaar ve Shory gibi dijital broker/karşılaştırma kanallarında tüketici yorumlarında fiyat/teklif farkı, poliçenin işlenme gecikmesi, ödeme sonrası destek ve uygulamada araç bulamama gibi iddialar görülüyor. Bunlar kullanıcı beyanıdır; broker back-office kullanıcılarının şikâyeti veya doğrulanmış hata oranı değildir. [15] [16] [17]

### Bahreyn

CBB Rulebook’ta sigorta brokeri ve insurance aggregator farklı düzenleyici kategoriler. SOOR gibi dijital karşılaştırma kanalları ve GIG’nin web/app/WhatsApp akışları gözleniyor. Bir Reddit başlığında kullanıcılar brokerden daha iyi fiyat bulma deneyimini paylaşıyor, ancak örneklem çok küçük ve fiyatın bazen tersine dönebileceği de söyleniyor. Brokerlerin hangi CRM/AMS veya komisyon yazılımını kullandığına ilişkin bağımsız veri yok. [18] [19]

### Kuveyt

IRU’nun Beema zorunlu motor sigortası dijital kanalı ve Al Mulla Insurance Brokerage’nin mobil teklif talep akışı mevcut. GIG Kuwait uygulaması doğrudan sigortacı müşteri uygulamasıdır. SmartSolns sayfası teklif, poliçe, endorsement/yenileme, tahsilat ve komisyon raporlama özellikleri olan broker ERP’si tanıtıyor; Kuveyt’te fiilen kullanıldığı, yerel müşteri adedi ve fiyatı doğrulanmadı. Broker çalışanlarının AMS/komisyon yazılımı şikâyeti için açık, temsilî örnek bulunamadı. [20] [21] [22]

### Umman

FSA, 2025 sigorta gelirini 501,6 milyon OMR, brüt yazılan primi 551,8 milyon OMR ve dijital platform kaynaklı primlerde %35,5 büyüme bildirdi. FSA ayrıca 37 lisanslı broker sayısı ve brokerların üçten fazla sigortacıyla çalışması kuralını yayımlıyor. Tameen/Ameen gibi broker kanalları ve Dhamani sağlık platformu var; broker ofis yazılımının kullanım oranı bilinmiyor. FSA’nın elektronik sigorta platformu onay gerekliliği, broker/insurer dijital iş akışları için önemli bir düzenleyici unsur. [23] [24] [25]

## Ürün fırsatları: kanıt düzeyi ve sıralama

Aşağıdaki sıralama doğrulanmış boşlukların listesi değil; mevcut sinyallerle test edilmeye değer hipotezlerdir.

1. **Türkiye’de taşıyıcı bağımsız poliçe ve müşteri iş akışı katmanı.** Farklı dosya ve izinli servislerden teklif, poliçe, zeyil, hasar, tahsilat ve komisyonu tek müşteri/poliçe zaman çizelgesinde birleştirin. Mevcut ERP’lerin yerini hemen almak yerine veri taşınabilirliği, audit log, istisna yönetimi ve dışa aktarmayla başlayın.
2. **Satır bazlı komisyon mutabakatı.** Carrier statement ile sözleşme/komisyon oranı, poliçe, zeyil, iptal ve taksitleri karşılaştırın; otomatik eşleşmeyi insan onaylı istisna kuyruğuna bağlayın. Kullanıcı acısı ve fark tutarı gerçek ekstrelerle ölçülmeli; yüzde kayıp veya kurtarma garantisi uydurulmamalı.
3. **Yenileme hunisi.** Hatırlatmadan öte; görev, teklif, müşterinin kararı, yenilememe nedeni ve kaçan iş metriği. Var olan ürünlerde hatırlatma yaygın özellik olduğundan farklılaşma ölçülebilir dönüşüm ve kayıt bütünlüğü olmalı.
4. **Katar broker desk.** Lisanslı brokerlere Arapça/İngilizce müşteri/işveren kaydı, çoklu taşıyıcı dosyası, yenileme/claim belge takibi ve izinli portal durumlarının görünürlüğü. Önce broker gözlemi/LOI ve taşıyıcı erişimi doğrulaması.
5. **Hasar ve müşteri iletişim takibi.** Suudi Arabistan gibi pazarlarda resmi raporlarda hasar şikâyetleri yüksek; ülke ve rol bazında süreç görüşmesi yapın, tüketici şikâyetini broker içi yazılım problemi saymayın.

## Hızlı karar çerçevesi

- **Türkiye:** ilk ürün doğrulama ve erişilebilir gerçek poliçe/ekstre dosyaları için en mantıklı öğrenme pazarı.
- **Katar:** yatırım programı ve kurumsal bağlantı açısından ilk Körfez önceliği; ürün ve regülasyon varsayımlarını yerel brokerle doğrulama şart.
- **Suudi Arabistan:** ölçek ve aracı dijitalleşmesi açısından ikinci dalga; lisans/entegrasyon ve ürün uyarlaması gerektirir.
- **BAE:** broker operasyon kuralları dijital iş akışına somut gerekler veriyor; lisans, müşteri parası ve veri şartlarını en baştan tasarlayın.
- **Bahreyn, Kuveyt, Umman:** kıyas ve keşif pazarları; açık yazılım kullanım verisi daha da sınırlı.

## Kaynaklar

[1]: https://www.tsb.org.tr/content/Broadcasts/TSB_SEKTOR_TR24_1908.pdf "Türkiye Sigorta Birliği 2024 Sektör Raporu"
[2]: https://www.seddk.gov.tr/upload/Faaliyet%20Plan%C4%B1.pdf "SEDDK 2023 Faaliyet Planı ve sektör verileri"
[3]: https://www.polisoft.com.tr/ "Polisoft ürünleri"
[4]: https://polixir.com/ "Polixir Acente İşletim Sistemi"
[5]: https://pspyazilim.com/urunler/sigorta-acente-programi "PSP Sigorta Acente Programı"
[6]: https://acentekolay.com/ "Acente Kolay"
[7]: https://www.sikayetvar.com/open-yazilim "Open Yazılım kullanıcı şikâyetleri"
[8]: https://qic.online/en "QIC Online"
[9]: https://apps.apple.com/qa/app/qic-insurance-market-travel/id1620043397 "QIC Insurance App Store"
[10]: https://www.qfc.qa/en/business-solutions/insurance-and-reinsurance/ "QFC Insurance and Reinsurance"
[11]: https://www.qcb.gov.qa/Documents/LicensingForBanks/EN/LPFI9en.pdf "QCB Licensing Procedures for Financial Institutions"
[12]: https://www.ia.gov.sa/SectorReports/The%20Saudi%20Insurance%20Market%20Report%202025.pdf "Saudi Insurance Market Report 2025"
[13]: https://www.ia.gov.sa/en/regulations-and-licenses/apply-for-licenses "Insurance Authority Apply for a License"
[14]: https://www.ia.gov.sa/en/media-center/news/119 "Insurance Authority Innovation Lab and Sandbox"
[15]: https://rulebook.centralbank.ae/en/rulebook/insurance-brokers%E2%80%99-regulation "CBUAE Insurance Brokers Regulation"
[16]: https://www.trustpilot.com/review/policybazaar.ae "Policybazaar UAE Trustpilot reviews"
[17]: https://apps.apple.com/us/app/shory-insurance-%D8%B4%D9%88%D8%B1%D9%8A/id1601026503 "Shory Insurance App Store"
[18]: https://cbben.thomsonreuters.com/rulebook/au-1116 "CBB Insurance Broker definition"
[19]: https://bysoor.com/ "SOOR Bahrain"
[20]: https://www.iru.gov.kw/ "Insurance Regulatory Unit Kuwait"
[21]: https://www.almullagroup.com/financial-services/financial-services-al-mulla-insurance-brokerage-co-w-l-l "Al Mulla Insurance Brokerage"
[22]: https://www.smartsolns.com/insurance.html "SmartSolns Insurance Brokerage ERP"
[23]: https://fsa.gov.om/Home/News/10767 "Oman FSA 2025 insurance results"
[24]: https://fsa.gov.om/Sector/DisplaySubsection/4 "Oman FSA Insurance Brokerages"
[25]: https://fsa.gov.om/Home/News/9655 "Oman FSA Digital Insurance Platforms"
