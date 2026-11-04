import React, { useState } from 'react';
import { Customer, Policy, InsuranceBranch, Tenant, StaffPerformance } from '../types';
import { MOCK_STAFF, TENANTS } from '../data/mockData';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Car, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  HeartPulse, 
  Home, 
  Building2, 
  ArrowUpRight, 
  ArrowRight,
  Sparkles, 
  CheckCircle2, 
  X, 
  Share2, 
  Clock, 
  Crown, 
  Award, 
  TrendingUp, 
  AlertCircle,
  FileText,
  UserCheck,
  Send,
  RefreshCw
} from 'lucide-react';

interface CustomersViewProps {
  currentTenant: Tenant;
  customers: Customer[];
  policies: Policy[];
  onStartQuoteForCustomer: (customer: Customer, branch?: InsuranceBranch) => void;
  onOpenAddCustomerModal: () => void;
  onUpdateCustomerStaff: (customerId: string, newStaffId: string, newStaffName: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  currentTenant,
  customers,
  policies,
  onStartQuoteForCustomer,
  onOpenAddCustomerModal,
  onUpdateCustomerStaff
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('ALL');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('ALL');
  const [selectedVipFilter, setSelectedVipFilter] = useState<boolean>(false);
  const [selectedCustomerForDrawer, setSelectedCustomerForDrawer] = useState<Customer | null>(null);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [reassignCustomer, setReassignCustomer] = useState<Customer | null>(null);
  const [targetStaffId, setTargetStaffId] = useState<string>(MOCK_STAFF[0].id);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtrelenmiş Müşteri Listesi
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.identityNo.includes(searchTerm) ||
      (c.plateNumber && c.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.phone && c.phone.includes(searchTerm));

    const matchesStaff = selectedStaffFilter === 'ALL' || c.assignedStaffId === selectedStaffFilter || c.assignedStaffName === selectedStaffFilter;
    const matchesBranch = selectedBranchFilter === 'ALL' || c.primaryBranch === selectedBranchFilter;
    const matchesVip = !selectedVipFilter || c.isVip;

    return matchesSearch && matchesStaff && matchesBranch && matchesVip;
  });

  // Temsilci Atama / Aktarma İşlemi
  const handleConfirmReassign = () => {
    if (!reassignCustomer) return;
    const targetStaff = MOCK_STAFF.find(s => s.id === targetStaffId);
    if (!targetStaff) return;

    onUpdateCustomerStaff(reassignCustomer.id, targetStaff.id, targetStaff.name);
    
    // Eğer çekmecede bu müşteri açıksa onu da güncelle
    if (selectedCustomerForDrawer && selectedCustomerForDrawer.id === reassignCustomer.id) {
      setSelectedCustomerForDrawer({
        ...selectedCustomerForDrawer,
        assignedStaffId: targetStaff.id,
        assignedStaffName: targetStaff.name
      });
    }

    setIsReassignModalOpen(false);
    setReassignCustomer(null);
    showToast(`"${reassignCustomer.fullName}" portföyü başarıyla "${targetStaff.name}" temsilcisine devredildi.`);
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

      {/* Başlık ve Aksiyon Barı */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Müşteriler & Portföy Yönetimi (CRM)
            </h1>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
              {customers.length} Kayıtlı Portföy
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Müşteri 360° görünümü, atanmış müşteri temsilcileri (MT), LTV kârlılık skorları ve varlık yönetimi.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onOpenAddCustomerModal}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>+ Yeni Müşteri Kaydet</span>
          </button>
        </div>
      </div>

      {/* Filtreleme ve Arama Kontrolleri */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Arama Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ad Soyad, TCKN, Plaka veya Tel..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Müşteri Temsilcisi (MT) Filtresi */}
          <div>
            <select
              value={selectedStaffFilter}
              onChange={(e) => setSelectedStaffFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            >
              <option value="ALL">Tüm Müşteri Temsilcileri (MT)</option>
              {MOCK_STAFF.map(staff => (
                <option key={staff.id} value={staff.id}>
                  👤 {staff.name} ({staff.role})
                </option>
              ))}
            </select>
          </div>

          {/* Branş Filtresi */}
          <div>
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            >
              <option value="ALL">Tüm Sigorta Branşları</option>
              <option value="KASKO">🚗 Kasko</option>
              <option value="TRAFIK">🛡️ Zorunlu Trafik</option>
              <option value="TSS">🏥 Tamamlayıcı Sağlık (TSS)</option>
              <option value="DASK">🏢 DASK Deprem</option>
              <option value="KONUT">🏠 Konut Paket</option>
              <option value="ISYERI">🏭 İşyeri / KOBİ</option>
            </select>
          </div>

          {/* VIP Filtre Butonu */}
          <div>
            <button
              onClick={() => setSelectedVipFilter(!selectedVipFilter)}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                selectedVipFilter
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{selectedVipFilter ? 'Sadece VIP Portföy (Aktif)' : '⭐ Sadece VIP Müşteriler'}</span>
            </button>
          </div>
        </div>

        {/* Hızlı İstatistik Bilgi Şeridi */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
          <span>Gösterilen: <strong className="text-slate-800 font-bold">{filteredCustomers.length}</strong> müşteri</span>
          <div className="flex items-center space-x-3">
            <span>VIP Müşteri: <strong className="text-amber-700 font-bold">{customers.filter(c => c.isVip).length}</strong></span>
            <span>•</span>
            <span>Toplam Portföy LTV: <strong className="text-emerald-700 font-bold font-mono">{customers.reduce((sum, c) => sum + (c.lifetimeCommission || 0), 0).toLocaleString('tr-TR')} ₺</strong></span>
          </div>
        </div>
      </div>

      {/* Müşteri Listesi Tablosu */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="py-3 px-4 font-bold">Müşteri / Ünvan</th>
                <th className="py-3 px-4 font-bold">Atanmış Temsilci (MT)</th>
                <th className="py-3 px-4 font-bold">İletişim & Konum</th>
                <th className="py-3 px-4 font-bold">Kayıtlı Varlık / Branş</th>
                <th className="py-3 px-4 font-bold">Poliçe / Hasar</th>
                <th className="py-3 px-4 font-bold text-right">LTV Komisyon</th>
                <th className="py-3 px-4 font-bold text-right">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Arama kriterlerine uygun müşteri kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => {
                  const assignedStaff = MOCK_STAFF.find(s => s.id === customer.assignedStaffId || s.name === customer.assignedStaffName) || MOCK_STAFF[0];
                  return (
                    <tr 
                      key={customer.id} 
                      onClick={() => setSelectedCustomerForDrawer(customer)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Müşteri Adı & Kimlik */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-blue-700 text-xs shrink-0">
                            {customer.type === 'CORPORATE' ? 'FİLO' : customer.fullName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {customer.fullName}
                              </span>
                              {customer.isVip && (
                                <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-black px-1.5 py-0.2 rounded-full flex items-center space-x-0.5">
                                  <Crown className="w-2.5 h-2.5" />
                                  <span>VIP</span>
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[10px] text-slate-500 block">
                              {customer.identityNo} • {customer.type === 'CORPORATE' ? 'Kurumsal VKN' : 'Bireysel TCKN'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Atanmış Müşteri Temsilcisi (MT) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded-md text-white font-bold flex items-center justify-center text-[10px]"
                            style={{ backgroundColor: assignedStaff.avatarColor }}
                          >
                            {assignedStaff.name.substring(0, 1)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">{assignedStaff.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setReassignCustomer(customer);
                                setTargetStaffId(assignedStaff.id);
                                setIsReassignModalOpen(true);
                              }}
                              className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold hover:underline block"
                            >
                              Temsilci Değiştir
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* İletişim */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono font-medium text-slate-900 block">{customer.phone}</span>
                          <span className="text-slate-500 text-[11px] block">{customer.city}</span>
                        </div>
                      </td>

                      {/* Kayıtlı Varlık & Branş */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {customer.plateNumber ? (
                            <span className="inline-flex items-center space-x-1 font-mono font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[11px] text-slate-800">
                              <Car className="w-3 h-3 text-blue-600" />
                              <span>{customer.plateNumber}</span>
                            </span>
                          ) : customer.uavtCode ? (
                            <span className="inline-flex items-center space-x-1 font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded text-[11px]">
                              <Home className="w-3 h-3 text-amber-600" />
                              <span>UAVT: {customer.uavtCode.substring(0, 6)}...</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded text-[11px]">
                              <HeartPulse className="w-3 h-3 text-emerald-600" />
                              <span>TSS Sağlık</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Poliçe Adedi & Hasar Oranı */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-slate-900 block">{customer.activePolicies} Aktif Poliçe</span>
                          <span className={`text-[10px] font-bold ${customer.lossRatio > 40 ? 'text-rose-600' : 'text-emerald-700'}`}>
                            Hasar: %{customer.lossRatio}
                          </span>
                        </div>
                      </td>

                      {/* LTV Yaşam Boyu Komisyon Kazancı */}
                      <td className="py-3.5 px-4 text-right">
                        <div>
                          <span className="font-mono font-black text-emerald-700 text-xs block">
                            {(customer.lifetimeCommission || 12000).toLocaleString('tr-TR')} ₺
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">Toplam Komisyon</span>
                        </div>
                      </td>

                      {/* Aksiyon Butonları */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onStartQuoteForCustomer(customer, customer.primaryBranch || 'KASKO')}
                            className="bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                          >
                            Teklif Al
                          </button>

                          <button
                            onClick={() => setSelectedCustomerForDrawer(customer)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Müşteri 360° İncele"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TEMSİLCİ ATAMA / DEVRETME MODALI */}
      {isReassignModalOpen && reassignCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Müşteri Temsilcisi Ata / Değiştir</h3>
              </div>
              <button
                onClick={() => setIsReassignModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
              <span className="text-slate-500 block">Devredilecek Portföy:</span>
              <strong className="text-slate-900 text-sm block mt-0.5">{reassignCustomer.fullName}</strong>
              <span className="text-[11px] text-slate-500 font-mono">TCKN: {reassignCustomer.identityNo} • Mevcut MT: {reassignCustomer.assignedStaffName || 'Atanmamış'}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Yeni Atanacak Müşteri Temsilcisi (MT):
              </label>
              <div className="space-y-2 mt-2">
                {MOCK_STAFF.map(staff => (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => setTargetStaffId(staff.id)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between text-left cursor-pointer transition-all ${
                      targetStaffId === staff.id
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div 
                        className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs"
                        style={{ backgroundColor: staff.avatarColor }}
                      >
                        {staff.name.substring(0, 1)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{staff.name}</span>
                        <span className="text-[10px] text-slate-500">{staff.role}</span>
                      </div>
                    </div>
                    {targetStaffId === staff.id && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setIsReassignModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleConfirmReassign}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-sm"
              >
                Atamayı Onayla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MÜŞTERİ 360° DETAY ÇEKMECESİ (DRAWER) */}
      {selectedCustomerForDrawer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Çekmece Başlığı */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-black text-base">
                    {selectedCustomerForDrawer.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-black text-slate-900">{selectedCustomerForDrawer.fullName}</h3>
                      {selectedCustomerForDrawer.isVip && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full">
                          ⭐ VIP Müşteri
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono mt-0.5">
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

              {/* Atanmış Temsilci & LTV Kartı */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Portföy Yöneticisi (MT)</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {selectedCustomerForDrawer.assignedStaffName || 'Selin Aksoy'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setReassignCustomer(selectedCustomerForDrawer);
                      setIsReassignModalOpen(true);
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:underline"
                  >
                    Değiştir
                  </button>
                </div>

                <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">LTV Yaşam Boyu Komisyon</span>
                  <span className="font-mono font-black text-emerald-700 text-sm block mt-0.5">
                    {(selectedCustomerForDrawer.lifetimeCommission || 24000).toLocaleString('tr-TR')} ₺
                  </span>
                </div>
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

              {/* AI Çapraz Satış Önerisi */}
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

              {/* Kayıtlı Varlıklar */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider block">Kayıtlı Varlıklar</span>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
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
            </div>

            {/* Alt Aksiyon Butonu */}
            <div className="pt-6 border-t border-slate-100 mt-6 flex space-x-3">
              <button
                onClick={() => {
                  const cust = selectedCustomerForDrawer;
                  setSelectedCustomerForDrawer(null);
                  onStartQuoteForCustomer(cust, cust.primaryBranch || 'KASKO');
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Hemen 12 Şirketten Teklif Al</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
