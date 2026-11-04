import React from 'react';
import { 
  HunterScenario, 
  CommissionLeakageItem, 
  AuditorSubPage 
} from '../../types';
import { 
  TrendingDown, 
  ShieldAlert, 
  CalendarX, 
  FilePlus, 
  Layers, 
  ArrowRight, 
  UploadCloud, 
  Zap, 
  Clock, 
  FileSpreadsheet, 
  Mail, 
  FileText, 
  Download, 
  CheckCircle2, 
  HelpCircle,
  Scale,
  Sparkles
} from 'lucide-react';

interface CommissionAuditorOverviewProps {
  activeScenario: HunterScenario;
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadSample?: (company: 'anadolu' | 'allianz') => void;
  customUploadedFileName: string | null;
  isAuditing: boolean;
  progress: number;
  processedRows: number;
  onRunAudit: () => void;
  onNavigateSubPage: (subPage: AuditorSubPage) => void;
  onOpenReportModal: () => void;
  onOpenEmailModal: () => void;
  onExportCsv: () => void;
  onOpenPitchWizard?: () => void;
  leakages: CommissionLeakageItem[];
  totalLeakageAmount: number;
}

export const CommissionAuditorOverview: React.FC<CommissionAuditorOverviewProps> = ({
  activeScenario,
  selectedScenarioId,
  onSelectScenario,
  onFileUpload,
  onLoadSample,
  customUploadedFileName,
  isAuditing,
  progress,
  processedRows,
  onRunAudit,
  onNavigateSubPage,
  onOpenReportModal,
  onOpenEmailModal,
  onExportCsv,
  onOpenPitchWizard,
  leakages,
  totalLeakageAmount
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 0. SAHA PITCH MODU VURGU BANNER'I */}
      {onOpenPitchWizard && (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  MÜŞTERİ ÖNÜ SAHA PITCH MODU
                </span>
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">• Satış Kapanış Sihirbazı</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white mt-1">
                Acente Üretim Raporu + Şirket Ekstresini Yükleyin (Canlı Çapraz Eşleme)
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5 max-w-2xl">
                Müşterinin yanındayken sadece iki dosyayı yükleyin. Format bağımsız akıllı eşleme ile 3 saniyede masada unutulan parayı çıkarıp satışı anında kapatın.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenPitchWizard}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black px-5 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Canlı Saha Sihirbazını Aç</span>
          </button>
        </div>
      )}

      {/* 1. ÜST BAŞLIK VE HIZLI EYLEMLER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-700 mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Otonom Komisyon Avcısı • Genel Bakış</span>
              <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                TTK 102 Kalkanı
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Otonom Komisyon Avcısı
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Sigorta şirketlerinin komisyon ekstrelerini inceleyin, gelir farklarını görünür hale getirin ve itiraz sürecini başlatın.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Şirkete Resmi İtiraz E-Postası */}
            <button
              onClick={onOpenEmailModal}
              className="flex items-center space-x-2 bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Şirkete İtiraz E-Postası</span>
            </button>

            {/* TTK 102 Dilekçesi */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>TTK 102 Dilekçesi (PDF)</span>
            </button>

            {/* 3 Saniyede Yeniden Tara */}
            <button
              onClick={onRunAudit}
              disabled={isAuditing}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{isAuditing ? 'Taranıyor...' : '3 Sn\'de Tara'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DÖRT ANA ÖZET METRİK KARTI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kart 1: Beklenen Komisyon */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Beklenen Komisyon
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            {activeScenario.expectedTotalCommission.toLocaleString('tr-TR')} ₺
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Sözleşme hakedişi</span>
            <span className="font-bold text-slate-700">1.000 Poliçe</span>
          </div>
        </div>

        {/* Kart 2: Şirketin Ödediği Komisyon */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Şirketin Ödediği Komisyon
          </span>
          <div className="text-2xl font-black text-slate-700 font-mono mt-1">
            {activeScenario.receivedTotalCommission.toLocaleString('tr-TR')} ₺
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Bankaya geçen net tutar</span>
            <span className="text-slate-400">2.000 Satır</span>
          </div>
        </div>

        {/* Kart 3: Tespit Edilen Komisyon Farkı (★ Vurgu) */}
        <div className="bg-gradient-to-br from-rose-50/70 via-white to-white border-2 border-rose-300 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
              Tespit Edilen Komisyon Farkı
            </span>
            <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.2 rounded border border-rose-200">
              TTK 102
            </span>
          </div>
          <div className="text-2xl font-black text-rose-700 font-mono mt-1">
            -{totalLeakageAmount.toLocaleString('tr-TR')} ₺
          </div>
          <div className="mt-2 text-xs text-rose-700 font-bold flex items-center justify-between">
            <span>5 uyuşmazlık bulundu</span>
            <span>%100 Geri Alınabilir</span>
          </div>
        </div>

        {/* Kart 4: İncelenen Poliçe / Ekstre Satırı */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            İncelenen Satır / Poliçe
          </span>
          <div className="text-2xl font-black text-indigo-900 font-mono mt-1">
            {activeScenario.totalPolicies.toLocaleString('tr-TR')}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Ekstre satır sayısı</span>
            <span className="font-bold text-indigo-700">3 Saniyede Eşleşti</span>
          </div>
        </div>
      </div>

      {/* İlerleme Animasyonu (Eğer tarama sürüyorsa) */}
      {isAuditing && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in duration-200">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-600 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-600 animate-spin" />
              <span>Çapraz Eşleme Motoru Çalışıyor: {processedRows.toLocaleString('tr-TR')} / {activeScenario.totalPolicies.toLocaleString('tr-TR')} satır</span>
            </span>
            <span className="text-rose-700 font-bold">%{progress}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 3. DÖRT ANA KOMİSYON KAÇAĞI KATEGORİSİ KARTLARI */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Tespit Edilen Kaçak Kategorileri
            </h2>
            <p className="text-xs text-slate-500">
              Ekstrede bulunan uyuşmazlıklar 4 ana kategoride sınıflandırılmıştır. İlgili karta tıklayarak detayını inceleyin.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Kategori 1: Tarife ve Oran Sapmaları */}
          <div className="bg-white border border-slate-200 hover:border-blue-400 p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  -18.000 ₺
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Tarife ve Oran Sapmaları
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sözleşmedeki komisyon oranı ile şirketin uyguladığı oran arasındaki farklar (Örn: Doktor kaskosunda %15 yerine %10 uygulanması).
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100">
              <button
                onClick={() => onNavigateSubPage('tariff')}
                className="w-full bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Detayı İncele</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Kategori 2: Haksız İptal Kesintileri */}
          <div className="bg-white border border-slate-200 hover:border-amber-400 p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <CalendarX className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  -14.000 ₺
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Haksız İptal Kesintileri
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Poliçe iptalinde gün hesabı yerine tam yıl komisyon kesintisi yapılması (Örn: 5 günlük sigortaya 1 yıllık komisyon cezası).
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100">
              <button
                onClick={() => onNavigateSubPage('cancellation')}
                className="w-full bg-slate-50 group-hover:bg-amber-600 text-slate-700 group-hover:text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Detayı İncele</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Kategori 3: Zeyilname Komisyon Kaçakları */}
          <div className="bg-white border border-slate-200 hover:border-purple-400 p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <FilePlus className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  -750 ₺
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                Zeyilname Komisyon Kaçakları
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sonradan eklenen teminat veya ek primlerden doğan komisyonların ekstreye yansımaması veya sıfır girilmesi.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100">
              <button
                onClick={() => onNavigateSubPage('endorsement')}
                className="w-full bg-slate-50 group-hover:bg-purple-600 text-slate-700 group-hover:text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Detayı İncele</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Kategori 4: Havuz ve Sözleşme Dışı Kesintiler */}
          <div className="bg-white border border-slate-200 hover:border-rose-400 p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  -10.000 ₺
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                Havuz ve Sözleşme Dışı
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Yanlış riskli havuz sınıflandırması veya acentelik sözleşmesinde yer almayan portal/altyapı kesintileri.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100">
              <button
                onClick={() => onNavigateSubPage('pool')}
                className="w-full bg-slate-50 group-hover:bg-rose-600 text-slate-700 group-hover:text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Detayı İncele</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. "NASIL ÇALIŞIR?" 4 ADIMLI GÖRSEL AKIŞ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Nasıl Çalışır? (3 Saniyede Otonom İade Süreci)
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">Masaüstü Excel işçiliğine son</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="text-xs font-bold text-slate-900">Ekstreyi Yükle</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Allianz, Anadolu, Sompo gibi şirketlerin binlerce satırlık Excel ekstreleri tek tıkla sisteme yüklenir.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="text-xs font-bold text-slate-900">Sözleşmeyle Karşılaştır</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Poliçe ve zeyil numaraları sözleşmedeki komisyon oranları ve gün esaslı iptal kurallarıyla eşleştirilir.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="text-xs font-bold text-slate-900">Farkları Sınıflandır</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tarife sapması, iptal haksızlığı ve sözleşme dışı havuz kesintileri kuruşu kuruşuna ayrıştırılır.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">
              4
            </div>
            <h4 className="text-xs font-bold text-slate-900">İtiraz Raporu Oluştur</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              TTK 102 maddesi dayanağıyla resmi itiraz dilekçesi ve hazır şirket e-postası tek tıkla üretilir.
            </p>
          </div>
        </div>
      </div>

      {/* 5. VAKA & SENARYO SEÇİCİ VE DOSYA YÜKLEME */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Denetlenecek Saha Vakası veya Canlı Ekstre
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Canlı Excel / CSV Motoru
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Acentenin getirdiği gerçek komisyon ekstresini yükleyin veya hazır PoC şirket bordroları üzerinden 3 saniyede kaçakları görün.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs">
              <UploadCloud className="w-4 h-4 text-white" />
              <span>Gerçek Ekstre (XLSX / CSV) Yükle</span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={onFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={onExportCsv}
              className="flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>İtiraz CSV İndir</span>
            </button>
          </div>
        </div>

        {/* Özel Dosya Yüklendiyse Bildirim Kartı */}
        {customUploadedFileName && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                XLS
              </div>
              <div>
                <div className="text-xs font-black text-emerald-950 flex items-center space-x-1.5">
                  <span>Yüklenen Canlı Ekstre: {customUploadedFileName}</span>
                  <span className="bg-emerald-200 text-emerald-900 text-[9px] font-bold px-1.5 py-0.2 rounded">CANLI ANALİZ</span>
                </div>
                <div className="text-[11px] text-emerald-700">
                  Dosya taranarak sözleşme şartlarıyla karşılaştırıldı ve kaçaklar dinamik olarak hesaplandı.
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-black text-emerald-900">
              {totalLeakageAmount.toLocaleString('tr-TR')} ₺ Kaçak
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Senaryo A: Anadolu Sigorta PoC */}
          <div
            onClick={() => onSelectScenario('anadolu_poc')}
            className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
              selectedScenarioId === 'anadolu_poc'
                ? 'border-rose-600 bg-white shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.2 rounded uppercase">
                GERÇEK POC BORDROSU
              </span>
              <span className="font-mono font-black text-rose-700 text-xs">6.755 ₺ Kaçak</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Anadolu Sigorta Ekim Ekstresi</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
              10 poliçe. Kasko tarife sapması, kayıp konut poliçesi, storno cezası ve havuz kesintisi.
            </p>
          </div>

          {/* Senaryo B: Allianz Sigorta PoC */}
          <div
            onClick={() => onSelectScenario('allianz_poc')}
            className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
              selectedScenarioId === 'allianz_poc'
                ? 'border-blue-600 bg-white shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.2 rounded uppercase">
                GERÇEK POC BORDROSU
              </span>
              <span className="font-mono font-black text-blue-700 text-xs">1.628 ₺ Kaçak</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Allianz Sigorta Ekim Ekstresi</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
              4 poliçe. Filo kasko iskontosu kırpması ve TSS portföy kesintisi.
            </p>
          </div>

          {/* Senaryo C: Ahmet Bey Vakası */}
          <div
            onClick={() => onSelectScenario('ahmet_bey')}
            className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
              selectedScenarioId === 'ahmet_bey'
                ? 'border-amber-600 bg-white shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded uppercase">
                KADIKÖY SAHA VAKASI
              </span>
              <span className="font-mono font-black text-amber-700 text-xs">42.000 ₺ Fark</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Acente Ahmet Bey (Büyük Vaka)</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
              1.000 poliçe. 150.000 ₺ beklenirken yatan 108.000 ₺!
            </p>
          </div>

          {/* Senaryo D: Ekim 2026 Konsolide */}
          <div
            onClick={() => onSelectScenario('october_consolidated')}
            className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
              selectedScenarioId === 'october_consolidated'
                ? 'border-indigo-600 bg-white shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded uppercase">
                KONSOLİDE 124K SATIR
              </span>
              <span className="font-mono font-black text-indigo-700 text-xs">16.471 ₺ Fark</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Ekim 2026 Çoklu Şirket</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
              124.850 satırlık hakediş tablosu. Allianz, Türkiye, Anadolu ve Sompo.
            </p>
          </div>
        </div>

        {/* 6. TEST VE DEMO İÇİN ÖRNEK EXCEL DOSYALARI ÇUBUĞU */}
        <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-700 font-bold">PoC Doğrulama Dosyaları (İndirip Excel'de İnceleyin):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/samples/anadolu_sigorta_ekstre_2026_10.xlsx"
              download="anadolu_sigorta_ekstre_2026_10.xlsx"
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-mono font-semibold flex items-center space-x-1 transition-colors"
            >
              <Download className="w-3 h-3 text-slate-500" />
              <span>Anadolu_Bordro.xlsx</span>
            </a>

            <a
              href="/samples/allianz_sigorta_ekstre_2026_10.xlsx"
              download="allianz_sigorta_ekstre_2026_10.xlsx"
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-mono font-semibold flex items-center space-x-1 transition-colors"
            >
              <Download className="w-3 h-3 text-slate-500" />
              <span>Allianz_Bordro.xlsx</span>
            </a>

            <a
              href="/samples/acente_beklenen_uretim_2026_10.xlsx"
              download="acente_beklenen_uretim_2026_10.xlsx"
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-mono font-semibold flex items-center space-x-1 transition-colors"
            >
              <Download className="w-3 h-3 text-slate-500" />
              <span>Acente_Uretim.xlsx</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
