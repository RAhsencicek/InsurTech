import * as XLSX from 'xlsx';
import { CommissionLeakageItem, HunterScenario, LeakageErrorReason } from '../types';

export interface ExpectedPolicyRecord {
  policyNo: string;
  endorsementNo: number;
  companyName: string;
  customerName: string;
  identityNo?: string;
  branch: string;
  grossPremium: number;
  netPremium: number;
  contractCommissionRate: number;
  expectedCommission: number;
  issueDate?: string;
  actionType?: string;
}

export interface StatementRow {
  companyName: string;
  policyNo: string;
  endorsementNo: number;
  renewalNo?: number;
  branch: string;
  customerName: string;
  identityNo?: string;
  issueDate?: string;
  grossPremium: number;
  netPremium: number;
  appliedCommissionRate: number;
  calculatedCommission: number;
  deductionAmount: number;
  netPaidCommission: number;
  notes?: string;
  rawRow: Record<string, any>;
}

export interface AuditEngineResult {
  scenario: HunterScenario;
  analyzedRowCount: number;
  matchedCount: number;
  leakageCount: number;
  totalExpectedCommission: number;
  totalReceivedCommission: number;
  totalLeakageAmount: number;
  companyBreakdown: Record<string, { expected: number; received: number; leakage: number; count: number }>;
}

export interface ColumnRecognitionInfo {
  policyNoCol?: string;
  endorsementCol?: string;
  customerCol?: string;
  branchCol?: string;
  grossPremiumCol?: string;
  netPremiumCol?: string;
  rateCol?: string;
  commissionCol?: string;
  deductionCol?: string;
  recognizedCount: number;
  isUsable: boolean;
}

// Varsayılan Branş Sözleşme Komisyon Oranları (Acente eğer beklenen dosya yüklemezse kullanılır)
export const DEFAULT_CONTRACT_RATES: Record<string, number> = {
  'KASKO': 17.5,
  'TRAFİK': 8.0,
  'TRAFIK': 8.0,
  'TSS': 18.0,
  'SAĞLIK': 18.0,
  'SAGLIK': 18.0,
  'DASK': 15.0,
  'KONUT': 22.0,
  'İŞYERİ': 20.0,
  'ISYERI': 20.0,
  'YANGIN': 20.0,
  'NAKLİYAT': 15.0,
};

// Sütun Normalizasyonu İçin Başlık Haritası
export function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .replace(/[_\s\-\/\(\)]+/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

export function findMatchingColumnKey(row: Record<string, any>, possibleKeys: string[]): string | undefined {
  if (!row) return undefined;
  const normalizedRowKeys = Object.keys(row).map(k => ({ original: k, norm: normalizeKey(k) }));
  for (const pKey of possibleKeys) {
    const targetNorm = normalizeKey(pKey);
    const match = normalizedRowKeys.find(k => k.norm === targetNorm || k.norm.includes(targetNorm));
    if (match) {
      return match.original;
    }
  }
  return undefined;
}

export function findValue(row: Record<string, any>, possibleKeys: string[]): any {
  if (!row) return undefined;
  const matchedKey = findMatchingColumnKey(row, possibleKeys);
  if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null && row[matchedKey] !== '') {
    return row[matchedKey];
  }
  return undefined;
}

export function parseNumber(val: any, fallback = 0): number {
  if (val === undefined || val === null) return fallback;
  if (typeof val === 'number') return val;
  const s = String(val).trim().replace(/\./g, '').replace(/,/g, '.');
  const num = parseFloat(s);
  return isNaN(num) ? fallback : num;
}

// Sütun Tanıma Teşhis Fonksiyonu
export function detectColumns(row: Record<string, any>, type: 'agency' | 'statement'): ColumnRecognitionInfo {
  if (!row) {
    return { recognizedCount: 0, isUsable: false };
  }

  const policyNoCol = findMatchingColumnKey(row, ['Poliçe No', 'Police No', 'Police Numarasi', 'POL_NO', 'PoliceNo', 'Poliçe Numarası']);
  const endorsementCol = findMatchingColumnKey(row, ['Zeyil No', 'Zeyil Sira', 'ZEYIL_NO', 'Zeyil', 'Zeyil Sıra']);
  const customerCol = findMatchingColumnKey(row, ['Müşteri Ad Soyad / Ünvan', 'Sigortalı Adı', 'Sigortali Ad Soyad', 'Musteri Adi', 'Sigortali', 'Unvan', 'Müşteri']);
  const branchCol = findMatchingColumnKey(row, ['Branş Adı', 'Brans Adi', 'Branş', 'Brans', 'Urun Adi', 'Urun Tanimi']);
  const grossPremiumCol = findMatchingColumnKey(row, ['Brüt Prim (TL)', 'Brüt Prim', 'Brut Tutar', 'Brut Prim', 'BRUT_PRIM']);
  const netPremiumCol = findMatchingColumnKey(row, ['Net Prim (TL)', 'Net Prim', 'Komisyona Esas Net Prim', 'Net Matrah', 'NET_PRIM']);

  let rateCol: string | undefined;
  let commissionCol: string | undefined;
  let deductionCol: string | undefined;

  if (type === 'agency') {
    rateCol = findMatchingColumnKey(row, ['Sözleşme Komisyon Oranı (%)', 'Komisyon Oranı (%)', 'Oran', 'Sözleşme Komisyon Oranı', 'KOM_ORAN']);
    commissionCol = findMatchingColumnKey(row, ['Beklenen Komisyon (TL)', 'Beklenen Komisyon', 'Komisyon Tutarı']);
  } else {
    rateCol = findMatchingColumnKey(row, ['Uygulanan Oran (%)', 'Komisyon Yuzdesi', 'Komisyon Oranı (%)', 'Oran', 'KOM_ORAN']);
    commissionCol = findMatchingColumnKey(row, ['Tahakkuk Eden Komisyon (TL)', 'Tahakkuk Eden Komisyon', 'Hakedilen Komisyon', 'Net Ödenen', 'Net Odeme Tutari', 'KOMISYON_TUTARI']);
    deductionCol = findMatchingColumnKey(row, ['Kesinti / Havuz (TL)', 'Kesinti Stopaj', 'Kesinti / Havuz', 'Havuz Kesintisi', 'Stopaj', 'KESINTI']);
  }

  const list = [policyNoCol, customerCol, branchCol, grossPremiumCol, rateCol, commissionCol].filter(Boolean);
  const recognizedCount = list.length;
  // En az Poliçe No ve Prim veya Komisyon bulunmuşsa kullanılabilir
  const isUsable = Boolean(policyNoCol && (grossPremiumCol || commissionCol));

  return {
    policyNoCol,
    endorsementCol,
    customerCol,
    branchCol,
    grossPremiumCol,
    netPremiumCol,
    rateCol,
    commissionCol,
    deductionCol,
    recognizedCount,
    isUsable
  };
}

