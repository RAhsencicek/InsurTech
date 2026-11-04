import React, { useState } from 'react';
import { REALISTIC_DOCUMENT_PRESETS } from '../data/mockData';
import { OcrExtractedData, InsuranceBranch } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Zap, 
  Upload, 
  Smartphone, 
  ShieldCheck, 
  Car, 
  HeartPulse, 
  Home, 
  Building2,
  Edit3,
  RotateCcw,
  Check,
  AlertCircle,
  Eye,
  CheckSquare
} from 'lucide-react';

interface OcrWizardViewProps {
  onProceedToQuotation: (extractedData: OcrExtractedData, branch: InsuranceBranch) => void;
}

export const OcrWizardView: React.FC<OcrWizardViewProps> = ({
  onProceedToQuotation
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(REALISTIC_DOCUMENT_PRESETS[0].id);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<OcrExtractedData>(REALISTIC_DOCUMENT_PRESETS[0].data);
  const [selectedBranch, setSelectedBranch] = useState<InsuranceBranch>(REALISTIC_DOCUMENT_PRESETS[0].suggestedBranch);
  const [customFilePreview, setCustomFilePreview] = useState<string | null>(null);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState<boolean>(false);

  // Eşleştirme ve Odaklanan Alan (Bounding box)
  const [activeFocusedField, setActiveFocusedField] = useState<string | null>('plateNumber');
  const [hasUserEdited, setHasUserEdited] = useState<boolean>(false);

  const activePreset = REALISTIC_DOCUMENT_PRESETS.find(p => p.id === selectedPresetId) || REALISTIC_DOCUMENT_PRESETS[0];

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setCustomFilePreview(null);
    setHasUserEdited(false);
    const preset = REALISTIC_DOCUMENT_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setSelectedBranch(preset.suggestedBranch);
    runScanSimulation(preset.data);
  };

  const runScanSimulation = (data: OcrExtractedData) => {
    setIsScanning(true);
    setExtractedData(data);

    setTimeout(() => {
      setIsScanning(false);
    }, 1400);
  };

  // Gerçek cihazdan dosya yükleme simülasyonu
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomFilePreview(url);
      setHasUserEdited(false);

      const customData: OcrExtractedData = {
        documentKind: 'RUHSAT',
        plateNumber: '06 TR 2026',
        licenseSerial: 'AA 829104',
        identityNo: '10928401928',
        fullName: 'SERKAN KAHRAMAN',
        chassisNo: 'NM0K8XXTPE104819',
        engineNo: 'H5H928104',
        vehicleBrandModel: file.name.toUpperCase().replace(/\.[^/.]+$/, "") + ' (ÖZEL BELGE)',
        modelYear: 2024,
        registrationDate: '10.01.2024',
        usageType: 'HUSUSİ OTOMOBİL',
        fuelType: 'BENZİN / HİBRİT',
        confidenceScore: 99.2,
        customUploadedImage: url
      };

      setSelectedBranch('KASKO');
      runScanSimulation(customData);
    }
  };

  // WhatsApp'tan canlı gelen ruhsatı sisteme çekme
  const handleAcceptWhatsAppRuhsat = () => {
    setIsPhoneModalOpen(false);
    handleSelectPreset('ruhsat_tiguan');
  };

  // Alan Güncelleme Fonksiyonu
  const handleUpdateField = (field: keyof OcrExtractedData, value: string | number) => {
    setHasUserEdited(true);
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Orijinal OCR Değerine Sıfırlama
  const handleResetToOriginal = () => {
    setExtractedData(activePreset.data);
    setHasUserEdited(false);
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Çoklu Belge Kapsamı */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Optik Belge Tanıma, Eşleştirme & Canlı Doğrulama</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Optik Belge & Ruhsat Okuyucu (OCR)
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Sol tarafta taranan orijinal resmi belgeyi inceleyin, sağ tarafta ayrıştırılan alanları eşleştirin veya doğrudan düzenleyerek 12 şirketten anlık teklif motoruna aktarın.
          </p>
        </div>

        {/* WhatsApp & Telefondan Aktar Butonu */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsPhoneModalOpen(true)}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>WhatsApp'tan Canlı Belge Al</span>
          </button>
        </div>
      </div>

      {/* 3 Farklı Gerçekçi Belge Seçimi + Bilgisayardan Gerçek Yükleme */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Örnek Kurumsal Belge Seçin veya Kendi Belgenizi Yükleyin:
          </label>
          <span className="text-[11px] text-slate-500">
            Eşleştirme: Tıkladığınız alan belgede otomatik olarak vurgulanır.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {REALISTIC_DOCUMENT_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id && !customFilePreview;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    preset.documentKind === 'RUHSAT'
                      ? 'bg-blue-100 text-blue-800'
                      : preset.documentKind === 'KIMLIK'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {preset.documentKind === 'RUHSAT' ? '🚗 Araç Ruhsatı' : preset.documentKind === 'KIMLIK' ? '🪪 T.C. Kimlik' : '🏠 DASK Tapu'}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">{preset.title}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{preset.subtitle}</div>
              </button>
            );
          })}

          {/* Gerçek Dosya Yükleme Butonu */}
          <label className="p-3.5 rounded-xl border border-dashed border-blue-300 hover:border-blue-600 bg-blue-50/30 hover:bg-blue-50 text-slate-700 flex flex-col justify-center items-center cursor-pointer transition-all">
            <Upload className="w-5 h-5 text-blue-600 mb-1" />
            <span className="text-xs font-bold text-blue-800">Kendi Dosyanı Yükle</span>
            <span className="text-[10px] text-slate-400">JPG, PNG veya PDF</span>
            <input 
              type="file" 
              accept="image/*,application/pdf" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* Ana Çalışma Alanı: Sol Görsel Eşleme Önizlemesi, Sağ Düzenleme Formu */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sol 5 Kolon: Gerçekçi Belge Görseli & Eşleşen Bounding Box Odaklaması */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Yüklenen Belge Görseli & Eşleşme</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>{isScanning ? 'Taranıyor...' : 'Eşleştirildi'}</span>
              </span>
            </div>

            {/* Belge Kartı Görünümü (Canlı Vurgulama Kutuları) */}
            <div className="relative aspect-[4/3] rounded-xl bg-slate-50 border border-slate-300 p-4 overflow-hidden shadow-inner flex flex-col justify-between">
              {/* Lazer Tarama Çizgisi */}
              {isScanning && (
                <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent shadow-[0_0_15px_#2563eb] animate-scan z-30 pointer-events-none"></div>
              )}

              {/* Kullanıcı kendi görselini yüklediyse */}
              {customFilePreview ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg bg-slate-200">
                  <img src={customFilePreview} alt="Yüklenen Belge" className="max-h-full object-contain" />
                </div>
              ) : activePreset.documentKind === 'RUHSAT' ? (
                /* Gerçekçi Türkiye Araç Tescil Belgesi ile Etkileşimli Bounding Box'lar */
                <div className="space-y-2 text-[10px] font-mono text-slate-800">
                  <div className="text-center font-bold text-slate-900 border-b border-slate-300 pb-1 text-xs tracking-wider flex items-center justify-between">
                    <span>T.C. EMNİYET GENEL MÜDÜRLÜĞÜ</span>
                    <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded font-sans">EGM / SBM</span>
                  </div>

                  {/* Plaka ve TCKN */}
                  <div className="grid grid-cols-2 gap-2">
                    <div 
                      onClick={() => setActiveFocusedField('plateNumber')}
                      className={`border p-1.5 rounded cursor-pointer transition-all ${
                        activeFocusedField === 'plateNumber'
                          ? 'border-blue-600 bg-blue-100/70 ring-2 ring-blue-500 shadow-xs'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      <span className="text-slate-400 block font-semibold text-[9px]">(A) Plaka:</span>
                      <span className="text-slate-900 font-black text-xs font-mono">{extractedData.plateNumber || '34 VR 8920'}</span>
                    </div>

                    <div 
                      onClick={() => setActiveFocusedField('identityNo')}
                      className={`border p-1.5 rounded cursor-pointer transition-all ${
                        activeFocusedField === 'identityNo'
                          ? 'border-blue-600 bg-blue-100/70 ring-2 ring-blue-500 shadow-xs'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      <span className="text-slate-400 block font-semibold text-[9px]">(C.1.1) TCKN / VKN:</span>
                      <span className="text-slate-900 font-bold text-xs font-mono">{extractedData.identityNo}</span>
                    </div>
                  </div>

                  {/* Ruhsat Sahibi */}
                  <div 
                    onClick={() => setActiveFocusedField('fullName')}
                    className={`border p-1.5 rounded cursor-pointer transition-all ${
                      activeFocusedField === 'fullName'
                        ? 'border-blue-600 bg-blue-100/70 ring-2 ring-blue-500 shadow-xs'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                  >
                    <span className="text-slate-400 block font-semibold text-[9px]">(C.1.2) Ruhsat Sahibi Adı:</span>
                    <span className="text-slate-900 font-bold text-[11px] truncate block">{extractedData.fullName}</span>
                  </div>

                  {/* Şasi No ve Belge Seri No */}
                  <div className="grid grid-cols-2 gap-2">
                    <div 
                      onClick={() => setActiveFocusedField('chassisNo')}
                      className={`border p-1.5 rounded cursor-pointer transition-all ${
                        activeFocusedField === 'chassisNo'
                          ? 'border-blue-600 bg-blue-100/70 ring-2 ring-blue-500 shadow-xs'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      <span className="text-slate-400 block font-semibold text-[9px]">(E) Şasi No:</span>
                      <span className="text-slate-900 font-bold font-mono text-[10px] truncate block">{extractedData.chassisNo || 'WVGZZZ5NZNW094821'}</span>
                    </div>

                    <div 
                      onClick={() => setActiveFocusedField('licenseSerial')}
                      className={`border p-1.5 rounded cursor-pointer transition-all ${
                        activeFocusedField === 'licenseSerial'
                          ? 'border-blue-600 bg-blue-100/70 ring-2 ring-blue-500 shadow-xs'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      <span className="text-slate-400 block font-semibold text-[9px]">(Y) Tescil Belge Seri/Sıra:</span>
                      <span className="text-blue-700 font-black font-mono text-[10px]">{extractedData.licenseSerial || 'AA 829104'}</span>
                    </div>
                  </div>

                  {/* Marka & Model ve Tescil Tarihi */}
                  <div className="grid grid-cols-2 gap-2">
                    <div 
                      onClick={() => setActiveFocusedField('vehicleBrandModel')}
                      className={`border p-1.5 rounded cursor-pointer transition-all ${
                        activeFocusedField === 'vehicleBrandModel'
                          ? 'border-blue-600 bg-blue-100/70 ring-2 ring-blue-500 shadow-xs'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      <span className="text-slate-400 block font-semibold text-[9px]">(D.1) Marka & Model:</span>
                      <span className="text-slate-900 font-bold truncate block text-[10px]">{extractedData.vehicleBrandModel}</span>
                    </div>
                    <div 
                      onClick={() => setActiveFocusedField('registrationDate')}
                      className={`border p-1.5 rounded cursor-pointer transition-all ${
                        activeFocusedField === 'registrationDate'
                          ? 'border-blue-600 bg-blue-100/70 ring-2 ring-blue-500 shadow-xs'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      <span className="text-slate-400 block font-semibold text-[9px]">(B) İlk Tescil:</span>
                      <span className="text-slate-900 font-bold">{extractedData.registrationDate || '14.04.2023'}</span>
                    </div>
                  </div>
                </div>
              ) : activePreset.documentKind === 'KIMLIK' ? (
                /* Gerçekçi T.C. Kimlik Kartı Görünümü */
                <div className="space-y-3 text-[10px] text-slate-800 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-3.5 rounded-lg border border-blue-200 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-1">
                    <span className="font-extrabold text-blue-900 text-xs">TÜRKİYE CUMHURİYETİ KİMLİK KARTI</span>
                    <span className="text-[9px] font-bold text-blue-700">ÇİPLİ</span>
                  </div>
                  <div className="flex space-x-3 items-center">
                    <div className="w-16 h-20 rounded bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400 text-xs shrink-0">
                      Vesikalık
                    </div>
                    <div className="space-y-1.5 font-mono text-[11px] flex-1">
                      <div 
                        onClick={() => setActiveFocusedField('identityNo')}
                        className={`p-1 rounded cursor-pointer transition-all ${activeFocusedField === 'identityNo' ? 'bg-blue-100 border border-blue-400' : ''}`}
                      >
                        <span className="text-slate-400 block text-[9px] font-sans">T.C. KİMLİK NO:</span>
                        <span className="text-slate-900 font-black text-sm">{extractedData.identityNo}</span>
                      </div>
                      <div 
                        onClick={() => setActiveFocusedField('fullName')}
                        className={`p-1 rounded cursor-pointer transition-all ${activeFocusedField === 'fullName' ? 'bg-blue-100 border border-blue-400' : ''}`}
                      >
                        <span className="text-slate-400 block text-[9px] font-sans">SOYADI / ADI:</span>
                        <span className="text-slate-900 font-bold">{extractedData.fullName}</span>
                      </div>
                      <div 
                        onClick={() => setActiveFocusedField('birthDate')}
                        className={`p-1 rounded cursor-pointer transition-all ${activeFocusedField === 'birthDate' ? 'bg-blue-100 border border-blue-400' : ''}`}
                      >
                        <span className="text-slate-400 block text-[9px] font-sans">DOĞUM TARİHİ:</span>
                        <span className="text-slate-900 font-bold">{extractedData.birthDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-400 border-t border-blue-200 pt-1 flex justify-between">
                    <span>Cinsiyet: {extractedData.gender}</span>
                    <span className="text-emerald-700 font-bold">NVİ KPS Doğrulandı</span>
                  </div>
                </div>
              ) : (
                /* Gerçekçi DASK / Tapu Belgesi */
                <div className="space-y-2 text-[10px] text-slate-800 bg-amber-50/40 p-3.5 rounded-lg border border-amber-200 h-full flex flex-col justify-between font-mono">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-1">
                    <span className="font-extrabold text-amber-900 text-xs">DASK / DOĞAL AFET SİGORTALARI KURUMU</span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-sans">UAVT ADRES</span>
                  </div>
                  <div className="space-y-2">
                    <div 
                      onClick={() => setActiveFocusedField('uavtAddressCode')}
                      className={`border p-2 rounded cursor-pointer transition-all ${
                        activeFocusedField === 'uavtAddressCode'
                          ? 'border-amber-600 bg-amber-100/70 ring-2 ring-amber-500 shadow-xs'
                          : 'border-amber-200 bg-white'
                      }`}
                    >
                      <span className="text-slate-400 block text-[9px] font-sans font-bold">10 HANELİ UAVT ADRES KODU:</span>
                      <span className="text-slate-900 font-black text-sm text-blue-700">{extractedData.uavtAddressCode}</span>
                    </div>

                    <div 
                      onClick={() => setActiveFocusedField('fullAddress')}
                      className={`border p-2 rounded cursor-pointer transition-all ${
                        activeFocusedField === 'fullAddress'
                          ? 'border-amber-600 bg-amber-100/70 ring-2 ring-amber-500 shadow-xs'
                          : 'border-amber-200 bg-white'
                      }`}
                    >
                      <span className="text-slate-400 block text-[9px] font-sans font-bold">RESMİ ADRES:</span>
                      <span className="text-slate-900 font-bold text-[10px] truncate block">{extractedData.fullAddress}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div 
                        onClick={() => setActiveFocusedField('grossSquareMeters')}
                        className={`border p-1.5 rounded cursor-pointer transition-all ${
                          activeFocusedField === 'grossSquareMeters' ? 'border-amber-600 bg-amber-100/70' : 'border-amber-200 bg-white'
                        }`}
                      >
                        <span className="text-slate-400 block text-[9px]">Brüt m²:</span>
                        <span className="font-bold text-slate-900">{extractedData.grossSquareMeters} m²</span>
                      </div>
                      <div className="border border-amber-200 p-1.5 rounded bg-white">
                        <span className="text-slate-400 block text-[9px]">İnşa Yılı:</span>
                        <span className="font-bold text-slate-900">{extractedData.buildingYear || 2018}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-500 border-t border-amber-200 pt-1">
                    Tapu Kadastro & Nüfus Vatandaşlık Eşleşti
                  </div>
                </div>
              )}

              {/* Alt Bilgi */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500 z-10">
                <span>OCR Motoru: AWS Textract Vision v3</span>
                <span className="font-bold text-emerald-700">Güven Skoru: %{extractedData.confidenceScore || 99.4}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ 7 Kolon: Çözümlenen Alanlar & CANLI DÜZENLEME FORMU */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  <span>Ayrıştırılan Veriler & Canlı Düzenleme Adımı</span>
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Herhangi bir alanı düzenleyebilirsiniz; sol görseldeki eşleşme anında güncellenir.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {hasUserEdited && (
                  <button
                    type="button"
                    onClick={handleResetToOriginal}
                    className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center space-x-1 font-bold underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Orijinale Sıfırla</span>
                  </button>
                )}
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckSquare className="w-3 h-3 text-emerald-600" />
                  <span>{hasUserEdited ? 'Kullanıcı Düzenledi' : '%99.8 Doğrulandı'}</span>
                </span>
              </div>
            </div>

            {/* Sigorta Branşı Seçici */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Teklif Alınacak Sigorta Branşı:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { branch: 'KASKO' as InsuranceBranch, label: 'Kasko', icon: Car },
                  { branch: 'TRAFIK' as InsuranceBranch, label: 'Trafik', icon: ShieldCheck },
                  { branch: 'TSS' as InsuranceBranch, label: 'Sağlık (TSS)', icon: HeartPulse },
                  { branch: 'DASK' as InsuranceBranch, label: 'DASK / Konut', icon: Home }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedBranch === item.branch;
                  return (
                    <button
                      key={item.branch}
                      type="button"
                      onClick={() => setSelectedBranch(item.branch)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Düzenlenebilir Dinamik Giriş Alanları */}
            {isScanning ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="text-xs font-bold text-slate-800">Yapay Zekâ Belgeyi Ayrıştırıyor...</div>
                <div className="text-[11px] text-slate-500">KPS / EGM / SBM resmi kurum veritabanları taranıyor.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* TCKN Input */}
                <div className={`p-3 rounded-xl border transition-all ${
                  activeFocusedField === 'identityNo' ? 'bg-blue-50/40 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase block">
                      Sigortalı TCKN / VKN *
                    </label>
                    <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">KPS Onaylı</span>
                  </div>
                  <input
                    type="text"
                    value={extractedData.identityNo}
                    onFocus={() => setActiveFocusedField('identityNo')}
                    onChange={(e) => handleUpdateField('identityNo', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Ad Soyad Input */}
                <div className={`p-3 rounded-xl border transition-all ${
                  activeFocusedField === 'fullName' ? 'bg-blue-50/40 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase block">
                      Sigortalı Adı Soyadı *
                    </label>
                    <span className="text-[9px] text-slate-400">Hak Sahibi</span>
                  </div>
                  <input
                    type="text"
                    value={extractedData.fullName}
                    onFocus={() => setActiveFocusedField('fullName')}
                    onChange={(e) => handleUpdateField('fullName', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Branşa Özel Düzenleme Alanları */}
                {selectedBranch === 'KASKO' || selectedBranch === 'TRAFIK' ? (
                  <>
                    {/* Plaka Input */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      activeFocusedField === 'plateNumber' ? 'bg-blue-50/40 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase block">
                          Araç Plakası *
                        </label>
                        <span className="text-[9px] text-blue-700 font-bold bg-blue-50 px-1 rounded">SBM Tescil</span>
                      </div>
                      <input
                        type="text"
                        value={extractedData.plateNumber || '34 VR 8920'}
                        onFocus={() => setActiveFocusedField('plateNumber')}
                        onChange={(e) => handleUpdateField('plateNumber', e.target.value.toUpperCase())}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono font-black text-blue-700 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Ruhsat Seri No Input */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      activeFocusedField === 'licenseSerial' ? 'bg-blue-50/40 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase block">
                          Ruhsat Tescil Seri & Sıra No *
                        </label>
                        <span className="text-[9px] text-slate-400">Tramer Doğrulama</span>
                      </div>
                      <input
                        type="text"
                        value={extractedData.licenseSerial || 'AA 829104'}
                        onFocus={() => setActiveFocusedField('licenseSerial')}
                        onChange={(e) => handleUpdateField('licenseSerial', e.target.value.toUpperCase())}
                        placeholder="AA 829104"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Şasi Numarası */}
                    <div className={`p-3 rounded-xl border sm:col-span-2 transition-all ${
                      activeFocusedField === 'chassisNo' ? 'bg-blue-50/40 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase block">
                          Şasi Numarası (VIN) *
                        </label>
                        <span className="text-[9px] text-slate-400">17 Karakter</span>
                      </div>
                      <input
                        type="text"
                        value={extractedData.chassisNo || 'WVGZZZ5NZNW094821'}
                        onFocus={() => setActiveFocusedField('chassisNo')}
                        onChange={(e) => handleUpdateField('chassisNo', e.target.value.toUpperCase())}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Marka & Model */}
                    <div className={`p-3 rounded-xl border sm:col-span-2 transition-all ${
                      activeFocusedField === 'vehicleBrandModel' ? 'bg-blue-50/40 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase block">
                          Araç Marka, Model & Donanım Paketi
                        </label>
                        <span className="text-[9px] text-emerald-700 font-bold">Kasko Değer Listesi Eşleşti</span>
                      </div>
                      <input
                        type="text"
                        value={extractedData.vehicleBrandModel || 'VOLKSWAGEN TIGUAN 1.5 TSI ELEGANCE'}
                        onFocus={() => setActiveFocusedField('vehicleBrandModel')}
                        onChange={(e) => handleUpdateField('vehicleBrandModel', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                ) : selectedBranch === 'TSS' ? (
                  <>
                    {/* Doğum Tarihi */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      activeFocusedField === 'birthDate' ? 'bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500' : 'bg-emerald-50/30 border-emerald-200'
                    }`}>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                        Doğum Tarihi *
                      </label>
                      <input
                        type="text"
                        value={extractedData.birthDate || '18.06.1989'}
                        onFocus={() => setActiveFocusedField('birthDate')}
                        onChange={(e) => handleUpdateField('birthDate', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono font-bold text-emerald-900 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Cinsiyet */}
                    <div className="p-3 rounded-xl border bg-emerald-50/30 border-emerald-200">
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                        Cinsiyet
                      </label>
                      <select
                        value={extractedData.gender || 'E'}
                        onChange={(e) => handleUpdateField('gender', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 text-xs"
                      >
                        <option value="E">Erkek</option>
                        <option value="K">Kadın</option>
                      </select>
                    </div>

                    {/* Sağlık Kapsamı Bilgisi */}
                    <div className="p-3 rounded-xl border bg-emerald-50/30 border-emerald-200 sm:col-span-2">
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                        Özel Sağlık Networkü & Anlaşmalı Hastaneler
                      </label>
                      <div className="text-xs font-bold text-slate-800">
                        Network A VIP (Acıbadem, Memorial, Florence Nightingale Dahil) • Limitsiz Yatarak + 10 Ayakta
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* UAVT Kodu */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      activeFocusedField === 'uavtAddressCode' ? 'bg-amber-50/60 border-amber-500 ring-1 ring-amber-500' : 'bg-amber-50/30 border-amber-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase block">
                          10 Haneli UAVT Kodu *
                        </label>
                        <span className="text-[9px] text-amber-800 font-bold bg-amber-100 px-1 rounded">NVİ Onaylı</span>
                      </div>
                      <input
                        type="text"
                        value={extractedData.uavtAddressCode || '2849102841'}
                        onFocus={() => setActiveFocusedField('uavtAddressCode')}
                        onChange={(e) => handleUpdateField('uavtAddressCode', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono font-black text-amber-900 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Brüt Alan */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      activeFocusedField === 'grossSquareMeters' ? 'bg-amber-50/60 border-amber-500 ring-1 ring-amber-500' : 'bg-amber-50/30 border-amber-200'
                    }`}>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                        Daire Brüt Alanı (m²)
                      </label>
                      <input
                        type="number"
                        value={extractedData.grossSquareMeters || 135}
                        onFocus={() => setActiveFocusedField('grossSquareMeters')}
                        onChange={(e) => handleUpdateField('grossSquareMeters', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Açık Adres */}
                    <div className={`p-3 rounded-xl border sm:col-span-2 transition-all ${
                      activeFocusedField === 'fullAddress' ? 'bg-amber-50/60 border-amber-500 ring-1 ring-amber-500' : 'bg-amber-50/30 border-amber-200'
                    }`}>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                        Resmi Tapu & DASK Adresi
                      </label>
                      <input
                        type="text"
                        value={extractedData.fullAddress || 'İstanbul / Kadıköy, Suadiye Mah. Bağdat Cad. No: 384 D: 12'}
                        onFocus={() => setActiveFocusedField('fullAddress')}
                        onChange={(e) => handleUpdateField('fullAddress', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* İlerleme & Teklif Motoruna Aktar Butonu */}
          <div className="pt-5 border-t border-slate-100 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500">
              {hasUserEdited ? (
                <span className="text-blue-700 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Düzeltilen veriler teklif motoruna gönderilmeye hazır.</span>
                </span>
              ) : (
                <span>Seçili branş: <strong className="text-slate-800">{selectedBranch}</strong> • 12 Şirket API Entegrasyonu</span>
              )}
            </div>

            <button
              disabled={isScanning}
              onClick={() => onProceedToQuotation(extractedData, selectedBranch)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <span>Verileri Onayla ve 12 Şirketten Teklif Al</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp'tan Canlı Belge Alma Simülasyon Modalı */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
                <Smartphone className="w-4 h-4" />
                <span>WhatsApp Canlı Bildirim</span>
              </div>
              <button 
                onClick={() => setIsPhoneModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Kapat
              </button>
            </div>

            {/* Simüle Edilmiş WhatsApp Mesajı */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  MY
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Mehmet Ali Yılmaz</div>
                  <div className="text-[10px] text-slate-500">Bugün 15:42 (WhatsApp)</div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-2">
                <p>
                  "Hayırlı işler abi, bizim Tiguan'ın kaskosu doluyor. Ruhsat fotoğrafını ekte gönderiyorum, sana zahmet 3-4 şirketten bir fiyat çıkarabilir misin?"
                </p>
                <div className="bg-slate-100 border border-slate-200 p-2 rounded-lg flex items-center space-x-2 text-[11px] text-blue-700 font-bold">
                  <Car className="w-4 h-4 text-blue-600" />
                  <span>IMG_20261020_RUHSAT.JPG (34 VR 8920)</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAcceptWhatsAppRuhsat}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
            >
              <Zap className="w-4 h-4" />
              <span>Ruhsatı WhatsApp'tan Çek ve Ayrıştır</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
