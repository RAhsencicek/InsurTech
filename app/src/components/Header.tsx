import React from 'react';
import { TENANTS } from '../data/mockData';
import { TenantId } from '../types';
import { Building2, Zap, Crown, Shield } from 'lucide-react';

interface HeaderProps {
  currentTenantId: TenantId;
  onTenantChange: (id: TenantId) => void;
  isSimulatingQuotes?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTenantId,
  onTenantChange,
  isSimulatingQuotes = false
}) => {
  const currentTenant = TENANTS.find(t => t.id === currentTenantId) || TENANTS[0];

  return (
    <header className="app-header h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Sol: Yönetici Modu & Canlı Durum */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
          <Crown className="w-3.5 h-3.5 text-blue-700" />
          <span>Acente Yönetim Paneli</span>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Tüm Şubeler Canlı</span>
        </div>

        {isSimulatingQuotes && (
          <div className="flex items-center space-x-1.5 bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-teal-700" />
            <span>Teklif motoru devrede</span>
          </div>
        )}
      </div>

      {/* Sağ: Multi-Tenant Şube Değiştirici & Yönetici Profili */}
      <div className="flex items-center space-x-4">
        {/* Şube Seçici (Yönetici Tüm Şubeleri Denetleyebilir) */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 hover:border-blue-400 transition-colors">
          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
              Yönetici Şube Denetimi
            </span>
            <select
              value={currentTenantId}
              onChange={(e) => onTenantChange(e.target.value as TenantId)}
              className="bg-transparent text-xs font-bold text-slate-900 border-none focus:outline-none focus:ring-0 cursor-pointer pr-4"
            >
              {TENANTS.map((t) => (
                <option key={t.id} value={t.id} className="text-slate-900 bg-white">
                  {t.name} ({t.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Profil: Acente Sahibi / Yönetici */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
            YÖ
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-black text-slate-900">Acente Yönetim Kurulu</span>
            <span className="text-[10px] text-blue-600 font-bold">Genel Müdürlük Yetkisi</span>
          </div>
        </div>
      </div>
    </header>
  );
};