export function parseStatementRow(rawRow: Record<string, any>, defaultCompany = 'Sigorta Şirketi'): StatementRow {
  const policyNo = String(findValue(rawRow, ['Poliçe No', 'Police No', 'Police Numarasi', 'POL_NO', 'PoliceNo', 'Poliçe Numarası']) || 'BİLİNMEYEN').trim();
  const endorsementNo = parseInt(String(findValue(rawRow, ['Zeyil No', 'Zeyil Sira', 'ZEYIL_NO', 'Zeyil', 'Zeyil Sıra']) || '0'), 10) || 0;
  const renewalNo = parseInt(String(findValue(rawRow, ['Yenileme No', 'Tecdit No', 'Yenileme']) || '0'), 10) || 0;
  const branch = String(findValue(rawRow, ['Branş Adı', 'Brans Adi', 'Branş', 'Brans', 'Urun Adi', 'Urun Tanimi']) || 'KASKO').toUpperCase();
  const customerName = String(findValue(rawRow, ['Sigortalı Adı', 'Sigortali Ad Soyad', 'Musteri Adi', 'Sigortali', 'Unvan', 'Müşteri Ad Soyad / Ünvan']) || 'Müşteri').trim();
  const identityNo = String(findValue(rawRow, ['Kimlik / Vergi No', 'TC / Vergi No', 'TCKN / VKN', 'TCKN', 'VKN']) || '');
  const issueDate = String(findValue(rawRow, ['Tanzim Tarihi', 'Tanzim', 'TARIH']) || new Date().toISOString().split('T')[0]);

  const grossPremium = parseNumber(findValue(rawRow, ['Brüt Prim (TL)', 'Brüt Prim', 'Brut Tutar', 'Brut Prim', 'BRUT_PRIM']));
  const netPremium = parseNumber(findValue(rawRow, ['Net Prim (TL)', 'Net Prim', 'Komisyona Esas Net Prim', 'Net Matrah', 'NET_PRIM']), grossPremium * 0.87);
  
  let appliedCommissionRate = parseNumber(findValue(rawRow, ['Uygulanan Oran (%)', 'Komisyon Yuzdesi', 'Komisyon Oranı (%)', 'Oran', 'KOM_ORAN']));
  if (appliedCommissionRate > 0 && appliedCommissionRate < 1) {
    appliedCommissionRate = appliedCommissionRate * 100;
  }

  const calculatedCommission = parseNumber(findValue(rawRow, ['Tahakkuk Eden Komisyon (TL)', 'Tahakkuk Eden Komisyon', 'Hakedilen Komisyon', 'Komisyon Tutarı', 'KOMISYON_TUTARI']));
  const deductionAmount = parseNumber(findValue(rawRow, ['Kesinti / Havuz (TL)', 'Kesinti Stopaj', 'Kesinti / Havuz', 'Havuz Kesintisi', 'Stopaj', 'KESINTI']));
  const netPaidCommission = parseNumber(findValue(rawRow, ['Net Ödenen (TL)', 'Net Odeme Tutari', 'Net Ödenen', 'Odenen Komisyon', 'NET_ODENEN']), calculatedCommission - deductionAmount);
  const notes = String(findValue(rawRow, ['Açıklama', 'Durum Aciklama', 'Notlar', 'ACIKLAMA']) || '');

  // Şirket Adı Tespiti
  let companyName = String(findValue(rawRow, ['Sigorta Şirketi', 'Sirket', 'Sirket Adi']) || defaultCompany);
  if (companyName === 'Sigorta Şirketi' || !companyName) {
    if (policyNo.startsWith('AS-')) companyName = 'Anadolu Sigorta';
    else if (policyNo.startsWith('ALZ-')) companyName = 'Allianz Sigorta';
    else if (policyNo.startsWith('AXA-')) companyName = 'Axa Sigorta';
    else if (policyNo.startsWith('SMP-')) companyName = 'Sompo Sigorta';
  }

  return {
    companyName,
    policyNo,
    endorsementNo,
    renewalNo,
    branch,
    customerName,
    identityNo,
    issueDate,
    grossPremium,
    netPremium,
    appliedCommissionRate,
    calculatedCommission,
    deductionAmount,
    netPaidCommission,
    notes,
    rawRow
  };
}

