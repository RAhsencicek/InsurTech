# Acente Yazılımları ve Komisyon Mutabakatı: Rakip Haritası

**Araştırma tarihi:** 26 Ekim 2026. Ürün yetenekleri resmi sayfalardan, kullanıcı deneyimi ise seçili mağaza/review kaynaklarından incelendi. Tedarikçi iddiaları bağımsız başarı kanıtı sayılmadı.

## Önce kategorileri ayıralım

“Acente yazılımı” tek ürün sınıfı değil. Dört işlev birbirine karıştırıldığında rakip analizi hatalı olur:

1. **AMS/ERP ve CRM:** müşteri, poliçe, zeyil, renewal, tahsilat, muhasebe, şube ve dosya arşivi.
2. **Teklif/rater/aggregator:** farklı taşıyıcılardan fiyat/teminat toplama, kıyaslama, teklif ve bazen bind/issue.
3. **Komisyon mutabakatı:** sigortacı ekstresini poliçe/şirket sözleşmesi/komisyon tarifesiyle eşleme, eksik/fazla ödemeyi bulma ve uyuşmazlığı kapatma.
4. **Producer compensation/ICM/compliance:** şirket veya agency içindeki producer split, teşvik planı, payout/statement, producer onboarding/lisans/appointment ve uyum.

Carrier statement içe alma ile ödeme planı hesaplamak aynı yetenek değildir. Bir ürün komisyon oranı uygulayabilir ama beklenen ile gerçekten yatan tutarı eşleştirmeyebilir; başka ürün eksik ödemeyi bulup producer paylaştırma yapmayabilir.

## Türkiye’de görünen yazılım seti

| Ürün | Kamuya açık sayfalardaki öne çıkan işlevler | Fiyat/kullanım notu |
|---|---|---|
| **Polisoft** | SKPS, MHS, LiveLink, OPS; poliçe/şirket transferi, teklif, yenileme, cari/tahsilat, muhasebe ve bildirim. | Açık fiyat görünmüyor; satıcı ürün ve entegrasyon beyanı. [1] |
| **Polixir** | Acente işletim sistemi, hızlı teklif, PolPort, mobil/web kanalları, poliçe/cari/tahsilat/hasar/rapor ve yenileme. | Kullanıcı/acente adetleri satıcı kaynaklı; bağımsız penetrasyon ölçümü yok. [2] |
| **Ada Yazılım / Sigorta Adası** | Poliçe, cari, tahsilat, hasar, muhasebe, şirket transferi ve yenileme. | “600 acente/50 broker” satıcı beyanıdır. [3] |
| **PSPforSQL** | Masaüstü/SQL; poliçe aktarımı, cari, kasa/banka, POS, komisyon, çek-senet, tahsilat, reminder, raporlama ve şube/tali acente. | Araştırma anında ana kullanıcı için 30.000 TL + KDV ve ek kullanıcı için 4.200 TL + KDV gibi fiyat gösterilmişti. Lisans süresi/destek detayını teklif ile teyit edin. [4] |
| **Acente Kolay** | Web CRM, poliçe/teklif/yenileme, WhatsApp Business API, Excel/XML/Web API aktarımı, ekstre mutabakatı. | 7 günlük deneme ve demo; açık fiyat yok; “500+ acente/15+ entegrasyon” satıcı beyanı. [5] |
| **Acente365** | Çoklu şirket teklifi, CRM, poliçe, yenileme, muhasebe/tahsilat, POS, iletişim ve mobil. | Paket şartı/entegrasyon derinliği görüşmeyle; mağaza indirme sayısı aktif acente müşterisini göstermez. [6] |
| **AcentePlus / Acente Takip / SigortaPro** | Web tabanlı poliçe/yenileme/CRM, tahsilat, komisyon, mesajlaşma ve bazı ürünlerde PDF/OCR. | Bazı fiyatlar açık, çoğu teklif usulü; karşılaştırırken vergi, kullanıcı sayısı, destek ve entegrasyon maliyetini ekleyin. [7] [8] [9] |

Bu ürünlerin varlığı pazarda iş akışı modüllerinin bulunduğunu gösteriyor; tüm acentelerin bunları kullandığını veya yeterli bulduğunu değil. Satıcı sayfalarındaki müşteri adetleri ve referans yorumları pazarlama beyanı olarak etiketlenmeli.

## Küresel ve bölgesel rakipler

### Doğrudan commission reconciliation

