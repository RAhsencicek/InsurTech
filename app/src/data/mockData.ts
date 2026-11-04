import { 
  Tenant, 
  Customer, 
  Policy, 
  QuotationCompany, 
  OcrExtractedData, 
  CommissionLeakageItem,
  InsuranceBranch
} from '../types';

export const TENANTS: Tenant[] = [
  {
    id: 'merkez',
    name: 'Hayat İşleri Sigorta & Brokerlık (Genel Merkez)',
    type: 'MERKEZ_BROKER',
    city: 'İstanbul / Elazığ',
    dbsLimit: 5000000,
    dbsBlocked: 1240000,
    activePoliciesCount: 14850,
    monthlyProduction: 18450000
  },
  {
    id: 'kadikoy',
    name: 'Kadıköy Kurumsal Şube (Kendi Üretimi)',
    type: 'SUBE',
    city: 'İstanbul',
    dbsLimit: 1500000,
    dbsBlocked: 420000,
    activePoliciesCount: 3820,
    monthlyProduction: 4920000
  },
  {
    id: 'ankara',
    name: 'Ankara Çankaya Şubesi',
    type: 'SUBE',
    city: 'Ankara',
    dbsLimit: 1000000,
    dbsBlocked: 180000,
    activePoliciesCount: 2190,
    monthlyProduction: 2840000
  },
  {
    id: 'izmir_tali',
    name: 'İzmir Bornova Tali Acenteliği (DBS Korumalı)',
    type: 'TALI_ACENTE',
    city: 'İzmir',
    dbsLimit: 300000,
    dbsBlocked: 215000,
    activePoliciesCount: 840,
    monthlyProduction: 1120000
  }
];