export function parseExpectedRow(rawRow: Record<string, any>): ExpectedPolicyRecord {
  const policyNo = String(findValue(rawRow, ['Poliçe No', 'Police No', 'Police Numarasi', 'POL_NO', 'PoliceNo', 'Poliçe Numarası']) || '').trim();
  const endorsementNo = parseInt(String(findValue(rawRow, ['Zeyil No', 'Zeyil Sira', 'ZEYIL_NO', 'Zeyil', 'Zeyil Sıra']) || '0'), 10) || 0;
  const companyName = String(findValue(rawRow, ['Sigorta Şirketi', 'Sirket', 'Sirket Adi']) || 'Anadolu Sigorta');
  const customerName = String(findValue(rawRow, ['Müşteri Ad Soyad / Ünvan', 'Sigortalı Adı', 'Musteri', 'Sigortali', 'Unvan', 'Sigortali Ad Soyad']) || 'Müşteri');
  const identityNo = String(findValue(rawRow, ['TCKN / VKN', 'TCKN', 'VKN', 'Kimlik / Vergi No', 'TC / Vergi No']) || '');
  const branch = String(findValue(rawRow, ['Branş', 'Brans', 'Branş Adı', 'Brans Adi']) || 'KASKO').toUpperCase();
  const grossPremium = parseNumber(findValue(rawRow, ['Brüt Prim (TL)', 'Brüt Prim', 'Brut Tutar', 'BRUT_PRIM']));
  const netPremium = parseNumber(findValue(rawRow, ['Net Prim (TL)', 'Net Prim', 'Komisyona Esas Net Prim', 'NET_PRIM']), grossPremium * 0.87);
  
  let contractCommissionRate = parseNumber(findValue(rawRow, ['Sözleşme Komisyon Oranı (%)', 'Komisyon Oranı (%)', 'Oran', 'Sözleşme Komisyon Oranı', 'KOM_ORAN']));
  if (contractCommissionRate > 0 && contractCommissionRate < 1) {
    contractCommissionRate = contractCommissionRate * 100;
  }
  if (!contractCommissionRate) {
    contractCommissionRate = DEFAULT_CONTRACT_RATES[branch] || 15.0;
  }

  const expectedCommission = parseNumber(findValue(rawRow, ['Beklenen Komisyon (TL)', 'Beklenen Komisyon', 'Komisyon Tutarı']), (netPremium * contractCommissionRate) / 100);
  const issueDate = String(findValue(rawRow, ['Tanzim Tarihi', 'Tanzim', 'TARIH']) || '');
  const actionType = String(findValue(rawRow, ['İşlem Türü', 'Islem Turu', 'Hareket Türü', 'Hareket']) || '');

  return {
    policyNo,
    endorsementNo,
    companyName,
    customerName,
    identityNo,
    branch,
    grossPremium,
    netPremium,
    contractCommissionRate,
    expectedCommission,
    issueDate,
    actionType
  };
}

