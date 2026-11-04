import React, { useState } from 'react';
import { 
  Database, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  FileSpreadsheet, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  Building2,
  FileCheck2,
  Users,
  Search,
  Check,
  AlertTriangle,
  FileText,
  Car,
  HeartPulse,
  Home,
  CheckSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MigrationWizardViewProps {
  onMigrationComplete: () => void;
}

interface MockImportRow {
  id: string;
  customerName: string;
  identityNo: string;
  branch: string;
  plateOrAddress: string;
  policyNo: string;
  companyName: string;
  grossPremium: number;
  commissionAmount: number;
  endDate: string;
  status: 'VALID' | 'FIXED' | 'MERGED';
}

const SAMPLE_IMPORT_ROWS: MockImportRow[] = [
  {
    id: 'row_1',
    customerName: 'Selin Yılmaz Kurt',
    identityNo: '39281740192',
    branch: 'KASKO',
    plateOrAddress: '34 SYK 920',
    policyNo: 'ALZ-849102',
    companyName: 'Allianz Sigorta',
    grossPremium: 24500,
    commissionAmount: 4900,
    endDate: '18.11.2026',
    status: 'VALID'
  },
  {
    id: 'row_2',
    customerName: 'Dr. Barış Demir',
    identityNo: '10948291048',
    branch: 'TSS',
    plateOrAddress: 'Network A VIP',
    policyNo: 'AND-928104',
    companyName: 'Anadolu Sigorta',
    grossPremium: 14200,
    commissionAmount: 2556,
    endDate: '14.12.2026',
    status: 'VALID'
  },
  {
    id: 'row_3',
    customerName: 'Teknoloji A.Ş. (Filo)',
    identityNo: '8291048291',
    branch: 'TRAFIK',
    plateOrAddress: '14 Araçlık Filo',
    policyNo: 'SMP-104928',
    companyName: 'Sompo Sigorta',
    grossPremium: 98000,
    commissionAmount: 9800,
    endDate: '29.08.2026',
    status: 'VALID'
  },
  {
    id: 'row_4',
    customerName: 'Ayşe Gökçe',
    identityNo: '58201948291',
    branch: 'DASK',
    plateOrAddress: 'UAVT: 1940284719',
    policyNo: 'TRK-294018',
    companyName: 'Türkiye Sigorta',
    grossPremium: 1850,
    commissionAmount: 277,
    endDate: '02.05.2027',
    status: 'VALID'
  },
  {
    id: 'row_5',
    customerName: 'Kemal Can Güven',
    identityNo: '48201948102',
    branch: 'KASKO',
    plateOrAddress: '34 KCG 104',
    policyNo: 'ALZ-391029',
    companyName: 'Allianz Sigorta',
    grossPremium: 31200,
    commissionAmount: 5616,
    endDate: '11.02.2027',
    status: 'FIXED' // Otomatik düzeltilen TCKN
  },
  {
    id: 'row_6',
    customerName: 'Eren Otomotiv Ltd.',
    identityNo: '3049182049',
    branch: 'ISYERI',
    plateOrAddress: 'Maslak Sanayi Sitesi',
    policyNo: 'AXA-940281',
    companyName: 'AXA Sigorta',
    grossPremium: 46000,
    commissionAmount: 9200,
    endDate: '30.01.2027',
    status: 'VALID'
  },
  {
    id: 'row_7',
    customerName: 'Mehmet Ali Yılmaz',
    identityNo: '28472910482',
    branch: 'KASKO',
    plateOrAddress: '34 VR 8920',
    policyNo: 'QCK-592810',
    companyName: 'Quick Sigorta',
    grossPremium: 19400,
    commissionAmount: 3492,
    endDate: '24.10.2026',
    status: 'MERGED' // Mükerrer birleştirilen kayıt
  },
  {
    id: 'row_8',
    customerName: 'Zeynep Aktaş',
    identityNo: '69482019482',
    branch: 'KONUT',
    plateOrAddress: 'UAVT: 2849102841',
    policyNo: 'AND-491028',
    companyName: 'Anadolu Sigorta',
    grossPremium: 5800,
    commissionAmount: 1276,
    endDate: '19.09.2026',
    status: 'VALID'
  }
];

export const MigrationWizardView: React.FC<MigrationWizardViewProps> = ({
  onMigrationComplete
}) => {
  // 4 Adımlı Göç Akışı: 1 = Dosya Seçimi, 2 = Önizleme Tablosu, 3 = Kontrol & Doğrulama, 4 = Tamamlandı
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSource, setSelectedSource] = useState<'POLISOFT' | 'POLIXIR' | 'EXCEL'>('POLISOFT');
  const [selectedPresetFile, setSelectedPresetFile] = useState<string>('polisoft_kadikoy_sube_2026.bak');
  const [previewSearchTerm, setPreviewSearchTerm] = useState<string>('');
  const [isProcessingMigration, setIsProcessingMigration] = useState<boolean>(false);
  const [migrationProgress, setMigrationProgress] = useState<number>(0);
  const [autoFixErrors, setAutoFixErrors] = useState<boolean>(true);

  // Dosya Önizleme Verisi
  const filteredPreviewRows = SAMPLE_IMPORT_ROWS.filter(r => 
    r.customerName.toLowerCase().includes(previewSearchTerm.toLowerCase()) ||
    r.identityNo.includes(previewSearchTerm) ||
    r.plateOrAddress.toLowerCase().includes(previewSearchTerm.toLowerCase()) ||
    r.companyName.toLowerCase().includes(previewSearchTerm.toLowerCase())
  );

  const totalImportPremium = SAMPLE_IMPORT_ROWS.reduce((sum, r) => sum + r.grossPremium, 0);
  const totalImportCommission = SAMPLE_IMPORT_ROWS.reduce((sum, r) => sum + r.commissionAmount, 0);

  // Göçü Başlat (Adım 3 -> 4)
  const handleExecuteMigration = () => {
    setIsProcessingMigration(true);
    setMigrationProgress(0);

    const interval = setInterval(() => {
      setMigrationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessingMigration(false);
          setActiveStep(4);
          confetti({
            particleCount: 110,
            spread: 70,
            origin: { y: 0.6 }
          });
          return 100;
        }
        return prev + 20;
      });
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Kurumsal Güvence */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Sıfır Veri Kaybı Garantili 4 Adımlı Veri Göçü</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Eski Sigorta Yazılımlarından Veri Aktarımı
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Polisoft, Polixir ve Excel formatındaki 15 yıllık müşteri, poliçe ve komisyon arşivinizi <strong>örnek dosya → önizleme → kontrol → onay</strong> akışıyla sıfır kayıpla aktarın.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 shrink-0 flex items-center space-x-3">
          <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
          <div>
            <span className="text-xs font-bold text-emerald-800 block">Eski Sisteme Bağımlılık Bitti</span>
            <span className="text-[10px] text-emerald-600 font-medium">100% Veri Bütünlüğü Doğrulaması</span>
          </div>
        </div>
      </div>

      {/* 4 Adımlı İlerleme Stepper'ı */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { step: 1, title: '1. Örnek Dosya Seçimi', desc: 'Yedek dosyası veya şablon' },
          { step: 2, title: '2. Veri Önizleme', desc: 'Müşteri & poliçe listesi' },
          { step: 3, title: '3. Kontrol & Doğrulama', desc: 'TCKN, plaka & sağlık testi' },
          { step: 4, title: '4. Onay & Portföye Aktar', desc: 'CRM entegrasyonu' }
        ].map((s) => {
          const isCurrent = activeStep === s.step;
          const isDone = activeStep > s.step;

          return (
            <div
              key={s.step}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isCurrent
                  ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-600'
                  : isDone
                  ? 'bg-emerald-50/50 border-emerald-300 text-slate-700'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isCurrent ? 'text-blue-800' : isDone ? 'text-emerald-800' : 'text-slate-600'}`}>
                  {s.title}
                </span>
                {isDone ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="text-[10px] font-mono font-bold text-slate-400">0{s.step}</span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">{s.desc}</span>
            </div>
          );
        })}
      </div>

      {/* ADIM 1: ÖRNEK DOSYA SEÇİMİ / YÜKLEME */}
      {activeStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Kaynak Yazılım Seçimi */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              1. Verilerin Alınacağı Eski Yazılımı ve Formatı Seçin:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Polisoft */}
              <button
                onClick={() => {
                  setSelectedSource('POLISOFT');
                  setSelectedPresetFile('polisoft_kadikoy_sube_2026.bak');
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedSource === 'POLISOFT'
                    ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-900">Polisoft (SKPS / MHS)</span>
                  {selectedSource === 'POLISOFT' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  Firebird DB (.fdb), SQL Server (.bak) veya Livelink yedek paketi.
                </p>
              </button>

              {/* Polixir */}
              <button
                onClick={() => {
                  setSelectedSource('POLIXIR');
                  setSelectedPresetFile('polixir_broker_cari_2026.xml');
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedSource === 'POLIXIR'
                    ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-900">Polixir (Broker)</span>
                  {selectedSource === 'POLIXIR' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  XML veri havuzu, cari hesap ekstreleri ve poliçe portföy yedeği.
                </p>
              </button>

              {/* Excel / CSV */}
              <button
                onClick={() => {
                  setSelectedSource('EXCEL');
                  setSelectedPresetFile('excel_portfoy_listesi_2026.xlsx');
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedSource === 'EXCEL'
                    ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-900">Özel Excel / CSV Listeleri</span>
                  {selectedSource === 'EXCEL' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  AcentePlus, SigortaPro veya Excel'de tutulan serbest müşteri/poliçe tabloları.
                </p>
              </button>
            </div>
          </div>

          {/* Dosya Seçim & Yükleme Alanı */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                2. Örnek Yedek Dosyası Seçin veya Bilgisayarınızdan Yükleyin:
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { file: 'polisoft_kadikoy_sube_2026.bak', desc: 'Kadıköy Şubesi • 1.450 Poliçe • 34.2M ₺ Prim', tag: 'SQL Server' },
                { file: 'polixir_broker_cari_2026.xml', desc: 'Genel Müdürlük • 2.890 Poliçe • 58.1M ₺ Prim', tag: 'XML Portföy' },
                { file: 'excel_portfoy_listesi_2026.xlsx', desc: 'Bireysel Portföy • 840 Müşteri & Poliçe', tag: 'Excel Dosyası' }
              ].map(item => (
                <button
                  key={item.file}
                  type="button"
                  onClick={() => setSelectedPresetFile(item.file)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedPresetFile === item.file
                      ? 'bg-blue-50 border-blue-600 shadow-xs ring-1 ring-blue-600'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold bg-white text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded">
                      {item.tag}
                    </span>
                    {selectedPresetFile === item.file && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="text-xs font-bold text-slate-900 font-mono truncate">{item.file}</div>
                  <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>

            {/* Dosya Sürükle Bırak Alanı */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50 flex flex-col items-center justify-center space-y-2 mt-4">
              <UploadCloud className="w-8 h-8 text-blue-600" />
              <div className="text-xs font-bold text-slate-800">
                Seçili Dosya: <strong className="text-blue-700 font-mono">{selectedPresetFile}</strong>
              </div>
              <p className="text-[11px] text-slate-500">
                Sistem dosyayı otomatik olarak şifreleyerek ayrıştırır. Herhangi bir kişisel veri dışarı sızmaz.
              </p>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Dosyayı Oku ve Önizleme Tablosuna Geç</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADIM 2: ÖNİZLEME (PREVIEW TABLOSU) */}
      {activeStep === 2 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">
                  Dosyadan Okunan Müşteri & Poliçe Önizlemesi ({SAMPLE_IMPORT_ROWS.length} Örnek Kayıt)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Yedek dosyasından çıkarılan kayıtlar standartlaştırılmış PostgreSQL şemasına eşlendi.
              </p>
            </div>

            {/* Arama */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={previewSearchTerm}
                onChange={(e) => setPreviewSearchTerm(e.target.value)}
                placeholder="İsim, TCKN veya Plaka ile ara..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* İstatistik Çubuğu */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">Toplam Okunan Prim:</span>
              <span className="font-mono font-black text-slate-900 text-sm">{totalImportPremium.toLocaleString('tr-TR')} ₺</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">Kazanılan Net Komisyon:</span>
              <span className="font-mono font-black text-emerald-700 text-sm">+{totalImportCommission.toLocaleString('tr-TR')} ₺</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">Kaynak Formatı:</span>
              <span className="font-bold text-blue-700">{selectedSource} (.bak)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">Genel Veri Bütünlüğü:</span>
              <span className="font-bold text-emerald-700">%99.7 Kusursuz</span>
            </div>
          </div>

          {/* Önizleme Tablosu */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Sigortalı Adı</th>
                  <th className="py-2.5 px-3">TCKN / VKN</th>
                  <th className="py-2.5 px-3">Branş</th>
                  <th className="py-2.5 px-3">Plaka / UAVT</th>
                  <th className="py-2.5 px-3">Sigorta Şirketi</th>
                  <th className="py-2.5 px-3">Poliçe No</th>
                  <th className="py-2.5 px-3 text-right">Brüt Prim</th>
                  <th className="py-2.5 px-3 text-right">Komisyon</th>
                  <th className="py-2.5 px-3 text-center">Bitiş Tarihi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPreviewRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{row.customerName}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{row.identityNo}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {row.branch}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{row.plateOrAddress}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{row.companyName}</td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{row.policyNo}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{row.grossPremium.toLocaleString('tr-TR')} ₺</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">+{row.commissionAmount.toLocaleString('tr-TR')} ₺</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500 text-[11px]">{row.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Geri Dön</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Veri Sağlık Kontrolünü Başlat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ADIM 3: KONTROL & VERİ DOĞRULAMA (HEALTH CHECK) */}
      {activeStep === 3 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-150">
          <div className="pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-indigo-700">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base font-black text-slate-900">Otomatik Veri Sağlık & Hata Denetimi Raporu</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Yapay zekâ ve algoritma motoru aktarılacak verileri TCKN algoritması, mükerrerlik ve DBS rasyolarına göre denetledi.
            </p>
          </div>

          {/* 4 Teşhis Kartı */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kart 1: Eksiksiz Kayıtlar */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-emerald-900 block">1.446 Kayıt Eksiksiz Eşleşti (%99.7)</span>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Tüm müşteri TCKN, ad soyad, araç plaka ve poliçe prim tutarları veritabanı şemasına tam uyumlu.
                </p>
              </div>
            </div>

            {/* Kart 2: Hatalı TCKN Otomatik Düzeltme */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-blue-900 block">3 Hatalı TCKN Otomatik Düzeltildi</span>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Nüfus Vatandaşlık (NVİ) mod 10/11 sağlama algoritmasıyla basamak hataları tespit edildi ve onarıldı.
                </p>
              </div>
            </div>

            {/* Kart 3: Mükerrer Plaka Birleştirme */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-900 block">1 Mükerrer Plaka Kaydı Birleştirildi</span>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  "34 VR 8920" plakalı Tiguan aracın mükerrer eski kasko kaydı tek bir müşteri profili altında birleştirildi.
                </p>
              </div>
            </div>

            {/* Kart 4: DBS & Muhasebe Bütünlüğü */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-purple-900 block">DBS ve Banka Mutabakat Bütünlüğü: 0 TL Fark</span>
                <p className="text-[11px] text-purple-700 mt-0.5">
                  Acentenin banka teminatı ve DBS limitleriyle birebir örtüşen cari bakiye tutarı doğrulandı.
                </p>
              </div>
            </div>
          </div>

          {/* Otomatik Düzeltme Onay Kutusu */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoFixCheck"
                checked={autoFixErrors}
                onChange={(e) => setAutoFixErrors(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
              <label htmlFor="autoFixCheck" className="font-bold text-slate-800 cursor-pointer">
                Hatalı ve mükerrer kayıtları otomatik temizleyerek portföye aktar (Önerilen)
              </label>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Güvenli Mod
            </span>
          </div>

          {/* İlerleme Çubuğu (Aktarım Çalışırken) */}
          {isProcessingMigration && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-700 font-bold">
                  {migrationProgress < 40 && 'PostgreSQL RLS tablolarına aktarılıyor...'}
                  {migrationProgress >= 40 && migrationProgress < 80 && '1.450 Müşteri ve 3.420 poliçe CRM portföyüne işleniyor...'}
                  {migrationProgress >= 80 && 'Mutabakat indeksleri oluşturuluyor...'}
                </span>
                <span className="text-blue-700 font-black">%{migrationProgress}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                  style={{ width: `${migrationProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              disabled={isProcessingMigration}
              onClick={() => setActiveStep(2)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 disabled:opacity-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Geri Dön</span>
            </button>

            <button
              type="button"
              disabled={isProcessingMigration}
              onClick={handleExecuteMigration}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isProcessingMigration ? 'Aktarılıyor...' : 'Doğrulamayı Onayla ve Portföye Aktar'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ADIM 4: TAMAMLANDI & PORTFÖYE AKTARILDI */}
      {activeStep === 4 && (
        <div className="p-8 bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200">
            <div className="flex items-center space-x-3.5 text-emerald-900">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-xl font-black">Veri Göçü %100 Başarıyla Tamamlandı!</h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  <strong>{selectedSource}</strong> sistemindeki 15 yıllık tüm geçmiş kayıtlarınız sıfır kayıpla yeni nesil InsurTech platformunuza aktarıldı.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold bg-white text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl shadow-xs self-start sm:self-auto font-mono">
              Durum: Canlıya Alındı
            </span>
          </div>

          {/* 4 Özet İstatistik Kartı */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-emerald-200 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Aktarılan Müşteri</span>
              <span className="text-2xl font-black text-slate-900 font-mono">1.450</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-1">✓ TCKN/VKN Doğrulandı</span>
            </div>

            <div className="bg-white border border-emerald-200 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Aktarılan Poliçe</span>
              <span className="text-2xl font-black text-slate-900 font-mono">3.420</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-1">✓ 6 Branş Eşlendi</span>
            </div>

            <div className="bg-white border border-emerald-200 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Taşınan Prim Hacmi</span>
              <span className="text-2xl font-black text-slate-900 font-mono">34.2M ₺</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-1">✓ 0 TL Mutabakat Farkı</span>
            </div>

            <div className="bg-white border border-emerald-200 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Ayrıştırılan Şube</span>
              <span className="text-2xl font-black text-slate-900 font-mono">4 Lokasyon</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-1">✓ PostgreSQL RLS İzolasyonu</span>
            </div>
          </div>

          {/* Alt Aksiyon Butonları */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveStep(1);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
            >
              Başka Bir Dosya Daha Aktar
            </button>

            <button
              type="button"
              onClick={onMigrationComplete}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <span>Aktarılan Portföyü Kokpitte Gör</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
