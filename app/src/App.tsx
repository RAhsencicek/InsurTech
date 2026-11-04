import React, { useState } from 'react';
import { ActiveTab, Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CustomersView } from './components/CustomersView';
import { OcrWizardView } from './components/OcrWizardView';
import { MultiQuoteEngineView } from './components/MultiQuoteEngineView';
import { CommissionAuditorView } from './components/CommissionAuditorView';
import { MigrationWizardView } from './components/MigrationWizardView';
import { SecurityView } from './components/SecurityView';
import { AddCustomerModal } from './components/AddCustomerModal';
import { TENANTS, MOCK_CUSTOMERS, MOCK_POLICIES } from './data/mockData';
import { TenantId, Customer, Policy, OcrExtractedData, QuotationResult, InsuranceBranch, AuditorSubPage } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [auditorSubPage, setAuditorSubPage] = useState<AuditorSubPage>('overview');
  const [currentTenantId, setCurrentTenantId] = useState<TenantId>('merkez');
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [policies, setPolicies] = useState<Policy[]>(MOCK_POLICIES);
  const [activeBranch, setActiveBranch] = useState<InsuranceBranch>('KASKO');
  const [activeVehicleForQuotation, setActiveVehicleForQuotation] = useState<OcrExtractedData | null>(null);

  // Genel Yeni Müşteri Modalı
  const [isGlobalAddCustomerModalOpen, setIsGlobalAddCustomerModalOpen] = useState(false);

  const currentTenant = TENANTS.find(t => t.id === currentTenantId) || TENANTS[0];

  // Müşteri kartından doğrudan teklife geçiş (Branş destekli)
  const handleStartQuoteForCustomer = (customer: Customer, branch: InsuranceBranch = 'KASKO') => {
    setActiveBranch(branch);
    setActiveVehicleForQuotation({
      documentKind: branch === 'TSS' ? 'KIMLIK' : (branch === 'DASK' || branch === 'KONUT' || branch === 'ISYERI') ? 'DASK_TAPU' : 'RUHSAT',
      plateNumber: customer.plateNumber || '34 VR 8920',
      identityNo: customer.identityNo,
      fullName: customer.fullName,
      vehicleBrandModel: 'VOLKSWAGEN PASSAT 1.5 TSI ELEGANCE',
      modelYear: 2022,
      chassisNo: 'WVGZZZ3CZNE019482',
      engineNo: 'DADA104928',
      registrationDate: '15.05.2022',
      usageType: 'HUSUSİ',
      fuelType: 'BENZİN',
      birthDate: '14.04.1985',
      uavtAddressCode: customer.uavtCode || '2849102841',
      fullAddress: `${customer.city} Bağdat Cad. No: 142 D: 6`,
      grossSquareMeters: 130,
      confidenceScore: 99.5
    });
    setActiveTab('quotes');
  };

  // Yeni Müşteri Ekleme ve İsteğe Bağlı Teklife Geçiş
  const handleAddNewCustomer = (
    newCustomer: Customer,
    startQuotationNow: boolean,
    branch: InsuranceBranch = 'KASKO',
    extractedData?: OcrExtractedData
  ) => {
    setCustomers(prev => [newCustomer, ...prev]);
    if (startQuotationNow) {
      setActiveBranch(branch);
      setActiveVehicleForQuotation(extractedData || null);
      setActiveTab('quotes');
    }
  };

  // OCR'dan doğrudan teklif motoruna geçiş (Branş ile birlikte)
  const handleProceedFromOcr = (extractedData: OcrExtractedData, branch: InsuranceBranch) => {
    setActiveBranch(branch);
    setActiveVehicleForQuotation(extractedData);
    setActiveTab('quotes');
  };

  // Müşteri Temsilcisi (MT) Atama / Güncelleme
  const handleUpdateCustomerStaff = (customerId: string, newStaffId: string, newStaffName: string) => {
    setCustomers(prev => prev.map(c => 
      c.id === customerId 
        ? { ...c, assignedStaffId: newStaffId, assignedStaffName: newStaffName }
        : c
    ));
  };

  // Poliçe Güncelleme (Yenileme Durumu, MT Notu vb.)
  const handleUpdatePolicy = (policyId: string, updates: Partial<Policy>) => {
    setPolicies(prev => prev.map(p => 
      p.id === policyId 
        ? { ...p, ...updates }
        : p
    ));
  };

  // Poliçe başarıyla kesildiğinde portföye ekle
  const handlePolicyIssued = (quote: QuotationResult) => {
    const newPolicy: Policy = {
      id: `pol_${Date.now()}`,
      tenantId: currentTenantId,
      policyNo: quote.quoteNo,
      companyName: quote.companyName,
      branch: quote.branch,
      customerName: activeVehicleForQuotation?.fullName || 'Mehmet Ali Yılmaz',
      customerIdentity: activeVehicleForQuotation?.identityNo || '28472910482',
      plateOrAddress: activeVehicleForQuotation?.plateNumber || activeVehicleForQuotation?.uavtAddressCode || '34 VR 8920',
      grossPremium: quote.grossPremium,
      netPremium: quote.netPremium,
      commissionAmount: quote.commissionAmount,
      commissionRate: quote.commissionRate,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysRemaining: 365,
      status: 'ACTIVE',
      assignedStaffName: 'Ece Karaca',
      renewalStatus: 'PENDING'
    };

    setPolicies(prev => [newPolicy, ...prev]);
  };

  return (
    <div className="app-shell flex min-h-screen font-sans selection:bg-teal-100 selection:text-slate-900">
      {/* Sol Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        auditorSubPage={auditorSubPage}
        onAuditorSubPageChange={setAuditorSubPage}
        pendingLeakagesCount={5}
      />

      {/* Sağ Ana Gövde */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTenantId={currentTenantId}
          onTenantChange={setCurrentTenantId}
          isSimulatingQuotes={activeTab === 'quotes'}
        />

        <main className="app-main flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentTenant={currentTenant}
              customers={customers}
              policies={policies}
              onStartQuoteForCustomer={handleStartQuoteForCustomer}
              onOpenOcrWizard={() => setActiveTab('ocr')}
              onAddNewCustomer={handleAddNewCustomer}
              onUpdatePolicy={handleUpdatePolicy}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              currentTenant={currentTenant}
              customers={customers}
              policies={policies}
              onStartQuoteForCustomer={handleStartQuoteForCustomer}
              onOpenAddCustomerModal={() => setIsGlobalAddCustomerModalOpen(true)}
              onUpdateCustomerStaff={handleUpdateCustomerStaff}
            />
          )}

          {activeTab === 'ocr' && (
            <OcrWizardView
              onProceedToQuotation={handleProceedFromOcr}
            />
          )}

          {activeTab === 'quotes' && (
            <MultiQuoteEngineView
              initialVehicleData={activeVehicleForQuotation}
              initialBranch={activeBranch}
              customers={customers}
              onSelectCustomer={handleStartQuoteForCustomer}
              onOpenAddCustomerModal={() => setIsGlobalAddCustomerModalOpen(true)}
              onPolicyIssued={handlePolicyIssued}
            />
          )}

          {activeTab === 'auditor' && (
            <CommissionAuditorView
              activeSubPage={auditorSubPage}
              onSubPageChange={setAuditorSubPage}
            />
          )}

          {activeTab === 'migration' && (
            <MigrationWizardView onMigrationComplete={() => setActiveTab('dashboard')} />
          )}

          {activeTab === 'security' && (
            <SecurityView currentTenantId={currentTenantId} />
          )}
        </main>
      </div>

      {/* Global Yeni Müşteri & Teklif Modalı */}
      <AddCustomerModal
        isOpen={isGlobalAddCustomerModalOpen}
        onClose={() => setIsGlobalAddCustomerModalOpen(false)}
        currentTenant={currentTenant}
        onAddNewCustomer={handleAddNewCustomer}
      />
    </div>
  );
};

export default App;
