import React, { useState } from 'react';
import { Mail, X, Check, Copy } from 'lucide-react';
import { CommissionLeakageItem } from '../../types';

interface CommissionEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  leakages: CommissionLeakageItem[];
  companyLeakageSummary: Record<string, number>;
  totalLeakageAmount: number;
  onToast: (msg: string) => void;
}

export const CommissionEmailModal: React.FC<CommissionEmailModalProps> = ({
  isOpen,
  onClose,
  leakages,
  companyLeakageSummary,
  totalLeakageAmount,
  onToast
}) => {
  const companyKeys = Object.keys(companyLeakageSummary);
  const [selectedCompany, setSelectedCompany] = useState<string>(companyKeys[0] || 'Allianz Sigorta');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  if (!isOpen) return null;

  const compLeak = companyLeakageSummary[selectedCompany] || totalLeakageAmount;
  const compPolicies = leakages.filter(l => l.companyName === selectedCompany);
  const policyDetails = compPolicies.length > 0 
    ? compPolicies.map(p => `• Poliçe No: ${p.policyNo} | Zeyil: ${p.endorsementNo || '0'} | Müşteri: ${p.customerName} | Prim: ${p.grossPremium.toLocaleString('tr-TR')} ₺ | Sözleşme Oranı: %${p.contractCommissionRate} | Uygulanan Oran: %${p.appliedCommissionRate} | Fark: ${p.leakageAmount.toLocaleString('tr-TR')} ₺ (${p.explanation || p.errorReason})`).join('\n')
    : `• Toplam Uyuşmazlık Tutarı: ${compLeak.toLocaleString('tr-TR')} ₺`;

  const emailBody = `Konu: [HAKEDİŞ MUTABAKATI] TTK 102 Kapsamında Komisyon Farkı İnceleme ve İade Talebi - Ref: AUDIT-2026-OCT-8492

Sayın ${selectedCompany} Acente İlişkileri ve Muhasebe Bölge Müdürlüğü'ne,

Acenteliğimiz ile şirketiniz arasında yürürlükte bulunan Acentelik Sözleşmesi ve 6102 sayılı Türk Ticaret Kanunu'nun (TTK) 102. maddesi kapsamında; son dönem hakediş ekstreniz acente operasyon sistemimizce incelenmiş ve çapraz denetimden geçirilmiştir.

Denetim neticesinde şirketiniz tarafından acentemize tahakkuk ettirilen hakedişte toplam ${compLeak.toLocaleString('tr-TR')} ₺ tutarında eksik ödeme ve sözleşme harici kesinti tespit edilmiştir.

İncelenmesi Talep Edilen Poliçeler:
${policyDetails}

Sözleşme ve ilgili mevzuat kurallarına göre yeniden incelenmesi gereken bu kesintiler için, bahsi geçen ${compLeak.toLocaleString('tr-TR')} ₺ tutarındaki bakiye alacağımızın işbu yazının tebliğinden itibaren 7 (yedi) iş günü içerisinde cari hesabımıza mahsuben ödenmesini rica ederiz.

Saygılarımızla,
Hayat İşleri Sigorta & Reasürans Brokerlığı A.Ş.
Mali İşler & Acente Operasyonları Koordinatörlüğü
İletişim: muhasebe@hayatisleri.com.tr | Tel: 0216 410 80 80`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
    onToast('Resmi itiraz e-postası panoya kopyalandı.');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 my-auto text-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Sigorta Şirketine Tek Tıkla Resmi İtiraz E-Postası
              </h3>
              <p className="text-[11px] text-slate-500">
                TTK 102 maddesi referansıyla hazırlanmış resmi iade talep yazısı
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Şirket Seçici */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            İtiraz Edilecek Sigorta Şirketi:
          </label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500"
          >
            {companyKeys.map(comp => (
              <option key={comp} value={comp}>
                {comp} — {companyLeakageSummary[comp].toLocaleString('tr-TR')} ₺ Kaçak Alacak
              </option>
            ))}
          </select>
        </div>

        {/* E-Posta Önizleme Metin Kutusu */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-700">Resmi E-Posta Metni:</span>
            <span className="text-[10px] text-rose-700 font-bold">Hukuken Bağlayıcı İtiraz Şablonu</span>
          </div>
          <textarea
            readOnly
            value={emailBody}
            rows={11}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Alt Butonlar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <a
            href={`mailto:muhasebe@${selectedCompany.toLowerCase().replace(/[^a-z]/g, '')}.com.tr?subject=${encodeURIComponent('[HAKEDİŞ İTİRAZI] TTK 102 Uyarınca Eksik Komisyon İade Talebi')}&body=${encodeURIComponent(emailBody)}`}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>E-Posta Programında Aç (Mailto)</span>
          </a>

          <button
            onClick={handleCopy}
            className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
          >
            {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedEmail ? 'Panoya Kopyalandı!' : 'Metni Kopyala'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
