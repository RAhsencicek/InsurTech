import React, { useState, useEffect } from 'react';
import { INSURANCE_COMPANIES } from '../data/mockData';
import { OcrExtractedData, QuotationResult, InsuranceBranch, GuaranteeItem, InstallmentPlan, Customer } from '../types';
import { CustomerSelectorModal } from './CustomerSelectorModal';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard,
  Car,
  HeartPulse,
  Home,
  Building2,
  Share2,
  Printer,
  Copy,
  Check,
  Send,
  Info,
  X,
  FileText,
  Percent,
  Wrench,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Users,
  UserPlus,
  UserCheck,
  Crown,
  Search
} from 'lucide-react';

interface MultiQuoteEngineViewProps {
  initialVehicleData?: OcrExtractedData | null;
  initialBranch?: InsuranceBranch;
  customers?: Customer[];
  onSelectCustomer?: (customer: Customer, branch?: InsuranceBranch) => void;
  onOpenAddCustomerModal?: () => void;
  onPolicyIssued?: (quote: QuotationResult) => void;
}

export const MultiQuoteEngineView: React.FC<MultiQuoteEngineViewProps> = ({
  initialVehicleData,
  initialBranch = 'KASKO',
  customers,
  onSelectCustomer,
  onOpenAddCustomerModal,
  onPolicyIssued
}) => {
  const [selectedBranch, setSelectedBranch] = useState<InsuranceBranch>(initialBranch);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [results, setResults] = useState<QuotationResult[]>([]);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [selectedQuoteForIssue, setSelectedQuoteForIssue] = useState<QuotationResult | null>(null);
  const [selectedQuoteForDetail, setSelectedQuoteForDetail] = useState<QuotationResult | null>(null);
  const [detailModalTab, setDetailModalTab] = useState<'guarantees' | 'installments' | 'assistance' | 'discounts'>('guarantees');
  const [isIssuing, setIsIssuing] = useState<boolean>(false);
  const [issuedSuccess, setIssuedSuccess] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [isCustomerSelectorModalOpen, setIsCustomerSelectorModalOpen] = useState<boolean>(false);

  const vehicle = initialVehicleData || {
    documentKind: 'RUHSAT' as const,
    plateNumber: '34 VR 8920',
    identityNo: '28472910482',
    fullName: 'MEHMET ALİ YILMAZ',
    vehicleBrandModel: 'VOLKSWAGEN TIGUAN 1.5 TSI ACT ELEGANCE DSG',
    modelYear: 2023,
    chassisNo: 'WVGZZZ5NZNW094821',
    engineNo: 'DADA849201',
    registrationDate: '14.04.2023',
    usageType: 'HUSUSİ',
    fuelType: 'BENZİN',
    birthDate: '14.04.1985',
    uavtAddressCode: '2849102841',
    fullAddress: 'İstanbul / Kadıköy, Suadiye Mah. Bağdat Cad. No: 384 D: 12',
    grossSquareMeters: 135,
    confidenceScore: 99.4
  };

  // Branş değiştikçe taban prim ve komisyon hesabı
  const getBranchBasePremium = (branch: InsuranceBranch): { basePrice: number; commRate: number } => {
    switch (branch) {
      case 'KASKO':
        return { basePrice: 18500, commRate: 17.5 };
      case 'TRAFIK':
        return { basePrice: 7200, commRate: 8.0 };
      case 'TSS':
        return { basePrice: 13800, commRate: 18.0 };
      case 'DASK':
        return { basePrice: 1850, commRate: 15.0 };
      case 'KONUT':
        return { basePrice: 4600, commRate: 22.0 };
      case 'ISYERI':
        return { basePrice: 24000, commRate: 20.0 };
      default:
        return { basePrice: 10000, commRate: 15.0 };
    }
  };

  // Zengin Teminat ve Taksit Verisi Üretici
  const generateDeepQuoteData = (branch: InsuranceBranch, compId: string, gross: number) => {
    const installmentPlans: InstallmentPlan[] = [
      { installments: 1, installmentAmount: gross, totalAmount: gross, label: 'Peşin (Tek Çekim)' },
      { installments: 3, installmentAmount: Math.round((gross * 1.02) / 3), totalAmount: Math.round(gross * 1.02), label: '3 Taksit' },
      { installments: 6, installmentAmount: Math.round((gross * 1.04) / 6), totalAmount: Math.round(gross * 1.04), label: '6 Taksit' },
      { installments: 9, installmentAmount: Math.round((gross * 1.06) / 9), totalAmount: Math.round(gross * 1.06), label: '9 Taksit' },
    ];

    let guaranteeItems: GuaranteeItem[] = [];

    if (branch === 'KASKO') {
      guaranteeItems = [
        {
          name: 'İhtiyari Mali Mesuliyet (İMM)',
          limit: compId === 'allianz' || compId === 'anadolu' ? 'Sınırsız (Limitsiz İMM)' : compId === 'sompo' ? '7.500.000 ₺' : '5.000.000 ₺',
          deductible: 'Sıfır Muafiyet (Tam Koruma)',
          status: 'INCLUDED',
          category: 'ANA_TEMINAT'
        },
        {
          name: 'Kasko Kaza / Çarpma / Çarpışma',
          limit: 'Rayiç Değer (%100 Kasko Bedeli)',
          deductible: 'Muafiyetsiz',
          status: 'INCLUDED',
          category: 'ANA_TEMINAT'
        },
        {
          name: 'Yangın & Hırsızlık',
          limit: 'Rayiç Değer',
          deductible: 'Muafiyetsiz',
          status: 'INCLUDED',
          category: 'ANA_TEMINAT'
        },
        {
          name: 'Doğal Afetler (Deprem, Sel, Dolu, Fırtına)',
          limit: 'Rayiç Değer',
          deductible: 'Muafiyetsiz',
          status: 'INCLUDED',
          category: 'ANA_TEMINAT'
        },
        {
          name: 'Orijinal Cam Değişimi',
          limit: 'Yılda 1 Defa Orijinal Cam',
          deductible: 'Hasarsızlık Kademesini Bozmaz',
          status: 'INCLUDED',
          category: 'EK_TEMINAT'
        },
        {
          name: 'İkame Araç Hizmeti',
          limit: compId === 'allianz' ? '2 x 14 Gün (C Segment Otomatik)' : '2 x 7 Gün (C Segment)',
          deductible: '24 Saati Aşan Onarımlarda',
          status: 'INCLUDED',
          category: 'ASISTANS'
        },
        {
          name: '7/24 Sınırsız Çekici & Kurtarma',
          limit: 'Türkiye Geneli Sınırsız Km',
          deductible: 'Ücretsiz Asistans',
          status: 'INCLUDED',
          category: 'ASISTANS'
        },
        {
          name: 'Mini Onarım Hizmeti (Boyasız Göçük / Çizik)',
          limit: 'RS & Auto King Sınırsız',
          deductible: 'Hasar Dosyası Açılmaz',
          status: 'INCLUDED',
          category: 'ASISTANS'
        },
        {
          name: 'Ferdi Kaza Koltuk (Vefat / Sürekli Sakatlık)',
          limit: '250.000 ₺ / Koltuk Başı',
          deductible: 'Muafiyetsiz',
          status: 'INCLUDED',
          category: 'HUKUK_VE_KAZA'
        },
        {
          name: 'Hukuksal Koruma',
          limit: '50.000 ₺',
          deductible: 'Dava Başına',
          status: 'INCLUDED',
          category: 'HUKUK_VE_KAZA'
        },
        {
          name: 'Anahtar Kaybı & Değişimi',
          limit: '25.000 ₺',
          deductible: 'Yılda 1 Defa',
          status: 'INCLUDED',
          category: 'EK_TEMINAT'
        },
        {
          name: 'Kemirgen & Vahşi Hayvan Hasarları',
          limit: 'Rayiç Değer',
          deductible: 'Muafiyetsiz',
          status: 'INCLUDED',
          category: 'ANA_TEMINAT'
        }
      ];
    } else if (branch === 'TRAFIK') {
      guaranteeItems = [
        { name: 'Maddi Hasar (Araç Başına)', limit: '200.000 ₺', deductible: 'Karayolları Kanuni Limit', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Maddi Hasar (Kaza Başına)', limit: '400.000 ₺', deductible: 'Karayolları Kanuni Limit', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Sağlık & Tedavi Gideri (Kişi Başına)', limit: '1.800.000 ₺', deductible: 'SGK ve Tedavi Teminatı', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Vefat & Sakatlık (Kişi Başına)', limit: '1.800.000 ₺', deductible: 'Kanuni Üst Limit', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Kaza Anında Çekici Asistansı', limit: '1.500 ₺ Limitli Çekim', deductible: 'Olay Başına', status: 'INCLUDED', category: 'ASISTANS' },
        { name: 'Sürücü Hukuksal Koruma', limit: '25.000 ₺', deductible: 'Trafik İhtilaflarında', status: 'INCLUDED', category: 'HUKUK_VE_KAZA' }
      ];
    } else if (branch === 'TSS') {
      guaranteeItems = [
        { name: 'Yatarak Tedavi (Ameliyat, Yoğun Bakım, Kemoterapi)', limit: 'Limitsiz (%100 Şirket Karşılar)', deductible: 'Fark Ücreti Alınmaz', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Ayakta Tedavi (Muayene, Tahlil, Röntgen, MR)', limit: compId === 'allianz' ? '10 Muayene / Yıl' : '8-10 Muayene / Yıl', deductible: 'Sadece 15 ₺ SGK Katılımı', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Anlaşmalı Hastane Ağı', limit: compId === 'allianz' || compId === 'anadolu' ? 'Network A VIP (Acıbadem, Memorial, Florence Nightingale)' : 'Network B Geniş Ağ (Medical Park, Medicana, VM)', deductible: 'Türkiye Geneli 650+ Hastane', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Yıllık Kapsamlı Check-up & Kan Tahlili', limit: 'Yılda 1 Kez Ücretsiz', deductible: 'Anlaşmalı Tanı Merkezlerinde', status: 'INCLUDED', category: 'ASISTANS' },
        { name: 'Diş Bakım Paketi (Taş Temizliği & Röntgen)', limit: 'Yılda 1 Kez Ücretsiz', deductible: 'Anlaşmalı Diş Kliniklerinde', status: 'INCLUDED', category: 'ASISTANS' },
        { name: '7/24 Online Doktor & Psikolojik Danışmanlık', limit: 'Sınırsız Görüntülü Görüşme', deductible: 'Mobil Uygulama Üzerinden', status: 'INCLUDED', category: 'ASISTANS' },
        { name: 'Ömür Boyu Yenileme Garantisi (ÖBYG)', limit: '3 Yıl Kesintisiz Poliçe Sonrası', deductible: 'Sonradan Çıkan Hastalıklarda İptal Edilemez', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Fizik Tedavi & Rehabilitasyon', limit: '30 Seans / Yıl', deductible: 'Yatarak Kapsamında', status: 'INCLUDED', category: 'EK_TEMINAT' }
      ];
    } else if (branch === 'DASK') {
      guaranteeItems = [
        { name: 'Zorunlu Deprem Bina Teminatı', limit: '850.000 ₺ (Çevre ve Şehircilik Birim Maliyeti)', deductible: '%2 DASK Resmi Muafiyeti', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Enkaz Kaldırma Masrafları', limit: '34.000 ₺ (%4 Kanuni Oran)', deductible: 'Resmi Tarife', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Deprem Sonucu Yangın & Tsunami', limit: 'Bina Bedeline Kadar', deductible: 'DASK Resmi Güvencesi', status: 'INCLUDED', category: 'ANA_TEMINAT' }
      ];
    } else if (branch === 'KONUT') {
      guaranteeItems = [
        { name: 'Yangın, Yıldırım, İnfilak (Bina & Eşya)', limit: '2.800.000 ₺', deductible: 'Muafiyetsiz', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Ev Eşyası & Hırsızlık Güvencesi', limit: '450.000 ₺', deductible: 'Yeni Değerine Göre Ödeme', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Dahili Su & Su Baskını / Sızıntı', limit: '300.000 ₺', deductible: 'Muafiyetsiz', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'İzolasyon Eksikliği Hasarları', limit: '50.000 ₺', deductible: 'Olay Başına', status: 'INCLUDED', category: 'EK_TEMINAT' },
        { name: 'Cam Kırılması', limit: '40.000 ₺', deductible: 'Muafiyetsiz', status: 'INCLUDED', category: 'EK_TEMINAT' },
        { name: 'Komşuluk & Kiracı Mali Sorumluluk', limit: '200.000 ₺', deductible: 'Muafiyetsiz', status: 'INCLUDED', category: 'HUKUK_VE_KAZA' },
        { name: 'Enflasyon Koruma Klozu', limit: '%45 Endeksli Değer Artışı', deductible: 'Yıl Boyu Otomatik Güncelleme', status: 'INCLUDED', category: 'EK_TEMINAT' },
        { name: 'Acil Ev Asistansı (Çilingir, Su & Elektrik Tesisatı)', limit: '3 x 1.500 ₺ / Yıl', deductible: 'Ücretsiz Çağrı', status: 'INCLUDED', category: 'ASISTANS' }
      ];
    } else {
      guaranteeItems = [
        { name: 'Yangın, Yıldırım, İnfilak (Bina & Emtia)', limit: '4.500.000 ₺', deductible: 'Muafiyetsiz', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Hırsızlık & Kasa Güvencesi', limit: '800.000 ₺', deductible: 'Mesai İçi ve Dışı Koruma', status: 'INCLUDED', category: 'ANA_TEMINAT' },
        { name: 'Üçüncü Şahıs Mali Mesuliyet', limit: '1.500.000 ₺', deductible: 'Müşteri & Ziyaretçi Güvencesi', status: 'INCLUDED', category: 'HUKUK_VE_KAZA' },
        { name: 'İşveren Mali Mesuliyet (İş Kazası)', limit: '1.500.000 ₺', deductible: 'SGK Rücu Talepleri Dahil', status: 'INCLUDED', category: 'HUKUK_VE_KAZA' },
        { name: 'İş Durması & Kar Kaybı', limit: '400.000 ₺', deductible: 'Yangın ve Afet Sonrası', status: 'INCLUDED', category: 'EK_TEMINAT' },
        { name: 'Makine Kırılması & Elektronik Cihaz', limit: '250.000 ₺', deductible: '%10 Muafiyetli', status: 'INCLUDED', category: 'EK_TEMINAT' },
        { name: 'Cam & Işıklı Tabela Kırılması', limit: '75.000 ₺', deductible: 'Muafiyetsiz', status: 'INCLUDED', category: 'EK_TEMINAT' }
      ];
    }

    const discountsApplied = [
      'Meslek Grubu Özel İndirimi (%10 Uygulandı)',
      'Tramer Hasarsızlık Kademesi İndirimi (%40)',
      'Acente Çoklu Poliçe Sadakat İndirimi (%5)'
    ];

    return {
      installmentPlans,
      guaranteeItems,
      discountsApplied,
      immLimit: branch === 'KASKO' ? (compId === 'allianz' ? 'Sınırsız İMM' : '7.500.000 ₺') : undefined,
      replacementVehicleDays: branch === 'KASKO' ? (compId === 'allianz' ? 14 : 7) : undefined,
      serviceType: compId === 'quick' ? 'Anlaşmalı Özel Servisler' : 'Tüm Yetkili ve Özel Servisler (Muafiyetsiz)',
      glassDeductible: 'Orijinal Cam Muafiyetsiz',
      hospitalNetworkName: branch === 'TSS' ? (compId === 'allianz' ? 'Network A VIP (Acıbadem / Memorial Dahil)' : 'Network B Geniş Ağ') : undefined,
      outpatientVisits: branch === 'TSS' ? (compId === 'allianz' ? 10 : 8) : undefined
    };
  };

  // Asenkron Teklif Toplama Simülatörü
  const startQuotationRace = () => {
    setIsFetching(true);
    setResults([]);
    setCompletedCount(0);
    setElapsedMs(0);
    setIssuedSuccess(false);
    setSelectedQuoteForIssue(null);
    setSelectedQuoteForDetail(null);

    const startTime = Date.now();

    const timer = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 50);

    const { basePrice, commRate } = getBranchBasePremium(selectedBranch);
    let finished = 0;

    INSURANCE_COMPANIES.forEach((comp) => {
      const delay = comp.simulatedDelayMs + Math.floor(Math.random() * 400) - 200;
      const multiplier = comp.branchMultipliers[selectedBranch] || 1.0;

      setTimeout(() => {
        const rawNet = Math.round(basePrice * multiplier + (Math.random() * 300 - 150));
        const gross = Math.round(rawNet * 1.05); // BSMV / Fonlar
        const commAmt = Math.round((rawNet * commRate) / 100);

        const deepData = generateDeepQuoteData(selectedBranch, comp.id, gross);

        const newQuote: QuotationResult = {
          companyId: comp.id,
          companyName: comp.name,
          color: comp.color,
          quoteNo: `${comp.code}-${Math.floor(100000 + Math.random() * 900000)}`,
          branch: selectedBranch,
          netPremium: rawNet,
          grossPremium: gross,
          commissionRate: commRate,
          commissionAmount: commAmt,
          coverageDetails: comp.branchGuarantees[selectedBranch] || ['Standart Teminat'],
          installmentPlans: deepData.installmentPlans,
          guaranteeItems: deepData.guaranteeItems,
          discountsApplied: deepData.discountsApplied,
          immLimit: deepData.immLimit,
          replacementVehicleDays: deepData.replacementVehicleDays,
          serviceType: deepData.serviceType,
          glassDeductible: deepData.glassDeductible,
          hospitalNetworkName: deepData.hospitalNetworkName,
          outpatientVisits: deepData.outpatientVisits,
          responseTimeMs: delay,
          status: 'COMPLETED'
        };

        setResults((prev) => {
          const updated = [...prev, newQuote];
          const sorted = [...updated].sort((a, b) => a.grossPremium - b.grossPremium);
          const minPriceId = sorted[0]?.companyId;
          return updated.map((q) => ({
            ...q,
            isBestPrice: q.companyId === minPriceId,
            isBestCoverage: q.companyId === 'allianz' || q.companyId === 'anadolu'
          }));
        });

        finished++;
        setCompletedCount(finished);

        if (finished === INSURANCE_COMPANIES.length) {
          clearInterval(timer);
          setIsFetching(false);
        }
      }, delay);
    });
  };

  useEffect(() => {
    if (initialBranch) {
      setSelectedBranch(initialBranch);
    }
  }, [initialBranch]);

  useEffect(() => {
    startQuotationRace();
  }, [selectedBranch]);

  const handleIssuePolicy = (quote: QuotationResult) => {
    setSelectedQuoteForIssue(quote);
    setIsIssuing(true);

    setTimeout(() => {
      setIsIssuing(false);
      setIssuedSuccess(true);
      setSelectedQuoteForDetail(null);

      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (onPolicyIssued) {
        onPolicyIssued(quote);
      }
    }, 1400);
  };

  const generateWhatsAppSummary = (): string => {
    const sorted = [...results].sort((a, b) => a.grossPremium - b.grossPremium);
    const best = sorted[0];
    const top3 = sorted.slice(0, 3);

    let text = `Sayın ${vehicle.fullName},\n\n`;
    text += `🛡️ *Hayat İşleri Sigorta & Brokerlık*\n`;
    text += `12 Sigorta Şirketinden *${selectedBranch}* Teklifleriniz Hazırlandı:\n\n`;

    top3.forEach((q, idx) => {
      text += `${idx + 1}. *${q.companyName}*\n`;
      text += `   • Fiyat: *${q.grossPremium.toLocaleString('tr-TR')} ₺*\n`;
      text += `   • Teklif No: ${q.quoteNo}\n`;
      text += `   • Teminatlar: ${q.coverageDetails.slice(0, 2).join(', ')}\n\n`;
    });

    if (best) {
      text += `⭐ *En Uygun Seçenek:* ${best.companyName} (${best.grossPremium.toLocaleString('tr-TR')} ₺)\n`;
    }
    text += `Poliçenizi anında başlatmak ve taksit seçenekleri için bizimle iletişime geçebilirsiniz.`;

    return text;
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(generateWhatsAppSummary());
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const matchedCustomer = customers?.find(c => c.identityNo === vehicle.identityNo) || (customers && customers.length > 0 ? customers[0] : null);

  return (
    <div className="space-y-6">
      {/* Hızlı Müşteri Seçici & Portföy Barı (Gelişmiş Yönetici Kartı) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div 
            onClick={() => setIsCustomerSelectorModalOpen(true)}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              {matchedCustomer?.type === 'CORPORATE' ? 'FİLO' : (matchedCustomer?.fullName || vehicle.fullName).substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Teklif Hazırlanan Portföy Müşterisi</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {matchedCustomer?.fullName || vehicle.fullName}
                </span>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                  TCKN: {matchedCustomer?.identityNo || vehicle.identityNo}
                </span>
                {matchedCustomer?.isVip && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Crown className="w-3 h-3 text-amber-600" />
                    <span>VIP</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-slate-200 mx-1" />

          {/* Atanmış MT & Varlık Rozeti */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl flex items-center space-x-1.5 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bağlı MT: <strong className="text-indigo-900">{matchedCustomer?.assignedStaffName || 'Ece Karaca'}</strong></span>
            </span>

            {matchedCustomer?.plateNumber && (
              <span className="text-slate-700 font-mono font-bold bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl flex items-center space-x-1 text-[11px]">
                <Car className="w-3.5 h-3.5 text-blue-600" />
                <span>{matchedCustomer.plateNumber}</span>
              </span>
            )}
          </div>
        </div>

        {/* Büyük Seçici Dialog Açma & Yeni Müşteri Butonları */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsCustomerSelectorModalOpen(true)}
            className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 text-slate-300" />
            <span>Müşteri Değiştir / Portföyde Ara</span>
            <span className="bg-slate-700 text-slate-200 text-[10px] px-2 py-0.5 rounded font-mono">
              {customers?.length || 8} Müşteri
            </span>
          </button>

          {onOpenAddCustomerModal && (
            <button
              type="button"
              onClick={onOpenAddCustomerModal}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-600" />
              <span>+ Yeni Müşteri</span>
            </button>
          )}
        </div>
      </div>

      {/* Üst Bilgi Barı: Sigortalı & Varlık Özeti */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-black text-sm shrink-0">
            {selectedBranch === 'KASKO' || selectedBranch === 'TRAFIK' ? (
              <Car className="w-6 h-6 text-blue-600" />
            ) : selectedBranch === 'TSS' ? (
              <HeartPulse className="w-6 h-6 text-emerald-600" />
            ) : selectedBranch === 'DASK' || selectedBranch === 'KONUT' ? (
              <Home className="w-6 h-6 text-amber-600" />
            ) : (
              <Building2 className="w-6 h-6 text-purple-600" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">{vehicle.fullName}</h2>
              <span className="text-[11px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                TCKN: {vehicle.identityNo}
              </span>
              <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold">
                {selectedBranch}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedBranch === 'KASKO' || selectedBranch === 'TRAFIK' ? (
                <>Plaka: <strong className="text-slate-800 font-mono">{vehicle.plateNumber || '34 VR 8920'}</strong> • {vehicle.vehicleBrandModel || 'Volkswagen Tiguan 1.5 TSI'} (2023)</>
              ) : selectedBranch === 'TSS' ? (
                <>Doğum: <strong>{vehicle.birthDate || '18.06.1989'}</strong> • Network A VIP Ağı • Yatarak Limitsiz + 10 Ayakta</>
              ) : selectedBranch === 'DASK' || selectedBranch === 'KONUT' ? (
                <>10 Haneli UAVT: <strong className="text-blue-700 font-mono">{vehicle.uavtAddressCode || '2849102841'}</strong> • {vehicle.fullAddress || 'Kadıköy Suadiye Mah. 135 m²'}</>
              ) : (
                <>Ticari İşyeri: <strong>Teknokent Ar-Ge Ofisi & Laboratuvar</strong> • Yangın & Mali Mesuliyet</>
              )}
            </p>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex items-center space-x-2">
          <button
            onClick={startQuotationRace}
            disabled={isFetching}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Yeniden Topla</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            disabled={results.length === 0}
            className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-300 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Teklif Paylaş (WhatsApp / PDF)</span>
          </button>
        </div>
      </div>

      {/* 6 Sigorta Branşı Seçim Barı */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 uppercase px-2 shrink-0">Branş:</span>
          
          <button
            onClick={() => setSelectedBranch('KASKO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer ${
              selectedBranch === 'KASKO'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Genişletilmiş Kasko</span>
          </button>

          <button
            onClick={() => setSelectedBranch('TRAFIK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer ${
              selectedBranch === 'TRAFIK'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zorunlu Trafik</span>
          </button>

          <button
            onClick={() => setSelectedBranch('TSS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer ${
              selectedBranch === 'TSS'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Tamamlayıcı Sağlık (TSS)</span>
          </button>

          <button
            onClick={() => setSelectedBranch('DASK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer ${
              selectedBranch === 'DASK'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>DASK (Deprem)</span>
          </button>

          <button
            onClick={() => setSelectedBranch('KONUT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer ${
              selectedBranch === 'KONUT'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Konut Paket</span>
          </button>

          <button
            onClick={() => setSelectedBranch('ISYERI')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer ${
              selectedBranch === 'ISYERI'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>İşyeri / KOBİ</span>
          </button>
        </div>
      </div>

      {/* Yarış Durum Göstergesi */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Zap className={`w-4 h-4 ${isFetching ? 'text-amber-500 animate-pulse' : 'text-blue-600'}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                {isFetching ? 'Teklifler Canlı Taranıyor...' : 'Tüm Şirket Teklifleri Toplandı'}
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full font-bold">
                {completedCount} / {INSURANCE_COMPANIES.length} Şirket
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Teklif satırına veya <span className="font-semibold text-blue-600">"Teminat Detayı"</span> butonuna tıklayarak kapsamı ve taksit dökümünü inceleyebilirsiniz.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div 
              className="bg-blue-600 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${(completedCount / INSURANCE_COMPANIES.length) * 100}%` }}
            ></div>
          </div>
          <div className="h-7 w-px bg-slate-300"></div>
          <div>
            <span className="text-[10px] text-slate-500 block font-semibold">Toplam Süre</span>
            <span className="text-sm font-black text-emerald-700 font-mono">
              {(elapsedMs / 1000).toFixed(2)} sn
            </span>
          </div>
        </div>
      </div>

      {/* Teklif Karşılaştırma Listesi (Borsa Tahtası) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Gelen Canlı Teklifler ({results.length})
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Fiyata göre en uygun olan en üstte listelenir • Tıklayarak detayları açın
          </span>
        </div>

        {results.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-xs font-bold text-slate-800">Sigorta Şirketleri {selectedBranch} Teklifi Hazırlıyor...</div>
            <div className="text-[11px] text-slate-500">Milisaniyeler içinde ekran kilitlenmeden fiyatlar dökülecek.</div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {results
              .sort((a, b) => a.grossPremium - b.grossPremium)
              .map((quote) => (
                <div
                  key={quote.companyId}
                  onClick={() => setSelectedQuoteForDetail(quote)}
                  className={`p-4 transition-all hover:bg-slate-50/90 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group ${
                    quote.isBestPrice ? 'bg-emerald-50/30 border-l-4 border-l-emerald-600' : ''
                  }`}
                >
                  {/* Şirket ve Teklif No */}
                  <div className="flex items-start space-x-3.5 min-w-[240px]">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0 shadow-sm"
                      style={{ backgroundColor: quote.color }}
                    >
                      {quote.companyName.substring(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {quote.companyName}
                        </span>
                        {quote.isBestPrice && (
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded uppercase">
                            En Uygun Fiyat
                          </span>
                        )}
                        {quote.isBestCoverage && (
                          <span className="text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-300 px-1.5 py-0.5 rounded uppercase">
                            Geniş Teminat
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono mt-0.5">
                        <span>Teklif No: {quote.quoteNo}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">{quote.responseTimeMs} ms</span>
                      </div>
                    </div>
                  </div>

                  {/* Teminatlar */}
                  <div className="hidden lg:flex flex-wrap gap-1.5 max-w-md">
                    {quote.coverageDetails.map((cov, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {cov}
                      </span>
                    ))}
                  </div>

                  {/* Prim, Komisyon ve Butonlar */}
                  <div className="flex items-center space-x-4 shrink-0 justify-between md:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Toplam Prim</span>
                      <span className="text-base font-black text-slate-900 font-mono">
                        {quote.grossPremium.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Acente Komisyonu</span>
                      <span className="text-xs font-bold text-emerald-700 font-mono">
                        {quote.commissionAmount.toLocaleString('tr-TR')} ₺ (%{quote.commissionRate})
                      </span>
                    </div>

                    {/* Teminat Detayı Butonu */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuoteForDetail(quote);
                      }}
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs flex items-center space-x-1"
                    >
                      <Info className="w-3.5 h-3.5 text-blue-600" />
                      <span>Detayları Gör</span>
                    </button>

                    {/* Poliçeleştir Butonu */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIssuePolicy(quote);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                    >
                      <span>Poliçeleştir</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* TEKLİF DETAY VE TEMİNAT MODALI (DETAYLI İNCELEME) */}
      {selectedQuoteForDetail && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Modal Başlığı */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3.5">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm shrink-0"
                  style={{ backgroundColor: selectedQuoteForDetail.color }}
                >
                  {selectedQuoteForDetail.companyName.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-black text-slate-900">{selectedQuoteForDetail.companyName}</h3>
                    <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                      {selectedQuoteForDetail.quoteNo}
                    </span>
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold">
                      {selectedQuoteForDetail.branch}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Müşteri: <strong className="text-slate-800">{vehicle.fullName}</strong> ({vehicle.identityNo}) • Geçerlilik: 15 Gün
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedQuoteForDetail(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Üst Prim & Komisyon Özet Kartı */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Net Prim</span>
                <span className="text-sm font-black text-slate-800 font-mono">
                  {selectedQuoteForDetail.netPremium.toLocaleString('tr-TR')} ₺
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Vergi & Fonlar (BSMV)</span>
                <span className="text-sm font-black text-slate-800 font-mono">
                  {(selectedQuoteForDetail.grossPremium - selectedQuoteForDetail.netPremium).toLocaleString('tr-TR')} ₺
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Toplam Brüt Prim</span>
                <span className="text-base font-black text-blue-700 font-mono">
                  {selectedQuoteForDetail.grossPremium.toLocaleString('tr-TR')} ₺
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Acente Komisyonu</span>
                <span className="text-sm font-black text-emerald-700 font-mono">
                  {selectedQuoteForDetail.commissionAmount.toLocaleString('tr-TR')} ₺ (%{selectedQuoteForDetail.commissionRate})
                </span>
              </div>
            </div>

            {/* Sekmeler: Teminatlar, Taksitler, Onarım & Asistans, İndirimler */}
            <div className="border-b border-slate-200 flex space-x-2">
              <button
                onClick={() => setDetailModalTab('guarantees')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  detailModalTab === 'guarantees'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Teminat Kapsamı & Limitler ({selectedQuoteForDetail.guaranteeItems?.length || 0})
              </button>

              <button
                onClick={() => setDetailModalTab('installments')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  detailModalTab === 'installments'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Ödeme & Taksit Seçenekleri
              </button>

              <button
                onClick={() => setDetailModalTab('assistance')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  detailModalTab === 'assistance'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Onarım Şartları & Asistans Ağı
              </button>

              <button
                onClick={() => setDetailModalTab('discounts')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  detailModalTab === 'discounts'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Uygulanan İndirimler
              </button>
            </div>

            {/* SEKME 1: Teminatlar & Limitler Tablosu */}
            {detailModalTab === 'guarantees' && (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="py-2.5 px-3 font-bold">Teminat Adı</th>
                      <th className="py-2.5 px-3 font-bold">Teminat Limiti</th>
                      <th className="py-2.5 px-3 font-bold">Muafiyet Şartı</th>
                      <th className="py-2.5 px-3 font-bold text-center">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedQuoteForDetail.guaranteeItems || []).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          {item.name}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-800">
                          {item.limit}
                        </td>
                        <td className="py-2 px-3 text-slate-500 text-[11px]">
                          {item.deductible || 'Muafiyetsiz'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                            <Check className="w-3 h-3" />
                            <span>Dahil</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SEKME 2: Taksit Seçenekleri Tablosu */}
            {detailModalTab === 'installments' && (
              <div className="space-y-3 max-h-[380px] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(selectedQuoteForDetail.installmentPlans || []).map((plan, idx) => (
                    <div 
                      key={idx}
                      className="border border-slate-200 hover:border-blue-500 rounded-xl p-4 bg-slate-50/50 hover:bg-blue-50/30 transition-all flex justify-between items-center"
                    >
                      <div>
                        <span className="text-xs font-black text-slate-900 block">{plan.label}</span>
                        <span className="text-[11px] text-slate-500">
                          {plan.installments === 1 ? 'Tek Çekim Komisyonsuz' : `${plan.installments} Eşit Taksit`}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900 font-mono">
                          {plan.installmentAmount.toLocaleString('tr-TR')} ₺ <span className="text-[10px] font-normal text-slate-500">/ ay</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Toplam: {plan.totalAmount.toLocaleString('tr-TR')} ₺
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start space-x-2">
                  <CreditCard className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">Anlaşmalı Banka Kartları:</span> Maximum, World, Bonus, Axess, CardFinans ve Paraf ile 9 taksite kadar vade farksız çekim imkanı.
                  </div>
                </div>
              </div>
            )}

            {/* SEKME 3: Onarım Şartları & Asistans Ağı */}
            {detailModalTab === 'assistance' && (
              <div className="space-y-3 max-h-[380px] overflow-y-auto text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    <span>Onarım Servisi & Yedek Parça Şartnamesi</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>Servis Tercihi:</strong> {selectedQuoteForDetail.serviceType || 'Tüm Yetkili ve Özel Servisler'}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>Yedek Parça Garantisi:</strong> Onarımlarda %100 orijinal üretici parçaları kullanılır. Cam kırılmalarında yılda 1 kez orijinal logolu cam muafiyetsiz temin edilir.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold">
                    <Car className="w-4 h-4 text-blue-600" />
                    <span>İkame Araç & Çekici Hizmetleri</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>İkame Araç Süresi:</strong> Kaza durumunda 24 saati aşan onarımlarda yılda 2 defa {selectedQuoteForDetail.replacementVehicleDays || 7} güne kadar C segment otomatik vites ikame araç adrese teslim edilir.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>7/24 Yol Yardım:</strong> Arıza ve kaza hallerinde sınırsız çekici, yerinde lastik değişimi ve benzin bitiminde akaryakıt temini sağlanır.
                  </p>
                </div>
              </div>
            )}

            {/* SEKME 4: Uygulanan İndirimler */}
            {detailModalTab === 'discounts' && (
              <div className="space-y-3 max-h-[380px] overflow-y-auto text-xs">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                    Bu Teklifte Sağlanan Özel İndirimler:
                  </span>
                  <div className="space-y-2">
                    {(selectedQuoteForDetail.discountsApplied || []).map((disc, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
                        <Percent className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold">{disc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Alt Aksiyon Butonları */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>WhatsApp ile Paylaş</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Resmi Teklif Formu (PDF)</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedQuoteForDetail(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Kapat
                </button>

                <button
                  type="button"
                  onClick={() => handleIssuePolicy(selectedQuoteForDetail)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Bu Şirketten Poliçeleştir ({selectedQuoteForDetail.grossPremium.toLocaleString('tr-TR')} ₺)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Müşteriye Gönder (WhatsApp & PDF) Modalı */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Başlık */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-emerald-700">
                <Share2 className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-slate-900">{selectedBranch} Teklif Raporu & WhatsApp Paylaşımı</h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                Kapat
              </button>
            </div>

            {/* Antetli Teklif Özeti */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-xs">
                <div>
                  <span className="font-extrabold text-slate-900">Hayat İşleri Sigorta & Brokerlık</span>
                  <div className="text-[11px] text-slate-500">{selectedBranch} Karşılaştırma Formu</div>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-500">
                  <span>Tarih: {new Date().toLocaleDateString('tr-TR')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Sigortalı</span>
                  <span className="font-bold text-slate-900">{vehicle.fullName}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Branş & Konu</span>
                  <span className="font-bold text-slate-900">
                    {selectedBranch === 'KASKO' || selectedBranch === 'TRAFIK' ? vehicle.plateNumber : selectedBranch}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Mesaj Şablonu Önizleme */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Hazır WhatsApp Müşteri Mesajı:
              </label>
              <textarea
                rows={9}
                readOnly
                value={generateWhatsAppSummary()}
                className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl p-3.5 text-xs text-slate-800 font-mono leading-relaxed focus:outline-none"
              />
            </div>

            {/* Aksiyon Butonları */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>PDF Olarak Yazdır</span>
              </button>

              <button
                onClick={handleCopyWhatsApp}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>WhatsApp Metni Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Metni Kopyala & WhatsApp'ta Aç</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Poliçe Onay Başarı Modalı */}
      {issuedSuccess && selectedQuoteForIssue && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Poliçe Başarıyla Kesildi!</h3>
              <p className="text-xs text-slate-500 mt-1">
                <strong className="text-slate-800">{selectedQuoteForIssue.companyName}</strong> üzerinden {selectedBranch} poliçesi tanzim edildi ve portföye kaydedildi.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Poliçe Numarası:</span>
                <span className="font-mono font-bold text-slate-900">{selectedQuoteForIssue.quoteNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Toplam Prim:</span>
                <span className="font-mono font-bold text-slate-900">{selectedQuoteForIssue.grossPremium.toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Kazanılan Komisyon:</span>
                <span className="font-mono">+{selectedQuoteForIssue.commissionAmount.toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIssuedSuccess(false);
                setSelectedQuoteForIssue(null);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
            >
              Tamam, Portföye Dön
            </button>
          </div>
        </div>
      )}

      {/* Büyük Müşteri Seçim ve Portföy Arama Modalı */}
      <CustomerSelectorModal
        isOpen={isCustomerSelectorModalOpen}
        onClose={() => setIsCustomerSelectorModalOpen(false)}
        customers={customers || []}
        activeCustomerId={matchedCustomer?.id}
        onSelectCustomer={onSelectCustomer || (() => {})}
        onOpenAddCustomerModal={onOpenAddCustomerModal}
      />
    </div>
  );
};
