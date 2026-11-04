import * as XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Acente Beklenen Üretim Listesi (Acente Portföy / ERP / Ada Acente Takip Çıktısı)
const acenteExpectedData = [
  {
    "Sıra No": 1,
    "Sigorta Şirketi": "Anadolu Sigorta",
    "Poliçe No": "AS-2026-89401",
    "Zeyil No": 0,
    "Müşteri Ad Soyad / Ünvan": "Ahmet Yılmaz",
    "TCKN / VKN": "28491028472",
    "Branş": "KASKO",
    "Plaka / UAVT": "34 VR 8920",
    "Tanzim Tarihi": "02.10.2026",
    "Başlangıç Tarihi": "02.10.2026",
    "Bitiş Tarihi": "02.10.2027",
    "Brüt Prim (TL)": 28500.00,
    "Net Prim (TL)": 24782.60,
    "Sözleşme Komisyon Oranı (%)": 17.5,
    "Beklenen Komisyon (TL)": 4336.95,
    "İşlem Türü": "YENİ POLİÇE"
  },
  {
    "Sıra No": 2,
    "Sigorta Şirketi": "Anadolu Sigorta",
    "Poliçe No": "AS-2026-89402",
    "Zeyil No": 0,
    "Müşteri Ad Soyad / Ünvan": "Selin Demir",
    "TCKN / VKN": "19482019482",
    "Branş": "TRAFİK",
    "Plaka / UAVT": "34 BJK 1903",
    "Tanzim Tarihi": "04.10.2026",
    "Başlangıç Tarihi": "04.10.2026",
    "Bitiş Tarihi": "04.10.2027",
    "Brüt Prim (TL)": 8400.00,
    "Net Prim (TL)": 7304.35,
    "Sözleşme Komisyon Oranı (%)": 8.0,
    "Beklenen Komisyon (TL)": 584.35,
    "İşlem Türü": "YENİLEME"
  },
  {
    "Sıra No": 3,
    "Sigorta Şirketi": "Anadolu Sigorta",
    "Poliçe No": "AS-2026-89403",
    "Zeyil No": 0,
    "Müşteri Ad Soyad / Ünvan": "Kaya Lojistik A.Ş.",
    "TCKN / VKN": "4820194829",
    "Branş": "KASKO",
    "Plaka / UAVT": "34 LGT 88",
    "Tanzim Tarihi": "07.10.2026",
    "Başlangıç Tarihi": "07.10.2026",
    "Bitiş Tarihi": "07.10.2027",
    "Brüt Prim (TL)": 45000.00,
    "Net Prim (TL)": 39130.43,
    "Sözleşme Komisyon Oranı (%)": 17.5,
    "Beklenen Komisyon (TL)": 6847.83,
    "İşlem Türü": "YENİ POLİÇE"
  },
  {
    "Sıra No": 4,
    "Sigorta Şirketi": "Anadolu Sigorta",
    "Poliçe No": "AS-2026-89404",
    "Zeyil No": 1,
    "Müşteri Ad Soyad / Ünvan": "Kaya Lojistik A.Ş.",
    "TCKN / VKN": "4820194829",
    "Branş": "KASKO",
    "Plaka / UAVT": "34 LGT 88",
    "Tanzim Tarihi": "18.10.2026",
    "Başlangıç Tarihi": "07.10.2026",
    "Bitiş Tarihi": "07.10.2027",
    "Brüt Prim (TL)": 8000.00,
    "Net Prim (TL)": 6956.52,
    "Sözleşme Komisyon Oranı (%)": 17.5,
    "Beklenen Komisyon (TL)": 1217.39,
    "İşlem Türü": "ZEYİL (BEDEL ARTIŞI)"
  },
  {
    "Sıra No": 5,
    "Sigorta Şirketi": "Anadolu Sigorta",
    "Poliçe No": "AS-2026-89405",
    "Zeyil No": 0,
    "Müşteri Ad Soyad / Ünvan": "Caner Erkin",
    "TCKN / VKN": "38291048291",
    "Branş": "TSS",
    "Plaka / UAVT": "-",
    "Tanzim Tarihi": "10.10.2026",
    "Başlangıç Tarihi": "10.10.2026",
    "Bitiş Tarihi": "10.10.2027",
    "Brüt Prim (TL)": 16500.00,
    "Net Prim (TL)": 15714.28,
    "Sözleşme Komisyon Oranı (%)": 18.0,
    "Beklenen Komisyon (TL)": 2828.57,
    "İşlem Türü": "YENİ POLİÇE"
  },
  {
    "Sıra No": 6,
    "Sigorta Şirketi": "Anadolu Sigorta",
    "Poliçe No": "AS-2026-89406",
    "Zeyil No": 0,
    "Müşteri Ad Soyad / Ünvan": "Zeynep Aydın",
    "TCKN / VKN": "10492819482",
    "Branş": "KONUT",
    "Plaka / UAVT": "2849102841",
    "Tanzim Tarihi": "12.10.2026",
    "Başlangıç Tarihi": "12.10.2026",
    "Bitiş Tarihi": "12.10.2027",
    "Brüt Prim (TL)": 5800.00,
    "Net Prim (TL)": 5043.48,
    "Sözleşme Komisyon Oranı (%)": 22.0,
    "Beklenen Komisyon (TL)": 1109.56,
    "İşlem Türü": "YENİ POLİÇE"
  },
  {
    "Sıra No": 7,
    "Sigorta Şirketi": "Anadolu Sigorta",
    "Poliçe No": "AS-2026-89407",
    "Zeyil No": 0,
    "Müşteri Ad Soyad / Ünvan": "Murat Çelik",
    "TCKN / VKN": "59201948291",
    "Branş": "KASKO",
    "Plaka / UAVT": "06 ANK 06",
    "Tanzim Tarihi": "15.10.2026",
    "Başlangıç Tarihi": "15.10.2026",
    "Bitiş Tarihi": "15.10.2027",
    "Brüt Prim (TL)": 32000.00,
    "Net Prim (TL)": 27826.09,
    "Sözleşme Komisyon Oranı (%)": 17.5,
    "Beklenen Komisyon (TL)": 4869.56,
    "İşlem Türü": "YENİ POLİÇE"
  },
  {
    "Sıra No": 8,
    "Sigorta Şirketi": "Anadolu Sigorta",
    "Poliçe No": "AS-2026-89408",
    "Zeyil No": 0,
    "Müşteri Ad Soyad / Ünvan": "Ece Vural (Erken İptal)",
    "TCKN / VKN": "49201948271",
    "Branş": "KASKO",
    "Plaka / UAVT": "35 IZM 99",
    "Tanzim Tarihi": "01.05.2026",
    "Başlangıç Tarihi": "01.05.2026",
    "Bitiş Tarihi": "01.05.2027",
    "Brüt Prim (TL)": -12000.00, // 6 ay kullanıldı, kalan iade
    "Net Prim (TL)": -10434.78,
    "Sözleşme Komisyon Oranı (%)": 17.5,
    "Beklenen Komisyon (TL)": -1826.08, // Acentenin kabul ettiği iade payı
    "İşlem Türü": "İPTAL / STORNO"
  },
  {
    "Sıra No": 9,
    "Sigorta Şirketi": "Anadolu Sigorta",
    "Poliçe No": "AS-2026-89409",
    "Zeyil No": 0,
    "Müşteri Ad Soyad / Ünvan": "Birlik Un Fabrikası",
    "TCKN / VKN": "8492019482",
    "Branş": "İŞYERİ",
    "Plaka / UAVT": "9482019482",
    "Tanzim Tarihi": "22.10.2026",
    "Başlangıç Tarihi": "22.10.2026",
    "Bitiş Tarihi": "22.10.2027",
    "Brüt Prim (TL)": 64000.00,
    "Net Prim (TL)": 55652.17,
    "Sözleşme Komisyon Oranı (%)": 20.0,
    "Beklenen Komisyon (TL)": 11130.43,
    "İşlem Türü": "YENİ POLİÇE"
  },
  {
    "Sıra No": 10,
    "Sigorta Şirketi": "Anadolu Sigorta",
    "Poliçe No": "AS-2026-89410",
    "Zeyil No": 0,
    "Müşteri Ad Soyad / Ünvan": "Deniz Arda",
    "TCKN / VKN": "20491829481",
    "Branş": "DASK",
    "Plaka / UAVT": "1948201948",
    "Tanzim Tarihi": "25.10.2026",
    "Başlangıç Tarihi": "25.10.2026",
    "Bitiş Tarihi": "25.10.2027",
    "Brüt Prim (TL)": 2100.00,
    "Net Prim (TL)": 2100.00,
    "Sözleşme Komisyon Oranı (%)": 15.0,
    "Beklenen Komisyon (TL)": 315.00,
    "İşlem Türü": "YENİLEME"
  }
];

