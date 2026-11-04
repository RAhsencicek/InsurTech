import React, { useState } from 'react';
import { 
  CalendarX, 
  Clock, 
  ArrowRight, 
  Download, 
  FileText, 
  Mail, 
  Zap, 
  CheckCircle2, 
  HelpCircle,
  AlertTriangle,
  Scale,
  Calculator
} from 'lucide-react';

interface CancellationDeductionViewProps {
  onBackToOverview?: () => void;
  onOpenReportModal: () => void;
  onOpenEmailModal: () => void;
  onExportCsv: () => void;
}

export const CancellationDeductionView: React.FC<CancellationDeductionViewProps> = ({
  onBackToOverview,
  onOpenReportModal,
  onOpenEmailModal,
  onExportCsv
}) => {
  const [showCalculationDetails, setShowCalculationDetails] = useState(true);

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
                className="hover:text-amber-700 transition-colors cursor-pointer flex items-center space-x-1"
                title="Genel Bakış ekranına dön"
              >
                <span>← Otonom Komisyon Avcısı</span>
              </button>
              <span>/</span>
              <span className="text-amber-700">Haksız İptal Kesintileri</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Haksız İptal Kesintileri
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              İptal edilen poliçelerde şirketin yaptığı komisyon kesintisini poliçenin kullanım süresiyle karşılaştırın.
            </p>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowCalculationDetails(!showCalculationDetails)}
              className="flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-700" />
              <span>{showCalculationDetails ? 'Hesap Gizle' : 'İptal Hesabını Göster'}</span>
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
              <span>Uyuşmazlık Raporu (PDF)</span>
            </button>

            <button
              onClick={onOpenEmailModal}
              className="flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>İtiraz Metnini Hazırla</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. BÜYÜK HESAPLAMA KARŞILAŞTIRMASI (OLMASI GEREKEN vs ŞİRKET EKSTRESİ) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sol Kolon: Tespit Edilen Fark */}
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-white border-2 border-amber-200 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              Tespit Edilen Komisyon İadesi
            </span>
            <div className="text-3xl font-black text-amber-700 font-mono tracking-tight">
              14.000 ₺
            </div>
            <p className="text-xs text-slate-500 pt-1">
              Ahmet Bey Vakası & Örnek İptal Simülasyonu
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-amber-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Poliçe Toplam Süresi:</span>
              <span className="font-bold text-slate-900 font-mono">365 Gün</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Fiili Kullanım Süresi:</span>
              <span className="font-bold text-slate-900 font-mono">10 Gün</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Kesilen / Alıkonan Tutar:</span>
              <span className="font-bold text-rose-700 font-mono">Tam Yıl Komisyon</span>
            </div>
          </div>
        </div>

        {/* Sağ 2 Kolon: Olması Gereken vs Şirket Ekstresindeki Durum */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              "10 Günlük Sigortaya 1 Yıllık Ceza" Karşılaştırması
            </h3>
            <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded">
              Gün Esaslı Hesaplanmamış
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Olması Gereken Durum */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase block">
                Olması Gereken (Gün Esaslı Pro-Rata)
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>10 Günlük Fiili Kullanım:</span>
                  <span className="font-mono font-bold text-emerald-700">100 ₺ Hak Edilen</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Acentede Kalması Gereken:</span>
                  <span className="font-mono font-bold text-emerald-700">100 ₺</span>
                </div>
                <div className="flex justify-between text-slate-700 pt-1 border-t border-emerald-200">
                  <span>İade Edilecek Kısım:</span>
                  <span className="font-mono font-black text-emerald-800">3.550 ₺</span>
                </div>
              </div>
            </div>

            {/* Şirket Ekstresindeki Durum */}
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-rose-800 uppercase block">
                Şirket Ekstresindeki Durum (Hatalı)
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Geri Alınan Komisyon:</span>
                  <span className="font-mono font-bold text-rose-700">3.650 ₺ (Tamamı!)</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Gün Hesabı Uygulandı mı?:</span>
                  <span className="font-mono font-bold text-rose-700">Hayır (Sıfır Gün)</span>
                </div>
                <div className="flex justify-between text-slate-700 pt-1 border-t border-rose-200">
                  <span>Acenteden Haksız Kesilen:</span>
                  <span className="font-mono font-black text-rose-800">-3.550 ₺ Fark</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Kurumsal Değerlendirme:</strong> Sözleşme ve ilgili mevzuat kurallarına göre yeniden incelenmesi gereken kesinti. Müşteri 10. günde aracını sattığı için poliçeyi yasal hakkı olarak iptal etmiştir; şirketin acenteden 355 günün değil, 365 günün tamamını kesmesi haksız zenginleşme teşkil eder.
            </p>
          </div>
        </div>
      </div>

      {/* 3. ZAMAN ÇİZELGESİ (OLAY AKIŞI) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Olay Akışı & Zaman Çizelgesi
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">Adım Adım İptal ve Hakediş Süreci</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400">1. Gün</span>
            <h4 className="text-xs font-bold text-slate-900">Poliçe Düzenlendi</h4>
            <p className="text-[11px] text-slate-500">36.500 ₺ primli kasko poliçesi sisteme girildi.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400">1-9. Günler</span>
            <h4 className="text-xs font-bold text-slate-900">Müşteri Kullandı</h4>
            <p className="text-[11px] text-slate-500">Teminat 9 gün boyunca kesintisiz sağlandı.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400">10. Gün</span>
            <h4 className="text-xs font-bold text-slate-900">Araç Satışı Oldu</h4>
            <p className="text-[11px] text-slate-500">Müşteri noter satışıyla aracı devretti.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-amber-700">11. Gün</span>
            <h4 className="text-xs font-bold text-slate-900">Poliçe İptal Edildi</h4>
            <p className="text-[11px] text-slate-500">Şirket ekranından resmi iptal zeyli basıldı.</p>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
            <span className="text-[10px] font-bold text-rose-700">Ay Sonu</span>
            <h4 className="text-xs font-bold text-rose-900">Tam Komisyon Kesildi</h4>
            <p className="text-[11px] text-rose-700">Şirket ekstrede acenteden 3.650 ₺ tam kesti.</p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-bold text-emerald-700">3 Saniye</span>
            <h4 className="text-xs font-bold text-emerald-900">Sistem Farkı Buldu</h4>
            <p className="text-[11px] text-emerald-800">3.550 ₺ haksız kesinti tek tıkla itiraza alındı.</p>
          </div>
        </div>
      </div>

      {/* 4. DETAY TABLOSU: İPTAL KESİNTİSİNE UĞRAYAN POLİÇELER */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarX className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              İptal Kesintisi İncelenen Kayıtlar
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Pro-rata gün hesabı uyumsuzlukları</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Poliçe No</th>
                <th className="p-3">Müşteri</th>
                <th className="p-3">Şirket</th>
                <th className="p-3">İptal Nedeni</th>
                <th className="p-3 text-center">Kullanılan Gün</th>
                <th className="p-3 text-right">İlk Prim</th>
                <th className="p-3 text-right">Kesilen Komisyon</th>
                <th className="p-3 text-right text-emerald-700">Olması Gereken Kesinti</th>
                <th className="p-3 text-right text-rose-700">İade Edilecek Fark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              <tr className="hover:bg-amber-50/20 transition-colors">
                <td className="p-3 font-bold text-slate-900">1102-9948120-1</td>
                <td className="p-3 font-sans font-semibold text-slate-800">Moda Tasarım & Tekstil Ltd.</td>
                <td className="p-3 font-sans text-slate-600">Anadolu Sigorta</td>
                <td className="p-3 font-sans text-slate-500">5. Gün Erken Fesih</td>
                <td className="p-3 text-center font-bold text-slate-800">5 Gün</td>
                <td className="p-3 text-right text-slate-800">70.000 ₺</td>
                <td className="p-3 text-right text-rose-700 font-bold">14.000 ₺ (Tam Yıl)</td>
                <td className="p-3 text-right text-emerald-700 font-bold">191 ₺</td>
                <td className="p-3 text-right font-black text-rose-700 text-xs">+13.809 ₺</td>
              </tr>
              <tr className="hover:bg-amber-50/20 transition-colors">
                <td className="p-3 font-bold text-slate-900">9910-3849102-0</td>
                <td className="p-3 font-sans font-semibold text-slate-800">Murat Serbest (Araç Satışı)</td>
                <td className="p-3 font-sans text-slate-600">Allianz Sigorta</td>
                <td className="p-3 font-sans text-slate-500">Noter Satış İptali</td>
                <td className="p-3 text-center font-bold text-slate-800">10 Gün</td>
                <td className="p-3 text-right text-slate-800">36.500 ₺</td>
                <td className="p-3 text-right text-rose-700 font-bold">3.650 ₺ (Tam Yıl)</td>
                <td className="p-3 text-right text-emerald-700 font-bold">100 ₺</td>
                <td className="p-3 text-right font-black text-rose-700 text-xs">+3.550 ₺</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. "BU MODÜL NEYİ ÇÖZÜYOR?" BİLGİ KARTI */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-900 font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Bu Modül Acente İçin Hangi Sorunu Çözer?</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Türkiye'de her ay kesilen araç ve konut poliçelerinin ortalama %5 ila %8'i araç satışı, taşınma veya zeyil sebebiyle ilk aylarda iptal edilir. Sigorta şirketlerinin muhasebe yazılımları, gün esaslı komisyon tenzili yapmak yerine çoğu zaman acentenin o poliçeden kazandığı 1 yıllık komisyonun tamamını tek kalemde geri çeker. Bu ekran, poliçenin kaç gün aktif kaldığını gün bazında hesaplar ve acentenin haksız yere geri alınan komisyonunu kuruşuna kadar ortaya çıkarır.
        </p>
      </div>
    </div>
  );
};
