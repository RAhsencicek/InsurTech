import React, { useState } from 'react';
import { Tenant, Customer, Policy, InsuranceBranch, OcrExtractedData } from '../types';
import { TENANTS, MOCK_STAFF, MOCK_COMPANY_STATS } from '../data/mockData';
import { ActiveTab } from './Sidebar';
import { AddCustomerModal } from './AddCustomerModal';
import { 
  Users, 
  FileCheck2, 
  CalendarClock, 
  TrendingUp, 
  ShieldAlert, 
  Car, 
  ArrowUpRight, 
  Phone, 
  Sparkles,
  Search,
  X,
  CheckCircle2, 
  ShieldCheck, 
  HeartPulse,
  Home,
  Building2,
  UserPlus,
  ArrowRight,
  FileText,
  BadgePercent,
  Activity,
  Layers,
  MapPin,
  Lock,
  ChevronRight,
  AlertCircle,
  Crown,
  BarChart3,
  Target,
  Briefcase,
  Award,
  DollarSign,
  PieChart,
  MessageCircle,
  Send,
  Clock,
  UserCheck,
  BellRing,
  PhoneCall,
  Scale,
  Zap,
  ScanLine,
  Check,
  CircleDollarSign,
  FileSpreadsheet
} from 'lucide-react';