export const INSURANCE_COMPANIES: QuotationCompany[] = [
  {
    id: 'allianz',
    name: 'Allianz Sigorta',
    code: 'ALZ',
    color: '#003780',
    badge: 'A+ Kurumsal',
    simulatedDelayMs: 1400,
    branchMultipliers: {
      KASKO: 1.08,
      TRAFIK: 1.02,
      TSS: 1.10,
      DASK: 1.00,
      KONUT: 1.06,
      ISYERI: 1.12
    },
    branchGuarantees: {
      KASKO: ['Orijinal Cam Teminatı', 'Yetkili Servis Ağı', 'İkame Araç (15 Gün C Segment)', 'İMM 15.000.000 ₺'],
      TRAFIK: ['Standart Trafik Teminatı', 'Çekici Asistans (1.000 TL)', 'Hukuksal Koruma'],
      TSS: ['Limitsiz Yatarak Tedavi', '10 Adet Ayakta Muayene', 'Acıbadem / Memorial / Liv VIP Ağı', 'Doğum Teminatı Opsiyonu'],
      DASK: ['Zorunlu Deprem Teminatı', 'Enflasyon Koruması', 'Kamu Güvencesi'],
      KONUT: ['Eşya 500.000 ₺', 'Dahili Su & Sel', 'Hırsızlık Teminatı', 'Cam Kırılması', 'Çilingir VIP'],
      ISYERI: ['Yangın & Yıldırım', 'Kâr Kaybı Teminatı', 'İşveren Mali Mesuliyet 2M ₺', 'Makine Kırılması']
    }
  },
  {
    id: 'turkiye',
    name: 'Türkiye Sigorta',
    code: 'TRS',
    color: '#d6001c',
    badge: 'Kamu Güvencesi',
    simulatedDelayMs: 900,
    branchMultipliers: {
      KASKO: 0.95,
      TRAFIK: 0.97,
      TSS: 0.92,
      DASK: 1.00,
      KONUT: 0.90,
      ISYERI: 0.94
    },
    branchGuarantees: {
      KASKO: ['Genişletilmiş Kasko', 'Geniş Servis Anlaşması', 'İkame Araç (7 Gün)', 'İMM 10.000.000 ₺'],
      TRAFIK: ['Yasal Trafik Teminatı', 'Kaza Tespit Desteği', 'Asistans Çekici'],
      TSS: ['Geniş Hastane Ağı (Medical Park vb.)', 'Limitsiz Yatarak', '8 Ayakta Muayene', 'Fizik Tedavi'],
      DASK: ['Resmi DASK Tarifesi', 'Hızlı Hasar Tazminatı'],
      KONUT: ['Genişletilmiş Konut Paketi', 'Komşuluk Mali Mesuliyet', 'Elektronik Cihaz 50.000 ₺'],
      ISYERI: ['Kapsamlı Ticari Paket', 'Deprem & Fırtına', 'Kasa Hırsızlık']
    }
  },
  {
    id: 'anadolu',
    name: 'Anadolu Sigorta',
    code: 'AND',
    color: '#002b80',
    badge: 'Mavi Dalga',
    simulatedDelayMs: 1700,
    branchMultipliers: {
      KASKO: 1.04,
      TRAFIK: 1.01,
      TSS: 1.05,
      DASK: 1.00,
      KONUT: 1.02,
      ISYERI: 1.08
    },
    branchGuarantees: {
      KASKO: ['Tam Kapsamlı Asistans', 'Orijinal Parça Garantisi', 'Sınırsız İMM Opsiyonu', 'Kişisel Eşya 25.000 ₺'],
      TRAFIK: ['Standart Trafik', 'Yol Yardım 7/24', 'Hukuki Koruma'],
      TSS: ['Limitsiz Yatarak Tedavi', '10 Ayakta Tedavi', 'Geniş Network', 'Ücretsiz Diş & Göz Paketi'],
      DASK: ['Resmi Tarife', 'Konut İndirimi'],
      KONUT: ['Kombine Konut Güvencesi', 'İzolasyon Eksikliği Hasarı', 'Ev Asistans'],
      ISYERI: ['Sanayi & KOBİ Özel Paketi', 'Emtia & Demirbaş', 'Cam Kırılması']
    }
  },
  {
    id: 'sompo',
    name: 'Sompo Sigorta',
    code: 'SMP',
    color: '#d61827',
    badge: 'Japon Titizliği',
    simulatedDelayMs: 1500,
    branchMultipliers: {
      KASKO: 0.92,
      TRAFIK: 0.98,
      TSS: 0.89,
      DASK: 1.00,
      KONUT: 0.88,
      ISYERI: 0.93
    },
    branchGuarantees: {
      KASKO: ['Özel Onarım Servisleri', 'Mini Onarım Sınırsız', 'İkame Araç', 'İMM 7.500.000 ₺'],
      TRAFIK: ['Standart Trafik Teminatı', 'Çekici'],
      TSS: ['Giriş Seviye Ekonomik TSS', 'Limitsiz Yatarak', '6 Ayakta Tedavi'],
      DASK: ['DASK Zorunlu Deprem'],
      KONUT: ['Pratik Ev Sigortası', 'Su Baskını', 'Cam Teminatı'],
      ISYERI: ['Esnaf & Küçük İşyeri Paketi', 'Hırsızlık & Yangın']
    }
  },
  {
    id: 'axa',
    name: 'Axa Sigorta',
    code: 'AXA',
    color: '#00008f',
    badge: 'VIP Hizmet',
    simulatedDelayMs: 2100,
    branchMultipliers: {
      KASKO: 1.06,
      TRAFIK: 1.03,
      TSS: 1.08,
      DASK: 1.00,
      KONUT: 1.05,
      ISYERI: 1.10
    },
    branchGuarantees: {
      KASKO: ['Axa VIP Asistans', 'Yetkili Servis Muafiyetsiz', 'Manevi Tazminat 1.000.000 ₺'],
      TRAFIK: ['Standart Trafik', 'Çekici VIP'],
      TSS: ['Axa Sağlığım Tamam Paketi', 'Limitsiz Yatarak', '9 Ayakta Tedavi', 'Psikolojik Destek'],
      DASK: ['DASK Teminatı'],
      KONUT: ['Axa Evim Paket', 'Kira Kaybı', 'Gözlük & Kedi/Köpek Asistans'],
      ISYERI: ['Ticari Risk Yönetimi', 'Çalışan Emniyeti Suiistimal']
    }
  },
  {
    id: 'quick',
    name: 'Quick Sigorta',
    code: 'QCK',
    color: '#ff6600',
    badge: 'Anında Üretim',
    simulatedDelayMs: 700,
    branchMultipliers: {
      KASKO: 0.88,
      TRAFIK: 0.94,
      TSS: 0.86,
      DASK: 1.00,
      KONUT: 0.85,
      ISYERI: 0.89
    },
    branchGuarantees: {
      KASKO: ['Anında Dijital Poliçe', 'Ekonomik Onarım', 'Mini Kasko'],
      TRAFIK: ['Hızlı Trafik', 'Yol Yardım'],
      TSS: ['Dijital Hızlı TSS', 'Limitsiz Yatarak', 'Anlaşmalı Butik Hastaneler'],
      DASK: ['Zorunlu Deprem'],
      KONUT: ['Hızlı Konut Poliçesi', 'Eşya Koruma'],
      ISYERI: ['Quick Esnaf Güvencesi', 'Yangın & Hırsızlık']
    }
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    tenantId: 'merkez',
    fullName: 'Mehmet Ali Yılmaz',
    identityNo: '28472910482',
    type: 'INDIVIDUAL',
    phone: '+90 532 411 98 22',
    email: 'm.ali.yilmaz@gmail.com',
    city: 'İstanbul / Kadıköy',
    plateNumber: '34 VR 8920',
    uavtCode: '2849102841',
    primaryBranch: 'KASKO',
    assignedStaffId: 's1',
    assignedStaffName: 'Selin Aksoy',
    lifetimeCommission: 38400,
    isVip: true,
    activePolicies: 3,
    lossRatio: 12,
    churnRisk: 'LOW',
    lastPolicyDate: '2026-09-14'
  },
  {
    id: 'c2',
    tenantId: 'merkez',
    fullName: 'Atlas Lojistik & Taşımacılık A.Ş.',
    identityNo: '1420582914',
    type: 'CORPORATE',
    phone: '+90 212 884 10 00',
    email: 'filo@atlaslojistik.com.tr',
    city: 'Kocaeli / Gebze',
    plateNumber: '41 AT 501',
    primaryBranch: 'KASKO',
    assignedStaffId: 's2',
    assignedStaffName: 'Ahmet Yılmaz',
    lifetimeCommission: 142000,
    isVip: true,
    activePolicies: 28,
    lossRatio: 38,
    churnRisk: 'MEDIUM',
    lastPolicyDate: '2026-10-02'
  },
  {
    id: 'c3',
    tenantId: 'kadikoy',
    fullName: 'Av. Zeynep Bilge Tan',
    identityNo: '48201948271',
    type: 'INDIVIDUAL',
    phone: '+90 544 321 00 11',
    email: 'zeynep@tan-hukuk.com',
    city: 'İstanbul / Moda',
    plateNumber: '34 ZB 198',
    uavtCode: '1948201928',
    primaryBranch: 'TSS',
    assignedStaffId: 's1',
    assignedStaffName: 'Selin Aksoy',
    lifetimeCommission: 24800,
    isVip: true,
    activePolicies: 2,
    lossRatio: 0,
    churnRisk: 'LOW',
    lastPolicyDate: '2026-08-20'
  },
  {
    id: 'c4',
    tenantId: 'izmir_tali',
    fullName: 'Hakan Karadağ',
    identityNo: '39102948210',
    type: 'INDIVIDUAL',
    phone: '+90 533 902 44 12',
    email: 'hakan.karadag35@hotmail.com',
    city: 'İzmir / Bornova',
    plateNumber: '35 KB 9034',
    primaryBranch: 'KASKO',
    assignedStaffId: 's5',
    assignedStaffName: 'Cemre Aydın',
    lifetimeCommission: 8200,
    isVip: false,
    activePolicies: 2,
    lossRatio: 0,
    churnRisk: 'LOW',
    lastPolicyDate: '2026-07-28'
  },
  {
    id: 'c5',
    tenantId: 'ankara',
    fullName: 'Dr. Barış Demir',
    identityNo: '10948291048',
    type: 'INDIVIDUAL',
    phone: '+90 542 391 84 00',
    email: 'dr.baris.demir@hastane.com',
    city: 'Ankara / Çankaya',
    birthDate: '1984-11-20',
    primaryBranch: 'TSS',
    assignedStaffId: 's4',
    assignedStaffName: 'Burak Demir',
    lifetimeCommission: 31500,
    isVip: true,
    activePolicies: 3,
    lossRatio: 15,
    churnRisk: 'LOW',
    lastPolicyDate: '2026-09-01'
  },
  {
    id: 'c6',
    tenantId: 'kadikoy',
    fullName: 'Selin Yılmaz Kurt',
    identityNo: '39281740192',
    type: 'INDIVIDUAL',
    phone: '+90 535 882 19 40',
    email: 'selin.yilmaz@gmail.com',
    city: 'İstanbul / Kadıköy',
    plateNumber: '34 SYK 920',
    primaryBranch: 'KASKO',
    assignedStaffId: 's2',
    assignedStaffName: 'Ahmet Yılmaz',
    lifetimeCommission: 19800,
    isVip: false,
    activePolicies: 2,
    lossRatio: 0,
    churnRisk: 'LOW',
    lastPolicyDate: '2026-08-15'
  },
  {
    id: 'c7',
    tenantId: 'izmir_tali',
    fullName: 'Ayşe Gökçe',
    identityNo: '58201948291',
    type: 'INDIVIDUAL',
    phone: '+90 532 901 22 77',
    email: 'ayse.gokce@outlook.com',
    city: 'İzmir / Karşıyaka',
    uavtCode: '1940284719',
    primaryBranch: 'DASK',
    assignedStaffId: 's5',
    assignedStaffName: 'Cemre Aydın',
    lifetimeCommission: 6400,
    isVip: false,
    activePolicies: 2,
    lossRatio: 0,
    churnRisk: 'LOW',
    lastPolicyDate: '2026-07-10'
  },
  {
    id: 'c8',
    tenantId: 'merkez',
    fullName: 'TeknoLine Ar-Ge & Bilişim Ltd. Şti.',
    identityNo: '8820194820',
    type: 'CORPORATE',
    phone: '+90 216 410 80 80',
    email: 'yonetim@teknoline.com.tr',
    city: 'İstanbul / Kadıköy',
    primaryBranch: 'ISYERI',
    assignedStaffId: 's3',
    assignedStaffName: 'Gamze Çelik',
    lifetimeCommission: 48000,
    isVip: true,
    activePolicies: 4,
    lossRatio: 22,
    churnRisk: 'LOW',
    lastPolicyDate: '2026-09-25'
  }
];

