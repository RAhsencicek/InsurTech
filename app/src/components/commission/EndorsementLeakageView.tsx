import React, { useState } from 'react';
import { 
  FilePlus, 
  RefreshCw, 
  ArrowRight, 
  Download, 
  FileText, 
  Mail, 
  Zap, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

interface EndorsementLeakageViewProps {
  onBackToOverview?: () => void;
  onOpenReportModal: () => void;
  onOpenEmailModal: () => void;
  onExportCsv: () => void;
}

export const EndorsementLeakageView: React.FC<EndorsementLeakageViewProps> = ({
  onBackToOverview,
  onOpenReportModal,
  onOpenEmailModal,
  onExportCsv
}) => {
  const [calculated, setCalculated] = useState(true);

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
                className="hover:text-purple-700 transition-colors cursor-pointer flex items-center space-x-1"
                title="Genel Bakış ekranına dön"
              >
                <span>← Otonom Komisyon Avcısı</span>
              </button>
              <span>/</span>
              <span className="text-purple-700">Zeyilname Komisyon Kaçakları</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Zeyilname Komisyon Kaçakları
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Poliçeye sonradan eklenen teminat, prim veya değişikliklerden doğan komisyonların ekstreye doğru yansıdığını kontrol edin.
            </p>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setCalculated(true)}
              className="flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Beklenen Komisyonu Hesapla</span>
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
              <span>Eksik Komisyon Raporu</span>
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

      {/* 2. BÜYÜK FARK VE BEKLENEN / GERÇEKLEŞEN HESAPLAMA KARTI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sol Kolon: Büyük Fark Tutarı */}
        <div className="bg-gradient-to-br from-purple-50/80 via-white to-white border-2 border-purple-200 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
              Zeyil Kaynaklı Kaçak
            </span>
            <div className="text-3xl font-black text-purple-700 font-mono tracking-tight">
              750 ₺
            </div>
            <p className="text-xs text-slate-500 pt-1">
              Ek Teminat / Prim Artışı Zeyili Örneği
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-purple-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>İlk Poliçe Komisyonu:</span>
              <span className="font-bold text-slate-900 font-mono">1.200 ₺</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Zeyil Ek Primi:</span>
              <span className="font-bold text-purple-700 font-mono">5.000 ₺</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Zeyil Komisyon Oranı:</span>
              <span className="font-bold text-slate-900 font-mono">%15.0</span>
            </div>
          </div>
        </div>

        {/* Sağ 2 Kolon: Beklenen vs Gerçekleşen Zeyil Komisyonu */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Zeyilname Komisyon Hesaplama Matrisi
            </h3>
            <span className="text-[10px] bg-purple-100 text-purple-800 border border-purple-300 font-bold px-2 py-0.5 rounded">
              Zeyil No: 01 (Ek Teminat)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {/* Beklenen Ek Komisyon */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Beklenen Ek Komisyon</span>
              <div className="text-2xl font-black text-emerald-700 font-mono">750 ₺</div>
              <span className="text-[10px] text-slate-500">5.000 ₺ ek prim × %15</span>
            </div>

            {/* Ekstreye Yansıyan */}
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
              <span className="text-[10px] text-rose-800 font-bold uppercase block">Ekstreye Yansıyan</span>
              <div className="text-2xl font-black text-rose-700 font-mono">0 ₺</div>
              <span className="text-[10px] text-slate-500">Şirket ekstrede sıfır girmiş</span>
            </div>

            {/* Tespit Edilen Fark */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-600 font-bold uppercase block">Tespit Edilen Fark</span>
              <div className="text-2xl font-black text-purple-700 font-mono">+750 ₺</div>
              <span className="text-[10px] text-slate-500">Acentenin masada kalan hakkı</span>
            </div>
          </div>

          <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Zeyil Kaçağı Mekanizması:</strong> Müşteri yıl ortasında kasko poliçesine "Yurt Dışı Teminatı" veya "Aksesuar İlavesi" zeyili yaptırmış ve acente 5.000 ₺ ek prim tahakkuk ettirmiştir. Şirket ana poliçenin komisyonunu ödemiş ancak ay sonu ekstrede zeyilname komisyonunu sehven sıfır geçmiştir.
            </p>
          </div>
        </div>
      </div>

      {/* 3. POLİÇE YAŞAM DÖNGÜSÜ (7 ADIMLI ZAMAN AKIŞI) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Poliçe Yaşam Döngüsü & Değişiklik Geçmişi
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">Ana Poliçeden Zeyil Ekstresine</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400">1. Adım</span>
            <h4 className="font-bold text-slate-900">İlk Poliçe</h4>
            <p className="text-[11px] text-slate-500">8.000 ₺ prim, 1.200 ₺ komisyon tanzim edildi.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400">2. Adım</span>
            <h4 className="font-bold text-slate-900">Ek Teminat</h4>
            <p className="text-[11px] text-slate-500">Yurt dışı ve aksesuar teminatı eklendi.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400">3. Adım</span>
            <h4 className="font-bold text-slate-900">Ek Prim Çıktı</h4>
            <p className="text-[11px] text-slate-500">5.000 ₺ net ek prim tahakkuk ettirildi.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400">4. Adım</span>
            <h4 className="font-bold text-slate-900">Yeni Hakediş</h4>
            <p className="text-[11px] text-slate-500">Acentenin 750 ₺ ek komisyon beklentisi oluştu.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400">5. Adım</span>
            <h4 className="font-bold text-slate-900">Ekstre Geldi</h4>
            <p className="text-[11px] text-slate-500">Şirket aylık hakediş dosyasını iletti.</p>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
            <span className="text-[10px] font-bold text-rose-700">6. Adım</span>
            <h4 className="font-bold text-rose-900">Komisyon 0 ₺</h4>
            <p className="text-[11px] text-rose-700">Zeyil satırına komisyon yazılmadı.</p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-bold text-emerald-700">7. Adım</span>
            <h4 className="font-bold text-emerald-900">Fark Yakalandı</h4>
            <p className="text-[11px] text-emerald-800">Sistem 750 ₺'yi anında raporladı.</p>
          </div>
        </div>
      </div>

      {/* 4. DETAY TABLOSU: ZEYİLNAME HAREKETLERİ */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FilePlus className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Zeyilname Komisyon Hareketleri Listesi
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Poliçe yaşam döngüsü denetimi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Poliçe No</th>
                <th className="p-3">Zeyil No</th>
                <th className="p-3">Müşteri</th>
                <th className="p-3">Zeyil Türü</th>
                <th className="p-3 text-right">Zeyil Ek Primi</th>
                <th className="p-3 text-center">Komisyon Oranı</th>
                <th className="p-3 text-right">Beklenen Komisyon</th>
                <th className="p-3 text-right">Yatırılan</th>
                <th className="p-3 text-right text-purple-700">Fark (İade)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              <tr className="hover:bg-purple-50/20 transition-colors">
                <td className="p-3 font-bold text-slate-900">4420-1192840-0</td>
                <td className="p-3 font-bold text-purple-700">Zeyil: 01</td>
                <td className="p-3 font-sans font-semibold text-slate-800">Serkan Yurtseven</td>
                <td className="p-3 font-sans text-slate-600">Yurt Dışı & Aksesuar Ekleme</td>
                <td className="p-3 text-right text-slate-800 font-bold">5.000 ₺</td>
                <td className="p-3 text-center text-emerald-700 font-bold">%15.0</td>
                <td className="p-3 text-right text-slate-900 font-bold">750 ₺</td>
                <td className="p-3 text-right text-rose-700 font-bold">0 ₺</td>
                <td className="p-3 text-right font-black text-purple-700 text-xs">+750 ₺</td>
              </tr>
              <tr className="hover:bg-purple-50/20 transition-colors">
                <td className="p-3 font-bold text-slate-900">5510-4491820-2</td>
                <td className="p-3 font-bold text-purple-700">Zeyil: 02</td>
                <td className="p-3 font-sans font-semibold text-slate-800">Selin Karaca</td>
                <td className="p-3 font-sans text-slate-600">TSS Yeni Aile Bireyi Ekleme</td>
                <td className="p-3 text-right text-slate-800 font-bold">4.480 ₺</td>
                <td className="p-3 text-center text-emerald-700 font-bold">%20.0</td>
                <td className="p-3 text-right text-slate-900 font-bold">896 ₺</td>
                <td className="p-3 text-right text-rose-700 font-bold">0 ₺</td>
                <td className="p-3 text-right font-black text-purple-700 text-xs">+896 ₺</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. "BU MODÜL NEYİ ÇÖZÜYOR?" BİLGİ KARTI */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-900 font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-purple-600" />
          <span>Bu Modül Acente İçin Hangi Sorunu Çözer?</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Poliçeler tanzim edildikten sonra yıl içerisinde zeyilname (ek teminat, araç bedeli artışı, adres değişikliği, yeni sigortalı ekleme vb.) ile defalarca güncellenebilir. Şirket muhasebeleri ana poliçenin komisyonunu cariye işlerken, zeyilname kaynaklı ek primlerin komisyonlarını ya unutur ya da sıfır olarak ekstreye basar. Bu ekran, poliçenin yaşam döngüsündeki her bir zeyil hareketini satır satır denetler ve unutulan ek komisyonları geri kazandırır.
        </p>
      </div>
    </div>
  );
};
