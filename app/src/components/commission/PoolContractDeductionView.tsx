import React, { useState } from 'react';
import { 
  Layers, 
  ShieldAlert, 
  ArrowRight, 
  Download, 
  FileText, 
  Mail, 
  Zap, 
  CheckCircle2, 
  HelpCircle,
  FileCheck,
  AlertTriangle,
  Scale,
  XCircle,
  ShieldCheck
} from 'lucide-react';

interface PoolContractDeductionViewProps {
  onBackToOverview?: () => void;
  onOpenReportModal: () => void;
  onOpenEmailModal: () => void;
  onExportCsv: () => void;
}

export const PoolContractDeductionView: React.FC<PoolContractDeductionViewProps> = ({
  onBackToOverview,
  onOpenReportModal,
  onOpenEmailModal,
  onExportCsv
}) => {
  const [checkedContract, setCheckedContract] = useState(true);

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
                className="hover:text-rose-700 transition-colors cursor-pointer flex items-center space-x-1"
                title="Genel Bakış ekranına dön"
              >
                <span>← Otonom Komisyon Avcısı</span>
              </button>
              <span>/</span>
              <span className="text-rose-700">Havuz ve Sözleşme Dışı Kesintiler</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Havuz ve Sözleşme Dışı Kesintiler
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Poliçenin yanlış havuza alınmasını ve sözleşmede tanımlanmayan kesintileri görünür hale getirin.
            </p>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setCheckedContract(true)}
              className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Sözleşme Kontrolü Yap</span>
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
              <span>Kesintiyi Raporla</span>
            </button>

            <button
              onClick={onOpenEmailModal}
              className="flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>İtiraz Dosyasına Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. BÜYÜK FARK VE İKİ KOLONLU KARŞILAŞTIRMA (HAVUZ + SÖZLEŞME DIŞI KESİNTİ) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sol Kolon: Büyük Fark Tutarı */}
        <div className="bg-gradient-to-br from-rose-50/80 via-white to-white border-2 border-rose-200 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider block">
              Sözleşme Dışı Kesinti Tutarı
            </span>
            <div className="text-3xl font-black text-rose-700 font-mono tracking-tight">
              10.000 ₺
            </div>
            <p className="text-xs text-slate-500 pt-1">
              Kadıköy Lojistik Vakası & Tramer Altyapı Bedeli
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-rose-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Kesinti Gerekçesi:</span>
              <span className="font-bold text-slate-900">Altyapı Fonu / Tramer</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Sözleşmede Tanımlı mı?:</span>
              <span className="font-bold text-rose-700 font-mono">HAYIR (%0 Hukuki Dayanak)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>İtiraz Durumu:</span>
              <span className="font-bold text-emerald-700 font-mono">TTK 102 Şerhi Hazır</span>
            </div>
          </div>
        </div>

        {/* Sağ 2 Kolon: İki Kolonlu Karşılaştırma (Beklenen Sınıf vs Şirket Sınıflandırması) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Beklenen Sınıflandırma vs Şirket Sınıflandırması
            </h3>
            <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded">
              Hatalı Havuz Tespiti
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Beklenen Sınıflandırma */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Beklenen Gerçek Sınıf</span>
              </div>
              <div className="space-y-1 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Gerçek Sınıf:</span>
                  <span className="font-bold text-slate-900">Hususi Otomobil</span>
                </div>
                <div className="flex justify-between">
                  <span>Havuz Türü:</span>
                  <span className="font-bold text-emerald-700">Standart Portföy</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-emerald-200">
                  <span>Sözleşme Komisyonu:</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">%15.0</span>
                </div>
              </div>
            </div>

            {/* Şirket Sınıflandırması */}
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center space-x-1.5 text-rose-800 font-bold text-xs uppercase">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Şirketin Uyguladığı Sınıf</span>
              </div>
              <div className="space-y-1 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Şirket Sınıfı:</span>
                  <span className="font-bold text-rose-900">Riskli Havuz / Filo</span>
                </div>
                <div className="flex justify-between">
                  <span>Kesinti Sebebi:</span>
                  <span className="font-bold text-rose-700">Sözleşme Dışı Düşüş</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-rose-200">
                  <span>Uygulanan Komisyon:</span>
                  <span className="font-mono font-bold text-rose-700 text-sm">%8.0 (Fark: -%7)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sözleşme Kontrol Kartı */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Sözleşme Kontrolü: Portal Altyapı Bedeli</span>
                <span className="text-[11px] text-slate-500">Acentelik sözleşmesinde böyle bir kesinti maddesi tanımlı değildir.</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded">
                Sözleşmede Yok: HAYIR
              </span>
              <span className="text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                İtiraz İçin İşaretlendi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DETAY TABLOSU: HAVUZ VE SÖZLEŞME DIŞI KESİNTİLER */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Havuz ve Sözleşme Dışı Kesinti Kayıtları
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">6102 sayılı TTK 102 denetimi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Poliçe No</th>
                <th className="p-3">Müşteri</th>
                <th className="p-3">Şirket</th>
                <th className="p-3">Kesinti Türü</th>
                <th className="p-3 text-right">Poliçe Primi</th>
                <th className="p-3 text-center">Sözleşme Hakkı</th>
                <th className="p-3 text-center">Şirketin Kestiği</th>
                <th className="p-3 text-right text-rose-700">Haksız Kesinti Tutarı</th>
                <th className="p-3">Sözleşmede Var mı?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              <tr className="hover:bg-rose-50/20 transition-colors">
                <td className="p-3 font-bold text-slate-900">5520-1492018-0</td>
                <td className="p-3 font-sans font-semibold text-slate-800">Kadıköy Lojistik Filo</td>
                <td className="p-3 font-sans text-slate-600">Axa Sigorta</td>
                <td className="p-3 font-sans text-rose-700 font-bold">Tramer Altyapı Bedeli</td>
                <td className="p-3 text-right text-slate-800">100.000 ₺</td>
                <td className="p-3 text-center text-emerald-700 font-bold">%18.0</td>
                <td className="p-3 text-center text-rose-700 font-bold">%8.0</td>
                <td className="p-3 text-right font-black text-rose-700 text-xs">-10.000 ₺</td>
                <td className="p-3 font-sans">
                  <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    HAYIR (Sözleşme Dışı)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-rose-50/20 transition-colors">
                <td className="p-3 font-bold text-slate-900">3020-1129482-0</td>
                <td className="p-3 font-sans font-semibold text-slate-800">Yıldız Turizm Taşımacılık</td>
                <td className="p-3 font-sans text-slate-600">Sompo Sigorta</td>
                <td className="p-3 font-sans text-amber-700 font-bold">Hatalı Havuz Kesintisi</td>
                <td className="p-3 text-right text-slate-800">195.000 ₺</td>
                <td className="p-3 text-center text-emerald-700 font-bold">%16.0</td>
                <td className="p-3 text-center text-rose-700 font-bold">%12.5</td>
                <td className="p-3 text-right font-black text-rose-700 text-xs">-6.825 ₺</td>
                <td className="p-3 font-sans">
                  <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    HAYIR (Yanlış Havuz)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. "BU MODÜL NEYİ ÇÖZÜYOR?" BİLGİ KARTI */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-900 font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-rose-600" />
          <span>Bu Modül Acente İçin Hangi Sorunu Çözer?</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Sigorta şirketleri son yıllarda artan hasar maliyetlerini telafi etmek amacıyla acentelere ödedikleri ekstrelerde "SBM Katılım Payı", "Altyapı Fonu" veya poliçeyi sebepsizce "Riskli Havuz" kategorisine alarak %5 ila %7 arasında oran düşürmektedir. 6102 sayılı TTK 102. maddesi ve acentelik sözleşmesi uyarınca sözleşmede açıkça hüküm bulunmayan hiçbir kesinti acentenin hakedişinden tek taraflı düşülemez. Bu ekran, acentenin sözleşmesini baz alarak şirketlerin tek taraflı dayattığı kesintileri yakalar ve resmi itiraz dosyasına ekler.
        </p>
      </div>
    </div>
  );
};