export const MOCK_POLICIES: Policy[] = [
  {
    id: 'p1',
    tenantId: 'merkez',
    policyNo: '4401-9281048-0',
    companyName: 'Allianz Sigorta',
    branch: 'KASKO',
    customerName: 'Mehmet Ali Yılmaz',
    customerIdentity: '28472910482',
    customerPhone: '+90 532 411 98 22',
    assignedStaffName: 'Selin Aksoy',
    plateOrAddress: '34 VR 8920 (VW Tiguan)',
    grossPremium: 18450,
    netPremium: 16920,
    commissionAmount: 2876,
    commissionRate: 17,
    startDate: '2025-11-04',
    endDate: '2026-11-04',
    daysRemaining: 15,
    status: 'RENEWAL_URGENT',
    renewalStatus: 'PENDING'
  },
  {
    id: 'p2',
    tenantId: 'merkez',
    policyNo: '1092-4418290-0',
    companyName: 'Türkiye Sigorta',
    branch: 'TRAFIK',
    customerName: 'Mehmet Ali Yılmaz',
    customerIdentity: '28472910482',
    customerPhone: '+90 532 411 98 22',
    assignedStaffName: 'Selin Aksoy',
    plateOrAddress: '34 VR 8920',
    grossPremium: 7200,
    netPremium: 6605,
    commissionAmount: 528,
    commissionRate: 8,
    startDate: '2025-11-04',
    endDate: '2026-11-04',
    daysRemaining: 15,
    status: 'RENEWAL_URGENT',
    renewalStatus: 'PENDING'
  },
  {
    id: 'p3',
    tenantId: 'kadikoy',
    policyNo: '8820-1192840-0',
    companyName: 'Anadolu Sigorta',
    branch: 'TSS',
    customerName: 'Av. Zeynep Bilge Tan',
    customerIdentity: '48201948271',
    customerPhone: '+90 544 321 00 11',
    assignedStaffName: 'Selin Aksoy',
    plateOrAddress: 'Yatarak + Ayakta (Network A)',
    grossPremium: 14800,
    netPremium: 14800,
    commissionAmount: 2664,
    commissionRate: 18,
    startDate: '2025-10-27',
    endDate: '2026-10-27',
    daysRemaining: 7,
    status: 'RENEWAL_URGENT',
    renewalStatus: 'WHATSAPP_SENT'
  },
  {
    id: 'p4',
    tenantId: 'izmir_tali',
    policyNo: '3391-4410294-1',
    companyName: 'Sompo Sigorta',
    branch: 'KASKO',
    customerName: 'Hakan Karadağ',
    customerIdentity: '39102948210',
    customerPhone: '+90 533 902 44 12',
    assignedStaffName: 'Cemre Aydın',
    plateOrAddress: '35 KB 9034 (Toyota Corolla)',
    grossPremium: 16200,
    netPremium: 14850,
    commissionAmount: 2673,
    commissionRate: 18,
    startDate: '2025-10-23',
    endDate: '2026-10-23',
    daysRemaining: 3,
    status: 'RENEWAL_URGENT',
    renewalStatus: 'CALLED'
  },
  {
    id: 'p5',
    tenantId: 'ankara',
    policyNo: '5510-8820194-0',
    companyName: 'Allianz Sigorta',
    branch: 'TSS',
    customerName: 'Dr. Barış Demir',
    customerIdentity: '10948291048',
    customerPhone: '+90 542 391 84 00',
    assignedStaffName: 'Burak Demir',
    plateOrAddress: 'Aile TSS (VIP Acıbadem / Memorial)',
    grossPremium: 28500,
    netPremium: 28500,
    commissionAmount: 5130,
    commissionRate: 18,
    startDate: '2025-10-25',
    endDate: '2026-10-25',
    daysRemaining: 5,
    status: 'RENEWAL_URGENT',
    renewalStatus: 'PENDING'
  },
  {
    id: 'p6',
    tenantId: 'merkez',
    policyNo: '9920-4102948-2',
    companyName: 'Axa Sigorta',
    branch: 'ISYERI',
    customerName: 'TeknoLine Ar-Ge & Bilişim Ltd. Şti.',
    customerIdentity: '8820194820',
    customerPhone: '+90 216 410 80 80',
    assignedStaffName: 'Gamze Çelik',
    plateOrAddress: 'Ar-Ge Ofisi (Kadıköy/İst)',
    grossPremium: 34000,
    netPremium: 32380,
    commissionAmount: 6476,
    commissionRate: 20,
    startDate: '2025-10-31',
    endDate: '2026-10-31',
    daysRemaining: 11,
    status: 'RENEWAL_URGENT',
    renewalStatus: 'PENDING'
  }
];