// 2. Anadolu Sigorta Şirket Bordrosu (Şirketin Acente Portalı Ekstresi - 4 Gizli Kaçak İçerir)
const anadoluEkstreData = [
  {
    "Acente Kodu": "10482",
    "Poliçe No": "AS-2026-89401",
    "Zeyil No": 0,
    "Yenileme No": 0,
    "Branş Adı": "KASKO",
    "Sigortalı Adı": "Ahmet Yılmaz",
    "Kimlik / Vergi No": "28491028472",
    "Tanzim Tarihi": "02.10.2026",
    "Yürürlük Tarihi": "02.10.2026",
    "Vade Tarihi": "02.10.2027",
    "Brüt Prim (TL)": 28500.00,
    "Net Prim (TL)": 24782.60,
    "Uygulanan Oran (%)": 17.5,
    "Tahakkuk Eden Komisyon (TL)": 4336.95,
    "Kesinti / Havuz (TL)": 0.00,
    "Net Ödenen (TL)": 4336.95,
    "Açıklama": "TAM VE EKSİKSİZ ÖDEME"
  },
  {
    "Acente Kodu": "10482",
    "Poliçe No": "AS-2026-89402",
    "Zeyil No": 0,
    "Yenileme No": 0,
    "Branş Adı": "TRAFİK",
    "Sigortalı Adı": "Selin Demir",
    "Kimlik / Vergi No": "19482019482",
    "Tanzim Tarihi": "04.10.2026",
    "Yürürlük Tarihi": "04.10.2026",
    "Vade Tarihi": "04.10.2027",
    "Brüt Prim (TL)": 8400.00,
    "Net Prim (TL)": 7304.35,
    "Uygulanan Oran (%)": 8.0,
    "Tahakkuk Eden Komisyon (TL)": 584.35,
    "Kesinti / Havuz (TL)": 0.00,
    "Net Ödenen (TL)": 584.35,
    "Açıklama": "TAM VE EKSİKSİZ ÖDEME"
  },
  // KAÇAK 1: Kasko Sözleşme %17.5 iken şirket %12.0 uygulamış (1.369 TL eksik ödeme!)
  {
    "Acente Kodu": "10482",
    "Poliçe No": "AS-2026-89403",
    "Zeyil No": 0,
    "Yenileme No": 0,
    "Branş Adı": "KASKO",
    "Sigortalı Adı": "Kaya Lojistik A.Ş.",
    "Kimlik / Vergi No": "4820194829",
    "Tanzim Tarihi": "07.10.2026",
    "Yürürlük Tarihi": "07.10.2026",
    "Vade Tarihi": "07.10.2027",
    "Brüt Prim (TL)": 45000.00,
    "Net Prim (TL)": 39130.43,
    "Uygulanan Oran (%)": 12.0, // <-- HATA: Beklenen 17.5
    "Tahakkuk Eden Komisyon (TL)": 4695.65, // <-- HATA: Beklenen 6847.83 (Fark: 2.152,18 TL)
    "Kesinti / Havuz (TL)": 0.00,
    "Net Ödenen (TL)": 4695.65,
    "Açıklama": "TARİFE DEĞİŞİKLİĞİ UYGULANDI"
  },
  // KAÇAK 2: Bedel artış zeyili komisyonu 0 TL olarak yansıtılmış!
  {
    "Acente Kodu": "10482",
    "Poliçe No": "AS-2026-89404",
    "Zeyil No": 1,
    "Yenileme No": 0,
    "Branş Adı": "KASKO",
    "Sigortalı Adı": "Kaya Lojistik A.Ş.",
    "Kimlik / Vergi No": "4820194829",
    "Tanzim Tarihi": "18.10.2026",
    "Yürürlük Tarihi": "07.10.2026",
    "Vade Tarihi": "07.10.2027",
    "Brüt Prim (TL)": 8000.00,
    "Net Prim (TL)": 6956.52,
    "Uygulanan Oran (%)": 0.0, // <-- HATA: Zeyil komisyonu ödenmedi
    "Tahakkuk Eden Komisyon (TL)": 0.00, // <-- HATA: Beklenen 1.217,39 TL
    "Kesinti / Havuz (TL)": 0.00,
    "Net Ödenen (TL)": 0.00,
    "Açıklama": "EK BEDEL ZEYİLİ - KOMİSYONSUZ"
  },
  // KAÇAK 3: TSS poliçesinden haksız 450 TL 'Kampanya / Havuz Payı' kesilmiş!
  {
    "Acente Kodu": "10482",
    "Poliçe No": "AS-2026-89405",
    "Zeyil No": 0,
    "Yenileme No": 0,
    "Branş Adı": "TSS",
    "Sigortalı Adı": "Caner Erkin",
    "Kimlik / Vergi No": "38291048291",
    "Tanzim Tarihi": "10.10.2026",
    "Yürürlük Tarihi": "10.10.2026",
    "Vade Tarihi": "10.10.2027",
    "Brüt Prim (TL)": 16500.00,
    "Net Prim (TL)": 15714.28,
    "Uygulanan Oran (%)": 18.0,
    "Tahakkuk Eden Komisyon (TL)": 2828.57,
    "Kesinti / Havuz (TL)": 450.00, // <-- HATA: Sözleşmede olmayan havuz kesintisi
    "Net Ödenen (TL)": 2378.57, // <-- Acenteye 450 TL eksik yattı
    "Açıklama": "GENEL MÜDÜRLÜK KAMPANYA PAYI KESİNTİSİ"
  },
  // KAÇAK 4: AS-2026-89406 (Zeynep Aydın - KONUT 1.109,56 TL) BORDRODA HİÇ YOK! UNUTULMUŞ!

  {
    "Acente Kodu": "10482",
    "Poliçe No": "AS-2026-89407",
    "Zeyil No": 0,
    "Yenileme No": 0,
    "Branş Adı": "KASKO",
    "Sigortalı Adı": "Murat Çelik",
    "Kimlik / Vergi No": "59201948291",
    "Tanzim Tarihi": "15.10.2026",
    "Yürürlük Tarihi": "15.10.2026",
    "Vade Tarihi": "15.10.2027",
    "Brüt Prim (TL)": 32000.00,
    "Net Prim (TL)": 27826.09,
    "Uygulanan Oran (%)": 17.5,
    "Tahakkuk Eden Komisyon (TL)": 4869.56,
    "Kesinti / Havuz (TL)": 0.00,
    "Net Ödenen (TL)": 4869.56,
    "Açıklama": "TAM VE EKSİKSİZ ÖDEME"
  },
  // KAÇAK 5: Erken iptalde sadece kalan gün iadesi (-1.826 TL) olması gerekirken şirket 1 yıllık komisyonun tamamını (-3.652 TL) acenteden kesmiş!
  {
    "Acente Kodu": "10482",
    "Poliçe No": "AS-2026-89408",
    "Zeyil No": 0,
    "Yenileme No": 0,
    "Branş Adı": "KASKO",
    "Sigortalı Adı": "Ece Vural (Erken İptal)",
    "Kimlik / Vergi No": "49201948271",
    "Tanzim Tarihi": "01.05.2026",
    "Yürürlük Tarihi": "01.05.2026",
    "Vade Tarihi": "01.05.2027",
    "Brüt Prim (TL)": -24000.00, // <-- HATA: Tüm prim iptali yansıtılmış
    "Net Prim (TL)": -20869.56,
    "Uygulanan Oran (%)": 17.5,
    "Tahakkuk Eden Komisyon (TL)": -3652.17, // <-- HATA: Beklenen kesinti -1.826,08 TL idi. Acenteden 1.826,09 TL fazla kesildi!
    "Kesinti / Havuz (TL)": 0.00,
    "Net Ödenen (TL)": -3652.17,
    "Açıklama": "STORNO KOMİSYON TAM İADE KESİNTİSİ"
  },
  {
    "Acente Kodu": "10482",
    "Poliçe No": "AS-2026-89409",
    "Zeyil No": 0,
    "Yenileme No": 0,
    "Branş Adı": "İŞYERİ",
    "Sigortalı Adı": "Birlik Un Fabrikası",
    "Kimlik / Vergi No": "8492019482",
    "Tanzim Tarihi": "22.10.2026",
    "Yürürlük Tarihi": "22.10.2026",
    "Vade Tarihi": "22.10.2027",
    "Brüt Prim (TL)": 64000.00,
    "Net Prim (TL)": 55652.17,
    "Uygulanan Oran (%)": 20.0,
    "Tahakkuk Eden Komisyon (TL)": 11130.43,
    "Kesinti / Havuz (TL)": 0.00,
    "Net Ödenen (TL)": 11130.43,
    "Açıklama": "TAM VE EKSİKSİZ ÖDEME"
  },
  {
    "Acente Kodu": "10482",
    "Poliçe No": "AS-2026-89410",
    "Zeyil No": 0,
    "Yenileme No": 0,
    "Branş Adı": "DASK",
    "Sigortalı Adı": "Deniz Arda",
    "Kimlik / Vergi No": "20491829481",
    "Tanzim Tarihi": "25.10.2026",
    "Yürürlük Tarihi": "25.10.2026",
    "Vade Tarihi": "25.10.2027",
    "Brüt Prim (TL)": 2100.00,
    "Net Prim (TL)": 2100.00,
    "Uygulanan Oran (%)": 15.0,
    "Tahakkuk Eden Komisyon (TL)": 315.00,
    "Kesinti / Havuz (TL)": 0.00,
    "Net Ödenen (TL)": 315.00,
    "Açıklama": "TAM VE EKSİKSİZ ÖDEME"
  }
];