// İki listeyi karşılaştırarak kaçakları çıkaran ana çekirdek fonksiyon
export function auditCommissionStatement(
  statementRows: StatementRow[],
  expectedRecords: ExpectedPolicyRecord[],
  fileName = 'ekstre.xlsx'
): AuditEngineResult {
  const leakages: CommissionLeakageItem[] = [];
  const expectedMap = new Map<string, ExpectedPolicyRecord>();

  expectedRecords.forEach(exp => {
    const key = `${exp.policyNo}_${exp.endorsementNo}`;
    expectedMap.set(key, exp);
  });

  const statementMatchedKeys = new Set<string>();

  let totalExpectedCommission = 0;
  let totalReceivedCommission = 0;
  const companyBreakdown: Record<string, { expected: number; received: number; leakage: number; count: number }> = {};

  statementRows.forEach((st, idx) => {
    const key = `${st.policyNo}_${st.endorsementNo}`;
    statementMatchedKeys.add(key);

    const expected = expectedMap.get(key);
    
    // Şirket için sözleşme oranı belirle
    let contractRate = expected ? expected.contractCommissionRate : (DEFAULT_CONTRACT_RATES[st.branch] || 17.5);
    let expectedAmount = expected ? expected.expectedCommission : (st.netPremium * contractRate) / 100;

    // Normalizasyon: Kuruş yuvarlama
    expectedAmount = Math.round(expectedAmount * 100) / 100;
    const receivedAmount = Math.round(st.netPaidCommission * 100) / 100;

    totalExpectedCommission += expectedAmount;
    totalReceivedCommission += receivedAmount;

    if (!companyBreakdown[st.companyName]) {
      companyBreakdown[st.companyName] = { expected: 0, received: 0, leakage: 0, count: 0 };
    }
    companyBreakdown[st.companyName].expected += expectedAmount;
    companyBreakdown[st.companyName].received += receivedAmount;
    companyBreakdown[st.companyName].count += 1;

    // 1. KONTROL: Tarife Sapması (Sözleşme oranı ile uygulanan oran farkı)
    if (contractRate > st.appliedCommissionRate && st.grossPremium > 0) {
      const diffAmount = Math.round((expectedAmount - receivedAmount) * 100) / 100;
      if (diffAmount > 1.0) {
        leakages.push({
          id: `leak_tariff_${idx}_${st.policyNo}`,
          policyNo: st.policyNo,
          endorsementNo: String(st.endorsementNo),
          companyName: st.companyName,
          customerName: st.customerName,
          branch: st.branch,
          grossPremium: st.grossPremium,
          contractCommissionRate: contractRate,
          expectedCommission: expectedAmount,
          appliedCommissionRate: st.appliedCommissionRate,
          receivedCommission: receivedAmount,
          leakageAmount: diffAmount,
          errorReason: 'TARIFE_HATASI',
          detectedAt: new Date().toISOString().split('T')[0],
          explanation: `Acentelik sözleşmesinde ${st.branch} için belirlenen komisyon oranı %${contractRate} iken, şirket ekstrede %${st.appliedCommissionRate} uygulayarak ${diffAmount.toLocaleString('tr-TR')} ₺ eksik tahakkuk ettirmiştir.`
        });
        companyBreakdown[st.companyName].leakage += diffAmount;
      }
    }

    // 2. KONTROL: Zeyil Artış Komisyonunun Ödenmemesi (Zeyil No > 0, prim artışı var ama komisyon 0)
    else if (st.endorsementNo > 0 && st.grossPremium > 0 && (st.netPaidCommission <= 0 || st.appliedCommissionRate === 0)) {
      const diffAmount = Math.round(expectedAmount * 100) / 100;
      if (diffAmount > 1.0) {
        leakages.push({
          id: `leak_endorsement_${idx}_${st.policyNo}`,
          policyNo: st.policyNo,
          endorsementNo: String(st.endorsementNo),
          companyName: st.companyName,
          customerName: st.customerName,
          branch: st.branch,
          grossPremium: st.grossPremium,
          contractCommissionRate: contractRate,
          expectedCommission: expectedAmount,
          appliedCommissionRate: 0,
          receivedCommission: 0,
          leakageAmount: diffAmount,
          errorReason: 'ZEYIL_IADE_HESAPLAMA_HATASI',
          detectedAt: new Date().toISOString().split('T')[0],
          explanation: `Zeyil No ${st.endorsementNo} ile ${st.grossPremium.toLocaleString('tr-TR')} ₺ tutarında ek prim tahsil edilmesine rağmen, komisyon oranı %0 girilmiş ve ${diffAmount.toLocaleString('tr-TR')} ₺ komisyon hak edişi acenteye ödenmemiştir.`
        });
        companyBreakdown[st.companyName].leakage += diffAmount;
      }
    }

    // 3. KONTROL: Keyfi Havuz / Kampanya Kesintisi (Deduction > 0)
    else if (st.deductionAmount > 0) {
      const deduction = Math.round(st.deductionAmount * 100) / 100;
      leakages.push({
        id: `leak_deduction_${idx}_${st.policyNo}`,
        policyNo: st.policyNo,
        endorsementNo: String(st.endorsementNo),
        companyName: st.companyName,
        customerName: st.customerName,
        branch: st.branch,
        grossPremium: st.grossPremium,
        contractCommissionRate: contractRate,
        expectedCommission: expectedAmount,
        appliedCommissionRate: st.appliedCommissionRate,
        receivedCommission: receivedAmount,
        leakageAmount: deduction,
        errorReason: 'KEYFI_HAVUZ_KESINTISI',
        detectedAt: new Date().toISOString().split('T')[0],
        explanation: `Sözleşmede yer almayan '${st.notes || 'Genel Müdürlük / Kampanya Payı'}' gerekçesiyle tahakkuk eden komisyondan haksız ${deduction.toLocaleString('tr-TR')} ₺ kesinti yapılmıştır.`
      });
      companyBreakdown[st.companyName].leakage += deduction;
    }

    // 4. KONTROL: Haksız Storno / İptal Kesintisi (Poliçe İptal Edilmiş ve Acenteden Fazla Kesilmiş)
    else if (st.grossPremium < 0 && expected && expected.expectedCommission < 0) {
      const extraDeduction = Math.round(Math.abs(receivedAmount - expectedAmount) * 100) / 100;
      if (receivedAmount < expectedAmount && extraDeduction > 1.0) {
        leakages.push({
          id: `leak_storno_${idx}_${st.policyNo}`,
          policyNo: st.policyNo,
          endorsementNo: String(st.endorsementNo),
          companyName: st.companyName,
          customerName: st.customerName,
          branch: st.branch,
          grossPremium: st.grossPremium,
          contractCommissionRate: contractRate,
          expectedCommission: expectedAmount,
          appliedCommissionRate: st.appliedCommissionRate,
          receivedCommission: receivedAmount,
          leakageAmount: extraDeduction,
          errorReason: 'HAKSIZ_IPTAL_KESINTISI',
          detectedAt: new Date().toISOString().split('T')[0],
          explanation: `Kısa süreli erken fesih/iptalde gün esaslı oransal kesinti (${Math.abs(expectedAmount).toLocaleString('tr-TR')} ₺) yerine, acentenin cari hesabından 1 yıllık tam komisyon kesilmiş; acenteden haksız ${extraDeduction.toLocaleString('tr-TR')} ₺ ceza tahsil edilmiştir.`
        });
        companyBreakdown[st.companyName].leakage += extraDeduction;
      }
    }
  });

  // 5. KONTROL: Kayıp Poliçe (Acentenin üretiminde var ama şirketin ekstresinde HİÇ YOK!)
  expectedRecords.forEach(exp => {
    const key = `${exp.policyNo}_${exp.endorsementNo}`;
    if (!statementMatchedKeys.has(key) && exp.grossPremium > 0) {
      const missingCommission = Math.round(exp.expectedCommission * 100) / 100;
      leakages.push({
        id: `leak_missing_${exp.policyNo}`,
        policyNo: exp.policyNo,
        endorsementNo: String(exp.endorsementNo),
        companyName: exp.companyName,
        customerName: exp.customerName,
        branch: exp.branch,
        grossPremium: exp.grossPremium,
        contractCommissionRate: exp.contractCommissionRate,
        expectedCommission: missingCommission,
        appliedCommissionRate: 0,
        receivedCommission: 0,
        leakageAmount: missingCommission,
        errorReason: 'HATALI_ORAN_UYGULAMASI',
        detectedAt: new Date().toISOString().split('T')[0],
        explanation: `Acente portföyünde tanzim edilen ${exp.grossPremium.toLocaleString('tr-TR')} ₺ primli poliçe, şirketin ay sonu ekstresinde HİÇ YER ALMAMIŞTIR. Şirket komisyon hakedişini listeye basmayı unutmuştur.`
      });

      totalExpectedCommission += missingCommission;
      if (!companyBreakdown[exp.companyName]) {
        companyBreakdown[exp.companyName] = { expected: 0, received: 0, leakage: 0, count: 0 };
      }
      companyBreakdown[exp.companyName].expected += missingCommission;
      companyBreakdown[exp.companyName].leakage += missingCommission;
    }
  });

  const totalLeakageAmount = leakages.reduce((sum, item) => sum + item.leakageAmount, 0);

  const scenario: HunterScenario = {
    id: `custom_audit_${Date.now()}`,
    title: `Canlı Ekstre Denetimi: ${fileName}`,
    subtitle: `${statementRows.length} satır incelendi • ${leakages.length} adet uyuşmazlık ve komisyon kaçağı saptandı`,
    statementFileName: fileName,
    totalPolicies: Math.max(statementRows.length, expectedRecords.length),
    expectedTotalCommission: Math.round(totalExpectedCommission),
    receivedTotalCommission: Math.round(totalReceivedCommission),
    leakageTotal: Math.round(totalLeakageAmount),
    leakages
  };

  return {
    scenario,
    analyzedRowCount: statementRows.length,
    matchedCount: statementMatchedKeys.size,
    leakageCount: leakages.length,
    totalExpectedCommission,
    totalReceivedCommission,
    totalLeakageAmount,
    companyBreakdown
  };
}