interface DashboardViewProps {
  currentTenant: Tenant;
  customers: Customer[];
  policies: Policy[];
  onStartQuoteForCustomer: (customer: Customer, branch?: InsuranceBranch) => void;
  onOpenOcrWizard: () => void;
  onAddNewCustomer?: (
    customer: Customer,
    startQuotationNow: boolean,
    branch?: InsuranceBranch,
    extractedData?: OcrExtractedData
  ) => void;
  onUpdatePolicy?: (policyId: string, updates: Partial<Policy>) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentTenant,
  customers,
  policies,
  onStartQuoteForCustomer,
  onOpenOcrWizard,
  onAddNewCustomer,
  onUpdatePolicy,
  onNavigateTab
}) => {
  // Görünüm Modu Seçimi: 'operations' (Operasyon Paneli) veya 'value_summary' (Değer Özeti)
  const [viewMode, setViewMode] = useState<'operations' | 'value_summary'>('operations');
  
  // Operasyon paneli iç sekmesi (Özet Analizler vs Müşteri 360)
  const [operationsInnerTab, setOperationsInnerTab] = useState<'overview' | 'customers'>('overview');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerForDrawer, setSelectedCustomerForDrawer] = useState<Customer | null>(null);

  // Branş Seçim Modalı (Mevcut müşteri için)
  const [customerForBranchModal, setCustomerForBranchModal] = useState<Customer | null>(null);

  // Yeni Müşteri Modalı Durumu
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

  // WhatsApp Tecdit Hatırlatma Modalı
  const [whatsappModalPolicy, setWhatsappModalPolicy] = useState<Policy | null>(null);
  const [whatsappCustomText, setWhatsappCustomText] = useState('');

  // MT Görev / Talimat Modalı ("Dürt / Görev Ver")
  const [taskModalPolicy, setTaskModalPolicy] = useState<Policy | null>(null);
  const [managerTaskInput, setManagerTaskInput] = useState('');

  // Başarı Bildirimi (Toast)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sadece aktif tenant'a ait müşteriler ve poliçeler
  const tenantCustomers = customers.filter(c => c.tenantId === currentTenant.id);
  const tenantPolicies = policies.filter(p => p.tenantId === currentTenant.id);

  // Konsolide Toplamlar (Tüm Şubeler)
  const consolidatedTotalProduction = TENANTS.reduce((sum, t) => sum + t.monthlyProduction, 0);
  const consolidatedTotalPolicies = TENANTS.reduce((sum, t) => sum + t.activePoliciesCount, 0);

  const filteredCustomers = tenantCustomers.filter(c => 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.identityNo.includes(searchTerm) ||
    (c.plateNumber && c.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const urgentPolicies = tenantPolicies.filter(p => p.status === 'RENEWAL_URGENT');
  const totalUrgentPremium = urgentPolicies.reduce((sum, p) => sum + p.grossPremium, 0);
  const totalUrgentCommission = urgentPolicies.reduce((sum, p) => sum + p.commissionAmount, 0);

  // WhatsApp Mesaj Taslağı Oluşturucu
  const openWhatsappModal = (policy: Policy) => {
    const text = `Sayın ${policy.customerName}, ${policy.companyName} bünyesindeki ${policy.policyNo} numaralı ${policy.branch} poliçenizin vadesi ${policy.daysRemaining} gün sonra dolmaktadır. SBM ve Tramer kayıtlarınıza istinaden 12 sigorta şirketinden en uygun ve en geniş teminatlı yenileme teklifiniz hazırlanmıştır. Detayları incelemek ve poliçenizi onaylamak için acentemizle iletişime geçebilirsiniz. Sağlıklı ve güvenli günler dileriz.`;
    setWhatsappCustomText(text);
    setWhatsappModalPolicy(policy);
  };

  // WhatsApp Gönderim Aksiyonu
  const handleSendWhatsapp = () => {
    if (!whatsappModalPolicy) return;
    const phone = whatsappModalPolicy.customerPhone || '+905358821940';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(whatsappCustomText)}`;
    window.open(url, '_blank');

    onUpdatePolicy?.(whatsappModalPolicy.id, { 
      renewalStatus: 'WHATSAPP_SENT' 
    });

    showToast(`${whatsappModalPolicy.customerName} için WhatsApp yenileme hatırlatması açıldı ve kaydedildi.`);
    setWhatsappModalPolicy(null);
  };

  const handleMarkWhatsappSent = () => {
    if (!whatsappModalPolicy) return;
    onUpdatePolicy?.(whatsappModalPolicy.id, { 
      renewalStatus: 'WHATSAPP_SENT' 
    });
    showToast(`${whatsappModalPolicy.customerName} durumu "WhatsApp Gönderildi" olarak güncellendi.`);
    setWhatsappModalPolicy(null);
  };

  // MT Görev Ver Aksiyonu
  const openTaskModal = (policy: Policy) => {
    setManagerTaskInput(policy.managerTaskNote || `Lütfen müşteriyi bugün arayıp %15 doktor meslek indirimli kasko yenileme teklifini sunun.`);
    setTaskModalPolicy(policy);
  };

  const handleSaveManagerTask = () => {
    if (!taskModalPolicy) return;
    onUpdatePolicy?.(taskModalPolicy.id, {
      managerTaskNote: managerTaskInput,
      renewalStatus: taskModalPolicy.renewalStatus === 'PENDING' ? 'CALLED' : taskModalPolicy.renewalStatus
    });
    showToast(`${taskModalPolicy.assignedStaffName || 'Müşteri Temsilcisine'} yönetici direktifi iletildi.`);
    setTaskModalPolicy(null);
    setManagerTaskInput('');
  };

  // Yenileme Durumu Rozeti
  const renderRenewalStatusBadge = (status?: Policy['renewalStatus']) => {
    switch (status) {
      case 'WHATSAPP_SENT':
        return (
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <MessageCircle className="w-3 h-3 text-emerald-700" />
            <span>WhatsApp İletildi</span>
          </span>
        );
      case 'CALLED':
        return (
          <span className="text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <PhoneCall className="w-3 h-3 text-blue-700" />
            <span>Görüşüldü / Arandı</span>
          </span>
        );
      case 'RENEWED':
        return (
          <span className="text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-purple-700" />
            <span>Yenilendi</span>
          </span>
        );
      case 'LOST':
        return (
          <span className="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <AlertCircle className="w-3 h-3 text-rose-700" />
            <span>Kayıp / Kaçtı</span>
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>Aksiyon Bekliyor</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Bildirimi */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. BANT: MERKEZİ BAŞLIK, MOD SEÇİCİ VE ANA AKSİYONLAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {viewMode === 'operations' 
                ? 'InsurTech Operasyon ve Gelir Merkezi' 
                : 'InsurTech Değer Özeti'}
            </h1>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
              <Crown className="w-3 h-3 text-blue-600" />
              <span>{currentTenant.name}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {viewMode === 'operations'
              ? 'Müşteri, teklif, yenileme ve komisyon süreçlerinizi tek merkezden yönetin.'
              : 'Acentelerin satış hızını artıran, operasyon yükünü azaltan ve komisyon kaçaklarını görünür hale getiren yeni nesil platform.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Görünüm Modu Toggle [ Operasyon Paneli | Değer Özeti ] */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setViewMode('operations')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'operations'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Operasyon Paneli</span>
            </button>
            <button
              onClick={() => setViewMode('value_summary')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'value_summary'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Değer Özeti</span>
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Hızlı Aksiyon 1: Yeni Müşteri & Teklif */}
          <button
            onClick={() => setIsAddCustomerModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-white" />
            <span>Yeni Müşteri & Teklif</span>
          </button>

          {/* Hızlı Aksiyon 2: Belgeden OCR ile Başlat */}
          <button
            onClick={onOpenOcrWizard}
            className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Belgeden OCR Başlat</span>
          </button>
        </div>
      </div>

      {/* 2. BANT: 4 TEMEL DEĞER VE KOKPİT KARTI (HERO KPIS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kart 1: Aylık Prim Üretimi */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Aylık Prim Üretimi</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            18.450.000 ₺
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              + %18.4 Büyüme
            </span>
            <span className="text-slate-400 font-medium">Konsolide: 42.5M ₺</span>
          </div>
        </div>

        {/* Kart 2: Yaklaşan Yenilemeler */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs transition-all hover:border-amber-300">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Yaklaşan Yenilemeler</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            12 Kritik Poliçe
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
              Bugün aksiyon bekliyor
            </span>
            <span className="text-slate-500 font-mono font-medium">Risk: 284.500 ₺</span>
          </div>
        </div>

        {/* Kart 3: Tespit Edilen Komisyon Farkı (★ KAHRAMAN ÖZELLİK) */}
        <div 
          onClick={() => onNavigateTab?.('auditor')}
          className="bg-white border-2 border-rose-200 hover:border-rose-400 p-5 rounded-2xl shadow-xs transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold text-slate-900">Tespit Edilen Komisyon Farkı</span>
              <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded border border-rose-200">
                TTK 102
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono tracking-tight">
            42.000 ₺
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              <strong className="text-slate-900">5 uyuşmazlık</strong> bulundu
            </span>
            <span className="text-blue-600 group-hover:text-blue-700 font-bold flex items-center space-x-1">
              <span>İncele</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Kart 4: Aktif Portföy */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Aktif Portföy</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            14.850 Poliçe
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">3.820 Kayıtlı Müşteri</span>
            <span className="text-slate-400">4 Şube</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GÖRÜNÜM A: OPERASYON PANELİ (GÜNLÜK ACENTE KULLANIMI)                       */}
      {/* ========================================================================= */}
      {viewMode === 'operations' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* İÇ SEKME GEÇİŞİ: GENEL BAKIŞ & ŞUBELER vs MÜŞTERİ PORTFÖYÜ */}
          <div className="flex items-center space-x-3 border-b border-slate-200 pb-2">
            <button
              onClick={() => setOperationsInnerTab('overview')}
              className={`pb-2 px-1 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                operationsInnerTab === 'overview'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Günlük Operasyon & Analizler
            </button>
            <button
              onClick={() => setOperationsInnerTab('customers')}
              className={`pb-2 px-1 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                operationsInnerTab === 'customers'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Müşteri Portföyü</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full font-mono">
                {filteredCustomers.length}
              </span>
            </button>
          </div>

          {operationsInnerTab === 'overview' && (
            <>
              {/* ACİL YENİLEME & MÜŞTERİ RADARI (MODERNİZE EDİLMİŞ ŞIK BLOK) */}
              <div className="bg-white border border-amber-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <BellRing className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                        <span>Bugün Aksiyon Bekleyen Yenilemeler (&lt; 15 Gün)</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                          {urgentPolicies.length} Kritik Risk
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Poliçe bitiminden önce müşteriye WhatsApp tecdit teklifi gönderin veya ilgili personele direktif iletin.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Riskteki Prim</span>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {totalUrgentPremium.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Korunacak Komisyon</span>
                      <span className="font-mono font-bold text-emerald-700 text-xs">
                        +{totalUrgentCommission.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>
                </div>

                {/* Kritik Poliçeler Kart Izgarası */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {urgentPolicies.map((policy) => {
                    const matchedCustomer = tenantCustomers.find(c => c.identityNo === policy.customerIdentity) || tenantCustomers[0];

                    return (
                      <div
                        key={policy.id}
                        className="bg-slate-50/60 border border-slate-200/90 hover:border-amber-400 rounded-xl p-4 space-y-3 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-900">{policy.companyName}</span>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                              ⏰ {policy.daysRemaining} Gün Kaldı
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{policy.customerName}</span>
                              <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                                {policy.branch}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>{policy.plateOrAddress}</span>
                              <span className="font-mono">{policy.customerPhone || '+90 535 882 19 40'}</span>
                            </div>
                          </div>

                          {/* Temsilci & Durum */}
                          <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 flex items-center space-x-1">
                              <UserCheck className="w-3 h-3 text-slate-400" />
                              <span>MT: <strong className="text-slate-800">{policy.assignedStaffName || 'Ece Karaca'}</strong></span>
                            </span>
                            {renderRenewalStatusBadge(policy.renewalStatus)}
                          </div>

                          {policy.managerTaskNote && (
                            <div className="mt-2 p-1.5 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 flex items-start space-x-1">
                              <span className="font-bold shrink-0">📌 Direktif:</span>
                              <span className="italic truncate">{policy.managerTaskNote}</span>
                            </div>
                          )}
                        </div>

                        {/* Aksiyon Butonları */}
                        <div className="pt-2 border-t border-slate-200/70 flex items-center gap-1.5">
                          <button
                            onClick={() => openWhatsappModal(policy)}
                            className="flex-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-300 hover:border-emerald-600 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            onClick={() => openTaskModal(policy)}
                            className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5 text-slate-500" />
                            <span>MT'ye Görev</span>
                          </button>

                          <button
                            onClick={() => {
                              if (matchedCustomer) onStartQuoteForCustomer(matchedCustomer, policy.branch);
                            }}
                            title="12 Şirketten Anlık Karşılaştırmalı Teklif Al"
                            className="bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 p-1.5 rounded-lg transition-all cursor-pointer shadow-xs"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* İKİ KOLONLU OPERASYON VE DAĞITIM ALANI */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SOL: ŞUBELER ARASI ÜRETİM VE HEDEF LİGİ */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Şubeler Arası Üretim ve Hedef Ligi
                      </h2>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                      4 Lokasyon
                    </span>
                  </div>

                  <div className="space-y-3">
                    {TENANTS.map((tenant) => {
                      const target = tenant.monthlyProduction * 1.05;
                      const ratio = Math.round((tenant.monthlyProduction / target) * 100);
                      const isCurrent = tenant.id === currentTenant.id;

                      return (
                        <div 
                          key={tenant.id}
                          className={`p-3.5 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-900">{tenant.name}</span>
                              <span className="text-[10px] text-slate-500 font-medium">({tenant.city})</span>
                              {isCurrent && (
                                <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                                  Aktif Şube
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-900">
                              {tenant.monthlyProduction.toLocaleString('tr-TR')} ₺
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  ratio >= 95 ? 'bg-emerald-500' : 'bg-blue-600'
                                }`}
                                style={{ width: `${Math.min(ratio, 100)}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>Hedef: {Math.round(target).toLocaleString('tr-TR')} ₺</span>
                              <span className="font-bold text-slate-800">%{ratio} Gerçekleşme</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SAĞ: SİGORTA ŞİRKETİ KÂRLILIĞI & KOMİSYON DAĞILIMI */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Sigorta Şirketi Kârlılık Dağılımı
                      </h2>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                      Komisyon Katkısı
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {MOCK_COMPANY_STATS.map((comp) => (
                      <div 
                        key={comp.code}
                        className="p-3 rounded-xl border border-slate-200/90 hover:border-emerald-300 bg-white transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-[11px] shrink-0"
                            style={{ backgroundColor: comp.color }}
                          >
                            {comp.code}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{comp.companyName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {comp.policyCount} Poliçe • Ort. Komisyon: %{comp.averageCommissionRate}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-emerald-700 font-mono block">
                            +{comp.commissionEarned.toLocaleString('tr-TR')} ₺
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Ciro: {comp.productionAmount.toLocaleString('tr-TR')} ₺
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MÜŞTERİ TEMSİLCİSİ (MT) & PORTFÖY PERFORMANS TABLOSU */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Müşteri Temsilcisi (MT) Performans Tablosu
                    </h2>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Aylık prim hedefi ve çapraz satış başarı oranları
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 font-bold">Müşteri Temsilcisi</th>
                        <th className="py-2.5 px-3 font-bold">Şube</th>
                        <th className="py-2.5 px-3 font-bold">Aylık Hedef</th>
                        <th className="py-2.5 px-3 font-bold">Gerçekleşen Ciro</th>
                        <th className="py-2.5 px-3 font-bold">Gerçekleşme</th>
                        <th className="py-2.5 px-3 font-bold">Kesilen Poliçe</th>
                        <th className="py-2.5 px-3 font-bold">Çapraz Satış</th>
                        <th className="py-2.5 px-3 font-bold text-right">Kazanılan Komisyon</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_STAFF.map((staff) => {
                        const ratio = Math.round((staff.achievedProduction / staff.monthlyTarget) * 100);
                        return (
                          <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3">
                              <div className="flex items-center space-x-2.5">
                                <div 
                                  className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-[11px]"
                                  style={{ backgroundColor: staff.avatarColor }}
                                >
                                  {staff.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block">{staff.name}</span>
                                  <span className="text-[10px] text-slate-500">{staff.role}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 font-medium">
                              {TENANTS.find(t => t.id === staff.tenantId)?.name || 'Merkez'}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-500">
                              {staff.monthlyTarget.toLocaleString('tr-TR')} ₺
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                              {staff.achievedProduction.toLocaleString('tr-TR')} ₺
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className={`h-1.5 rounded-full ${ratio >= 100 ? 'bg-emerald-600' : 'bg-blue-600'}`}
                                    style={{ width: `${Math.min(ratio, 100)}%` }}
                                  />
                                </div>
                                <span className={`font-bold ${ratio >= 100 ? 'text-emerald-700' : 'text-blue-700'}`}>
                                  %{ratio}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-800 font-bold">
                              {staff.policiesCount} Adet
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                %{staff.crossSellRate}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                              {staff.commissionGenerated.toLocaleString('tr-TR')} ₺
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* İÇ SEKME 2: MÜŞTERİ 360 PORTFÖYÜ */}
          {operationsInnerTab === 'customers' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Aktif Müşteri Portföyü ({filteredCustomers.length})
                  </h2>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="İsim, TCKN veya Plaka ile ara..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomerForDrawer(customer)}
                    className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-blue-700 shrink-0">
                        {customer.type === 'CORPORATE' ? 'FİLO' : customer.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {customer.fullName}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-mono font-medium">
                            {customer.identityNo}
                          </span>
                          {customer.primaryBranch && (
                            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-bold">
                              {customer.primaryBranch}
                            </span>
                          )}
                          {customer.isVip && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-bold">
                              VIP
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          {customer.plateNumber && (
                            <span className="flex items-center space-x-1 font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[11px]">
                              <Car className="w-3 h-3 text-blue-600" />
                              <span>{customer.plateNumber}</span>
                            </span>
                          )}
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{customer.phone}</span>
                          </span>
                          <span>{customer.city}</span>
                          {customer.assignedStaffName && (
                            <span className="text-indigo-700 font-medium">
                              MT: {customer.assignedStaffName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0 justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900">{customer.activePolicies} Aktif Poliçe</div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          Hasar Oranı: <span className={customer.lossRatio > 50 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>%{customer.lossRatio}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomerForBranchModal(customer);
                        }}
                        className="flex items-center space-x-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        <span>Teklif Al</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* GÖRÜNÜM B: DEĞER ÖZETİ (SUNUM, FARK VE KAHRAMAN MODÜLLER)                    */}
      {/* ========================================================================= */}
      {viewMode === 'value_summary' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 3 TEMEL DEĞER SÜTUNU (PLATFORMUN VAATLERİ) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sütun 1: Hızlı Çoklu Teklif */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  15 Saniyede Çoklu Şirket Teklifi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  12 sigorta şirketinin portalına ayrı ayrı şifrelerle girmeye son. Tek ekranda en kapsamlı teminat ve en uygun fiyatı canlı kıyaslayın.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center space-x-2 text-xs font-bold text-emerald-700">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Müşteri bekleme süresinde %70 azalma</span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigateTab?.('quotes')}
                  className="w-full bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <span>Teklif Motorunu İncele</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sütun 2: AI OCR ile Sıfır Manuel Giriş */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <ScanLine className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  AI OCR ile Sıfır Manuel Veri Girişi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ruhsat, kimlik ve tapu evraklarını yapay zeka 2 saniyede görsel sınır kutularıyla okur. TCKN, plaka, şasi ve UAVT kodunu formlara hatasız aktarır.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center space-x-2 text-xs font-bold text-teal-700">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>15 dakikalık elle veri girişi 3 saniyeye iner</span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigateTab?.('ocr')}
                  className="w-full bg-slate-50 hover:bg-teal-600 text-slate-700 hover:text-white border border-slate-200 hover:border-teal-600 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <span>Belge Aktarımını (OCR) Dene</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sütun 3: Otonom Komisyon Avcısı */}
            <div className="bg-gradient-to-br from-rose-50/40 via-white to-white border-2 border-rose-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-rose-400 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <CircleDollarSign className="w-5 h-5 text-rose-600" />
                  </div>
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full">
                    TTK 102 Güvencesi
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Otonom Komisyon Avcısı
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sigorta şirketlerinin acentelerden kestiği haksız tarife, gün hesabı yanlış yapılan iptal kesintileri ve havuz kaçaklarını kuruşu kuruşuna bulur.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center space-x-2 text-xs font-bold text-rose-700">
                  <Check className="w-4 h-4 text-rose-600" />
                  <span>Yılda 250.000 ₺ - 600.000 ₺ net parayı kurtarır</span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigateTab?.('auditor')}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <span>Komisyon Avcısını Aç</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* KAHRAMAN VAKA SENARYOSU: KADIKÖY ACENTESİ AHMET BEY'İN 42.000 ₺'Sİ */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Canlı Vaka Analizi
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-2">
                  Kadıköy Acentesi Ahmet Bey'in Masada Kalan 42.000 ₺'si
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Şirket ekstrelerinin karmaşıklığında kaybolan hakedişin 3 saniyede tespit edilip resmi itiraz sürecine dönüştürülmesi.
                </p>
              </div>

              <div className="text-left sm:text-right bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Tespit Edilen Komisyon Farkı</span>
                <span className="text-2xl font-black text-rose-600 font-mono">42.000 ₺</span>
              </div>
            </div>

            {/* 3 Adımlı Vaka Akışı */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center">1</span>
                  <span>Satış & Beklenen Hakediş</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ahmet Bey ayda 1.000 poliçe keser. Sözleşme komisyon oranlarına göre <strong>150.000 ₺</strong> komisyon beklemektedir.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center">2</span>
                  <span>Şirketten Gelen Ekstre</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Şirket bankaya <strong>108.000 ₺</strong> yatırır ve 2.000 satırlık devasa bir Excel gönderir: <em>"Net hakedişiniz budur."</em>
                </p>
              </div>

              <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-rose-900">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center">3</span>
                  <span>Komisyon Avcısı Devrede (3 Sn)</span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  Ekstre sisteme yüklenir; sistem 42.000 ₺'nin nereye gittiğini 3 kalemde bulur ve <strong>TTK 102 resmi itiraz dosyasını basar!</strong>
                </p>
              </div>
            </div>

            {/* 42.000 TL Kaçak Dağılımı */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Sistemin 3 Saniyede Ayrıştırdığı 3 Gizli Kaçak:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>1. Tarife Hatası</span>
                    <span className="text-rose-600 font-mono">-18.000 ₺</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Doktor kaskosunda sözleşme komisyonu %15 iken şirketin sisteme sehven %10 girmesi.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>2. Haksız İptal Kesintisi</span>
                    <span className="text-rose-600 font-mono">-14.000 ₺</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Müşteri 5. günde poliçeyi iptal etmiş; şirket 5 günlük yerine 1 yıllık tam komisyon düşmüş.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>3. Sözleşme Dışı Havuz</span>
                    <span className="text-rose-600 font-mono">-10.000 ₺</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Sözleşmede yer almayan Tramer altyapı bedelinin acentenin hakedişinden kesilmesi.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500">
                Bu modül ile acente tek bir tıkla resmi TTK 102 itiraz dilekçesini sigorta şirketine iletebilir.
              </span>

              <button
                onClick={() => onNavigateTab?.('auditor')}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs shrink-0"
              >
                <span>Komisyon Avcısı Denetimini Canlı Gör</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* RAKİP KARŞILAŞTIRMASI MATRİSİ: GELENEKSEL YAKLAŞIM vs INSURTECH */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Neden Farklıyız? (Geleneksel Yazılımlar vs InsurTech)
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Pazardaki %60 hantal altyapı açığı
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-bold w-1/4">Operasyon Alanı</th>
                    <th className="py-2.5 px-3 font-bold w-3/8 text-slate-500">Geleneksel Yazılımlar (Polisoft, Acente2000 vb.)</th>
                    <th className="py-2.5 px-3 font-bold w-3/8 text-blue-700">InsurTech Yaklaşımı</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">Poliçe & Gelir Yönetimi</td>
                    <td className="py-3 px-3 text-slate-500">Yalnızca poliçe kaydeder, şirketin bildirdiği cari bakiyeye güvenir.</td>
                    <td className="py-3 px-3 font-bold text-emerald-800 bg-emerald-50/40">
                      Poliçe + Müşteri 360 + Satır satır komisyon denetimi ve gelir koruma.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">Teklif Alma Süreci</td>
                    <td className="py-3 px-3 text-slate-500">Her şirketin portalına ayrı şifrelerle tek tek girilir (dakikalar sürer).</td>
                    <td className="py-3 px-3 font-bold text-blue-800 bg-blue-50/40">
                      Tek ekranda 12 şirketten 15 saniyede paralel canlı karşılaştırma.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">Evrak & Veri Girişi</td>
                    <td className="py-3 px-3 text-slate-500">Ruhsat, kimlik ve tapu bilgileri elle tek tek klavyeyle yazılır (15 dk).</td>
                    <td className="py-3 px-3 font-bold text-teal-800 bg-teal-50/40">
                      AI OCR ile evrak 2 saniyede çözülür ve teklif formuna hatasız akar.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">Komisyon Mutabakatı</td>
                    <td className="py-3 px-3 text-slate-500">Dağınık Excel ekstreleri incelenemez; kaçaklar gözden kaçar.</td>
                    <td className="py-3 px-3 font-bold text-rose-800 bg-rose-50/40">
                      Otonom kaçak avcısı 3 saniyede bulur, resmi TTK 102 itirazı basar.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">Müşteri Yenilemeleri</td>
                    <td className="py-3 px-3 text-slate-500">Reaktif; müşteri hatırlarsa veya ararsa işlem yapılır.</td>
                    <td className="py-3 px-3 font-bold text-amber-800 bg-amber-50/40">
                      15 günlük erken uyarı radarı ve 1-tıkla kişiselleştirilmiş WhatsApp teklifi.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3 CANLI DEMO AKIŞI KARTI (INTERACTIVE WALKTHROUGHS) */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Yatırımcı ve Müşteri Sunumunda 3 Canlı Hikâye
              </span>
              <span className="text-[10px] text-slate-500">Tıklayarak doğrudan modüllere geçin</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigateTab?.('quotes')}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 text-left transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Senaryo 1: Hızlı Satış
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">
                    Yeni Müşteri & Teklif Karşılaştırma
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Ruhsatı yükle → bilgileri otomatik al → 12 şirketten anlık teklifleri gör.
                  </p>
                </div>
                <div className="mt-3 text-xs font-bold text-blue-600 flex items-center space-x-1">
                  <span>Teklife Git</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => setViewMode('operations')}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-500 text-left transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                    Senaryo 2: Portföy Koruma
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-2 group-hover:text-amber-700 transition-colors">
                    Mevcut Müşteri Tecdit & WhatsApp
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Yaklaşan yenilemeyi tespit et → 1 tıkla WhatsApp teklif mesajını ilet.
                  </p>
                </div>
                <div className="mt-3 text-xs font-bold text-amber-700 flex items-center space-x-1">
                  <span>Radarı Aç</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => onNavigateTab?.('auditor')}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-rose-500 text-left transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                    Senaryo 3: Gelir Kurtarma
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-2 group-hover:text-rose-600 transition-colors">
                    Komisyon Kaçağı & TTK 102
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Ekstreyi tara → 42.000 ₺ farkı gör → resmi itiraz dosyasını şirkete ilet.
                  </p>
                </div>
                <div className="mt-3 text-xs font-bold text-rose-600 flex items-center space-x-1">
                  <span>Avcıyı Başlat</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALLAR VE ÇEKMECELER                                                    */}
      {/* ========================================================================= */}

      {/* MODAL 1: Hızlı Teklif İçin Branş Seçim Modalı */}
      {customerForBranchModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Sigorta Branşı Seçin</h3>
                <p className="text-xs text-slate-500">
                  <strong className="text-slate-800">{customerForBranchModal.fullName}</strong> için 12 şirketten anlık teklif motoru.
                </p>
              </div>
              <button
                onClick={() => setCustomerForBranchModal(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { branch: 'KASKO' as InsuranceBranch, title: 'Genişletilmiş Kasko', desc: 'Araç hasar & mini onarım', icon: Car, color: 'text-blue-600 bg-blue-50' },
                { branch: 'TRAFIK' as InsuranceBranch, title: 'Zorunlu Trafik', desc: 'Resmi zorunlu mali mesuliyet', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' },
                { branch: 'TSS' as InsuranceBranch, title: 'Tamamlayıcı Sağlık (TSS)', desc: 'Özel hastaneler limitsiz yatarak', icon: HeartPulse, color: 'text-emerald-600 bg-emerald-50' },
                { branch: 'DASK' as InsuranceBranch, title: 'DASK Deprem', desc: 'Zorunlu deprem resmi tarifesi', icon: Home, color: 'text-amber-600 bg-amber-50' },
                { branch: 'KONUT' as InsuranceBranch, title: 'Konut Paket', desc: 'Yangın, hırsızlık & su basması', icon: Home, color: 'text-orange-600 bg-orange-50' },
                { branch: 'ISYERI' as InsuranceBranch, title: 'İşyeri / KOBİ', desc: 'Ticari emtia, demirbaş & sorumluluk', icon: Building2, color: 'text-purple-600 bg-purple-50' }
              ].map(item => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.branch}
                    onClick={() => {
                      const cust = customerForBranchModal;
                      setCustomerForBranchModal(null);
                      onStartQuoteForCustomer(cust, item.branch);
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center space-x-2.5 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 3 ADIMLI KURUMSAL YENİ MÜŞTERİ & SİGORTA TEKLİFİ MODALI */}
      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        currentTenant={currentTenant}
        onAddNewCustomer={(customer, startQuotationNow, branch, extractedData) => {
          if (onAddNewCustomer) {
            onAddNewCustomer(customer, startQuotationNow, branch, extractedData);
          }
          if (!startQuotationNow) {
            showToast(`Müşteri "${customer.fullName}" portföye başarıyla eklendi.`);
          }
        }}
      />

      {/* MODAL 3: YÖNETİCİ 1-CLICK WHATSAPP TECDİT HATIRLATMA MODALI */}
      {whatsappModalPolicy && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-emerald-700">
                <MessageCircle className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900">WhatsApp Tecdit Hatırlatma Mesajı</h3>
              </div>
              <button
                onClick={() => setWhatsappModalPolicy(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Müşteri & Telefon</span>
                  <span className="font-bold text-slate-900 text-sm">{whatsappModalPolicy.customerName}</span>
                </div>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  {whatsappModalPolicy.customerPhone || '+90 535 882 19 40'}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kişiselleştirilmiş WhatsApp Mesaj Metni (Düzenlenebilir):
                </label>
                <textarea
                  rows={6}
                  value={whatsappCustomText}
                  onChange={(e) => setWhatsappCustomText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
                />
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-900 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  "WhatsApp'ı Aç ve İlet" butonuna bastığınızda WhatsApp Web veya masaüstü uygulaması hedef müşteri ve hazır mesajla otomatik açılır.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={handleMarkWhatsappSent}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Sadece "Gönderildi" İşaretle
              </button>

              <button
                onClick={handleSendWhatsapp}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp'ı Aç ve İlet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: YÖNETİCİ MT TALİMAT / GÖREV MODALI ("DÜRT") */}
      {taskModalPolicy && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-blue-600">
                <Send className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900">Müşteri Temsilcisine Direktif / Görev Ver</h3>
              </div>
              <button
                onClick={() => setTaskModalPolicy(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Poliçe Sahibi</span>
                  <span className="font-bold text-slate-900 text-sm">{taskModalPolicy.customerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hedef MT (Temsilci)</span>
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {taskModalPolicy.assignedStaffName || 'Ece Karaca'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Yönetici Talimatı / Özel Görev Notu:
                </label>
                <textarea
                  rows={4}
                  value={managerTaskInput}
                  onChange={(e) => setManagerTaskInput(e.target.value)}
                  placeholder="Örn: Müşteriyi bugün saat 14:00'e kadar arayıp Allianz kasko yenileme indirimini teklif et..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setTaskModalPolicy(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                İptal
              </button>

              <button
                onClick={handleSaveManagerTask}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Direktifi Temsilciye İlet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Müşteri 360° Yan Çekmece (Drawer) */}
      {selectedCustomerForDrawer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Çekmece Başlığı */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-black text-sm">
                    {selectedCustomerForDrawer.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{selectedCustomerForDrawer.fullName}</h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
                      <span>TCKN: {selectedCustomerForDrawer.identityNo}</span>
                      <span>•</span>
                      <span>{selectedCustomerForDrawer.city}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCustomerForDrawer(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* İletişim Bilgileri */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Telefon</span>
                  <span className="font-bold text-slate-900">{selectedCustomerForDrawer.phone}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">E-Posta</span>
                  <span className="font-bold text-slate-900 truncate block">{selectedCustomerForDrawer.email}</span>
                </div>
              </div>

              {/* Atanmış Müşteri Temsilcisi */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Portföy Yöneticisi / MT</span>
                  <span className="font-bold text-indigo-900">{selectedCustomerForDrawer.assignedStaffName || 'Ece Karaca'}</span>
                </div>
                {selectedCustomerForDrawer.isVip && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
                    👑 VIP Müşteri
                  </span>
                )}
              </div>

              {/* AI Çapraz Satış (Cross-Selling) Motoru */}
              <div className="bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white border border-indigo-200 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-indigo-700">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">AI Çapraz Satış Önerisi</span>
                  </div>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-full">
                    %84 İhtiyaç Skoru
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Bu müşterinin portföyünüzde <strong>Kasko ve Zorunlu Trafik</strong> poliçesi bulunuyor ancak <strong>Tamamlayıcı Sağlık (TSS) veya Konut DASK</strong> poliçesi bulunmuyor.
                </p>

                <div className="p-3 bg-white/80 rounded-xl border border-indigo-100 text-xs text-indigo-900 font-semibold flex items-center justify-between">
                  <span>Önerilen Ürün: Aile Tamamlayıcı Sağlık (TSS)</span>
                  <span className="text-emerald-700 font-bold">~%18 Ek Komisyon</span>
                </div>
              </div>

              {/* Varlıklar & Araç Bilgileri */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Kayıtlı Varlıklar & Araçlar
                </span>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <Car className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-bold text-slate-900 font-mono">{selectedCustomerForDrawer.plateNumber || '34 VR 8920'}</span>
                      <div className="text-[11px] text-slate-500">Volkswagen Tiguan 1.5 TSI Elegance</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Kasko Aktif
                  </span>
                </div>
              </div>

              {/* Hasar / Prim Rasyosu */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Hasar / Prim Oranı (Loss Ratio)</span>
                  <span className="text-xs text-slate-600 font-medium">Portföy kârlılık skoru</span>
                </div>
                <div className="text-right">
                  <span className={`text-base font-black ${selectedCustomerForDrawer.lossRatio > 50 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    %{selectedCustomerForDrawer.lossRatio}
                  </span>
                  <div className="text-[10px] text-slate-400 font-medium">Kârlı Müşteri</div>
                </div>
              </div>
            </div>

            {/* Alt Aksiyon Butonu */}
            <div className="pt-6 border-t border-slate-100 mt-6 space-y-2">
              <button
                onClick={() => {
                  const cust = selectedCustomerForDrawer;
                  setSelectedCustomerForDrawer(null);
                  setCustomerForBranchModal(cust);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Bu Müşteri İçin Teklif Al (Branş Seçerek)</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