- **Applied Recon:** Applied Epic kullanan bağımsız acentelere yönelik; PDF/CSV/taranmış carrier statement’larından veriyi çıkarma, Epic işlem kayıtlarıyla eşleştirme, doğrudan GL’ye aktarma ve insan incelemesi. Uygunluk Epic ekosistemine bağlı. Satıcının taşıyıcı kapsamı ve doğruluk/tasarruf iddiaları demo, SOW ve müşteri referansıyla ölçülmeli. [10]
- **AgencyBloc Commissions+:** özellikle sağlık/hayat, Medicare ve IMO/FMO/upline segmentlerinde carrier statement import/mapping, eksik komisyon tespiti, rate/override, agent split ve statement. Fiyat işlem hacmine göre teklif; ürünün bütün P&C/GCC pazarına uyduğu kanıtlanmış değil. [11] [12]
- **Commissionly Insurance Commission Tracker:** statement/CSV, beklenen komisyon tarifesi, eksik veya farklı ödemeyi bulma, discrepancy report ve agent split/statement. Resmi fiyat sayfasında açık fiyat yok; dizinlerde görünen fiyatın sigorta ürününe uygulanıp uygulanmadığı teyit edilmeli. [13] [14]
- **Commission Tracker:** insurance-specific dosya yükleme, carrier/agent mapping, policy/payment eşleşmesi, discrepancy ve agent portal/statement; yazılım yanında işlem hizmeti de sunuyor. İçe aktarma otomasyonu, API derinliği ve hizmet maliyeti ayrı doğrulanmalı. [15] [16]
- **Salesforce Financial Services Cloud for Insurance Brokerages:** resmi sayfa direct-bill carrier statement alımı, broker poliçesiyle eşleştirme, producer split ve expected revenue takibi anlatıyor. Özelliğin hazır SKU mu yoksa özel uygulama mı olduğu lisans/demo ile netleştirilmeli. [17]

### Komşu ürünler — tam mutabakat rakibi olmayabilir

- **Vertafore AMS360 / Reconciliation Agent:** AMS, accounting ve producer split’in yanında taşıyıcı ekstresini acente hareketleriyle eşleştiren ayrı Reconciliation Agent tanıtılıyor. Bu kabiliyet ve kullanılabilirlik sürüm/lisans bazında teyit edilmeli. [18]
- **Performio:** sigorta ICM; policy-level incentive, producer split/hierarchy, payout/statement, hold-release, clawback, dispute ve enterprise integration. Carrier statement’ı acente poliçesiyle satır düzeyinde mutabık hale getirdiği ürün sayfasında yeterince açık değil. [19] [20]
- **Sircon Compensation:** sigortacı/taşıyıcı tarafında producer compensation plan, hiyerarşi, ödeme döngüsü ve producer portalı. Agency’nin gelen carrier ekstresini eşleştirme ürünüyle aynı değildir. [21]
- **AgentSync:** producer onboarding, lisans, appointment, termination ve compliance. Komisyon statement reconciliation ürünü değildir. [22]
- **Vymo:** producer onboarding, saha satış/CRM, lead, renewals/persistency ve performans yönetimi. Carrier statement matching kanıtı yok. [23]
- **Insly:** MGA/insurer için modüler ürün, prim muhasebesi, direct/agency billing, carrier/reinsurer payables, çoklu para birimi, poliçe bazında komisyon ve API. Brokerin carrier statement’ını beklenen komisyonla eşleştirme ve producer payout işlevi ayrıca test edilmeli. [24] [25]
- **Simson / SAIBA:** BAE bağlantılı broker ERP; placement, poliçe, claim, accounting, commission/revenue tracking. Ürün sayfasında carrier statement extraction ve satır bazlı reconciliation ayrı ayrı kanıtlanmıyor. [26]
- **EZLynx Rating Engine:** ABD kişisel hatlar için çoklu taşıyıcı teklif/rating ve bind/issue akışı; komisyon mutabakatı değildir. [27]

**Sonuç:** “Rakip yok” iddiası doğru değil. Doğrudan commission reconciliation ürünleri var; komşu AMS ve producer compensation ürünleri de alanın parçalarını karşılıyor. Fırsat ancak hedef segment, taşıyıcı verisi, çoklu AMS bağımsızlığı, yerel iş kuralları ve istisna çözümü gibi ölçülebilir bir wedge ile tarif edilebilir.

## Katar ve Körfez yazılım görünürlüğü

