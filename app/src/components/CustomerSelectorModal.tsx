import React, { useState } from 'react';
import { Customer, InsuranceBranch } from '../types';
import { MOCK_STAFF } from '../data/mockData';
import { 
  X, 
  Search, 
  Users, 
  UserCheck, 
  Crown, 
  Car, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  HeartPulse, 
  Home, 
  Building2, 
  ArrowRight, 
  UserPlus, 
  Check, 
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

interface CustomerSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  activeCustomerId?: string;
  onSelectCustomer: (customer: Customer, branch?: InsuranceBranch) => void;
  onOpenAddCustomerModal?: () => void;
}

export const CustomerSelectorModal: React.FC<CustomerSelectorModalProps> = ({
  isOpen,
  onClose,
  customers,
  activeCustomerId,
  onSelectCustomer,
  onOpenAddCustomerModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('ALL');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('ALL');
  const [selectedVipOnly, setSelectedVipOnly] = useState<boolean>(false);

  if (!isOpen) return null;

  // Filtreleme mantığı
  const filteredCustomers = customers.filter((c) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      c.fullName.toLowerCase().includes(q) ||
      c.identityNo.includes(q) ||
      (c.plateNumber && c.plateNumber.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q));

    const matchesStaff = 
      selectedStaffFilter === 'ALL' || 
      c.assignedStaffId === selectedStaffFilter || 
      c.assignedStaffName === selectedStaffFilter;

    const matchesBranch = 
      selectedBranchFilter === 'ALL' || 
      c.primaryBranch === selectedBranchFilter;

    const matchesVip = !selectedVipOnly || c.isVip;

    return matchesSearch && matchesStaff && matchesBranch && matchesVip;
  });

  const getBranchIcon = (branch?: InsuranceBranch) => {
    switch (branch) {
      case 'KASKO':
      case 'TRAFIK':
        return <Car className="w-3.5 h-3.5 text-blue-600" />;
      case 'TSS':
        return <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />;
      case 'DASK':
      case 'KONUT':
        return <Home className="w-3.5 h-3.5 text-amber-600" />;
      case 'ISYERI':
        return <Building2 className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const handleSelect = (customer: Customer) => {
    onSelectCustomer(customer, customer.primaryBranch || 'KASKO');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Üst Başlık & Aksiyon Barı */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Teklif Hazırlanacak Müşteriyi Seçin
                </h2>
                <p className="text-xs text-slate-500">
                  Portföydeki müşterilerden seçim yapın, Temsilciye (MT) göre filtreleyin veya tek tıkla arayın.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onOpenAddCustomerModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddCustomerModal();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">+ Yeni Müşteri Ekle</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canlı Filtreleme ve Arama Barı */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Arama Kutusu */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="İsim, TCKN / VKN, Araç Plakası, Telefon veya İlçe ile ara..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Müşteri Temsilcisi (MT) Filtresi */}
            <div className="sm:w-60">
              <select
                value={selectedStaffFilter}
                onChange={(e) => setSelectedStaffFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">👤 Tüm Müşteri Temsilcileri (MT)</option>
                {MOCK_STAFF.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    MT: {staff.name} ({staff.role.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Branş Filtresi */}
            <div className="sm:w-44">
              <select
                value={selectedBranchFilter}
                onChange={(e) => setSelectedBranchFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">🛡️ Tüm Branşlar</option>
                <option value="KASKO">🚗 Kasko</option>
                <option value="TRAFIK">📄 Trafik</option>
                <option value="TSS">🏥 TSS Sağlık</option>
                <option value="DASK">🏠 DASK / Konut</option>
                <option value="ISYERI">🏢 İşyeri</option>
              </select>
            </div>

            {/* VIP Filtre Butonu */}
            <button
              type="button"
              onClick={() => setSelectedVipOnly(!selectedVipOnly)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer border shrink-0 ${
                selectedVipOnly
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Crown className={`w-3.5 h-3.5 ${selectedVipOnly ? 'text-amber-700' : 'text-slate-400'}`} />
              <span>Sadece VIP</span>
            </button>
          </div>

          {/* Hızlı İstatistik ve Sonuç Sayısı */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-0.5">
            <div className="flex items-center space-x-3">
              <span>
                Bulunan: <strong className="text-slate-900">{filteredCustomers.length}</strong> / {customers.length} müşteri
              </span>
              {(selectedStaffFilter !== 'ALL' || selectedBranchFilter !== 'ALL' || selectedVipOnly || searchTerm) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStaffFilter('ALL');
                    setSelectedBranchFilter('ALL');
                    setSelectedVipOnly(false);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                >
                  Filtreleri Temizle
                </button>
              )}
            </div>
            <span className="hidden sm:inline text-slate-400">
              İpucu: Bir müşteriye tıkladığınızda 12 şirketten teklifler anında o müşteri için baştan üretilir.
            </span>
          </div>
        </div>

        {/* Kaydırılabilir Müşteri Kartları Listesi */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-slate-50/40">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Eşleşen Müşteri Bulunamadı</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                "{searchTerm}" aramasına ve seçili filtrelere uygun müşteri kaydı mevcut değil. Yeni müşteri olarak ekleyip hemen teklif alabilirsiniz.
              </p>
              {onOpenAddCustomerModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAddCustomerModal();
                  }}
                  className="mt-2 inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Yeni Müşteri Ekle & Teklif Başlat</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {filteredCustomers.map((cust) => {
                const isSelected = cust.id === activeCustomerId;

                return (
                  <div
                    key={cust.id}
                    onClick={() => handleSelect(cust)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-xs'
                    }`}
                  >
                    {/* Sol: Avatar ve Temel Kimlik */}
                    <div className="flex items-start space-x-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-blue-700 border border-slate-200 group-hover:bg-blue-50'
                      }`}>
                        {cust.type === 'CORPORATE' ? 'FİLO' : cust.fullName.substring(0, 2).toUpperCase()}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {cust.fullName}
                          </span>

                          <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-mono font-bold">
                            {cust.identityNo}
                          </span>

                          {cust.primaryBranch && (
                            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-bold flex items-center space-x-1">
                              {getBranchIcon(cust.primaryBranch)}
                              <span>{cust.primaryBranch}</span>
                            </span>
                          )}

                          {cust.isVip && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-black flex items-center space-x-1">
                              <Crown className="w-3 h-3 text-amber-600" />
                              <span>VIP Müşteri</span>
                            </span>
                          )}

                          {isSelected && (
                            <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                              <Check className="w-3 h-3" />
                              <span>Şu Anki Teklif Sahibi</span>
                            </span>
                          )}
                        </div>

                        {/* Alt Satır: Varlık / Telefon / Lokasyon */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          {cust.plateNumber && (
                            <span className="flex items-center space-x-1 font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              <Car className="w-3 h-3 text-blue-600" />
                              <span>{cust.plateNumber}</span>
                            </span>
                          )}
                          {cust.uavtCode && (
                            <span className="flex items-center space-x-1 font-mono text-slate-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[11px]">
                              <Home className="w-3 h-3 text-amber-600" />
                              <span>UAVT: {cust.uavtCode}</span>
                            </span>
                          )}
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{cust.phone}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{cust.city}</span>
                          </span>
                          {cust.profession && (
                            <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                              {cust.profession} (%15 İndirimli)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sağ: Temsilci, Metrikler ve Seç Butonu */}
                    <div className="flex items-center space-x-4 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 justify-between md:justify-end shrink-0">
                      {/* Atanmış MT */}
                      <div className="text-left md:text-right">
                        <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center md:justify-end space-x-1">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          <span>Müşteri Temsilcisi</span>
                        </div>
                        <div className="text-xs font-bold text-indigo-900">
                          {cust.assignedStaffName || 'Ece Karaca'}
                        </div>
                      </div>

                      {/* Poliçe Sayısı & LTV */}
                      <div className="text-left md:text-right hidden sm:block">
                        <div className="text-xs font-bold text-slate-900">
                          {cust.activePolicies} Aktif Poliçe
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          Komisyon LTV: <strong className="text-emerald-700 font-mono">{(cust.lifetimeCommission || 6400).toLocaleString('tr-TR')} ₺</strong>
                        </div>
                      </div>

                      {/* Seçim Butonu */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(cust);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs ${
                          isSelected
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600'
                        }`}
                      >
                        <span>{isSelected ? 'Yeniden Hesapla' : 'Bu Müşteriyi Seç'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Alt Çubuk (Footer) */}
        <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="text-slate-500 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Müşteri seçildiğinde Tramer basamağı ve meslek indirimleri tekliflere yansıtılır.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
          >
            Vazgeç / Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
