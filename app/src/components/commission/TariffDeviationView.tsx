import React, { useState } from 'react';
import { 
  BadgePercent, 
  TrendingDown, 
  ArrowRight, 
  Download, 
  FileText, 
  Mail, 
  Zap, 
  CheckCircle2, 
  HelpCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { CommissionLeakageItem } from '../../types';

interface TariffDeviationViewProps {
  onBackToOverview?: () => void;
  onOpenReportModal: () => void;
  onOpenEmailModal: () => void;
  onExportCsv: () => void;
}

export const TariffDeviationView: React.FC<TariffDeviationViewProps> = ({
  onBackToOverview,
  onOpenReportModal,
  onOpenEmailModal,
  onExportCsv
}) => {
  const [isRunningScenario, setIsRunningScenario] = useState(false);
  const [scenarioExecuted, setScenarioExecuted] = useState(true);

  const handleRunScenario = () => {
    setIsRunningScenario(true);
    setTimeout(() => {
      setIsRunningScenario(false);
      setScenarioExecuted(true);
    }, 800);
  };

  // 50 Doktor Poliçesi Mock Satırları (Örnekleme)
  const tariffItems: (CommissionLeakageItem & { campaignCode: string })[] = [
    {
      id: 'doc_1',
      policyNo: '3301-8491028-0',
      endorsementNo: '0',
      companyName: 'Allianz Sigorta',
      customerName: 'Prof. Dr. Metin Ergün & Kadıköy Tıp Grubu',
      branch: 'Genişletilmiş Kasko (Doktor)',
      grossPremium: 10000,
      contractCommissionRate: 18.0,
      expectedCommission: 1800,
      appliedCommissionRate: 12.0,
      receivedCommission: 1200,
      leakageAmount: 600,
      errorReason: 'TARIFE_HATASI',
      detectedAt: '2026-10-21',
      campaignCode: 'IND-DOKTOR-2026',
      explanation: 'Özel hekim meslek protokolü sözleşmesinde %18 tanımlıyken genel merkez ekranı %12 uygulamış.'
    },
    {
      id: 'doc_2',
      policyNo: '3301-8491029-0',
      endorsementNo: '0',
      companyName: 'Allianz Sigorta',
      customerName: 'Op. Dr. Berna Ceylan',
      branch: 'Genişletilmiş Kasko (Doktor)',
      grossPremium: 10000,
      contractCommissionRate: 18.0,
      expectedCommission: 1800,
      appliedCommissionRate: 12.0,
      receivedCommission: 1200,
      leakageAmount: 600,
      errorReason: 'TARIFE_HATASI',
      detectedAt: '2026-10-21',
      campaignCode: 'IND-DOKTOR-2026',
      explanation: 'Sistem kampanya klozunu tanımamış, standart kasko tarifesine düşürmüş.'
    },
    {
      id: 'doc_3',
      policyNo: '3301-8491030-0',
      endorsementNo: '0',
      companyName: 'Allianz Sigorta',
      customerName: 'Uzm. Dr. Kaan Aksoy',
      branch: 'Genişletilmiş Kasko (Doktor)',
      grossPremium: 10000,
      contractCommissionRate: 18.0,
      expectedCommission: 1800,
      appliedCommissionRate: 12.0,
      receivedCommission: 1200,
      leakageAmount: 600,
      errorReason: 'TARIFE_HATASI',
      detectedAt: '2026-10-21',
      campaignCode: 'IND-DOKTOR-2026',
      explanation: 'Acente protokol zeyli ekstreye yansıtılmamış.'
    },
    {
      id: 'doc_4',
      policyNo: '3301-8491031-0',
      endorsementNo: '0',
      companyName: 'Allianz Sigorta',
      customerName: 'Doç. Dr. Zeynep Bilgin',
      branch: 'Genişletilmiş Kasko (Doktor)',
      grossPremium: 10000,
      contractCommissionRate: 18.0,
      expectedCommission: 1800,
      appliedCommissionRate: 12.0,
      receivedCommission: 1200,
      leakageAmount: 600,
      errorReason: 'TARIFE_HATASI',
      detectedAt: '2026-10-21',
      campaignCode: 'IND-DOKTOR-2026',
      explanation: 'Şirket muhasebe havuzunda %6 komisyon kesintisi yapılmış.'
    },
    {
      id: 'doc_bulk',
      policyNo: '3301-8491032 ~ 078 (46 Poliçe)',
      endorsementNo: '0',
      companyName: 'Allianz Sigorta',
      customerName: 'Doktorlar Odası Toplu Kasko Portföyü (46 Hekim)',
      branch: 'Genişletilmiş Kasko (Doktor)',
      grossPremium: 460000,
      contractCommissionRate: 18.0,
      expectedCommission: 82800,
      appliedCommissionRate: 12.0,
      receivedCommission: 55200,
      leakageAmount: 27600,
      errorReason: 'TARIFE_HATASI',
      detectedAt: '2026-10-21',
      campaignCode: 'IND-DOKTOR-2026',
      explanation: 'Aynı gruptaki 46 doktor poliçesinin tamamında %18 yerine %12 komisyon kesilmiş.'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. ÜST BREADCRUMB VE BAŞLIK */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 mb-1">
              <button
                type="button"
                onClick={onBackToOverview}
                className="hover:text-blue-700 transition-colors cursor-pointer flex items-center space-x-1"
                title="Genel Bakış ekranına dön"
              >
                <span>← Otonom Komisyon Avcısı</span>
              </button>
              <span>/</span>
              <span className="text-blue-700">Tarife ve Oran Sapmaları</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Tarife ve Oran Sapmaları
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Poliçede ve acentelik sözleşmesinde olması gereken komisyon oranı ile şirketin uyguladığı oran arasındaki farkları yakalayın.
            </p>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleRunScenario}
              disabled={isRunningScenario}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isRunningScenario ? 'Hesaplanıyor...' : 'Senaryoyu Çalıştır'}</span>
            </button>

            <button
              onClick={onExportCsv}
              className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>CSV İndir</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>İtiraz Raporu (PDF)</span>
            </button>

            <button
              onClick={onOpenEmailModal}
              className="flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>E-Posta Taslağı</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. BÜYÜK FARK VE BEKLENEN / GERÇEKLEŞEN KARŞILAŞTIRMA KARTI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sol 1 Kolon: Büyük Tespit Tutarı */}
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-white border-2 border-blue-200 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
              Tespit Edilen Toplam Fark
            </span>
            <div className="text-3xl font-black text-blue-700 font-mono tracking-tight">
              30.000 ₺
            </div>
            <p className="text-xs text-slate-500 pt-1">
              Doktor Meslek Protokolü Kampanyası (50 Poliçe)
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-blue-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Etkilenen Poliçe:</span>
              <span className="font-bold text-slate-900 font-mono">50 Adet</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Poliçe Başına Fark:</span>
              <span className="font-bold text-blue-700 font-mono">600 ₺</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Kampanya Klozu:</span>
              <span className="font-mono text-[11px] bg-blue-100 text-blue-800 px-1.5 rounded">IND-DOKTOR-2026</span>
            </div>
          </div>
        </div>

        {/* Sağ 2 Kolon: Beklenen vs Gerçekleşen Karşılaştırma Alanı */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Beklenen Sözleşme Oranı vs Şirketin Uyguladığı Oran
            </h3>
            <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded">
              %6 Sapma Saptandı
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {/* Sözleşme Oranı */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Sözleşme Oranı</span>
              <div className="text-2xl font-black text-emerald-700 font-mono">%18.0</div>
              <span className="text-[10px] text-slate-500">Acentelik sözleşmesi kloz hakkı</span>
            </div>

            {/* Uygulanan Oran */}
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
              <span className="text-[10px] text-rose-800 font-bold uppercase block">Şirketin Uyguladığı</span>
              <div className="text-2xl font-black text-rose-700 font-mono">%12.0</div>
              <span className="text-[10px] text-slate-500">Ekstreye yansıyan hatalı oran</span>
            </div>

            {/* Net Kayıp Oranı */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-600 font-bold uppercase block">Oran Farkı (Kayıp)</span>
              <div className="text-2xl font-black text-slate-900 font-mono">-%6.0</div>
              <span className="text-[10px] text-slate-500">Poliçe başına %6 eksik ödeme</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Senaryo Teşhisi:</strong> Kadıköy Acentesi, anlaşmalı hekim odasıyla yaptığı protokol uyarınca 50 doktora kasko kesmiştir. Şirket muhasebe sistemi kampanya kodunu kloz tablosuna işlemediği için standart komisyon oranı olan %12'yi uygulamış ve <strong>30.000 ₺</strong> eksik hakediş üretmiştir.
            </p>
          </div>
        </div>
      </div>

      {/* 3. DETAY TABLOSU: TARİFE SAPMASI YAŞANAN POLİÇELER */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BadgePercent className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Uyuşmazlık Konusu Poliçeler (50 Kayıt)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Kloz: IND-DOKTOR-2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Poliçe No</th>
                <th className="p-3">Müşteri / Doktor</th>
                <th className="p-3">Şirket</th>
                <th className="p-3 text-right">Prim</th>
                <th className="p-3 text-center">Sözleşme</th>
                <th className="p-3 text-center">Uygulanan</th>
                <th className="p-3 text-right text-blue-700">Eksik Komisyon</th>
                <th className="p-3">Kloz / Kampanya</th>
                <th className="p-3">Açıklama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tariffItems.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {item.policyNo}
                  </td>
                  <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">
                    {item.customerName}
                  </td>
                  <td className="p-3 text-slate-600 whitespace-nowrap">{item.companyName}</td>
                  <td className="p-3 text-right font-mono text-slate-900 whitespace-nowrap">
                    {item.grossPremium.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-emerald-700">
                    %{item.contractCommissionRate}
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-rose-700">
                    %{item.appliedCommissionRate}
                  </td>
                  <td className="p-3 text-right font-mono font-black text-blue-700 whitespace-nowrap">
                    +{item.leakageAmount.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {item.campaignCode}
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-slate-500 max-w-xs truncate">
                    {item.explanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. "BU MODÜL NEYİ ÇÖZÜYOR?" BİLGİ KARTI */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-900 font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Bu Modül Acente İçin Hangi Sorunu Çözer?</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Sigorta şirketleri meslek gruplarına (doktor, avukat, öğretmen vb.) veya acentelik ek protokollerine özel ek komisyon taahhüt eder. Ancak ay sonu muhasebe aktarımlarında bu özel klozlar sisteme manuel olarak eksik veya standart orandan işlenebilmektedir. Acente 2.000 satırlık ekstrede bu %6'lık farkı gözle fark edemez. Bu ekran sözleşme klozlarını ekstreyle otomatik eşleştirir ve acentenin tek bir kampanyada kaybettiği <strong>30.000 ₺'yi</strong> kurtarır.
        </p>
      </div>
    </div>
  );
};