Katar’da QIC’nin tüketici app/web ve broker-agent portal girişi var. Kamuya açık araştırmada Katar brokerlerinin yaygın AMS/CRM markası, fiyatı, bağımsız kullanıcı yorumu veya taşıyıcı API standardı doğrulanamadı. BAE’de Simson gibi broker ERP sağlayıcısı görünür, ancak yerel müşteri kullanımına ve reconciliation derinliğine dair bağımsız kanıt yok. Suudi Arabistan’da Tameeni/BCare tüketici karşılaştırma uygulamaları; broker AMS kullanımını değil dijital dağıtım kanalını gösteriyor. Bahreyn’de SOOR ve Umman’da Tameen/Ameen broker-dijital teklif kanalları olarak görünüyor; bunlar da back-office yazılım penetrasyon ölçümü değil. [28] [29] [30] [31]

## Kullanıcı şikâyeti ve puan verisi

- **Türkiye acente yazılımı:** Open Yazılım Şikayetvar sayfasında kesinti, proxy/IP erişimi, güncelleme sonrası performans ve destek erişimi üzerine kullanıcı beyanları var. Bu sınırlı bir şikâyet örneklemidir, tüm yerel ürünlerin kalitesi veya mevcut hata oranı değildir. [32]
- **Katar:** QIC App Store puanı/yorumları tüketici uygulamasına ait; broker ERP şikâyeti bulunmadı. Bir kullanıcının yurtdışında uygulamayı kullanamadığına ilişkin yorumu tekil, uygulama özelinde sinyaldir. [33]
- **Suudi Arabistan:** Tameeni ve BCare Google Play yorumları giriş, teklif/ödeme, ek hizmet ve destek sorunları anlatabiliyor. Uygulamalar tüketici karşılaştırma kanalıdır; broker çalışanı yorumu değil. [34] [35]
- **BAE:** Shory App Store yorumlarında araç/kapsam bulunamaması, destek yanıtı ve poliçenin uygulamaya geç gelmesi iddiaları; Policybazaar Trustpilot’ta ödeme/tescil gecikmesi ve satın alma sonrası destek sorunları var. Bunlar tüketici deneyimi ve doğrulanmamış kullanıcı beyanıdır. [36] [37]
- **Kuveyt:** GIG app yorumlarında profil doğrulama/erişim sorunları gibi sınırlı son kullanıcı sinyalleri var. Acente yazılımı değerlendirmesi değil. [38]
- **Bahreyn ve Umman:** forum ve uygulama sinyalleri düşük hacimli; broker içi yazılım/komisyon şikâyeti doğrulanmadı. [39] [40]
- **Global review siteleri:** G2 Applied Epic/AMS360 kullanıcıları öğrenme eğrisi, tıklama/arama ve zaman zaman performans sorunlarını bildiriyor. AgencyBloc Commissions+ için tek G2 yorumu kurulum/entegrasyon zorluğundan bahsediyor; N=1 olduğundan ürün geneline genellenemez. Capterra Commission Tracker yorumlarında carrier mapping/Excel kurulumu öğrenme yükü yanında destek ve işlev övgüleri var; bazı yorumlar satıcı yönlendirmeli/teşvikli. [41] [42] [43]

## Fiyat sinyalleri

Fiyatlar ürünler arasında doğrudan kıyaslanabilir değil. Türkiye’de bazı yerel ürünler TL liste fiyatı verir; çoğu büyük AMS ve reconciliation aracı teklif/demoyla fiyatlanır. AgencyBloc hacim bazlı özel teklif; Performio kullanıcı/plan/entegrasyon karmaşıklığı ve ayrıca implementasyon bedeli; Insly modüler paket + kurulum yaklaşımı; Simson ve çoğu kurumsal çözüm özel fiyat sunuyor. Commissionly için üçüncü taraf dizinde görülen kullanıcı başı fiyat, sigorta modülünün resmi fiyatı olarak teyit edilmedi. [12] [14] [20] [25]

## Rakiplerden öğrenilecek ürün ilkeleri

1. **Carrier mapping ürünün çekirdeği:** Dosya kolonları, isim eşleştirme, poliçe numarası, zeyil, iptal, taksit, negatif düzeltme ve tekrar yükleme idempotency kuralları.
2. **Human-in-the-loop:** Belirsiz eşleşme otomatik olarak kesin kabul edilmemeli; confidence, kaynak satırı, düzeltme ve onay izi gösterilmeli.
3. **İstisna ve çözüm iş akışı:** “Fark bulundu”dan sonra sorumlu, taşıyıcıya itiraz, yanıt, kapanış ve tahsilat sonucu izlenmeli.
4. **Dışa aktarım ve beraber çalışabilirlik:** İlk sürüm mevcut AMS/muhasebe sistemini değiştirmeden CSV, Excel, PDF ve izinli API ile çalışmalı.
5. **Gerçek ölçüm:** doğruluk, yanlış pozitif, kurulum saati, carrier başına onboarding, kapanan fark ve gerçek tahsilat pilotta ölçülmeli.
6. **Yerel uyum:** Türkiye ve Katar için ayrı veri, para birimi, carrier, komisyon ve lisans katmanı tasarlanmalı; ülke geneli kural varsayılmamalı.

