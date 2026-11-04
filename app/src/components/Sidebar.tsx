import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ScanLine, 
  Zap, 
  CircleDollarSign, 
  ShieldCheck, 
  FileText, 
  Users, 
  Sliders, 
  TrendingUp, 
  Cpu, 
  RefreshCw,
  ChevronDown,
  TrendingDown,
  CalendarX,
  FilePlus,
  Layers
} from 'lucide-react';
import { AuditorSubPage } from '../types';

export type ActiveTab = 'dashboard' | 'customers' | 'ocr' | 'quotes' | 'auditor' | 'migration' | 'security';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  auditorSubPage?: AuditorSubPage;
  onAuditorSubPageChange?: (subPage: AuditorSubPage) => void;
  pendingLeakagesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  auditorSubPage = 'overview',
  onAuditorSubPageChange,
  pendingLeakagesCount = 5
}) => {
  // Otonom Komisyon Avcısı akordeon durumu
  const [isAuditorExpanded, setIsAuditorExpanded] = useState<boolean>(activeTab === 'auditor');

  // activeTab 'auditor' olduğunda akordeon otomatik açık kalsın
  useEffect(() => {
    if (activeTab === 'auditor') {
      setIsAuditorExpanded(true);
    }
  }, [activeTab]);

  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Operasyon ve Gelir',
      badge: null,
      icon: LayoutDashboard,
      description: 'Merkezi operasyon, tecdit ve komisyonlar'
    },
    {
      id: 'customers' as ActiveTab,
      label: 'Müşteriler & Portföy',
      badge: 'CRM',
      badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200 font-bold',
      icon: Users,
      description: 'Müşteri 360°, Temsilci Atama & Varlıklar'
    },
    {
      id: 'ocr' as ActiveTab,
      label: 'Belge Aktarımı (OCR)',
      badge: null,
      icon: ScanLine,
      description: 'Belgeden bilgileri otomatik aktarın'
    },
    {
      id: 'quotes' as ActiveTab,
      label: 'Teklifleri Karşılaştır',
      badge: null,
      icon: Zap,
      description: 'Sigorta şirketlerinden teklif alın'
    },
    {
      id: 'auditor' as ActiveTab,
      label: 'Otonom Komisyon Avcısı',
      badge: 'TTK 102',
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200 font-bold',
      icon: CircleDollarSign,
      description: 'Gelir kayıplarını görünür hale getirin',
      isAccordion: true
    },
    {
      id: 'migration' as ActiveTab,
      label: 'Eski Programdan Aktar',
      badge: 'Polisoft',
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold',
      icon: RefreshCw,
      description: 'Eski sistemden kayıtları taşıyın'
    },
    {
      id: 'security' as ActiveTab,
      label: 'Veri Güvenliği',
      badge: null,
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold',
      icon: ShieldCheck,
      description: 'Şube erişimi ve veri koruması'
    }
  ];

  // Komisyon Avcısı Altında Açılan 4 Temel Kaçak Kategorisi
  const auditorSubItems: {
    id: AuditorSubPage;
    label: string;
    badge: string;
    dotColor: string;
  }[] = [
    {
      id: 'tariff',
      label: 'Tarife ve Oran Sapmaları',
      badge: '18 bin ₺',
      dotColor: 'bg-blue-500'
    },
    {
      id: 'cancellation',
      label: 'Haksız İptal Kesintileri',
      badge: '14 bin ₺',
      dotColor: 'bg-amber-500'
    },
    {
      id: 'endorsement',
      label: 'Zeyilname Kaçakları',
      badge: '750 ₺',
      dotColor: 'bg-purple-500'
    },
    {
      id: 'pool',
      label: 'Havuz & Sözleşme Dışı',
      badge: '10 bin ₺',
      dotColor: 'bg-rose-500'
    }
  ];

  const handleAuditorMainClick = () => {
    if (activeTab !== 'auditor') {
      onTabChange('auditor');
      onAuditorSubPageChange?.('overview');
      setIsAuditorExpanded(true);
    } else {
      // Eğer bir alt sayfadaysa ana başlığa basınca Genel Bakış'a dönsün
      if (auditorSubPage !== 'overview') {
        onAuditorSubPageChange?.('overview');
        setIsAuditorExpanded(true);
      } else {
        // Zaten Genel Bakış'taysa akordeonu aç/kapat
        setIsAuditorExpanded(!isAuditorExpanded);
      }
    }
  };

  const handleToggleChevron = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAuditorExpanded(!isAuditorExpanded);
  };

  const handleSubItemClick = (subId: AuditorSubPage, e: React.MouseEvent) => {
    e.stopPropagation();
    onTabChange('auditor');
    onAuditorSubPageChange?.(subId);
  };

  return (
    <aside className="app-sidebar w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Logo Bölümü */}
        <div className="h-16 px-5 flex items-center space-x-3 border-b border-slate-100">
          <div className="brand-mark w-9 h-9 rounded-xl flex items-center justify-center text-white">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">InsurTech</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                ACENTE
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Acente yönetim platformu</span>
          </div>
        </div>

        {/* Menü Linkleri */}
        <div className="p-3 space-y-1">
          <div className="px-3 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            ÇALIŞMA ALANI
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isAuditor = item.id === 'auditor';
            const isActive = activeTab === item.id;

            if (isAuditor) {
              const isOverviewActive = isActive && auditorSubPage === 'overview';
              const isSubActiveInGroup = isActive && auditorSubPage !== 'overview';

              return (
                <div key={item.id} className="space-y-0.5">
                  <button
                    onClick={handleAuditorMainClick}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                      isOverviewActive
                        ? 'bg-blue-50/80 text-blue-700 font-bold border border-blue-200 shadow-xs'
                        : isSubActiveInGroup
                        ? 'bg-slate-100/80 text-slate-900 font-bold border border-slate-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent font-medium'
                    }`}
                    title="Otonom Komisyon Avcısı (Genel Bakış)"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`} />
                      <div className="flex flex-col truncate">
                        <span className="text-xs truncate">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate hidden sm:block font-normal">
                          {item.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-1.5">
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                          item.badgeColor || 'bg-rose-50 text-rose-700 border border-rose-200 font-bold'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <span 
                        onClick={handleToggleChevron}
                        className="p-1 -mr-1 rounded-md hover:bg-slate-200/50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        title={isAuditorExpanded ? 'Daralt' : 'Genişlet'}
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isAuditorExpanded ? 'transform rotate-180 text-slate-600' : ''
                        }`} />
                      </span>
                    </div>
                  </button>

                  {/* Akordeon: Alta Doğru Genişleyen 4 Seçenek */}
                  <div 
                    className={`overflow-hidden transition-all duration-200 ease-in-out ${
                      isAuditorExpanded ? 'max-h-72 opacity-100 my-1' : 'max-h-0 opacity-0 pointer-events-none my-0'
                    }`}
                  >
                    <div className="ml-4 pl-2.5 border-l-2 border-slate-200 space-y-1 py-0.5">
                      {auditorSubItems.map((sub) => {
                        const isSubActive = isActive && auditorSubPage === sub.id;

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={(e) => handleSubItemClick(sub.id, e)}
                            className={`sidebar-sub-item w-full flex items-center justify-between text-left transition-all cursor-pointer ${
                              isSubActive
                                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900 font-medium border border-transparent'
                            }`}
                            title={sub.label}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                isSubActive ? 'bg-[#255963]' : sub.dotColor
                              }`} />
                              <span className="truncate">{sub.label}</span>
                            </div>

                            {sub.badge && (
                              <span className={`text-[10px] font-mono shrink-0 ml-1.5 ${
                                isSubActive
                                  ? 'text-blue-700 font-bold'
                                  : 'text-slate-400'
                              }`}>
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/80 text-blue-700 font-bold border border-blue-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent font-medium'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <div className="flex flex-col truncate">
                    <span className="text-xs truncate">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate hidden sm:block font-normal">
                      {item.description}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ml-1.5 ${
                    item.badgeColor || 'bg-blue-100/70 text-blue-700 border border-blue-200 font-bold'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Gelecek Kurumsal Modüller */}
        <div className="p-3 pt-2 space-y-1">
          <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            YAKINDA
          </div>
          <div className="px-3 py-2 text-xs text-slate-400 flex items-center space-x-3 cursor-not-allowed opacity-60">
            <Users className="w-4 h-4 text-slate-400" />
            <span>B2B Tali Acente Portalı</span>
          </div>
          <div className="px-3 py-2 text-xs text-slate-400 flex items-center space-x-3 cursor-not-allowed opacity-60">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Hasar & Loss-Ratio Analitiği</span>
          </div>
          <div className="px-3 py-2 text-xs text-slate-400 flex items-center space-x-3 cursor-not-allowed opacity-60">
            <Sliders className="w-4 h-4 text-slate-400" />
            <span>SBM & UAVT Canlı Akış</span>
          </div>
        </div>
      </div>

      {/* Alt: Kurumsal Lisans & Sistem Durumu */}
      <div className="sidebar-note p-4 m-3 rounded-2xl bg-slate-50 border border-slate-200/80">
        <div className="flex items-center space-x-2 text-blue-700 text-xs font-bold mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>Demo çalışma alanı</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          Örnek acente verileriyle hazırlanan ürün demosu.
        </p>
        <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <span>InsurTech</span>
          <span className="text-emerald-700 font-bold">● Hazır</span>
        </div>
      </div>
    </aside>
  );
};