// Dosyayı (ArrayBuffer veya File) okuyan yardımcı fonksiyon
export async function parseExcelOrCsvFile(file: File): Promise<Record<string, any>[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
}

// Çift Dosya Denetim Parametreleri
export interface DualAuditParams {
  agencyRows: Record<string, any>[];
  statementRows: Record<string, any>[];
  agencyFileName?: string;
  statementFileName?: string;
}

// Canlı Çift Dosya Çapraz Denetim Motoru
export function auditDualDatasets(params: DualAuditParams): AuditEngineResult & {
  agencyColumns: ColumnRecognitionInfo;
  statementColumns: ColumnRecognitionInfo;
  agencyRowCount: number;
  statementRowCount: number;
} {
  const { agencyRows, statementRows, agencyFileName = 'acente_uretim.xlsx', statementFileName = 'sirket_ekstre.xlsx' } = params;

  const agencyColumns = agencyRows.length > 0 ? detectColumns(agencyRows[0], 'agency') : { recognizedCount: 0, isUsable: false };
  const statementColumns = statementRows.length > 0 ? detectColumns(statementRows[0], 'statement') : { recognizedCount: 0, isUsable: false };

  const parsedExpected: ExpectedPolicyRecord[] = agencyRows.map(r => parseExpectedRow(r));
  const parsedStatements: StatementRow[] = statementRows.map(r => parseStatementRow(r));

  const baseResult = auditCommissionStatement(
    parsedStatements,
    parsedExpected,
    `${agencyFileName} ⟷ ${statementFileName}`
  );

  return {
    ...baseResult,
    agencyColumns,
    statementColumns,
    agencyRowCount: agencyRows.length,
    statementRowCount: statementRows.length
  };
}

// ==========================================
// REFERANS HAM VERİ KÜMELERİ (ANINDA DEMO İÇİN)
// ==========================================

export const SAMPLE_ACENTE_EXPECTED_POLICIES: ExpectedPolicyRecord[] = [
  // Anadolu Sigorta Portföyü
  { policyNo: 'AS-2026-89401', endorsementNo: 0, companyName: 'Anadolu Sigorta', customerName: 'Ahmet Yılmaz', identityNo: '28491028472', branch: 'KASKO', grossPremium: 28500, netPremium: 24782.60, contractCommissionRate: 17.5, expectedCommission: 4336.95, issueDate: '02.10.2026' },
  { policyNo: 'AS-2026-89402', endorsementNo: 0, companyName: 'Anadolu Sigorta', customerName: 'Selin Demir', identityNo: '19482019482', branch: 'TRAFİK', grossPremium: 8400, netPremium: 7304.35, contractCommissionRate: 8.0, expectedCommission: 584.35, issueDate: '04.10.2026' },
  { policyNo: 'AS-2026-89403', endorsementNo: 0, companyName: 'Anadolu Sigorta', customerName: 'Kaya Lojistik A.Ş.', identityNo: '4820194829', branch: 'KASKO', grossPremium: 45000, netPremium: 39130.43, contractCommissionRate: 17.5, expectedCommission: 6847.83, issueDate: '07.10.2026' },
  { policyNo: 'AS-2026-89404', endorsementNo: 1, companyName: 'Anadolu Sigorta', customerName: 'Kaya Lojistik A.Ş.', identityNo: '4820194829', branch: 'KASKO', grossPremium: 8000, netPremium: 6956.52, contractCommissionRate: 17.5, expectedCommission: 1217.39, issueDate: '18.10.2026' },
  { policyNo: 'AS-2026-89405', endorsementNo: 0, companyName: 'Anadolu Sigorta', customerName: 'Caner Erkin', identityNo: '38291048291', branch: 'TSS', grossPremium: 16500, netPremium: 15714.28, contractCommissionRate: 18.0, expectedCommission: 2828.57, issueDate: '10.10.2026' },
  { policyNo: 'AS-2026-89406', endorsementNo: 0, companyName: 'Anadolu Sigorta', customerName: 'Zeynep Aydın', identityNo: '10492819482', branch: 'KONUT', grossPremium: 5800, netPremium: 5043.48, contractCommissionRate: 22.0, expectedCommission: 1109.56, issueDate: '12.10.2026' },
  { policyNo: 'AS-2026-89407', endorsementNo: 0, companyName: 'Anadolu Sigorta', customerName: 'Murat Çelik', identityNo: '59201948291', branch: 'KASKO', grossPremium: 32000, netPremium: 27826.09, contractCommissionRate: 17.5, expectedCommission: 4869.56, issueDate: '15.10.2026' },
  { policyNo: 'AS-2026-89408', endorsementNo: 0, companyName: 'Anadolu Sigorta', customerName: 'Ece Vural (Erken İptal)', identityNo: '49201948271', branch: 'KASKO', grossPremium: -12000, netPremium: -10434.78, contractCommissionRate: 17.5, expectedCommission: -1826.08, issueDate: '01.05.2026' },
  { policyNo: 'AS-2026-89409', endorsementNo: 0, companyName: 'Anadolu Sigorta', customerName: 'Birlik Un Fabrikası', identityNo: '8492019482', branch: 'İŞYERİ', grossPremium: 64000, netPremium: 55652.17, contractCommissionRate: 20.0, expectedCommission: 11130.43, issueDate: '22.10.2026' },
  { policyNo: 'AS-2026-89410', endorsementNo: 0, companyName: 'Anadolu Sigorta', customerName: 'Deniz Arda', identityNo: '20491829481', branch: 'DASK', grossPremium: 2100, netPremium: 2100.00, contractCommissionRate: 15.0, expectedCommission: 315.00, issueDate: '25.10.2026' },

  // Allianz Sigorta Portföyü
  { policyNo: 'ALZ-7749101', endorsementNo: 0, companyName: 'Allianz Sigorta', customerName: 'Bora Aksoy', identityNo: '12948201948', branch: 'KASKO', grossPremium: 36000, netPremium: 31304.35, contractCommissionRate: 17.5, expectedCommission: 5478.26, issueDate: '05.10.2026' },
  { policyNo: 'ALZ-7749102', endorsementNo: 0, companyName: 'Allianz Sigorta', customerName: 'Mert Güven', identityNo: '39482019482', branch: 'TRAFİK', grossPremium: 9200, netPremium: 8000.00, contractCommissionRate: 8.0, expectedCommission: 640.00, issueDate: '06.10.2026' },
  { policyNo: 'ALZ-7749103', endorsementNo: 0, companyName: 'Allianz Sigorta', customerName: 'Mega Metal Dış Tic.', identityNo: '6192840192', branch: 'KASKO', grossPremium: 42000, netPremium: 36521.74, contractCommissionRate: 17.5, expectedCommission: 6391.30, issueDate: '09.10.2026' },
  { policyNo: 'ALZ-7749104', endorsementNo: 0, companyName: 'Allianz Sigorta', customerName: 'Hakan Balta', identityNo: '29481029481', branch: 'TSS', grossPremium: 14800, netPremium: 14095.23, contractCommissionRate: 18.0, expectedCommission: 2537.14, issueDate: '11.10.2026' },
];