## Kaynaklar

[1]: https://www.polisoft.com.tr/ "Polisoft ürün kataloğu"
[2]: https://polixir.com/ "Polixir ürün kataloğu"
[3]: https://www.adayazilim.com/tr/cozumlerimiz-sigorta-adasi "Ada Yazılım Sigorta Adası"
[4]: https://pspyazilim.com/urunler/sigorta-acente-programi "PSP Sigorta Acente Programı ve fiyat bilgisi"
[5]: https://acentekolay.com/ "Acente Kolay"
[6]: https://acente365.com.tr/ "Acente365"
[7]: https://www.acenteplus.net/ "AcentePlus"
[8]: https://acentetakip.com/ "Acente Takip"
[9]: https://sigorta.pro/ "SigortaPro"
[10]: https://www1.appliedsystems.com/en-us/solutions/for-agents/financial-management/applied-recon/ "Applied Recon"
[11]: https://www.agencybloc.com/commissions-software/ "AgencyBloc Commissions Plus"
[12]: https://www.agencybloc.com/pricing/ "AgencyBloc pricing"
[13]: https://www.commissionly.io/insurance-commission-tracker/ "Commissionly Insurance Commission Tracker"
[14]: https://www.commissionly.io/pricing/ "Commissionly pricing"
[15]: https://commission-tracker.com/ "Commission Tracker for Insurance"
[16]: https://www.capterra.com/p/88991/Commission-Tracker-for-Insurance/reviews/ "Commission Tracker user reviews"
[17]: https://www.salesforce.com/financial-services/insurance-agency-management-software/ "Salesforce Insurance Agency Management"
[18]: https://www.vertafore.com/products/agency-management-software/ams360 "Vertafore AMS360"
[19]: https://www.performio.co/industry/insurance "Performio Insurance Incentive Compensation"
[20]: https://www.performio.co/pricing "Performio pricing"
[21]: https://www.vertafore.com/products/insurance-commission-tracking-software/sircon-compensation "Sircon Compensation"
[22]: https://agentsync.io/agentsync-manage "AgentSync Manage"
[23]: https://vymo.com/insurance-crm/ "Vymo insurance CRM"
[24]: https://insly.com/en/accounting-reporting-insurance-mga/ "Insly accounting and reporting"
[25]: https://insly.com/en/pricing/ "Insly pricing"
[26]: https://www.simson.ae/ "Simson Softwares"
[27]: https://www.ezlynx.com/products/rating-engine/ "EZLynx Rating Engine"
[28]: https://qic.online/en "QIC Online"
[29]: https://www.qfc.qa/en/business-solutions/insurance-and-reinsurance/ "QFC Insurance and Reinsurance"
[30]: https://www.ia.gov.sa/SectorReports/The%20Saudi%20Insurance%20Market%20Report%202025.pdf "Saudi Insurance Market Report 2025"
[31]: https://bysoor.com/ "SOOR Bahrain"
[32]: https://www.sikayetvar.com/open-yazilim "Open Yazılım kullanıcı şikâyetleri"
[33]: https://apps.apple.com/qa/app/qic-insurance-market-travel/id1620043397 "QIC App Store"
[34]: https://play.google.com/store/apps/details?id=tameeni.com "Tameeni Google Play"
[35]: https://play.google.com/store/apps/details?id=com.app.bcare "BCare Google Play"
[36]: https://apps.apple.com/us/app/shory-insurance-%D8%B4%D9%88%D8%B1%D9%8A/id1601026503 "Shory App Store"
[37]: https://www.trustpilot.com/review/policybazaar.ae "Policybazaar UAE Trustpilot"
[38]: https://apps.apple.com/us/app/gig-kuwait/id492098219 "GIG Kuwait App Store"
[39]: https://www.reddit.com/r/Bahrain/comments/1ig7emx/best-car-insurance-companies/ "Bahrain user discussion on car insurance"
[40]: https://fsa.gov.om/home/SearchNews/43?newsId=10695&year=2025 "Oman FSA broker filing enforcement"
[41]: https://www.g2.com/products/applied-epic/reviews "Applied Epic G2 reviews"
[42]: https://www.g2.com/products/ams360/reviews "AMS360 G2 reviews"
[43]: https://www.capterra.com/p/178138/Commissionly/ "Commissionly Capterra reviews"
