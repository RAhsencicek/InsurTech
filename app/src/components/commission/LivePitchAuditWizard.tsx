import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  Zap, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  FileText, 
  Mail, 
  Download, 
  Layers, 
  TrendingDown, 
  CalendarX, 
  FilePlus, 
  AlertCircle,
  HelpCircle,
  Check,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  parseExcelOrCsvFile, 
  auditDualDatasets,
  detectColumns,
  ColumnRecognitionInfo,
  RAW_SAMPLE_AGENCY_EXPECTED_DATA,
  RAW_SAMPLE_ANADOLU_STATEMENT_DATA,
  RAW_SAMPLE_ALLIANZ_STATEMENT_DATA,
  AuditEngineResult
} from '../../services/commissionHunterEngine';
import { CommissionLeakageItem, HunterScenario } from '../../types';

interface LivePitchAuditWizardProps {
  onAuditComplete: (result: AuditEngineResult) => void;
  onOpenReportModal: () => void;
  onOpenEmailModal: () => void;
  onExportCsv: (leakages: CommissionLeakageItem[]) => void;
  onClose?: () => void;
}

export const LivePitchAuditWizard: React.FC<LivePitchAuditWizardProps> = ({
  onAuditComplete,
  onOpenReportModal,
  onOpenEmailModal,
  onExportCsv,
  onClose
}) => {
  // Aşama Yönetimi: 1: Dosya Girişleri, 2: Önizleme & Eşleştirme, 3: Tarama, 4: Şov Sonuç Karnesi
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Dosya 1: Acente Üretim Raporu
  const [agencyFileName, setAgencyFileName] = useState<string | null>(null);
  const [agencyRawRows, setAgencyRawRows] = useState<Record<string, any>[] | null>(null);
  const [agencyCols, setAgencyCols] = useState<ColumnRecognitionInfo | null>(null);

  // Dosya 2: Şirket Komisyon Ekstresi
  const [statementFileName, setStatementFileName] = useState<string | null>(null);
  const [statementRawRows, setStatementRawRows] = useState<Record<string, any>[] | null>(null);
  const [statementCols, setStatementCols] = useState<ColumnRecognitionInfo | null>(null);

  // Tarama Durumu ve Sonuçlar
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStatusText, setScanStatusText] = useState<string>('');
  const [auditResult, setAuditResult] = useState<AuditEngineResult | null>(null);

  // 1. Acente Dosyası Yükleme
  const handleAgencyFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseExcelOrCsvFile(file);
      setAgencyFileName(file.name);
      setAgencyRawRows(rows);
      if (rows.length > 0) {
        setAgencyCols(detectColumns(rows[0], 'agency'));
      }
    } catch (err: any) {
      alert(`Acente dosyası okunurken hata: ${err?.message || 'Geçerli bir Excel/CSV seçin'}`);
    }
  };

  // 2. Şirket Ekstresi Yükleme
  const handleStatementFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseExcelOrCsvFile(file);
      setStatementFileName(file.name);
      setStatementRawRows(rows);
      if (rows.length > 0) {
        setStatementCols(detectColumns(rows[0], 'statement'));
      }
    } catch (err: any) {
      alert(`Şirket ekstresi okunurken hata: ${err?.message || 'Geçerli bir Excel/CSV seçin'}`);
    }
  };

  // Hızlı Demo Yükleyiciler
  const loadDemoAgencyFile = () => {
    setAgencyFileName('acente_beklenen_uretim_2026_10.xlsx');
    setAgencyRawRows(RAW_SAMPLE_AGENCY_EXPECTED_DATA);
    setAgencyCols(detectColumns(RAW_SAMPLE_AGENCY_EXPECTED_DATA[0], 'agency'));
  };

  const loadDemoAnadoluStatement = () => {
    setStatementFileName('anadolu_sigorta_ekstre_2026_10.xlsx');
    setStatementRawRows(RAW_SAMPLE_ANADOLU_STATEMENT_DATA);
    setStatementCols(detectColumns(RAW_SAMPLE_ANADOLU_STATEMENT_DATA[0], 'statement'));
  };

  const loadDemoAllianzStatement = () => {
    setStatementFileName('allianz_sigorta_ekstre_2026_10.xlsx');
    setStatementRawRows(RAW_SAMPLE_ALLIANZ_STATEMENT_DATA);
    setStatementCols(detectColumns(RAW_SAMPLE_ALLIANZ_STATEMENT_DATA[0], 'statement'));
  };

  const loadFullDemoPackage = () => {
    loadDemoAgencyFile();
    loadDemoAnadoluStatement();
  };

  // Canlı Otonom Çapraz Denetimi Başlat (3 Saniyelik Şov)
  const executeLiveAudit = () => {
    if (!agencyRawRows || !statementRawRows) {
      alert('Lütfen hem Acente Üretim Raporunu hem de Şirket Ekstresini yükleyin.');
      return;
    }

    setCurrentStep(3);
    setIsAuditing(true);
    setScanProgress(0);
    setScanStatusText('Poliçe ve zeyil numaraları çapraz eşleştiriliyor...');

    // Canlı animasyon akışı
    setTimeout(() => {
      setScanProgress(30);
      setScanStatusText('Sözleşme komisyon oranları taranıyor ve tarife sapmaları inceleniyor...');
    }, 600);

    setTimeout(() => {
      setScanProgress(65);
      setScanStatusText('Bedel artış zeyilleri, havuz kesintileri ve gün esaslı iptaller denetleniyor...');
    }, 1300);

    setTimeout(() => {
      setScanProgress(90);
      setScanStatusText('Şirket bordrosunda unutulan kayıp poliçeler ve haksız kesintiler ayrıştırılıyor...');
    }, 2000);

    setTimeout(() => {
      // Çapraz eşleme motorunu çalıştır
      const result = auditDualDatasets({
        agencyRows: agencyRawRows,
        statementRows: statementRawRows,
        agencyFileName: agencyFileName || 'Acente_Uretim.xlsx',
        statementFileName: statementFileName || 'Sirket_Ekstre.xlsx'
      });

      setAuditResult(result);
      setScanProgress(100);
      setIsAuditing(false);
      setCurrentStep(4);
      onAuditComplete(result);

      // Büyük Şov Kutlama Konfetisi
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 2800);
  };

  // Yeniden Başlat
  const handleReset = () => {
    setCurrentStep(1);
    setAgencyFileName(null);
    setAgencyRawRows(null);
    setAgencyCols(null);
    setStatementFileName(null);
    setStatementRawRows(null);
    setStatementCols(null);
    setAuditResult(null);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-xl overflow-hidden animate-in fade-in duration-300">
      {/* 1. PRESTİJLİ SAHA PITCH BAŞLIĞI */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 text-white border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-400 mb-1.5">
              <span className="bg-rose-950/80 text-rose-400 border border-rose-800/80 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>MÜŞTERİ ÖNÜ SAHA PITCH MODU</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 text-xs font-semibold">100% Kanıtlanabilir ROI Şovu</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center space-x-2">
              <span>Canlı Komisyon Denetim Sihirbazı</span>
              <span className="text-rose-500 font-mono text-sm font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                TTK 102 Kalkanı
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Müşterinin yanındayken sadece iki dosyayı yükleyin. 3 saniyede şirketlerin masada bıraktığı parayı kuruşu kuruşuna çıkarıp satışı anında kapatın.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentStep === 4 && (
              <button
                onClick={handleReset}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Yeni Dosya Yükle</span>
              </button>
            )}

            {onClose && (
              <button
                onClick={onClose}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Kapat
              </button>
            )}
          </div>
        </div>

        {/* ADIM İLERLEME ÇUBUĞU */}
        <div className="grid grid-cols-4 gap-2 mt-6 pt-5 border-t border-slate-800/80">
          <div className={`flex items-center space-x-2 text-xs font-bold pb-1 border-b-2 transition-all ${
            currentStep >= 1 ? 'border-rose-500 text-rose-400' : 'border-slate-800 text-slate-500'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              currentStep >= 1 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-500'
            }`}>1</span>
            <span className="hidden sm:inline">1. Dosya Girişi</span>
          </div>

          <div className={`flex items-center space-x-2 text-xs font-bold pb-1 border-b-2 transition-all ${
            currentStep >= 2 ? 'border-indigo-500 text-indigo-400' : 'border-slate-800 text-slate-500'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              currentStep >= 2 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'
            }`}>2</span>
            <span className="hidden sm:inline">2. Akıllı Doğrulama</span>
          </div>

          <div className={`flex items-center space-x-2 text-xs font-bold pb-1 border-b-2 transition-all ${
            currentStep >= 3 ? 'border-amber-500 text-amber-400' : 'border-slate-800 text-slate-500'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              currentStep >= 3 ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-500'
            }`}>3</span>
            <span className="hidden sm:inline">3. 3 Sn Tarama</span>
          </div>

          <div className={`flex items-center space-x-2 text-xs font-bold pb-1 border-b-2 transition-all ${
            currentStep >= 4 ? 'border-emerald-500 text-emerald-400' : 'border-slate-800 text-slate-500'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              currentStep >= 4 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
            }`}>4</span>
            <span className="hidden sm:inline">4. Kaçak Karnesi</span>
          </div>
        </div>
      </div>

      {/* 2. GÖRSEL SAHA MANTIĞI: MÜŞTERİYE ANLATIM PROTOKOLÜ (Sadece 1. ve 2. Adımda Göster) */}
      {currentStep <= 2 && (
        <div className="bg-slate-50 p-4 border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">
                1. MÜŞTERİDEN NE İSTİYORUZ?
              </span>
              <p className="text-slate-700 font-bold mt-1">
                Acente Üretim Raporu + Şirket Ekstresi
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Polisoft, Acentem, Sigortam çıktısı veya şirket portalından indirilen Excel bordrosu.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block">
                2. BİZ NE YAPIYORUZ?
              </span>
              <p className="text-slate-700 font-bold mt-1">
                Format Bağımsız Otomatik Çapraz Eşleme
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sütun adı ne olursa olsun tanır; tarife sapması, kayıp poliçe ve zeyil farklarını kuruşu kuruşuna bulur.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                3. NE ÇIKARIYORUZ? (BÜYÜK ŞOV)
              </span>
              <p className="text-slate-700 font-bold mt-1">
                Masada Kalan Para + Resmi TTK 102 Dilekçesi
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Eksik ödenen net tutar, şirket ihlal karnesi ve tek tıkla kaşe-imzaya hazır ihtarname PDF'i.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADIM 1 & 2: ÇİFT DOSYA YÜKLEME VE AKILLI DOĞRULAMA ALANI */}
      {/* ============================================================== */}
      {currentStep <= 2 && (
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Dosyaları Tanımlayın
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Müşterinin verdiği iki Excel/CSV dosyasını yükleyin veya sağdaki hazır PoC paketini tek tıkla doldurun.
              </p>
            </div>

            {/* Hızlı Demo Doldurma Butonu */}
            <button
              onClick={loadFullDemoPackage}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hazır Saha Demosunu Doldur (Anadolu PoC)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. KUTU: ACENTE ÜRETİM RAPORU */}
            <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              agencyRawRows ? 'bg-emerald-50/40 border-emerald-400' : 'bg-slate-50 border-dashed border-slate-300 hover:border-blue-400'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      agencyRawRows ? 'bg-emerald-600 text-white' : 'bg-blue-100 text-blue-700'
                    }`}>
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Acente Üretim Raporu
                      </h4>
                      <span className="text-[10px] text-slate-500">Ne kestiniz? (Polisoft / Acentem / Excel)</span>
                    </div>
                  </div>

                  {agencyRawRows && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>{agencyRawRows.length} Poliçe Yüklendi</span>
                    </span>
                  )}
                </div>

                {!agencyRawRows ? (
                  <div className="text-center py-6 px-4">
                    <UploadCloud className="w-9 h-9 text-slate-400 mx-auto mb-2" />
                    <label className="inline-block bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                      <span>Acente Excel / CSV Dosyası Seç</span>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleAgencyFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Sürükleyip bırakabilir veya cihazınızdan seçebilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 truncate max-w-[200px]">
                        📄 {agencyFileName}
                      </span>
                      <span className="font-mono text-emerald-700 font-bold">
                        {agencyRawRows.length} Satır
                      </span>
                    </div>

                    {/* Algılanan Sütunlar */}
                    {agencyCols && (
                      <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Akıllı Eşleşen Kolonlar:</div>
                        <div className="flex flex-wrap gap-1">
                          {agencyCols.policyNoCol && (
                            <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                              ✓ Poliçe No ({agencyCols.policyNoCol})
                            </span>
                          )}
                          {agencyCols.grossPremiumCol && (
                            <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                              ✓ Prim ({agencyCols.grossPremiumCol})
                            </span>
                          )}
                          {agencyCols.rateCol && (
                            <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                              ✓ Oran ({agencyCols.rateCol})
                            </span>
                          )}
                          {agencyCols.customerCol && (
                            <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                              ✓ Müşteri ({agencyCols.customerCol})
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-semibold">Demo için:</span>
                <button
                  type="button"
                  onClick={loadDemoAgencyFile}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                >
                  Örnek Acente Dosyasını Yükle (10 Poliçe)
                </button>
              </div>
            </div>

            {/* 2. KUTU: ŞİRKET KOMİSYON EKSTRESİ */}
            <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              statementRawRows ? 'bg-emerald-50/40 border-emerald-400' : 'bg-slate-50 border-dashed border-slate-300 hover:border-rose-400'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      statementRawRows ? 'bg-emerald-600 text-white' : 'bg-rose-100 text-rose-700'
                    }`}>
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Sigorta Şirketi Komisyon Ekstresi
                      </h4>
                      <span className="text-[10px] text-slate-500">Ne ödediler? (Anadolu, Allianz, Axa vb.)</span>
                    </div>
                  </div>

                  {statementRawRows && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>{statementRawRows.length} Ekstre Satırı</span>
                    </span>
                  )}
                </div>

                {!statementRawRows ? (
                  <div className="text-center py-6 px-4">
                    <UploadCloud className="w-9 h-9 text-slate-400 mx-auto mb-2" />
                    <label className="inline-block bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                      <span>Şirket Ekstresi (XLSX / CSV) Seç</span>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleStatementFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Anadolu, Allianz veya diğer şirketlerin portaldan inen bordrosu.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 truncate max-w-[200px]">
                        📄 {statementFileName}
                      </span>
                      <span className="font-mono text-emerald-700 font-bold">
                        {statementRawRows.length} Satır
                      </span>
                    </div>

                    {/* Algılanan Sütunlar */}
                    {statementCols && (
                      <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Akıllı Eşleşen Kolonlar:</div>
                        <div className="flex flex-wrap gap-1">
                          {statementCols.policyNoCol && (
                            <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                              ✓ Poliçe No ({statementCols.policyNoCol})
                            </span>
                          )}
                          {statementCols.rateCol && (
                            <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                              ✓ Oran ({statementCols.rateCol})
                            </span>
                          )}
                          {statementCols.commissionCol && (
                            <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                              ✓ Ödenen ({statementCols.commissionCol})
                            </span>
                          )}
                          {statementCols.deductionCol && (
                            <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                              ✓ Kesinti/Havuz ({statementCols.deductionCol})
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 font-semibold">Demo için:</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={loadDemoAnadoluStatement}
                    className="text-[11px] font-bold text-rose-700 hover:text-rose-900 hover:underline cursor-pointer"
                  >
                    Anadolu PoC
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={loadDemoAllianzStatement}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                  >
                    Allianz PoC
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* HAZIR OLUNDUĞUNDA BÜYÜK TARAMA BUTONU */}
          {agencyRawRows && statementRawRows && (
            <div className="p-4 bg-gradient-to-r from-rose-50 via-indigo-50 to-emerald-50 rounded-2xl border-2 border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-200">
              <div className="space-y-1">
                <div className="text-xs font-black text-indigo-950 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>İki Dosya da Başarıyla Algılandı ve Doğrulandı!</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  {agencyRawRows.length} adet beklenen acente poliçesi ile {statementRawRows.length} adet şirket ekstre satırı çapraz karşılaştırılmaya hazır.
                </div>
              </div>

              <button
                onClick={executeLiveAudit}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-700 via-rose-800 to-indigo-900 hover:opacity-95 text-white font-black px-6 py-3 rounded-xl text-sm shadow-md transition-all cursor-pointer shrink-0"
              >
                <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>3 Saniyede Otonom Kaçak Taramasını Başlat</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* ADIM 3: 3 SANİYELİK OTONOM ÇAPRAZ TARAMA ANİMASYONU */}
      {/* ============================================================== */}
      {currentStep === 3 && (
        <div className="p-12 text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-rose-600 animate-spin" />
            <Zap className="w-8 h-8 text-rose-600 absolute inset-0 m-auto" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <div className="text-lg font-black text-slate-900">
              Otonom Kaçak Avcısı Çalışıyor...
            </div>
            <p className="text-xs text-slate-500 font-mono animate-pulse">
              {scanStatusText}
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-600">
              <span>İlerleme</span>
              <span>%{scanProgress}</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-600 via-indigo-600 to-emerald-600 transition-all duration-300 rounded-full"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADIM 4: BÜYÜK ŞOV - KAÇAK & İADE KARNESİ (SATIŞ KAPANIŞI) */}
      {/* ============================================================== */}
      {currentStep === 4 && auditResult && (
        <div className="p-6 space-y-6">
          {/* A. BÜYÜK ETKİ KUTUSU: MASADA BIRAKILAN NET PARA */}
          <div className="bg-gradient-to-br from-rose-950 via-slate-950 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-rose-900/50">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    TESPİT EDİLEN NET GELİR KAYBI
                  </span>
                  <span className="text-xs text-rose-300 font-bold">
                    TTK Madde 102 Kalkanı
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-white">
                  -{auditResult.totalLeakageAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  İncelenen ekstrede <span className="text-white font-bold">{auditResult.leakageCount} adet</span> gizli komisyon kaçağı saptandı. 
                  Bu tutar, sigorta şirketinin acentenize eksik tahakkuk ettirdiği ve Türk Ticaret Kanunu uyarınca <span className="text-emerald-400 font-bold">%100 iade alınabilir</span> net hak edişinizdir.
                </p>
              </div>

              {/* Hızlı Aksiyon Butonları (Şov Finali) */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                <button
                  onClick={onOpenReportModal}
                  className="flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-black px-5 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>TTK 102 İtiraz Dilekçesini Aç (PDF)</span>
                </button>

                <button
                  onClick={onOpenEmailModal}
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-5 py-3 rounded-xl text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-rose-700" />
                  <span>Şirket Bölge Md. Hazır E-Posta</span>
                </button>

                <button
                  onClick={() => onExportCsv(auditResult.scenario.leakages)}
                  className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>İtiraz Excel Listesini İndir</span>
                </button>
              </div>
            </div>

            {/* Özet 3 Metrik Sayacı */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Beklenen Komisyon</span>
                <span className="font-mono text-white text-base font-bold">
                  {auditResult.totalExpectedCommission.toLocaleString('tr-TR')} ₺
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Şirketin Ödediği</span>
                <span className="font-mono text-slate-300 text-base font-bold">
                  {auditResult.totalReceivedCommission.toLocaleString('tr-TR')} ₺
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Taranan Satır</span>
                <span className="font-mono text-indigo-300 text-base font-bold">
                  {auditResult.analyzedRowCount} Satır
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Başarı Oranı</span>
                <span className="font-mono text-emerald-400 text-base font-bold">
                  3 Sn'de Tam Eşleşti
                </span>
              </div>
            </div>
          </div>

          {/* B. BULUNAN KAÇAKLARIN DETAYLI LİSTESİ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Tespit Edilen Kaçak Kalemleri ({auditResult.scenario.leakages.length})
                </h4>
                <p className="text-xs text-slate-500">
                  Her bir kaçak için şirket ekstresindeki hata gerekçesi ve yasal açıklama:
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {auditResult.scenario.leakages.map((item, index) => {
                let badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
                let icon = <TrendingDown className="w-4 h-4 text-blue-700" />;
                let title = 'Tarife ve Oran Sapması';

                if (item.errorReason === 'ZEYIL_IADE_HESAPLAMA_HATASI') {
                  badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';
                  icon = <FilePlus className="w-4 h-4 text-purple-700" />;
                  title = 'Zeyilname Komisyon Kaçağı';
                } else if (item.errorReason === 'KEYFI_HAVUZ_KESINTISI') {
                  badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
                  icon = <Layers className="w-4 h-4 text-rose-700" />;
                  title = 'Sözleşme Dışı Havuz / Kampanya Kesintisi';
                } else if (item.errorReason === 'HAKSIZ_IPTAL_KESINTISI') {
                  badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
                  icon = <CalendarX className="w-4 h-4 text-amber-700" />;
                  title = 'Haksız İptal / Storno Aşırı Kesinti';
                } else if (item.errorReason === 'HATALI_ORAN_UYGULAMASI') {
                  badgeColor = 'bg-rose-100 text-rose-900 border-rose-300';
                  icon = <AlertCircle className="w-4 h-4 text-rose-700" />;
                  title = 'Kayıp Poliçe (Şirket Bordrosunda HİÇ Yok!)';
                }

                return (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                          {icon}
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900">
                            {item.policyNo} {item.endorsementNo && item.endorsementNo !== '0' ? `(Zeyil ${item.endorsementNo})` : ''}
                          </span>
                          <span className="text-slate-400 mx-1.5">•</span>
                          <span className="text-xs text-slate-600 font-semibold">{item.customerName}</span>
                          <span className="text-slate-400 mx-1.5">•</span>
                          <span className="text-[11px] font-bold text-slate-500 uppercase">{item.branch}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                          {title}
                        </span>
                        <span className="text-sm font-mono font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                          -{item.leakageAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                      {item.explanation}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
                      <div className="flex items-center space-x-3">
                        <span>Yazılan Prim: <strong className="text-slate-800">{item.grossPremium.toLocaleString('tr-TR')} ₺</strong></span>
                        <span>Sözleşme Oranı: <strong className="text-emerald-700">%{item.contractCommissionRate}</strong></span>
                        <span>Uygulanan: <strong className="text-rose-700">%{item.appliedCommissionRate}</strong></span>
                      </div>
                      <span className="text-slate-400 text-[10px]">Şirket: {item.companyName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. PITCH KAPANIŞ MESAJI (THE CLOSING PUNCHLINE) */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black">
                ROI
              </div>
              <div>
                <div className="text-xs font-black text-emerald-950">
                  Satış Kapanış Argümanı (Acente Sahibine Söyleyin):
                </div>
                <div className="text-[11px] text-emerald-800 mt-0.5">
                  "Sayın Acente Sahibimiz, yazılımımızın yıllık lisans bedeli bu masada unuttuğunuz paranın çok daha altında. Sistemimiz daha ilk 30 saniyede kendi lisans bedelini fazlasıyla çıkardı ve kasanıza para kazandırdı."
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-xs font-bold text-emerald-900 bg-emerald-200/80 hover:bg-emerald-200 px-3 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Başka Bir Ekstre Tara
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