export const RAW_SAMPLE_AGENCY_EXPECTED_DATA: Record<string, any>[] = [
  { "Sıra No": 1, "Sigorta Şirketi": "Anadolu Sigorta", "Poliçe No": "AS-2026-89401", "Zeyil No": 0, "Müşteri Ad Soyad / Ünvan": "Ahmet Yılmaz", "TCKN / VKN": "28491028472", "Branş": "KASKO", "Plaka / UAVT": "34 VR 8920", "Tanzim Tarihi": "02.10.2026", "Brüt Prim (TL)": 28500.00, "Net Prim (TL)": 24782.60, "Sözleşme Komisyon Oranı (%)": 17.5, "Beklenen Komisyon (TL)": 4336.95, "İşlem Türü": "YENİ POLİÇE" },
  { "Sıra No": 2, "Sigorta Şirketi": "Anadolu Sigorta", "Poliçe No": "AS-2026-89402", "Zeyil No": 0, "Müşteri Ad Soyad / Ünvan": "Selin Demir", "TCKN / VKN": "19482019482", "Branş": "TRAFİK", "Plaka / UAVT": "34 BJK 1903", "Tanzim Tarihi": "04.10.2026", "Brüt Prim (TL)": 8400.00, "Net Prim (TL)": 7304.35, "Sözleşme Komisyon Oranı (%)": 8.0, "Beklenen Komisyon (TL)": 584.35, "İşlem Türü": "YENİLEME" },
  { "Sıra No": 3, "Sigorta Şirketi": "Anadolu Sigorta", "Poliçe No": "AS-2026-89403", "Zeyil No": 0, "Müşteri Ad Soyad / Ünvan": "Kaya Lojistik A.Ş.", "TCKN / VKN": "4820194829", "Branş": "KASKO", "Plaka / UAVT": "34 LGT 88", "Tanzim Tarihi": "07.10.2026", "Brüt Prim (TL)": 45000.00, "Net Prim (TL)": 39130.43, "Sözleşme Komisyon Oranı (%)": 17.5, "Beklenen Komisyon (TL)": 6847.83, "İşlem Türü": "YENİ POLİÇE" },
  { "Sıra No": 4, "Sigorta Şirketi": "Anadolu Sigorta", "Poliçe No": "AS-2026-89404", "Zeyil No": 1, "Müşteri Ad Soyad / Ünvan": "Kaya Lojistik A.Ş.", "TCKN / VKN": "4820194829", "Branş": "KASKO", "Plaka / UAVT": "34 LGT 88", "Tanzim Tarihi": "18.10.2026", "Brüt Prim (TL)": 8000.00, "Net Prim (TL)": 6956.52, "Sözleşme Komisyon Oranı (%)": 17.5, "Beklenen Komisyon (TL)": 1217.39, "İşlem Türü": "ZEYİL (BEDEL ARTIŞI)" },
  { "Sıra No": 5, "Sigorta Şirketi": "Anadolu Sigorta", "Poliçe No": "AS-2026-89405", "Zeyil No": 0, "Müşteri Ad Soyad / Ünvan": "Caner Erkin", "TCKN / VKN": "38291048291", "Branş": "TSS", "Plaka / UAVT": "-", "Tanzim Tarihi": "10.10.2026", "Brüt Prim (TL)": 16500.00, "Net Prim (TL)": 15714.28, "Sözleşme Komisyon Oranı (%)": 18.0, "Beklenen Komisyon (TL)": 2828.57, "İşlem Türü": "YENİ POLİÇE" },
  { "Sıra No": 6, "Sigorta Şirketi": "Anadolu Sigorta", "Poliçe No": "AS-2026-89406", "Zeyil No": 0, "Müşteri Ad Soyad / Ünvan": "Zeynep Aydın", "TCKN / VKN": "10492819482", "Branş": "KONUT", "Plaka / UAVT": "2849102841", "Tanzim Tarihi": "12.10.2026", "Brüt Prim (TL)": 5800.00, "Net Prim (TL)": 5043.48, "Sözleşme Komisyon Oranı (%)": 22.0, "Beklenen Komisyon (TL)": 1109.56, "İşlem Türü": "YENİ POLİÇE" },
  { "Sıra No": 7, "Sigorta Şirketi": "Anadolu Sigorta", "Poliçe No": "AS-2026-89407", "Zeyil No": 0, "Müşteri Ad Soyad / Ünvan": "Murat Çelik", "TCKN / VKN": "59201948291", "Branş": "KASKO", "Plaka / UAVT": "06 ANK 06", "Tanzim Tarihi": "15.10.2026", "Brüt Prim (TL)": 32000.00, "Net Prim (TL)": 27826.09, "Sözleşme Komisyon Oranı (%)": 17.5, "Beklenen Komisyon (TL)": 4869.56, "İşlem Türü": "YENİ POLİÇE" },
  { "Sıra No": 8, "Sigorta Şirketi": "Anadolu Sigorta", "Poliçe No": "AS-2026-89408", "Zeyil No": 0, "Müşteri Ad Soyad / Ünvan": "Ece Vural (Erken İptal)", "TCKN / VKN": "49201948271", "Branş": "KASKO", "Plaka / UAVT": "35 IZM 99", "Tanzim Tarihi": "01.05.2026", "Brüt Prim (TL)": -12000.00, "Net Prim (TL)": -10434.78, "Sözleşme Komisyon Oranı (%)": 17.5, "Beklenen Komisyon (TL)": -1826.08, "İşlem Türü": "İPTAL / STORNO" },
  { "Sıra No": 9, "Sigorta Şirketi": "Anadolu Sigorta", "Poliçe No": "AS-2026-89409", "Zeyil No": 0, "Müşteri Ad Soyad / Ünvan": "Birlik Un Fabrikası", "TCKN / VKN": "8492019482", "Branş": "İŞYERİ", "Plaka / UAVT": "9482019482", "Tanzim Tarihi": "22.10.2026", "Brüt Prim (TL)": 64000.00, "Net Prim (TL)": 55652.17, "Sözleşme Komisyon Oranı (%)": 20.0, "Beklenen Komisyon (TL)": 11130.43, "İşlem Türü": "YENİ POLİÇE" },
  { "Sıra No": 10, "Sigorta Şirketi": "Anadolu Sigorta", "Poliçe No": "AS-2026-89410", "Zeyil No": 0, "Müşteri Ad Soyad / Ünvan": "Deniz Arda", "TCKN / VKN": "20491829481", "Branş": "DASK", "Plaka / UAVT": "1948201948", "Tanzim Tarihi": "25.10.2026", "Brüt Prim (TL)": 2100.00, "Net Prim (TL)": 2100.00, "Sözleşme Komisyon Oranı (%)": 15.0, "Beklenen Komisyon (TL)": 315.00, "İşlem Türü": "YENİLEME" }
];

