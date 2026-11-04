import React, { useState, useEffect } from 'react';
import { 
  HUNTER_SCENARIOS, 
  HUNTER_GLOBAL_BENCHMARKS,
  HUNTER_MARKET_STATS,
  LEGAL_SHIELD_TTK_102,
  COMPETITOR_COMPARISON
} from '../data/mockData';
import { 
  CommissionLeakageItem, 
  HunterScenario, 
  AuditorSubPage 
} from '../types';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, LayoutDashboard } from 'lucide-react';

import { CommissionAuditorOverview } from './commission/CommissionAuditorOverview';
import { TariffDeviationView } from './commission/TariffDeviationView';
import { CancellationDeductionView } from './commission/CancellationDeductionView';
import { EndorsementLeakageView } from './commission/EndorsementLeakageView';
import { PoolContractDeductionView } from './commission/PoolContractDeductionView';
import { CommissionReportModal } from './commission/CommissionReportModal';
import { CommissionEmailModal } from './commission/CommissionEmailModal';
import { LivePitchAuditWizard } from './commission/LivePitchAuditWizard';

import { 
  parseExcelOrCsvFile, 
  parseStatementRow, 
  auditCommissionStatement, 
  SAMPLE_ACENTE_EXPECTED_POLICIES,
  AuditEngineResult 
} from '../services/commissionHunterEngine';

interface CommissionAuditorViewProps {
  activeSubPage?: AuditorSubPage;
  onSubPageChange?: (subPage: AuditorSubPage) => void;
}