export const REALISTIC_DOCUMENT_PRESETS: {
  id: string;
  title: string;
  subtitle: string;
  documentKind: 'RUHSAT' | 'KIMLIK' | 'DASK_TAPU';
  suggestedBranch: InsuranceBranch;
  data: OcrExtractedData;
}[] = [
  {
    id: 'ruhsat_tiguan',
    title: 'Araç Tescil Belgesi (Ruhsat)',
    subtitle: '34 VR 8920 • 2023 VW Tiguan 1.5 TSI',
    documentKind: 'RUHSAT',
    suggestedBranch: 'KASKO',
    data: {
      documentKind: 'RUHSAT',
      plateNumber: '34 VR 8920',
      identityNo: '28472910482',
      fullName: 'MEHMET ALİ YILMAZ',
      chassisNo: 'WVGZZZ5NZNW094821',
      engineNo: 'DADA849201',
      vehicleBrandModel: 'VOLKSWAGEN TIGUAN 1.5 TSI ELEGANCE DSG',
      modelYear: 2023,
      registrationDate: '14.04.2023',
      usageType: 'HUSUSİ OTOMOBİL',
      fuelType: 'BENZİN',
      confidenceScore: 99.4
    }
  },
  {
    id: 'kimlik_tss',
    title: 'Yeni T.C. Kimlik Kartı (Çipli)',
    subtitle: 'Sağlık / TSS İçin Otomatik Ayrıştırma',
    documentKind: 'KIMLIK',
    suggestedBranch: 'TSS',
    data: {
      documentKind: 'KIMLIK',
      identityNo: '48201948271',
      fullName: 'ZEYNEP BİLGE TAN',
      birthDate: '18.06.1989',
      gender: 'K',
      hospitalNetwork: 'NETWORK_A',
      confidenceScore: 99.8
    }
  },
  {
    id: 'dask_tapu',
    title: 'DASK / Tapu & UAVT Adres Belgesi',
    subtitle: 'Kadıköy Suadiye Mah. • UAVT: 2849102841',
    documentKind: 'DASK_TAPU',
    suggestedBranch: 'DASK',
    data: {
      documentKind: 'DASK_TAPU',
      identityNo: '28472910482',
      fullName: 'MEHMET ALİ YILMAZ',
      uavtAddressCode: '2849102841',
      fullAddress: 'İstanbul / Kadıköy, Suadiye Mah. Bağdat Cad. No: 384 D: 12',
      buildingYear: 2018,
      grossSquareMeters: 135,
      confidenceScore: 98.7
    }
  }
];

