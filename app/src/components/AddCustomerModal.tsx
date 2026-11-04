import React, { useState } from 'react';
import { Customer, InsuranceBranch, OcrExtractedData, Tenant } from '../types';
import { 
  X, 
  Sparkles, 
  UserPlus, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Car, 
  ShieldCheck, 
  HeartPulse, 
  Home, 
  Building2 
} from 'lucide-react';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTenant: Tenant;
  onAddNewCustomer: (
    customer: Customer,
    startQuotationNow: boolean,
    branch?: InsuranceBranch,
    extractedData?: OcrExtractedData
  ) => void;
  initialPreset?: 'AUTO' | 'HEALTH' | 'HOME';
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  currentTenant,
  onAddNewCustomer,
  initialPreset = 'AUTO'
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Adım 1: Müşteri & Meslek İndirimi Bilgileri
  const [isInsuredSame, setIsInsuredSame] = useState(true);
  const [policyHolderIdentity, setPolicyHolderIdentity] = useState('');
  const [policyHolderName, setPolicyHolderName] = useState('');
  const [newCustomerType, setNewCustomerType] = useState<'INDIVIDUAL' | 'CORPORATE'>('INDIVIDUAL');
  const [newIdentityNo, setNewIdentityNo] = useState('39281740192');
  const [newFullName, setNewFullName] = useState('Selin Yılmaz Kurt');
  const [newBirthDate, setNewBirthDate] = useState('1991-05-14');
  const [newGender, setNewGender] = useState<'E' | 'K'>('K');
  const [newProfession, setNewProfession] = useState('DOKTOR');
  const [newPhone, setNewPhone] = useState('+90 535 882 19 40');
  const [newEmail, setNewEmail] = useState('selin.yilmaz@gmail.com');
  const [newCity, setNewCity] = useState('İstanbul / Kadıköy');

  // Adım 2: Branş ve Varlık / Risk Bilgileri
  const [newSelectedBranch, setNewSelectedBranch] = useState<InsuranceBranch>('KASKO');

  // Araç Branşı (Kasko / Trafik)
  const [newPlateNumber, setNewPlateNumber] = useState('34 SYK 920');
  const [newLicenseSerial, setNewLicenseSerial] = useState('AA 829104');
  const [newVehicleModel, setNewVehicleModel] = useState('Volkswagen Golf 1.5 eTSI R-Line');
  const [newModelYear, setNewModelYear] = useState(2023);
  const [newUsageType, setNewUsageType] = useState('HUSUSİ');
  const [newTramerStep, setNewTramerStep] = useState<number>(6); // 6. basamak (%30 indirim)
  const [newServiceChoice, setNewServiceChoice] = useState<'YETKILI' | 'OZEL'>('YETKILI');
  const [newImmLimit, setNewImmLimit] = useState('SINIRSIZ');

  // Sağlık Branşı (TSS)
  const [newHeight, setNewHeight] = useState<number>(168);
  const [newWeight, setNewWeight] = useState<number>(58);
  const [newSgkStatus, setNewSgkStatus] = useState<'4A' | '4B' | '4C' | 'YOK'>('4A');
  const [newHospitalNetwork, setNewHospitalNetwork] = useState<'NETWORK_A' | 'NETWORK_B'>('NETWORK_A');
  const [newTssPackage, setNewTssPackage] = useState<'YATARAK_AYAKTA' | 'SADECE_YATARAK'>('YATARAK_AYAKTA');

  // Konut & DASK Branşı
  const [newUavtCode, setNewUavtCode] = useState('2849102841');
  const [newBuildingYear, setNewBuildingYear] = useState('2018');
  const [newConstructionType] = useState('BETONARME');
  const [newFloorNumber, setNewFloorNumber] = useState(4);
  const [newTotalFloors, setNewTotalFloors] = useState(8);
  const [newGrossM2, setNewGrossM2] = useState<number>(135);
  const [newOccupancyType, setNewOccupancyType] = useState<'EV_SAHIBI' | 'KIRACI'>('EV_SAHIBI');
  const [newContentValue, setNewContentValue] = useState<number>(500000);
  const [newFullAddress, setNewFullAddress] = useState('Suadiye Mah. Bağdat Cad. No: 384 D: 12');

  // İşyeri Branşı
  const [newNaceCode, setNewNaceCode] = useState('62.01 - Bilgisayar Programlama ve Yazılım');
  const [newBuildingValue, setNewBuildingValue] = useState<number>(4500000);
  const [newCommodityValue, setNewCommodityValue] = useState<number>(2000000);
  const [newFixtureValue, setNewFixtureValue] = useState<number>(800000);
  const [newEmployeesCount, setNewEmployeesCount] = useState<number>(14);

  // Adım 3: Ödeme & Teklif Tercihleri
  const [newPaymentPlan, setNewPaymentPlan] = useState<'PESIN' | '3_TAKSIT' | '6_TAKSIT' | '9_TAKSIT'>('6_TAKSIT');
  const [agentNotes, setAgentNotes] = useState('Müşteri yetkili servis ve orijinal cam teminatına öncelik veriyor.');

  // BMI Hesaplayıcı (Sağlık için)
  const calculateBmi = () => {
    if (!newHeight || !newWeight) return { bmi: 0, status: 'Belirsiz', color: 'text-slate-500' };
    const heightInM = newHeight / 100;
    const bmiVal = Number((newWeight / (heightInM * heightInM)).toFixed(1));
    if (bmiVal < 18.5) return { bmi: bmiVal, status: 'Zayıf', color: 'text-amber-600' };
    if (bmiVal <= 24.9) return { bmi: bmiVal, status: 'İdeal / Sürprimsiz Standart', color: 'text-emerald-700' };
    if (bmiVal <= 29.9) return { bmi: bmiVal, status: 'Fazla Kilolu', color: 'text-amber-600' };
    return { bmi: bmiVal, status: 'Obez (Sürprim Riski)', color: 'text-rose-600' };
  };

  const fillPreset = (type: 'AUTO' | 'HEALTH' | 'HOME') => {
    if (type === 'AUTO') {
      setNewCustomerType('INDIVIDUAL');
      setNewIdentityNo('39281740192');
      setNewFullName('Selin Yılmaz Kurt');
      setNewBirthDate('1991-05-14');
      setNewGender('K');
      setNewProfession('DOKTOR');
      setNewPhone('+90 535 882 19 40');
      setNewEmail('selin.yilmaz@gmail.com');
      setNewCity('İstanbul / Kadıköy');
      setNewSelectedBranch('KASKO');
      setNewPlateNumber('34 SYK 920');
      setNewLicenseSerial('AA 829104');
      setNewVehicleModel('Volkswagen Golf 1.5 eTSI R-Line');
      setNewModelYear(2023);
      setNewUsageType('HUSUSİ');
      setNewTramerStep(6);
      setNewServiceChoice('YETKILI');
      setNewImmLimit('SINIRSIZ');
      setNewPaymentPlan('6_TAKSIT');
      setAgentNotes('Doktor meslek indirimi (%15) ve yetkili servis muafiyetsiz talep edildi.');
    } else if (type === 'HEALTH') {
      setNewCustomerType('INDIVIDUAL');
      setNewIdentityNo('10948291048');
      setNewFullName('Dr. Barış Demir');
      setNewBirthDate('1984-11-20');
      setNewGender('E');
      setNewProfession('DOKTOR');
      setNewPhone('+90 542 391 84 00');
      setNewEmail('dr.baris.demir@hastane.com');
      setNewCity('Ankara / Çankaya');
      setNewSelectedBranch('TSS');
      setNewHeight(180);
      setNewWeight(78);
      setNewSgkStatus('4A');
      setNewHospitalNetwork('NETWORK_A');
      setNewTssPackage('YATARAK_AYAKTA');
      setNewPaymentPlan('3_TAKSIT');
      setAgentNotes('Acıbadem ve Memorial anlaşmalı VIP Network A istendi.');
    } else {
      setNewCustomerType('INDIVIDUAL');
      setNewIdentityNo('58201948291');
      setNewFullName('Ayşe Gökçe');
      setNewBirthDate('1978-03-22');
      setNewGender('K');
      setNewProfession('OGRETMEN');
      setNewPhone('+90 532 901 22 77');
      setNewEmail('ayse.gokce@outlook.com');
      setNewCity('İzmir / Karşıyaka');
      setNewSelectedBranch('DASK');
      setNewUavtCode('1940284719');
      setNewBuildingYear('2019');
      setNewFloorNumber(3);
      setNewTotalFloors(6);
      setNewGrossM2(140);
      setNewOccupancyType('EV_SAHIBI');
      setNewContentValue(600000);
      setNewFullAddress('Bostanlı Mah. Cemal Gürsel Cad. No: 64 D: 8');
      setNewPaymentPlan('PESIN');
      setAgentNotes('Deprem DASK ve eşya yangın paketi birlikte sorgulanacak.');
    }
  };

  const handleSave = (startQuotationNow: boolean) => {
    if (!newFullName || !newIdentityNo) {
      alert('Lütfen en az Ad Soyad ve TCKN/VKN alanlarını doldurun.');
      return;
    }

    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      tenantId: currentTenant.id,
      fullName: newFullName,
      identityNo: newIdentityNo,
      type: newCustomerType,
      phone: newPhone || '+90 555 000 00 00',
      email: newEmail || 'musteri@example.com',
      city: newCity,
      birthDate: newBirthDate,
      gender: newGender,
      profession: newProfession,
      isInsuredSameAsPolicyHolder: isInsuredSame,
      policyHolderName: isInsuredSame ? undefined : policyHolderName,
      policyHolderIdentity: isInsuredSame ? undefined : policyHolderIdentity,
      plateNumber: (newSelectedBranch === 'KASKO' || newSelectedBranch === 'TRAFIK') ? newPlateNumber : undefined,
      licenseSerial: (newSelectedBranch === 'KASKO' || newSelectedBranch === 'TRAFIK') ? newLicenseSerial : undefined,
      tramerStep: newTramerStep,
      uavtCode: (newSelectedBranch === 'DASK' || newSelectedBranch === 'KONUT') ? newUavtCode : undefined,
      buildingYear: Number(newBuildingYear) || 2020,
      constructionType: newConstructionType,
      floorNumber: newFloorNumber,
      totalFloors: newTotalFloors,
      sgkStatus: newSgkStatus,
      height: newHeight,
      weight: newWeight,
      primaryBranch: newSelectedBranch,
      activePolicies: 0,
      lossRatio: 0,
      churnRisk: 'LOW',
      lastPolicyDate: new Date().toISOString().split('T')[0],
      assignedStaffId: 'staff_1',
      assignedStaffName: 'Ece Karaca',
      isVip: false
    };

    const extractedData: OcrExtractedData = {
      documentKind: (newSelectedBranch === 'KASKO' || newSelectedBranch === 'TRAFIK') ? 'RUHSAT' : (newSelectedBranch === 'TSS') ? 'KIMLIK' : 'DASK_TAPU',
      identityNo: newIdentityNo,
      fullName: newFullName,
      plateNumber: newPlateNumber,
      licenseSerial: newLicenseSerial,
      tramerStep: newTramerStep,
      vehicleBrandModel: newVehicleModel,
      modelYear: newModelYear,
      birthDate: newBirthDate,
      gender: newGender,
      profession: newProfession,
      hospitalNetwork: newHospitalNetwork,
      sgkStatus: newSgkStatus,
      height: newHeight,
      weight: newWeight,
      uavtAddressCode: newUavtCode,
      fullAddress: `${newCity}, ${newFullAddress}`,
      grossSquareMeters: newGrossM2,
      confidenceScore: 99.8
    };

    onAddNewCustomer(newCustomer, startQuotationNow, newSelectedBranch, extractedData);
    onClose();
    setCurrentStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 my-6">
        
        {/* Modal Başlığı ve Hızlı Demo Doldurucular */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-black text-slate-900">Kurumsal Sigorta Teklif Başvurusu</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tramer, SBM, UAVT ve SGK gereksinimlerine tam uyumlu teklif hazırlama sihirbazı.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hızlı Demo Doldurma Çubuğu */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Tek Tıkla Gerçekçi Veri Doldur:</span>
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fillPreset('AUTO')}
              className="bg-white hover:bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-blue-200 cursor-pointer shadow-xs transition-colors"
            >
              🚗 Kasko (Doktor İndirimli)
            </button>
            <button
              type="button"
              onClick={() => fillPreset('HEALTH')}
              className="bg-white hover:bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-emerald-200 cursor-pointer shadow-xs transition-colors"
            >
              🏥 Sağlık TSS (VIP Network)
            </button>
            <button
              type="button"
              onClick={() => fillPreset('HOME')}
              className="bg-white hover:bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-amber-200 cursor-pointer shadow-xs transition-colors"
            >
              🏠 Konut & DASK (UAVT'li)
            </button>
          </div>
        </div>

        {/* 3 Adımlı Kurumsal İlerleme Çubuğu (Stepper) */}
        <div className="grid grid-cols-3 gap-2 py-1">
          {[
            { step: 1, title: '1. Müşteri & Meslek İndirimi', desc: 'Kimlik, meslek & indirim' },
            { step: 2, title: '2. Branş & Varlık/Risk', desc: 'Ruhsat, UAVT, boy-kilo' },
            { step: 3, title: '3. Teminat & Ödeme', desc: 'Taksit & teklif kanalı' }
          ].map(s => (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step as 1 | 2 | 3)}
              className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                currentStep === s.step
                  ? 'bg-blue-50/80 border-blue-600 shadow-xs'
                  : currentStep > s.step
                  ? 'bg-emerald-50/40 border-emerald-300 text-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${currentStep === s.step ? 'text-blue-700' : 'text-slate-800'}`}>
                  {s.title}
                </span>
                {currentStep > s.step && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">{s.desc}</span>
            </button>
          ))}
        </div>

        {/* ADIM 1: MÜŞTERİ KİMLİĞİ & MESLEK İNDİRİMİ */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            {/* Sigorta Ettiren & Sigortalı Ayrımı */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Sigorta Ettiren ile Sigortalı Aynı Kişi mi?</span>
                <span className="text-[11px] text-slate-500">Poliçe primi ödeyen ile hak sahibi aynı kişi mi?</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsInsuredSame(true)}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
                    isInsuredSame ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  Evet (Aynı)
                </button>
                <button
                  type="button"
                  onClick={() => setIsInsuredSame(false)}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
                    !isInsuredSame ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  Hayır (Farklı)
                </button>
              </div>
            </div>

            {!isInsuredSame && (
              <div className="grid grid-cols-2 gap-3 bg-amber-50/50 border border-amber-200 rounded-xl p-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Sigorta Ettiren TCKN / VKN</label>
                  <input
                    type="text"
                    value={policyHolderIdentity}
                    onChange={(e) => setPolicyHolderIdentity(e.target.value)}
                    placeholder="Örn: Şirket VKN veya Eşinin TCKN'si"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Sigorta Ettiren Adı / Ünvanı</label>
                  <input
                    type="text"
                    value={policyHolderName}
                    onChange={(e) => setPolicyHolderName(e.target.value)}
                    placeholder="Örn: Teknoloji A.Ş."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5"
                  />
                </div>
              </div>
            )}

            {/* Müşteri Tipi: Bireysel / Kurumsal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Müşteri Türü</label>
                <select
                  value={newCustomerType}
                  onChange={(e) => setNewCustomerType(e.target.value as 'INDIVIDUAL' | 'CORPORATE')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                >
                  <option value="INDIVIDUAL">Bireysel (Gerçek Kişi - TCKN)</option>
                  <option value="CORPORATE">Kurumsal (Tüzel Kişi / Filo - VKN)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {newCustomerType === 'INDIVIDUAL' ? 'T.C. Kimlik No (11 Hane) *' : 'Vergi Kimlik No (10 Hane) *'}
                </label>
                <input
                  type="text"
                  value={newIdentityNo}
                  onChange={(e) => setNewIdentityNo(e.target.value)}
                  placeholder="39281740192"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {newCustomerType === 'INDIVIDUAL' ? 'Sigortalı Ad Soyad *' : 'Şirket Resmi Ünvanı *'}
                </label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Selin Yılmaz Kurt"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
              </div>
            </div>

            {/* Doğum Tarihi, Cinsiyet ve Meslek Grubu (İndirim Faktörü) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doğum Tarihi (Gün/Ay/Yıl)</label>
                <input
                  type="date"
                  value={newBirthDate}
                  onChange={(e) => setNewBirthDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cinsiyet</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setNewGender('K')}
                    className={`flex-1 py-2 rounded-xl font-bold cursor-pointer transition-all border ${
                      newGender === 'K' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Kadın
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewGender('E')}
                    className={`flex-1 py-2 rounded-xl font-bold cursor-pointer transition-all border ${
                      newGender === 'E' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Erkek
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Meslek Grubu (Özel İndirim)
                </label>
                <select
                  value={newProfession}
                  onChange={(e) => setNewProfession(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-blue-900"
                >
                  <option value="DOKTOR">Doktor / Sağlık Çalışanı (%15 İndirim)</option>
                  <option value="OGRETMEN">Öğretmen / Akademisyen (%15 İndirim)</option>
                  <option value="POLIS_TSK">TSK / Emniyet Mensubu (%20 İndirim)</option>
                  <option value="MEMUR">Kamu Personeli / Memur (%10 İndirim)</option>
                  <option value="AVUKAT">Avukat / Yargı Mensubu (%10 İndirim)</option>
                  <option value="OZEL_SEKTOR">Özel Sektör / Serbest Meslek</option>
                  <option value="EMEKLİ">Emekli (%10 İndirim)</option>
                </select>
              </div>
            </div>

            {/* İletişim Bilgileri: Telefon, E-posta, İl / İlçe */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cep Telefonu (SMS & WhatsApp)</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+90 535 882 19 40"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">E-Posta Adresi</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="selin.yilmaz@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">İl / İlçe (Prim Bölgesi)</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="İstanbul / Kadıköy"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* ADIM 2: SİGORTA BRANŞI VE BRANŞA ÖZEL VARLIK / RİSK BİLGİLERİ */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            {/* 6 Branş Seçim Kartı */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Teklif Alınacak Sigorta Branşını Seçin:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { branch: 'KASKO' as InsuranceBranch, label: 'Genişletilmiş Kasko', icon: Car },
                  { branch: 'TRAFIK' as InsuranceBranch, label: 'Zorunlu Trafik', icon: ShieldCheck },
                  { branch: 'TSS' as InsuranceBranch, label: 'Tamamlayıcı Sağlık (TSS)', icon: HeartPulse },
                  { branch: 'DASK' as InsuranceBranch, label: 'DASK (Deprem)', icon: Home },
                  { branch: 'KONUT' as InsuranceBranch, label: 'Konut Paket Sigortası', icon: Home },
                  { branch: 'ISYERI' as InsuranceBranch, label: 'Ticari İşyeri & KOBİ', icon: Building2 }
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = newSelectedBranch === item.branch;
                  return (
                    <button
                      key={item.branch}
                      type="button"
                      onClick={() => setNewSelectedBranch(item.branch)}
                      className={`p-3 rounded-xl border flex items-center space-x-2 text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BRANŞ A: KASKO VEYA TRAFİK ALANLARI */}
            {(newSelectedBranch === 'KASKO' || newSelectedBranch === 'TRAFIK') && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                    <Car className="w-4 h-4 text-blue-600" />
                    <span>Araç & Ruhsat Detayları (SBM / Tramer Doğrulama)</span>
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                    Tramer Sorgusu Aktif
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Araç Plakası *</label>
                    <input
                      type="text"
                      value={newPlateNumber}
                      onChange={(e) => setNewPlateNumber(e.target.value.toUpperCase())}
                      placeholder="34 SYK 920"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Ruhsat Tescil Seri & Sıra No *
                    </label>
                    <input
                      type="text"
                      value={newLicenseSerial}
                      onChange={(e) => setNewLicenseSerial(e.target.value.toUpperCase())}
                      placeholder="AA 829104"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Model Yılı</label>
                    <input
                      type="number"
                      value={newModelYear}
                      onChange={(e) => setNewModelYear(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Marka & Model Adı</label>
                    <input
                      type="text"
                      value={newVehicleModel}
                      onChange={(e) => setNewVehicleModel(e.target.value)}
                      placeholder="Volkswagen Golf 1.5 eTSI R-Line"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kullanım Şekli</label>
                    <select
                      value={newUsageType}
                      onChange={(e) => setNewUsageType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium"
                    >
                      <option value="HUSUSİ">Hususi Otomobil</option>
                      <option value="ŞİRKET_ARACI">Şirket / Hizmet Aracı</option>
                      <option value="TICARI_TAKSI">Ticari Taksi</option>
                      <option value="KAMYONET">Kamyonet / Panelvan</option>
                      <option value="RENT_A_CAR">Kiralık Araç (Rent a Car)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tramer Hasarsızlık Kademesi
                    </label>
                    <select
                      value={newTramerStep}
                      onChange={(e) => setNewTramerStep(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-emerald-800"
                    >
                      <option value={4}>4. Basamak (İlk Tescil - Standart Prim)</option>
                      <option value={5}>5. Basamak (%15 Hasarsızlık İndirimi)</option>
                      <option value={6}>6. Basamak (%30 Hasarsızlık İndirimi)</option>
                      <option value={7}>7. Basamak (%40 Hasarsızlık İndirimi)</option>
                      <option value={8}>8. Basamak (%50 Maksimum İndirim)</option>
                      <option value={3}>3. Basamak (%20 Sürprim - 1 Hasar)</option>
                      <option value={2}>2. Basamak (%40 Sürprim - 2 Hasar)</option>
                    </select>
                  </div>
                </div>

                {newSelectedBranch === 'KASKO' && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Onarım Servis Tercihi</label>
                      <select
                        value={newServiceChoice}
                        onChange={(e) => setNewServiceChoice(e.target.value as 'YETKILI' | 'OZEL')}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium"
                      >
                        <option value="YETKILI">Tüm Yetkili Servisler (Muafiyetsiz Orijinal Parça)</option>
                        <option value="OZEL">Anlaşmalı Özel Servisler (%12 Ekonomik İndirim)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">İMM Teminat Limiti</label>
                      <select
                        value={newImmLimit}
                        onChange={(e) => setNewImmLimit(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium"
                      >
                        <option value="SINIRSIZ">Sınırsız İMM (Önerilen VIP)</option>
                        <option value="10M">10.000.000 ₺ İMM</option>
                        <option value="5M">5.000.000 ₺ İMM</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* BRANŞ B: SAĞLIK (TSS) ALANLARI */}
            {newSelectedBranch === 'TSS' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                    <HeartPulse className="w-4 h-4 text-emerald-600" />
                    <span>Sigortalı Sağlık, BMI & Hastane Ağı Bilgileri</span>
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-slate-500 font-bold">BMI:</span>
                    <span className={`text-xs font-black font-mono ${calculateBmi().color}`}>
                      {calculateBmi().bmi} ({calculateBmi().status})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Boy (cm)</label>
                    <input
                      type="number"
                      value={newHeight}
                      onChange={(e) => setNewHeight(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kilo (kg)</label>
                    <input
                      type="number"
                      value={newWeight}
                      onChange={(e) => setNewWeight(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">SGK Güvence Durumu *</label>
                    <select
                      value={newSgkStatus}
                      onChange={(e) => setNewSgkStatus(e.target.value as '4A' | '4B' | '4C' | 'YOK')}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-800"
                    >
                      <option value="4A">4A - SSK (Özel Sektör Çalışanı)</option>
                      <option value="4C">4C - Emekli Sandığı (Memur)</option>
                      <option value="4B">4B - Bağ-Kur (İş Yeri Sahibi / Şirket Ortağı)</option>
                      <option value="YOK">SGK Yok (Özel Sağlık - ÖSS Gerekir)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hastane Network Tercihi</label>
                    <select
                      value={newHospitalNetwork}
                      onChange={(e) => setNewHospitalNetwork(e.target.value as 'NETWORK_A' | 'NETWORK_B')}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium"
                    >
                      <option value="NETWORK_A">Network A VIP (Acıbadem, Memorial, Florence Nightingale Dahil)</option>
                      <option value="NETWORK_B">Network B Standart (Medical Park, Medicana, VM Ağları)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Teminat Kapsamı</label>
                    <select
                      value={newTssPackage}
                      onChange={(e) => setNewTssPackage(e.target.value as 'YATARAK_AYAKTA' | 'SADECE_YATARAK')}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium"
                    >
                      <option value="YATARAK_AYAKTA">Limitsiz Yatarak + 10 Ayakta Muayene (%100 Şirket Karşılar)</option>
                      <option value="SADECE_YATARAK">Sadece Limitsiz Yatarak Tedavi (Ameliyat & Yoğun Bakım)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* BRANŞ C: DASK VEYA KONUT ALANLARI */}
            {(newSelectedBranch === 'DASK' || newSelectedBranch === 'KONUT') && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                    <Home className="w-4 h-4 text-amber-600" />
                    <span>Gayrimenkul & UAVT Adres Bilgileri</span>
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                    NVİ UAVT Entegrasyonu
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">10 Haneli Resmi UAVT Kodu *</label>
                    <input
                      type="text"
                      value={newUavtCode}
                      onChange={(e) => setNewUavtCode(e.target.value)}
                      placeholder="2849102841"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Daire Brüt Alanı (m²)</label>
                    <input
                      type="number"
                      value={newGrossM2}
                      onChange={(e) => setNewGrossM2(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bina Yapım Yılı</label>
                    <select
                      value={newBuildingYear}
                      onChange={(e) => setNewBuildingYear(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium"
                    >
                      <option value="2020">2020 ve Sonrası (Son Deprem Yönetmeliği)</option>
                      <option value="2018">2007 - 2019 Arası</option>
                      <option value="1999">2000 Öncesi (Eski Yapı)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kullanım Biçimi</label>
                    <select
                      value={newOccupancyType}
                      onChange={(e) => setNewOccupancyType(e.target.value as 'EV_SAHIBI' | 'KIRACI')}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium"
                    >
                      <option value="EV_SAHIBI">Mülk Sahibi (Ev Sahibi)</option>
                      <option value="KIRACI">Kiracı (Eşya ve Komşuluk Sorumluluk)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bulunduğu Kat / Toplam Kat</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={newFloorNumber}
                        onChange={(e) => setNewFloorNumber(Number(e.target.value))}
                        placeholder="Kat: 4"
                        className="w-1/2 bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-mono"
                      />
                      <span className="text-slate-400">/</span>
                      <input
                        type="number"
                        value={newTotalFloors}
                        onChange={(e) => setNewTotalFloors(Number(e.target.value))}
                        placeholder="Toplam: 8"
                        className="w-1/2 bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ev Eşyası Bedeli (₺)</label>
                    <input
                      type="number"
                      value={newContentValue}
                      onChange={(e) => setNewContentValue(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Açık Adres & Daire No</label>
                  <input
                    type="text"
                    value={newFullAddress}
                    onChange={(e) => setNewFullAddress(e.target.value)}
                    placeholder="Suadiye Mah. Bağdat Cad. No: 384 D: 12"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5"
                  />
                </div>
              </div>
            )}

            {/* BRANŞ D: İŞYERİ ALANLARI */}
            {newSelectedBranch === 'ISYERI' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span>Ticari İşyeri & Risk Değerlendirmesi</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Faaliyet Alanı / NACE Kodu *</label>
                    <input
                      type="text"
                      value={newNaceCode}
                      onChange={(e) => setNewNaceCode(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Çalışan Sayısı (İşveren Mali Mesuliyet)</label>
                    <input
                      type="number"
                      value={newEmployeesCount}
                      onChange={(e) => setNewEmployeesCount(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bina Bedeli (₺)</label>
                    <input
                      type="number"
                      value={newBuildingValue}
                      onChange={(e) => setNewBuildingValue(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Emtia / Mal Bedeli (₺)</label>
                    <input
                      type="number"
                      value={newCommodityValue}
                      onChange={(e) => setNewCommodityValue(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Demirbaş Bedeli (₺)</label>
                    <input
                      type="number"
                      value={newFixtureValue}
                      onChange={(e) => setNewFixtureValue(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADIM 3: TEMİNAT & ÖDEME TERCİHLERİ */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            {/* Ödeme Planı Seçimi */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Tercih Edilen Ödeme Planı & Taksit Seçeneği:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { plan: 'PESIN' as const, label: 'Peşin (Tek Çekim)', desc: 'Ekstra indirimli' },
                  { plan: '3_TAKSIT' as const, label: '3 Taksit', desc: 'Vade farksız' },
                  { plan: '6_TAKSIT' as const, label: '6 Taksit', desc: 'Tüm kartlara' },
                  { plan: '9_TAKSIT' as const, label: '9 Taksit', desc: 'En düşük aylık taksit' }
                ].map(p => (
                  <button
                    key={p.plan}
                    type="button"
                    onClick={() => setNewPaymentPlan(p.plan)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      newPaymentPlan === p.plan
                        ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                    }`}
                  >
                    <span className="block">{p.label}</span>
                    <span className={`text-[10px] block mt-0.5 ${newPaymentPlan === p.plan ? 'text-blue-100' : 'text-slate-500'}`}>
                      {p.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Acente Özel Notu */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Acente Özel Notları & Müşteri Talepleri</label>
              <textarea
                rows={2}
                value={agentNotes}
                onChange={(e) => setAgentNotes(e.target.value)}
                placeholder="Müşterinin özel teminat talepleri, indirim kodları veya notları..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Başvuru Özeti Onay Kartı */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Başvuru ve Teklif Özeti:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">Sigortalı:</span>
                  <span className="font-bold text-slate-900 truncate block">{newFullName}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">Branş:</span>
                  <span className="font-bold text-blue-700">{newSelectedBranch}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">Meslek İndirimi:</span>
                  <span className="font-bold text-emerald-700">{newProfession} (%15)</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">Konu:</span>
                  <span className="font-bold text-slate-900 font-mono truncate block">
                    {newSelectedBranch === 'KASKO' || newSelectedBranch === 'TRAFIK' ? newPlateNumber : newSelectedBranch === 'TSS' ? 'TSS Sağlık' : newUavtCode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Alt Gezinme ve Eylem Butonları */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep - 1) as 1 | 2 | 3)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Önceki Adım</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep + 1) as 1 | 2 | 3)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <span>Sonraki Adım</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Sadece Portföye Kaydet
                </button>

                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center space-x-2"
                >
                  <span>Kaydet ve 12 Şirketten Teklif Al</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