export const CommissionAuditorView: React.FC<CommissionAuditorViewProps> = ({
  activeSubPage = 'overview',
  onSubPageChange
}) => {
  // Aktif Alt Sayfa (Props ile senkron)
  const [currentSubPage, setCurrentSubPage] = useState<AuditorSubPage>(activeSubPage);

  // Görünüm Modu: Müşteri Önü Saha Pitch Sihirbazı veya Klasik Analitik Panel
  const [viewMode, setViewMode] = useState<'pitch_wizard' | 'classic_dashboard'>('pitch_wizard');

  useEffect(() => {
    if (activeSubPage) {
      setCurrentSubPage(activeSubPage);
      if (activeSubPage !== 'overview') {
        setViewMode('classic_dashboard');
      }
    }
  }, [activeSubPage]);

  const handleSubPageChange = (subPage: AuditorSubPage) => {
    setCurrentSubPage(subPage);
    onSubPageChange?.(subPage);
  };

  // Seçili Senaryo & Denetim Durumu (Varsayılan olarak Gerçek PoC Vakası: Anadolu Sigorta)
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('anadolu_poc');
  const [activeScenario, setActiveScenario] = useState<HunterScenario>(HUNTER_SCENARIOS[0]);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);
  const [processedRows, setProcessedRows] = useState<number>(HUNTER_SCENARIOS[0].totalPolicies);
  const [leakages, setLeakages] = useState<CommissionLeakageItem[]>(HUNTER_SCENARIOS[0].leakages);

  // Modallar
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  // Özel Yüklenen Dosya Bilgisi
  const [customUploadedFileName, setCustomUploadedFileName] = useState<string | null>(null);

  // Bildirim (Toast)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const totalLeakageAmount = leakages.reduce((acc, curr) => acc + curr.leakageAmount, 0);

  // Şirket bazında kaçak toplamları
  const companyLeakageSummary = leakages.reduce((acc, curr) => {
    acc[curr.companyName] = (acc[curr.companyName] || 0) + curr.leakageAmount;
    return acc;
  }, {} as Record<string, number>);

  // Senaryo Değiştirme
  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setCustomUploadedFileName(null);
    const scen = HUNTER_SCENARIOS.find(s => s.id === scenarioId);
    if (!scen) return;

    setActiveScenario(scen);
    runAuditProcess(scen.totalPolicies, scen.leakages);
  };

  // Denetim Simülasyonu & İlerleme Animasyonu
  const runAuditProcess = (totalRows: number, targetLeakages: CommissionLeakageItem[]) => {
    setIsAuditing(true);
    setProgress(0);
    setProcessedRows(0);
    setLeakages([]);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          setLeakages(targetLeakages);
          setProcessedRows(totalRows);

          // Kutlama konfetisi
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.6 }
          });

          return 100;
        }
        const next = prev + 25;
        setProcessedRows(Math.floor((next / 100) * totalRows));
        return next;
      });
    }, 150);
  };

  // Gerçek Excel/CSV Dosyası Yükleme ve Canlı Denetim Motoru
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsAuditing(true);
      setCustomUploadedFileName(file.name);
      setSelectedScenarioId('custom');
      showToast(`"${file.name}" taranıyor ve sözleşme şartlarıyla çapraz karşılaştırılıyor...`);

      // 1. Excel/CSV dosyasını gerçek zamanlı hücre hücre oku
      const rawRows = await parseExcelOrCsvFile(file);
      
      if (!rawRows || rawRows.length === 0) {
        showToast('Yüklenen dosyada okunabilir satır bulunamadı.');
        setIsAuditing(false);
        return;
      }

      // 2. Satırları standart kanonik formata dönüştür
      const statementRows = rawRows.map(r => parseStatementRow(r));
      
      // 3. Çapraz eşleme ve kaçak avcısı algoritmasını çalıştır
      const auditResult = auditCommissionStatement(
        statementRows, 
        SAMPLE_ACENTE_EXPECTED_POLICIES, 
        file.name
      );

      // 4. Sonuçları ekrana bas ve animasyonu başlat
      setActiveScenario(auditResult.scenario);
      runAuditProcess(auditResult.analyzedRowCount, auditResult.scenario.leakages);

      showToast(`Tarama Başarılı! ${auditResult.analyzedRowCount} satır incelendi, ${auditResult.leakageCount} adet kaçakta toplam ${auditResult.totalLeakageAmount.toLocaleString('tr-TR')} ₺ fark tespit edildi.`);
    } catch (err: any) {
      console.error('Excel okuma hatası:', err);
      showToast(`Dosya okunurken hata oluştu: ${err?.message || 'Lütfen geçerli bir .xlsx veya .csv yükleyin.'}`);
      setIsAuditing(false);
    }
  };

  // Canlı Saha Denetim Sihirbazı Tamamlandığında
  const handlePitchAuditComplete = (result: AuditEngineResult) => {
    setActiveScenario(result.scenario);
    setLeakages(result.scenario.leakages);
    setProcessedRows(result.analyzedRowCount);
    setSelectedScenarioId(result.scenario.id);
    setCustomUploadedFileName(result.scenario.statementFileName);
    showToast(`Canlı Saha Denetimi tamamlandı! ${result.leakageCount} adet kaçakta toplam ${result.totalLeakageAmount.toLocaleString('tr-TR')} ₺ tespit edildi.`);
  };

  // Hazır Örnek Dosyayı Yükleme (Anadolu veya Allianz)
  const handleLoadSample = (company: 'anadolu' | 'allianz') => {
    if (company === 'anadolu') {
      handleSelectScenario('anadolu_poc');
      showToast('Anadolu Sigorta Ekim 2026 gerçek ekstre dosyası yüklendi. 5 kaçak inceleniyor.');
    } else {
      handleSelectScenario('allianz_poc');
      showToast('Allianz Sigorta Ekim 2026 gerçek ekstre dosyası yüklendi. 2 kaçak inceleniyor.');
    }
  };

  // Gerçek CSV Dosyası İndirme (Excel Uyumlu UTF-8 BOM ile)
  const handleExportCsv = (customLeakages?: CommissionLeakageItem[]) => {
    const targetLeakages = customLeakages || leakages;
    const headers = ['Poliçe No', 'Zeyil No', 'Müşteri Adı', 'Sigorta Şirketi', 'Branş', 'Yazılan Prim (TL)', 'Sözleşme Komisyonu (%)', 'Şirketin Kestiği (%)', 'Eksik Komisyon Tutarı (TL)', 'Hata Nedeni', 'Açıklama'];
    
    const rows = targetLeakages.map(item => [
      item.policyNo,
      item.endorsementNo || '0',
      `"${item.customerName}"`,
      `"${item.companyName}"`,
      item.branch,
      item.grossPremium,
      `%${item.contractCommissionRate}`,
      `%${item.appliedCommissionRate}`,
      item.leakageAmount,
      `"${item.errorReason.replace(/_/g, ' ')}"`,
      `"${item.explanation || ''}"`
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(r => r.join(';'))
    ].join('\r\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `otonom_komisyon_avcisi_raporu_${currentSubPage}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Excel / CSV itiraz listesi başarıyla indirildi.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Bildirimi */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* MOD SEÇİCİ SEKMESİ (SAHA PITCH SİHİRBAZI vs KLASİK ANALİTİK PANEL) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setViewMode('pitch_wizard');
              setCurrentSubPage('overview');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'pitch_wizard' && currentSubPage === 'overview'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>🎯 Müşteri Önü Canlı Sihirbaz (Saha Modu)</span>
          </button>

          <button
            onClick={() => {
              setViewMode('classic_dashboard');
              setCurrentSubPage('overview');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'classic_dashboard' && currentSubPage === 'overview'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-slate-700" />
            <span>📊 Detaylı Analitik Panel & Senaryolar</span>
          </button>
        </div>

        {currentSubPage !== 'overview' && (
          <button
            onClick={() => setCurrentSubPage('overview')}
            className="text-xs font-bold text-blue-600 hover:underline px-2 cursor-pointer"
          >
            ← Genel Bakışa Dön
          </button>
        )}
      </div>

      {/* 5 ALT SAYFA RENDER BLOĞU */}
      {currentSubPage === 'overview' && (
        viewMode === 'pitch_wizard' ? (
          <LivePitchAuditWizard
            onAuditComplete={handlePitchAuditComplete}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenEmailModal={() => setIsEmailModalOpen(true)}
            onExportCsv={handleExportCsv}
            onClose={() => setViewMode('classic_dashboard')}
          />
        ) : (
          <CommissionAuditorOverview
            activeScenario={activeScenario}
            selectedScenarioId={selectedScenarioId}
            onSelectScenario={handleSelectScenario}
            onFileUpload={handleFileUpload}
            onLoadSample={handleLoadSample}
            customUploadedFileName={customUploadedFileName}
            isAuditing={isAuditing}
            progress={progress}
            processedRows={processedRows}
            onRunAudit={() => runAuditProcess(activeScenario.totalPolicies, activeScenario.leakages)}
            onNavigateSubPage={handleSubPageChange}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenEmailModal={() => setIsEmailModalOpen(true)}
            onExportCsv={() => handleExportCsv(leakages)}
            onOpenPitchWizard={() => setViewMode('pitch_wizard')}
            leakages={leakages}
            totalLeakageAmount={totalLeakageAmount}
          />
        )
      )}

      {currentSubPage === 'tariff' && (
        <TariffDeviationView
          onBackToOverview={() => handleSubPageChange('overview')}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenEmailModal={() => setIsEmailModalOpen(true)}
          onExportCsv={() => handleExportCsv(leakages)}
        />
      )}

      {currentSubPage === 'cancellation' && (
        <CancellationDeductionView
          onBackToOverview={() => handleSubPageChange('overview')}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenEmailModal={() => setIsEmailModalOpen(true)}
          onExportCsv={() => handleExportCsv(leakages)}
        />
      )}

      {currentSubPage === 'endorsement' && (
        <EndorsementLeakageView
          onBackToOverview={() => handleSubPageChange('overview')}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenEmailModal={() => setIsEmailModalOpen(true)}
          onExportCsv={() => handleExportCsv(leakages)}
        />
      )}

      {currentSubPage === 'pool' && (
        <PoolContractDeductionView
          onBackToOverview={() => handleSubPageChange('overview')}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenEmailModal={() => setIsEmailModalOpen(true)}
          onExportCsv={() => handleExportCsv(leakages)}
        />
      )}

      {/* MODAL 1: RESMİ DENETİM RAPORU & TTK 102 İTİRAZ DİLEKÇESİ */}
      <CommissionReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        activeScenario={activeScenario}
        leakages={leakages}
        totalLeakageAmount={totalLeakageAmount}
        companyLeakageSummary={companyLeakageSummary}
      />

      {/* MODAL 2: ŞİRKETE RESMİ İTİRAZ E-POSTASI */}
      <CommissionEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        leakages={leakages}
        companyLeakageSummary={companyLeakageSummary}
        totalLeakageAmount={totalLeakageAmount}
        onToast={showToast}
      />
    </div>
  );
};