export const MOCK_LEAKAGE_DATA: CommissionLeakageItem[] = [
  {
    id: 'leak_1',
    policyNo: '4401-8849102-0',
    endorsementNo: '0',
    companyName: 'Allianz Sigorta',
    customerName: 'Teknokent Bilişim A.Ş.',
    branch: 'Yangın & İşyeri',
    grossPremium: 145000,
    contractCommissionRate: 22.0,
    expectedCommission: 31900,
    appliedCommissionRate: 18.5,
    receivedCommission: 26825,
    leakageAmount: 5075,
    errorReason: 'KAMPANYA_INDIRIM_KESINTISI',
    detectedAt: '2026-10-18',
    explanation: 'Şirket sisteminde tanımlı genel KOBİ indirimi acentenin sözleşme komisyon bareminden tenzil edilmiş.'
  },
  {
    id: 'leak_2',
    policyNo: '1092-7740192-0',
    endorsementNo: '1',
    companyName: 'Türkiye Sigorta',
    customerName: 'Kaya Mimarlık Ltd.',
    branch: 'Kasko (Filo)',
    grossPremium: 88000,
    contractCommissionRate: 17.0,
    expectedCommission: 14960,
    appliedCommissionRate: 14.0,
    receivedCommission: 12320,
    leakageAmount: 2640,
    errorReason: 'HATALI_ORAN_UYGULAMASI',
    detectedAt: '2026-10-19',
    explanation: 'Kurumsal filo kademe indirim oranı yanlış girilerek %17 yerine %14 tahakkuk ettirilmiş.'
  },
  {
    id: 'leak_3',
    policyNo: '8820-9901824-1',
    endorsementNo: '0',
    companyName: 'Anadolu Sigorta',
    customerName: 'Burak Serdar Çetin',
    branch: 'Genişletilmiş Kasko',
    grossPremium: 34500,
    contractCommissionRate: 18.0,
    expectedCommission: 6210,
    appliedCommissionRate: 15.0,
    receivedCommission: 5175,
    leakageAmount: 1035,
    errorReason: 'GIZLI_VERGI_KESINTISI',
    detectedAt: '2026-10-19',
    explanation: 'BSMV ve yangın payı kesintisi komisyon matrahına dahil edilerek mükerrer kesinti uygulanmış.'
  },
  {
    id: 'leak_4',
    policyNo: '3020-1129482-0',
    endorsementNo: '0',
    companyName: 'Sompo Sigorta',
    customerName: 'Yıldız Turizm Taşımacılık',
    branch: 'Otobüs Kasko',
    grossPremium: 195000,
    contractCommissionRate: 16.0,
    expectedCommission: 31200,
    appliedCommissionRate: 12.5,
    receivedCommission: 24375,
    leakageAmount: 6825,
    errorReason: 'KAMPANYA_INDIRIM_KESINTISI',
    detectedAt: '2026-10-20',
    explanation: 'Son çeyrek acente kampanya komisyonu şirketin genel merkez muhasebe aktarımında unutulmuş.'
  },
  {
    id: 'leak_5',
    policyNo: '5510-4491820-2',
    endorsementNo: '2',
    companyName: 'Axa Sigorta',
    customerName: 'Selin Karaca',
    branch: 'Tamamlayıcı Sağlık (TSS)',
    grossPremium: 22400,
    contractCommissionRate: 20.0,
    expectedCommission: 4480,
    appliedCommissionRate: 16.0,
    receivedCommission: 3584,
    leakageAmount: 896,
    errorReason: 'ZEYIL_IADE_HESAPLAMA_HATASI',
    detectedAt: '2026-10-20',
    explanation: 'Zeyilname ile ek teminat ilavesinde eski prim üzerinden oranlama yapılmış.'
  }
];

// OTONOM KOMİSYON AVCISI - RAPORDAKİ CANLI VAKA: AHMET BEY'İN MASADA KALAN 42.000 ₺'Sİ
export const AHMET_BEY_LEAKAGES: CommissionLeakageItem[] = [
  {
    id: 'ahmet_1',
    policyNo: '3301-8491028-0',
    endorsementNo: '0',
    companyName: 'Allianz Sigorta',
    customerName: 'Prof. Dr. Metin Ergün & Kadıköy Tıp Grubu',
    branch: 'Genişletilmiş Doktor Kaskosu',
    grossPremium: 360000,
    contractCommissionRate: 15.0,
    expectedCommission: 54000,
    appliedCommissionRate: 10.0,
    receivedCommission: 36000,
    leakageAmount: 18000,
    errorReason: 'TARIFE_HATASI',
    detectedAt: '2026-10-21',
    explanation: 'Doktorlara satılan kaskolarda sözleşme komisyonu %15 iken şirket sistemine sehven standart %10 girilmiş.'
  },
  {
    id: 'ahmet_2',
    policyNo: '1102-9948120-1',
    endorsementNo: '1',
    companyName: 'Anadolu Sigorta',
    customerName: 'Moda Tasarım & Tekstil Ltd. Şti.',
    branch: 'Ticari Yangın & İşyeri Paketi',
    grossPremium: 70000,
    contractCommissionRate: 20.0,
    expectedCommission: 14000,
    appliedCommissionRate: 0.0,
    receivedCommission: 0,
    leakageAmount: 14000,
    errorReason: 'HAKSIZ_IPTAL_KESINTISI',
    detectedAt: '2026-10-21',
    explanation: 'Müşteri 5. günde poliçeyi iptal etmiştir. Şirket 5 günlük hak ediş kesmek yerine tam 1 yıllık (365 gün) komisyonu acenteden düşmüştür!'
  },
  {
    id: 'ahmet_3',
    policyNo: '5520-1492018-0',
    endorsementNo: '0',
    companyName: 'Axa Sigorta',
    customerName: 'Kadıköy Lojistik Filo Araçları',
    branch: 'Filo Kasko & Trafik',
    grossPremium: 100000,
    contractCommissionRate: 18.0,
    expectedCommission: 18000,
    appliedCommissionRate: 8.0,
    receivedCommission: 8000,
    leakageAmount: 10000,
    errorReason: 'KEYFI_HAVUZ_KESINTISI',
    detectedAt: '2026-10-21',
    explanation: 'Acentelik sözleşmesinde kesinlikle yer almayan "Tramer / Altyapı Havuz Bedeli" gerekçesiyle tek kalemde 10.000 ₺ kesilmiştir.'
  }
];

