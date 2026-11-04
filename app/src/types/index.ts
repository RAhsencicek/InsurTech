export type TenantId = 'merkez' | 'kadikoy' | 'ankara' | 'izmir_tali';

export type InsuranceBranch = 'KASKO' | 'TRAFIK' | 'TSS' | 'DASK' | 'KONUT' | 'ISYERI';

export interface Tenant {
  id: TenantId;
  name: string;
  type: 'MERKEZ_BROKER' | 'SUBE' | 'TALI_ACENTE';
  city: string;
  dbsLimit: number;
  dbsBlocked: number;
  activePoliciesCount: number;
  monthlyProduction: number;
}

export interface Customer {
  id: string;
  tenantId: TenantId;
  fullName: string;
  identityNo: string; // TCKN or VKN
  type: 'INDIVIDUAL' | 'CORPORATE';
  phone: string;
  email: string;
  city: string;
  birthDate?: string;
  gender?: 'E' | 'K';
  profession?: string; // Meslek indirimi faktörü
  isInsuredSameAsPolicyHolder?: boolean;
  policyHolderName?: string;
  policyHolderIdentity?: string;
  plateNumber?: string;
  licenseSerial?: string; // Ruhsat Seri & Sıra No (Tescil Belge No örn: AA 123456)
  tramerStep?: number; // 0-8 Hasarsızlık Kademesi
  uavtCode?: string;
  buildingYear?: number;
  constructionType?: string;
  floorNumber?: number;
  totalFloors?: number;
  sgkStatus?: '4A' | '4B' | '4C' | 'YOK';
  height?: number;
  weight?: number;
  naceCode?: string;
  securityMeasures?: string[];
  primaryBranch?: InsuranceBranch;
  assignedStaffId?: string;
  assignedStaffName?: string;
  lifetimeCommission?: number; // LTV
  isVip?: boolean;
  notes?: string;
  activePolicies: number;
  lossRatio: number; // Hasar/Prim rasyosu (%)
  churnRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  lastPolicyDate: string;
}

export interface Policy {
  id: string;
  tenantId: TenantId;
  policyNo: string;
  companyName: string;
  branch: InsuranceBranch;
  customerName: string;
  customerIdentity: string;
  plateOrAddress?: string;
  grossPremium: number;
  netPremium: number;
  commissionAmount: number;
  commissionRate: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  status: 'ACTIVE' | 'EXPIRED' | 'RENEWAL_URGENT';
  customerPhone?: string;
  assignedStaffName?: string;
  renewalStatus?: 'PENDING' | 'WHATSAPP_SENT' | 'CALLED' | 'RENEWED' | 'LOST';
  managerTaskNote?: string;
  lostReason?: string;
}

export interface QuotationCompany {
  id: string;
  name: string;
  code: string;
  color: string;
  badge?: string;
  branchGuarantees: Record<InsuranceBranch, string[]>;
  branchMultipliers: Record<InsuranceBranch, number>;
  simulatedDelayMs: number;
}

export interface InstallmentPlan {
  installments: number;
  installmentAmount: number;
  totalAmount: number;
  label: string;
}

export interface GuaranteeItem {
  name: string;
  limit: string;
  deductible?: string; // Muafiyet şartı
  status: 'INCLUDED' | 'OPTIONAL' | 'EXCLUDED';
  category: 'ANA_TEMINAT' | 'EK_TEMINAT' | 'ASISTANS' | 'HUKUK_VE_KAZA';
}

export interface QuotationResult {
  companyId: string;
  companyName: string;
  color: string;
  quoteNo: string;
  branch: InsuranceBranch;
  netPremium: number;
  grossPremium: number;
  commissionAmount: number;
  commissionRate: number;
  coverageDetails: string[];
  installmentPlans?: InstallmentPlan[];
  guaranteeItems?: GuaranteeItem[];
  immLimit?: string;
  replacementVehicleDays?: number;
  serviceType?: string;
  glassDeductible?: string;
  roadAssistanceScope?: string;
  hospitalNetworkName?: string;
  outpatientVisits?: number;
  inpatientCoverage?: string;
  discountsApplied?: string[];
  responseTimeMs: number;
  status: 'WAITING' | 'FETCHING' | 'COMPLETED' | 'ERROR';
  isBestPrice?: boolean;
  isBestCoverage?: boolean;
}

export type DocumentKind = 'RUHSAT' | 'KIMLIK' | 'DASK_TAPU' | 'POLICE_PDF';

export interface OcrExtractedData {
  documentKind: DocumentKind;
  identityNo: string;
  fullName: string;
  birthDate?: string;
  gender?: 'E' | 'K';
  profession?: string;
  isInsuredSameAsPolicyHolder?: boolean;
  policyHolderName?: string;
  policyHolderIdentity?: string;
  // Araç Sigortası
  plateNumber?: string;
  licenseSerial?: string;
  tramerStep?: number;
  chassisNo?: string;
  engineNo?: string;
  vehicleBrandModel?: string;
  modelYear?: number;
  registrationDate?: string;
  usageType?: string;
  fuelType?: string;
  // Konut & DASK
  uavtAddressCode?: string;
  fullAddress?: string;
  buildingYear?: number;
  grossSquareMeters?: number;
  constructionType?: string;
  floorNumber?: number;
  totalFloors?: number;
  // Sağlık (TSS)
  hospitalNetwork?: 'NETWORK_A' | 'NETWORK_B';
  sgkStatus?: '4A' | '4B' | '4C' | 'YOK';
  height?: number;
  weight?: number;
  // İşyeri
  naceCode?: string;
  securityMeasures?: string[];
  confidenceScore: number;
  customUploadedImage?: string;
}

export type LeakageErrorReason = 
  | 'TARIFE_HATASI' 
  | 'HAKSIZ_IPTAL_KESINTISI' 
  | 'KEYFI_HAVUZ_KESINTISI' 
  | 'KAMPANYA_INDIRIM_KESINTISI' 
  | 'HATALI_ORAN_UYGULAMASI' 
  | 'GIZLI_VERGI_KESINTISI' 
  | 'ZEYIL_IADE_HESAPLAMA_HATASI';

export type AuditorSubPage = 
  | 'overview' 
  | 'tariff' 
  | 'cancellation' 
  | 'endorsement' 
  | 'pool';

export interface CommissionLeakageItem {
  id: string;
  policyNo: string;
  endorsementNo?: string; // Zeyil No
  companyName: string;
  customerName: string;
  branch: string;
  grossPremium: number;
  contractCommissionRate: number;
  expectedCommission: number;
  appliedCommissionRate: number;
  receivedCommission: number;
  leakageAmount: number;
  errorReason: LeakageErrorReason;
  detectedAt: string;
  explanation?: string;
}

export interface HunterScenario {
  id: string;
  title: string;
  subtitle: string;
  statementFileName: string;
  totalPolicies: number;
  expectedTotalCommission: number;
  receivedTotalCommission: number;
  leakageTotal: number;
  leakages: CommissionLeakageItem[];
}

export interface StaffPerformance {
  id: string;
  name: string;
  role: string;
  tenantId: TenantId;
  monthlyTarget: number;
  achievedProduction: number;
  policiesCount: number;
  crossSellRate: number; // %
  commissionGenerated: number;
  avatarColor: string;
}

export interface CompanyProductionStat {
  companyName: string;
  code: string;
  color: string;
  productionAmount: number;
  commissionEarned: number;
  averageCommissionRate: number;
  policyCount: number;
}
