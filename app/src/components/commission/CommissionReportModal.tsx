import React from 'react';
import { CommissionLeakageItem, HunterScenario } from '../../types';
import { Printer, X } from 'lucide-react';

interface CommissionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenario: HunterScenario;
  leakages: CommissionLeakageItem[];
  totalLeakageAmount: number;
  companyLeakageSummary: Record<string, number>;
}

export const CommissionReportModal: React.FC<CommissionReportModalProps> = ({
  isOpen,
  onClose,
  activeScenario,
  leakages,
  totalLeakageAmount,
  companyLeakageSummary
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 my-auto text-slate-900">
        
        {/* Rapor Üst Başlık & Kontroller */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] bg-slate-900 text-white font-mono font-bold px-2 py-0.5 rounded">
                REF: AUDIT-2026-OCT-8492
              </span>
              <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-300 font-bold px-2 py-0.5 rounded">
                TTK 102 HAKEDİŞ UYUŞMAZLIK ŞERHİ
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Resmi Komisyon Mutabakatı & İade Talep Dosyası
            </h2>
            <p className="text-xs text-slate-500">
              6102 sayılı TTK Md. 102 ve Sigorta Acenteleri Yönetmeliği Hükümleri Tahtında Tanzim Edilmiştir.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır / PDF Kaydet</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resmi Antet */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-black text-slate-900 block text-sm">HAYAT İŞLERİ SİGORTA VE REASÜRANS BROKERLIĞI A.Ş.</span>
            <span className="text-slate-500 block">SEDDK Ruhsat No: B.19.0.SGM.0.08-2024/914 • TOBB Levha No: 2024-T0914</span>
            <span className="text-slate-500 block">Adres: Suadiye Mah. Bağdat Cad. No: 384 Kadıköy / İstanbul</span>
          </div>
          <div className="text-right font-mono text-slate-600 sm:border-l sm:border-slate-200 sm:pl-4">
            <div>Tarih: <strong>23 Ekim 2026</strong></div>
            <div>Denetlenen: <strong>{activeScenario.totalPolicies.toLocaleString('tr-TR')} Satır</strong></div>
            <div className="text-rose-700 font-bold">Kaçak: {totalLeakageAmount.toLocaleString('tr-TR')} ₺</div>
          </div>
        </div>

        {/* İtiraz Edilen Şirketler Kırılımı */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Şirket Bazında Talep Edilen Eksik Komisyon İadeleri:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(companyLeakageSummary).map(([comp, amt]) => (
              <div key={comp} className="p-3 bg-white border border-rose-200 rounded-xl shadow-xs">
                <span className="text-xs font-bold text-slate-900 block">{comp}</span>
                <span className="text-base font-black text-rose-700 font-mono mt-0.5 block">
                  +{amt.toLocaleString('tr-TR')} ₺
                </span>
                <span className="text-[10px] text-slate-500">Mutabakat Farkı</span>
              </div>
            ))}
          </div>
        </div>

        {/* Uyuşmazlık Maddeleri Tablosu */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Uyuşmazlık Konusu Poliçeler Dökümü:
          </span>
          <div className="overflow-x-auto rounded-xl border border-slate-200 text-xs max-h-56">
            <table className="w-full text-left">
              <thead className="bg-slate-100 font-bold text-slate-700 sticky top-0">
                <tr>
                  <th className="p-2.5">Poliçe No</th>
                  <th className="p-2.5">Şirket</th>
                  <th className="p-2.5">Müşteri</th>
                  <th className="p-2.5 text-right">Prim</th>
                  <th className="p-2.5 text-center">Sözleşme</th>
                  <th className="p-2.5 text-center">Ödenen</th>
                  <th className="p-2.5 text-right text-rose-700">Fark (İade)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {leakages.map(item => (
                  <tr key={item.id}>
                    <td className="p-2.5 font-bold text-slate-900">{item.policyNo}</td>
                    <td className="p-2.5 font-sans font-semibold text-slate-700">{item.companyName}</td>
                    <td className="p-2.5 font-sans text-slate-600 truncate max-w-[120px]">{item.customerName}</td>
                    <td className="p-2.5 text-right text-slate-800">{item.grossPremium.toLocaleString('tr-TR')} ₺</td>
                    <td className="p-2.5 text-center text-emerald-700 font-bold">%{item.contractCommissionRate}</td>
                    <td className="p-2.5 text-center text-rose-700 font-bold">%{item.appliedCommissionRate}</td>
                    <td className="p-2.5 text-right font-black text-rose-700">+{item.leakageAmount.toLocaleString('tr-TR')} ₺</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resmi Hukuki İtiraz Metni (TTK 102 Şerhi) */}
        <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl text-[11px] text-slate-700 leading-relaxed font-serif space-y-1.5">
          <span className="font-sans font-bold text-slate-900 block uppercase">
            Yasal Dayanak & Hakediş İtiraz Beyanı (TTK Md. 102):
          </span>
          <p>
            İşbu denetim raporu; 6102 sayılı Türk Ticaret Kanunu'nun (TTK) 102. maddesi ve Sigorta Acenteleri Yönetmeliği hükümleri tahtında tanzim edilmiştir. 
            Yukarıda dökümü sunulan poliçelerde acentelik sözleşmemizde akdedilen komisyon oranlarının altında tahakkuk yapıldığı ve 
            toplam <strong>{totalLeakageAmount.toLocaleString('tr-TR')} TL</strong> tutarında eksik tahakkuk ve kesinti uygulandığı tespit edilmiştir. 
            Sözleşme ve ilgili mevzuat kurallarına göre yeniden incelenmesi ve söz konusu bakiye alacağımızın işbu bildirimin tebliğinden itibaren 7 (yedi) iş günü içerisinde acente cari hesabımıza mahsuben ödenmesi talep olunur.
          </p>
        </div>

        {/* Kaşe ve İmza Alanı */}
        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">E-İmza & Zaman Damgası:</span>
            <span className="font-mono text-[11px] text-slate-700 font-bold">SHA256: 8F92-A104-E294-B771-TTK102</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block">Acente Yetkilisi & Mali Koordinatör</span>
            <div className="w-32 border-b border-slate-400 my-2" />
            <span className="font-bold text-slate-900">Mühür & Kaşe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