export const ANADOLU_POC_LEAKAGES: CommissionLeakageItem[] = [
  {
    id: 'anadolu_leak_1',
    policyNo: 'AS-2026-89403',
    endorsementNo: '0',
    companyName: 'Anadolu Sigorta',
    customerName: 'Kaya Lojistik A.Ş.',
    branch: 'KASKO',
    grossPremium: 45000,
    contractCommissionRate: 17.5,
    expectedCommission: 6847.83,
    appliedCommissionRate: 12.0,
    receivedCommission: 4695.65,
    leakageAmount: 2152.18,
    errorReason: 'TARIFE_HATASI',
    detectedAt: '2026-10-31',
    explanation: 'Acentelik sözleşmesinde Kasko oranı %17.5 iken şirket bordroda %12.0 uygulayarak 2.152,18 ₺ eksik tahakkuk ettirmiştir.'
  },
  {
    id: 'anadolu_leak_2',
    policyNo: 'AS-2026-89404',
    endorsementNo: '1',
    companyName: 'Anadolu Sigorta',
    customerName: 'Kaya Lojistik A.Ş.',
    branch: 'KASKO',
    grossPremium: 8000,
    contractCommissionRate: 17.5,
    expectedCommission: 1217.39,
    appliedCommissionRate: 0.0,
    receivedCommission: 0.00,
    leakageAmount: 1217.39,
    errorReason: 'ZEYIL_IADE_HESAPLAMA_HATASI',
    detectedAt: '2026-10-31',
    explanation: 'Bedel artış zeyili ile 8.000 ₺ ek prim tahsil edilmesine rağmen zeyil komisyonu %0 girilmiş ve 1.217,39 ₺ hak ediş ödenmemiştir.'
  },
  {
    id: 'anadolu_leak_3',
    policyNo: 'AS-2026-89405',
    endorsementNo: '0',
    companyName: 'Anadolu Sigorta',
    customerName: 'Caner Erkin',
    branch: 'TSS',
    grossPremium: 16500,
    contractCommissionRate: 18.0,
    expectedCommission: 2828.57,
    appliedCommissionRate: 18.0,
    receivedCommission: 2378.57,
    leakageAmount: 450.00,
    errorReason: 'KEYFI_HAVUZ_KESINTISI',
    detectedAt: '2026-10-31',
    explanation: 'Sözleşmede yer almayan "Genel Müdürlük Kampanya Payı" adı altında 450 ₺ haksız kesinti yapılmıştır.'
  },
  {
    id: 'anadolu_leak_4',
    policyNo: 'AS-2026-89406',
    endorsementNo: '0',
    companyName: 'Anadolu Sigorta',
    customerName: 'Zeynep Aydın',
    branch: 'KONUT',
    grossPremium: 5800,
    contractCommissionRate: 22.0,
    expectedCommission: 1109.56,
    appliedCommissionRate: 0.0,
    receivedCommission: 0.00,
    leakageAmount: 1109.56,
    errorReason: 'HATALI_ORAN_UYGULAMASI',
    detectedAt: '2026-10-31',
    explanation: 'Acente portföyünde tanzim edilen konut poliçesi, şirketin ay sonu ekstresinde HİÇ YER ALMAMIŞTIR (Kayıp Poliçe).'
  },
  {
    id: 'anadolu_leak_5',
    policyNo: 'AS-2026-89408',
    endorsementNo: '0',
    companyName: 'Anadolu Sigorta',
    customerName: 'Ece Vural (Erken İptal)',
    branch: 'KASKO',
    grossPremium: -12000,
    contractCommissionRate: 17.5,
    expectedCommission: -1826.08,
    appliedCommissionRate: 17.5,
    receivedCommission: -3652.17,
    leakageAmount: 1826.09,
    errorReason: 'HAKSIZ_IPTAL_KESINTISI',
    detectedAt: '2026-10-31',
    explanation: '6. aydaki erken iptalde gün esaslı oransal kesinti (-1.826,08 ₺) yerine 1 yıllık tam komisyon (-3.652,17 ₺) acenteden haksız kesilmiştir.'
  }
];