export const RAW_SAMPLE_ANADOLU_STATEMENT_DATA: Record<string, any>[] = [
  { "Acente Kodu": "10482", "Poliçe No": "AS-2026-89401", "Zeyil No": 0, "Yenileme No": 0, "Branş Adı": "KASKO", "Sigortalı Adı": "Ahmet Yılmaz", "Kimlik / Vergi No": "28491028472", "Tanzim Tarihi": "02.10.2026", "Brüt Prim (TL)": 28500.00, "Net Prim (TL)": 24782.60, "Uygulanan Oran (%)": 17.5, "Tahakkuk Eden Komisyon (TL)": 4336.95, "Kesinti / Havuz (TL)": 0.00, "Net Ödenen (TL)": 4336.95, "Açıklama": "TAM VE EKSİKSİZ ÖDEME" },
  { "Acente Kodu": "10482", "Poliçe No": "AS-2026-89402", "Zeyil No": 0, "Yenileme No": 0, "Branş Adı": "TRAFİK", "Sigortalı Adı": "Selin Demir", "Kimlik / Vergi No": "19482019482", "Tanzim Tarihi": "04.10.2026", "Brüt Prim (TL)": 8400.00, "Net Prim (TL)": 7304.35, "Uygulanan Oran (%)": 8.0, "Tahakkuk Eden Komisyon (TL)": 584.35, "Kesinti / Havuz (TL)": 0.00, "Net Ödenen (TL)": 584.35, "Açıklama": "TAM VE EKSİKSİZ ÖDEME" },
  { "Acente Kodu": "10482", "Poliçe No": "AS-2026-89403", "Zeyil No": 0, "Yenileme No": 0, "Branş Adı": "KASKO", "Sigortalı Adı": "Kaya Lojistik A.Ş.", "Kimlik / Vergi No": "4820194829", "Tanzim Tarihi": "07.10.2026", "Brüt Prim (TL)": 45000.00, "Net Prim (TL)": 39130.43, "Uygulanan Oran (%)": 12.0, "Tahakkuk Eden Komisyon (TL)": 4695.65, "Kesinti / Havuz (TL)": 0.00, "Net Ödenen (TL)": 4695.65, "Açıklama": "TARİFE DEĞİŞİKLİĞİ UYGULANDI" },
  { "Acente Kodu": "10482", "Poliçe No": "AS-2026-89404", "Zeyil No": 1, "Yenileme No": 0, "Branş Adı": "KASKO", "Sigortalı Adı": "Kaya Lojistik A.Ş.", "Kimlik / Vergi No": "4820194829", "Tanzim Tarihi": "18.10.2026", "Brüt Prim (TL)": 8000.00, "Net Prim (TL)": 6956.52, "Uygulanan Oran (%)": 0.0, "Tahakkuk Eden Komisyon (TL)": 0.00, "Kesinti / Havuz (TL)": 0.00, "Net Ödenen (TL)": 0.00, "Açıklama": "EK BEDEL ZEYİLİ - KOMİSYONSUZ" },
  { "Acente Kodu": "10482", "Poliçe No": "AS-2026-89405", "Zeyil No": 0, "Yenileme No": 0, "Branş Adı": "TSS", "Sigortalı Adı": "Caner Erkin", "Kimlik / Vergi No": "38291048291", "Tanzim Tarihi": "10.10.2026", "Brüt Prim (TL)": 16500.00, "Net Prim (TL)": 15714.28, "Uygulanan Oran (%)": 18.0, "Tahakkuk Eden Komisyon (TL)": 2828.57, "Kesinti / Havuz (TL)": 450.00, "Net Ödenen (TL)": 2378.57, "Açıklama": "GENEL MÜDÜRLÜK KAMPANYA PAYI KESİNTİSİ" },
  // DİKKAT: AS-2026-89406 (Zeynep Aydın - KONUT 1.109,56 TL) ŞİRKET BORDROSUNDA UNUTULMUŞ / YOK!
  { "Acente Kodu": "10482", "Poliçe No": "AS-2026-89407", "Zeyil No": 0, "Yenileme No": 0, "Branş Adı": "KASKO", "Sigortalı Adı": "Murat Çelik", "Kimlik / Vergi No": "59201948291", "Tanzim Tarihi": "15.10.2026", "Brüt Prim (TL)": 32000.00, "Net Prim (TL)": 27826.09, "Uygulanan Oran (%)": 17.5, "Tahakkuk Eden Komisyon (TL)": 4869.56, "Kesinti / Havuz (TL)": 0.00, "Net Ödenen (TL)": 4869.56, "Açıklama": "TAM VE EKSİKSİZ ÖDEME" },
  { "Acente Kodu": "10482", "Poliçe No": "AS-2026-89408", "Zeyil No": 0, "Yenileme No": 0, "Branş Adı": "KASKO", "Sigortalı Adı": "Ece Vural (Erken İptal)", "Kimlik / Vergi No": "49201948271", "Tanzim Tarihi": "01.05.2026", "Brüt Prim (TL)": -24000.00, "Net Prim (TL)": -20869.56, "Uygulanan Oran (%)": 17.5, "Tahakkuk Eden Komisyon (TL)": -3652.17, "Kesinti / Havuz (TL)": 0.00, "Net Ödenen (TL)": -3652.17, "Açıklama": "STORNO KOMİSYON TAM İADE KESİNTİSİ" },
  { "Acente Kodu": "10482", "Poliçe No": "AS-2026-89409", "Zeyil No": 0, "Yenileme No": 0, "Branş Adı": "İŞYERİ", "Sigortalı Adı": "Birlik Un Fabrikası", "Kimlik / Vergi No": "8492019482", "Tanzim Tarihi": "22.10.2026", "Brüt Prim (TL)": 64000.00, "Net Prim (TL)": 55652.17, "Uygulanan Oran (%)": 20.0, "Tahakkuk Eden Komisyon (TL)": 11130.43, "Kesinti / Havuz (TL)": 0.00, "Net Ödenen (TL)": 11130.43, "Açıklama": "TAM VE EKSİKSİZ ÖDEME" },
  { "Acente Kodu": "10482", "Poliçe No": "AS-2026-89410", "Zeyil No": 0, "Yenileme No": 0, "Branş Adı": "DASK", "Sigortalı Adı": "Deniz Arda", "Kimlik / Vergi No": "20491829481", "Tanzim Tarihi": "25.10.2026", "Brüt Prim (TL)": 2100.00, "Net Prim (TL)": 2100.00, "Uygulanan Oran (%)": 15.0, "Tahakkuk Eden Komisyon (TL)": 315.00, "Kesinti / Havuz (TL)": 0.00, "Net Ödenen (TL)": 315.00, "Açıklama": "TAM VE EKSİKSİZ ÖDEME" }
];