function generateFiles() {
  const publicSamplesDir = path.resolve(__dirname, '../public/samples');
  const rootSamplesDir = path.resolve(__dirname, '../../samples');

  // 1. Acente Beklenen Üretim
  const wbExpected = XLSX.utils.book_new();
  const wsExpected = XLSX.utils.json_to_sheet(acenteExpectedData);
  XLSX.utils.book_append_sheet(wbExpected, wsExpected, "Acente_Uretim_Listesi");
  
  // 2. Anadolu Sigorta Ekstresi
  const wbAnadolu = XLSX.utils.book_new();
  const wsAnadolu = XLSX.utils.json_to_sheet(anadoluEkstreData);
  XLSX.utils.book_append_sheet(wbAnadolu, wsAnadolu, "Anadolu_Bordro_Ekim_2026");

  // 3. Allianz Sigorta Ekstresi
  const allianzEkstreData = [
    {
      "Acentelik No": "340912",
      "Police Numarasi": "ALZ-7749101",
      "Zeyil Sira": 0,
      "Brans Adi": "KASKO",
      "Sigortali Ad Soyad": "Bora Aksoy",
      "TC / Vergi No": "12948201948",
      "Tanzim": "05.10.2026",
      "Baslangic": "05.10.2026",
      "Bitis": "05.10.2027",
      "Brut Tutar": 36000.00,
      "Komisyona Esas Net Prim": 31304.35,
      "Komisyon Yuzdesi": 17.5,
      "Hakedilen Komisyon": 5478.26,
      "Kesinti Stopaj": 0.00,
      "Net Odeme Tutari": 5478.26,
      "Durum Aciklama": "TAM ÖDEME"
    },
    {
      "Acentelik No": "340912",
      "Police Numarasi": "ALZ-7749102",
      "Zeyil Sira": 0,
      "Brans Adi": "TRAFİK",
      "Sigortali Ad Soyad": "Mert Güven",
      "TC / Vergi No": "39482019482",
      "Tanzim": "06.10.2026",
      "Baslangic": "06.10.2026",
      "Bitis": "06.10.2027",
      "Brut Tutar": 9200.00,
      "Komisyona Esas Net Prim": 8000.00,
      "Komisyon Yuzdesi": 8.0,
      "Hakedilen Komisyon": 640.00,
      "Kesinti Stopaj": 0.00,
      "Net Odeme Tutari": 640.00,
      "Durum Aciklama": "TAM ÖDEME"
    },
    // ALLIANZ KAÇAK 1: Kasko %17.5 yerine %14.0 uygulanmış!
    {
      "Acentelik No": "340912",
      "Police Numarasi": "ALZ-7749103",
      "Zeyil Sira": 0,
      "Brans Adi": "KASKO",
      "Sigortali Ad Soyad": "Mega Metal Dış Tic.",
      "TC / Vergi No": "6192840192",
      "Tanzim": "09.10.2026",
      "Baslangic": "09.10.2026",
      "Bitis": "09.10.2027",
      "Brut Tutar": 42000.00,
      "Komisyona Esas Net Prim": 36521.74,
      "Komisyon Yuzdesi": 14.0, // <-- HATA: Beklenen %17.5
      "Hakedilen Komisyon": 5113.04, // <-- HATA: Beklenen 6.391,30 TL (Fark: 1.278,26 TL)
      "Kesinti Stopaj": 0.00,
      "Net Odeme Tutari": 5113.04,
      "Durum Aciklama": "TİCARİ FİLO İSKONTOSU KESİNTİSİ"
    },
    // ALLIANZ KAÇAK 2: TSS poliçesinde 350 TL Portföy Yönetim Kesintisi
    {
      "Acentelik No": "340912",
      "Police Numarasi": "ALZ-7749104",
      "Zeyil Sira": 0,
      "Brans Adi": "TSS",
      "Sigortali Ad Soyad": "Hakan Balta",
      "TC / Vergi No": "29481029481",
      "Tanzim": "11.10.2026",
      "Baslangic": "11.10.2026",
      "Bitis": "11.10.2027",
      "Brut Tutar": 14800.00,
      "Komisyona Esas Net Prim": 14095.23,
      "Komisyon Yuzdesi": 18.0,
      "Hakedilen Komisyon": 2537.14,
      "Kesinti Stopaj": 350.00, // <-- HATA: Haksız kesinti
      "Net Odeme Tutari": 2187.14,
      "Durum Aciklama": "ÖZEL PORTFÖY PAYI DÜŞÜLDÜ"
    }
  ];

  const wbAllianz = XLSX.utils.book_new();
  const wsAllianz = XLSX.utils.json_to_sheet(allianzEkstreData);
  XLSX.utils.book_append_sheet(wbAllianz, wsAllianz, "Allianz_Bordro_Ekim_2026");

  // Save to both public and root samples
  [publicSamplesDir, rootSamplesDir].forEach(dir => {
    XLSX.writeFile(wbExpected, path.join(dir, 'acente_beklenen_uretim_2026_10.xlsx'));
    XLSX.writeFile(wbAnadolu, path.join(dir, 'anadolu_sigorta_ekstre_2026_10.xlsx'));
    XLSX.writeFile(wbAllianz, path.join(dir, 'allianz_sigorta_ekstre_2026_10.xlsx'));
    
    // Also CSV versions for testing
    const csvExpected = XLSX.utils.sheet_to_csv(wsExpected);
    const csvAnadolu = XLSX.utils.sheet_to_csv(wsAnadolu);
    const csvAllianz = XLSX.utils.sheet_to_csv(wsAllianz);
    import('fs').then(fs => {
      fs.writeFileSync(path.join(dir, 'acente_beklenen_uretim_2026_10.csv'), csvExpected, 'utf8');
      fs.writeFileSync(path.join(dir, 'anadolu_sigorta_ekstre_2026_10.csv'), csvAnadolu, 'utf8');
      fs.writeFileSync(path.join(dir, 'allianz_sigorta_ekstre_2026_10.csv'), csvAllianz, 'utf8');
    });
  });

  console.log("Sample Excel and CSV files created successfully in /public/samples and /samples!");
}

generateFiles();