export const ALLIANZ_POC_LEAKAGES: CommissionLeakageItem[] = [
  {
    id: 'alz_leak_1',
    policyNo: 'ALZ-7749103',
    endorsementNo: '0',
    companyName: 'Allianz Sigorta',
    customerName: 'Mega Metal Dış Tic.',
    branch: 'KASKO',
    grossPremium: 42000,
    contractCommissionRate: 17.5,
    expectedCommission: 6391.30,
    appliedCommissionRate: 14.0,
    receivedCommission: 5113.04,
    leakageAmount: 1278.26,
    errorReason: 'TARIFE_HATASI',
    detectedAt: '2026-10-31',
    explanation: 'Acentelik sözleşmesinde Kasko %17.5 iken ticari filo iskontosu gerekçesiyle şirketin %14.0 uyguladığı saptandı.'
  },
  {
    id: 'alz_leak_2',
    policyNo: 'ALZ-7749104',
    endorsementNo: '0',
    companyName: 'Allianz Sigorta',
    customerName: 'Hakan Balta',
    branch: 'TSS',
    grossPremium: 14800,
    contractCommissionRate: 18.0,
    expectedCommission: 2537.14,
    appliedCommissionRate: 18.0,
    receivedCommission: 2187.14,
    leakageAmount: 350.00,
    errorReason: 'KEYFI_HAVUZ_KESINTISI',
    detectedAt: '2026-10-31',
    explanation: 'Sözleşme harici "Özel Portföy Payı" gerekçesiyle 350,00 ₺ kesinti uygulanmıştır.'
  }
];

export const HUNTER_SCENARIOS: import('../types').HunterScenario[] = [
  {
    id: 'anadolu_poc',
    title: 'Anadolu Sigorta Ekim 2026 Ekstresi (Gerçek PoC Dosyası)',
    subtitle: '10 Satır • 5 Gizli Kaçak • Kasko Tarife Sapması, Kayıp Poliçe, Storno ve Havuz Kesintisi',
    statementFileName: 'anadolu_sigorta_ekstre_2026_10.xlsx',
    totalPolicies: 10,
    expectedTotalCommission: 33243,
    receivedTotalCommission: 26488,
    leakageTotal: 6755,
    leakages: ANADOLU_POC_LEAKAGES
  },
  {
    id: 'allianz_poc',
    title: 'Allianz Sigorta Ekim 2026 Ekstresi (Gerçek PoC Dosyası)',
    subtitle: '4 Satır • 2 Gizli Kaçak • Filo Kasko İskonto Kırpması & Portföy Kesintisi',
    statementFileName: 'allianz_sigorta_ekstre_2026_10.xlsx',
    totalPolicies: 4,
    expectedTotalCommission: 15047,
    receivedTotalCommission: 13418,
    leakageTotal: 1628,
    leakages: ALLIANZ_POC_LEAKAGES
  },
  {
    id: 'ahmet_bey',
    title: "Kadıköy Acentesi Ahmet Bey'in Canlı Vakası",
    subtitle: '1.000 Poliçe • 150.000 ₺ Beklenti • 108.000 ₺ Yatan • Masada Kalan 42.000 ₺',
    statementFileName: 'Allianz_Anadolu_Axa_Ekim_Hakedis_Ekstresi_2000Satir.xlsx',
    totalPolicies: 1000,
    expectedTotalCommission: 150000,
    receivedTotalCommission: 108000,
    leakageTotal: 42000,
    leakages: AHMET_BEY_LEAKAGES
  },
  {
    id: 'october_consolidated',
    title: 'Ekim 2026 Konsolide Hakediş Ekstresi',
    subtitle: '124.850 Satır • 5 Sigorta Şirketi • Rutin Aylık Mutabakat Denetimi',
    statementFileName: 'Konsolide_Ekstre_Ekim_2026_AllCompanies.xlsx',
    totalPolicies: 124850,
    expectedTotalCommission: 89450,
    receivedTotalCommission: 72979,
    leakageTotal: 16471,
    leakages: MOCK_LEAKAGE_DATA
  }
];

export const HUNTER_GLOBAL_BENCHMARKS = [
  {
    name: 'AgentSync',
    region: 'ABD (Unicorn)',
    valuation: '1.2 Milyar $ Değerleme',
    satisfaction: '%98 Kurumsal Memnuniyet',
    description: 'Sigorta brokerlarının komisyon mutabakatlarını ve yasal uyumlarını otomatikleştirerek unicorn oldu.',
    highlight: '1.2B $'
  },
  {
    name: 'Commissionly',
    region: 'İngiltere & AB',
    valuation: 'Binlerce Broker & Acente',
    satisfaction: '%95+ Retansiyon Oranı',
    description: '"Excel ameleliğine son verin, gelir kaçağınızı geri kazanın" mottosuyla sektörü domine ediyor.',
    highlight: '%95+ Retansiyon'
  },
  {
    name: 'Vymo / Performio',
    region: 'Global Enterprise',
    valuation: 'Fortune 500 Tercihi',
    satisfaction: 'Kurumsal Lider',
    description: 'Büyük sigorta acentelerinde bağımsız komisyon denetim motorları kurarak gelir kaçaklarını engelliyor.',
    highlight: 'Fortune 500'
  }
];

export const HUNTER_MARKET_STATS = {
  averageLeakageRate: '%3.8',
  averageAnnualLoss: '420.000 ₺',
  paybackPeriod: '< 30 Gün',
  sampleLossRange: '250.000 ₺ - 600.000 ₺'
};