export const RAW_SAMPLE_ALLIANZ_STATEMENT_DATA: Record<string, any>[] = [
  { "Acentelik No": "340912", "Police Numarasi": "ALZ-7749101", "Zeyil Sira": 0, "Brans Adi": "KASKO", "Sigortali Ad Soyad": "Bora Aksoy", "TC / Vergi No": "12948201948", "Tanzim": "05.10.2026", "Brut Tutar": 36000.00, "Komisyona Esas Net Prim": 31304.35, "Komisyon Yuzdesi": 17.5, "Hakedilen Komisyon": 5478.26, "Kesinti Stopaj": 0.00, "Net Odeme Tutari": 5478.26, "Durum Aciklama": "TAM ÖDEME" },
  { "Acentelik No": "340912", "Police Numarasi": "ALZ-7749102", "Zeyil Sira": 0, "Brans Adi": "TRAFİK", "Sigortali Ad Soyad": "Mert Güven", "TC / Vergi No": "39482019482", "Tanzim": "06.10.2026", "Brut Tutar": 9200.00, "Komisyona Esas Net Prim": 8000.00, "Komisyon Yuzdesi": 8.0, "Hakedilen Komisyon": 640.00, "Kesinti Stopaj": 0.00, "Net Odeme Tutari": 640.00, "Durum Aciklama": "TAM ÖDEME" },
  { "Acentelik No": "340912", "Police Numarasi": "ALZ-7749103", "Zeyil Sira": 0, "Brans Adi": "KASKO", "Sigortali Ad Soyad": "Mega Metal Dış Tic.", "TC / Vergi No": "6192840192", "Tanzim": "09.10.2026", "Brut Tutar": 42000.00, "Komisyona Esas Net Prim": 36521.74, "Komisyon Yuzdesi": 14.0, "Hakedilen Komisyon": 5113.04, "Kesinti Stopaj": 0.00, "Net Odeme Tutari": 5113.04, "Durum Aciklama": "TİCARİ FİLO İSKONTOSU KESİNTİSİ" },
  { "Acentelik No": "340912", "Police Numarasi": "ALZ-7749104", "Zeyil Sira": 0, "Brans Adi": "TSS", "Sigortali Ad Soyad": "Hakan Balta", "TC / Vergi No": "29481029481", "Tanzim": "11.10.2026", "Brut Tutar": 14800.00, "Komisyona Esas Net Prim": 14095.23, "Komisyon Yuzdesi": 18.0, "Hakedilen Komisyon": 2537.14, "Kesinti Stopaj": 350.00, "Net Odeme Tutari": 2187.14, "Durum Aciklama": "ÖZEL PORTFÖY PAYI DÜŞÜLDÜ" }
];