export const LEGAL_SHIELD_TTK_102 = {
  article: 'Türk Ticaret Kanunu (TTK) Madde 102',
  title: 'Acentenin Komisyon Hakkı ve İtiraz Güvencesi',
  content: 'Acente, aracılık ettiği veya sözleşmenin kurulmasına aracı olduğu işlemler dolayısıyla hak kazandığı ücrete (komisyona), sözleşmenin kurulması anında hak kazanır. Müvekkil (sigorta şirketi), hakediş dönemini izleyen en geç üç ay içinde acenteye komisyon bordrosunu vermekle yükümlüdür. Yapılan haksız kesintilere karşı acentenin itiraz ve tahsil hakkı saklıdır.'
};

export const COMPETITOR_COMPARISON = [
  {
    feature: 'Cari Hesap Bakiye Takibi (Genel Borç/Alacak)',
    hunter: '✅ Gelişmiş & Gerçek Zamanlı',
    polisoft: '⚠️ Sadece Kaba Bakiye (Allianz: 15.750 ₺)',
    pivo: '❌ Yok (Sadece Teklif Botu)'
  },
  {
    feature: '2.000+ Satırlık Şirket Ekstresini Çapraz Eşleme',
    hunter: '✅ 3 Saniyede Otomatik Eşleme',
    polisoft: '❌ Yok (Excel ile Manuel Günler Sürer)',
    pivo: '❌ Yok'
  },
  {
    feature: 'Tarife ve İndirim Hatası Tespiti (Doktor vb.)',
    hunter: '✅ Anında Fark & Kuruşu Kuruşuna İtiraz',
    polisoft: '❌ Fark Edemez',
    pivo: '❌ Yok'
  },
  {
    feature: 'Gün Esaslı Haksız İptal Kesintisi Denetimi',
    hunter: '✅ 5 Günde İptale 1 Yıllık Kesintiyi Yakalar',
    polisoft: '❌ Gözden Kaçar',
    pivo: '❌ Yok'
  },
  {
    feature: 'Sözleşme Dışı Havuz / Altyapı Kesintisi Uyarısı',
    hunter: '✅ Sözleşme İle Çapraz Kıyaslar',
    polisoft: '❌ Ayrıştıramaz',
    pivo: '❌ Yok'
  },
  {
    feature: 'Tek Tıkla TTK 102 Resmi İtiraz Dilekçesi ve E-Posta',
    hunter: '✅ Hazır PDF ve Bölge Temsilcisi Maili',
    polisoft: '❌ Yok',
    pivo: '❌ Yok'
  }
];

export const MOCK_STAFF: import('../types').StaffPerformance[] = [
  {
    id: 's1',
    name: 'Selin Aksoy',
    role: 'Kıdemli Portföy Yöneticisi',
    tenantId: 'merkez',
    monthlyTarget: 1200000,
    achievedProduction: 1380000,
    policiesCount: 54,
    crossSellRate: 38,
    commissionGenerated: 248400,
    avatarColor: '#2563eb'
  },
  {
    id: 's2',
    name: 'Ahmet Yılmaz',
    role: 'Kurumsal Müşteri Temsilcisi',
    tenantId: 'kadikoy',
    monthlyTarget: 800000,
    achievedProduction: 890000,
    policiesCount: 39,
    crossSellRate: 31,
    commissionGenerated: 160200,
    avatarColor: '#059669'
  },
  {
    id: 's3',
    name: 'Gamze Çelik',
    role: 'Sağlık & Bireysel Uzmanı',
    tenantId: 'merkez',
    monthlyTarget: 900000,
    achievedProduction: 1040000,
    policiesCount: 46,
    crossSellRate: 44,
    commissionGenerated: 187200,
    avatarColor: '#7c3aed'
  },
  {
    id: 's4',
    name: 'Burak Demir',
    role: 'Bireysel Segment Sorumlusu',
    tenantId: 'ankara',
    monthlyTarget: 600000,
    achievedProduction: 510000,
    policiesCount: 28,
    crossSellRate: 19,
    commissionGenerated: 91800,
    avatarColor: '#d97706'
  },
  {
    id: 's5',
    name: 'Cemre Aydın',
    role: 'Tali Acente Yöneticisi',
    tenantId: 'izmir_tali',
    monthlyTarget: 400000,
    achievedProduction: 420000,
    policiesCount: 22,
    crossSellRate: 26,
    commissionGenerated: 75600,
    avatarColor: '#e11d48'
  }
];

export const MOCK_COMPANY_STATS: import('../types').CompanyProductionStat[] = [
  {
    companyName: 'Allianz Sigorta',
    code: 'ALZ',
    color: '#003780',
    productionAmount: 5820000,
    commissionEarned: 1018500,
    averageCommissionRate: 17.5,
    policyCount: 312
  },
  {
    companyName: 'Türkiye Sigorta',
    code: 'TRS',
    color: '#e30613',
    productionAmount: 4640000,
    commissionEarned: 742400,
    averageCommissionRate: 16.0,
    policyCount: 284
  },
  {
    companyName: 'Anadolu Sigorta',
    code: 'AND',
    color: '#00205b',
    productionAmount: 3950000,
    commissionEarned: 671500,
    averageCommissionRate: 17.0,
    policyCount: 210
  },
  {
    companyName: 'Sompo Sigorta',
    code: 'SMP',
    color: '#d61827',
    productionAmount: 2480000,
    commissionEarned: 446400,
    averageCommissionRate: 18.0,
    policyCount: 175
  },
  {
    companyName: 'Axa Sigorta',
    code: 'AXA',
    color: '#00008f',
    productionAmount: 1560000,
    commissionEarned: 296400,
    averageCommissionRate: 19.0,
    policyCount: 94
  }
];
