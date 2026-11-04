import React, { useState } from 'react';
import { TenantId } from '../types';
import { TENANTS } from '../data/mockData';
import { 
  ShieldCheck, 
  Database, 
  KeyRound, 
  Server
} from 'lucide-react';

interface SecurityViewProps {
  currentTenantId: TenantId;
}

export const SecurityView: React.FC<SecurityViewProps> = ({ currentTenantId }) => {
  const currentTenant = TENANTS.find(t => t.id === currentTenantId) || TENANTS[0];
  const [activeTab, setActiveTab] = useState<'RLS' | 'DBS' | 'AES'>('RLS');

  return (
    <div className="space-y-6">
      {/* Üst Başlık */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Şube yönetimi ve veri koruması</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          Şube ve veri güvenliği
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Kurumsal sigorta acenteleri ve holdingler için tasarlanmış donanımsal veri izolasyonu, alt şube nakit risk yönetimi ve kriptografik şifreleme katmanı.
        </p>
      </div>

      {/* 3 Mimari Sekmesi */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('RLS')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'RLS'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Şube erişimi
        </button>
        <button
          onClick={() => setActiveTab('DBS')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'DBS'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. Banka limitleri
        </button>
        <button
          onClick={() => setActiveTab('AES')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'AES'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          3. Kişisel veriler
        </button>
      </div>

      {/* Sekme 1: RLS Gösterimi */}
      {activeTab === 'RLS' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Veritabanı Çekirdeğinde Canlı İzolasyon</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Geleneksel yazılımlar (Polisoft, PİVO vb.) çoklu şube ayrımını uygulama kodundaki basit <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono">WHERE acente_id = ?</code> filtreleriyle yapmaya çalışır. Yazılımcı bu filtreyi bir yerde unuttuğunda şubeler birbirinin müşterilerini görür.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bizim mimarimiz ise PostgreSQL'in yerel <strong>Row Level Security (RLS)</strong> motorunu kullanır. Sorguda filtre yazılmasa bile veritabanı motorunun kendisi diğer şubenin satırlarını donanımsal düzeyde gizler.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Şu Anki Oturum Tenant Bilgisi:</span>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">SESSION tenant_id:</span>
                <span className="text-emerald-700 font-bold">{currentTenant.id}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Şube Tipi:</span>
                <span className="text-slate-900 font-bold">{currentTenant.type}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Fiziksel İzolasyon Durumu:</span>
                <span className="text-blue-700 font-bold">KİLİTLİ (ENFORCED)</span>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: SQL Kodu Canlı Simülasyonu */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-slate-200 space-y-3 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
              <span>PostgreSQL DDL / RLS Politikası</span>
              <span className="text-emerald-400">PostgreSQL 16+</span>
            </div>

            <pre className="text-[11px] text-blue-300 overflow-x-auto leading-relaxed">
{`-- 1. Tabloda RLS'i Aktif Et
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

-- 2. Tenant İzolasyon Kuralı Tanımla
CREATE POLICY tenant_isolation_policy ON policies
  FOR ALL
  TO acente_user
  USING (tenant_id = current_setting('app.current_tenant')::text);

-- 3. Çalıştırılan Ham Sorgu:
SELECT * FROM policies WHERE status = 'ACTIVE';

-- 4. Veritabanının Zorladığı Güvenli Sorgu:
-- [Fiziksel Filtre]: WHERE tenant_id = '${currentTenant.id}'
-- Sonuç: Diğer şubelerin verisi RAM'e dahi yüklenmez!`}
            </pre>
          </div>
        </div>
      )}

      {/* Sekme 2: DBS */}
      {activeTab === 'DBS' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Server className="w-4 h-4 text-emerald-600" />
            <span>Online DBS (Doğrudan Borçlandırma Sistemi) ile Alt Şube Riskini Sıfırlama</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            Ana acentelerin en büyük iflas sebebi: Tali acentenin poliçeyi kesip, parayı müşteriden tahsil edip ana acenteye ödememesidir. 
            Sistemimiz; İş Bankası, Garanti BBVA ve Yapı Kredi DBS API'larıyla doğrudan entegredir. 
            Tali acente ekranda poliçeyi tanzim et butonuna bastığı an, bankadaki DBS limitinden poliçe tutarı kadar para anında ana acente lehine bloke edilir. 
            Limit yetersizse poliçe kesilemez; ana acentenin 1 TL bile batak riski oluşmaz.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Tali Acente DBS Limiti</span>
              <div className="text-base font-black text-slate-900 font-mono mt-1">300.000 ₺</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Aktif Poliçe Blokajı</span>
              <div className="text-base font-black text-amber-700 font-mono mt-1">215.000 ₺</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Kalan Güvenli Kesim Limiti</span>
              <div className="text-base font-black text-emerald-700 font-mono mt-1">85.000 ₺</div>
            </div>
          </div>
        </div>
      )}

      {/* Sekme 3: AES */}
      {activeTab === 'AES' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <KeyRound className="w-4 h-4 text-cyan-700" />
            <span>KVKK Uyumlu Alan Bazlı AES-256 Şifreleme</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            Müşterilerin T.C. Kimlik Numaraları, araç plakaları ve cep telefonları veritabanında asla düz metin (plaintext) olarak saklanmaz. 
            AWS KMS veya HashiCorp Vault anahtarlarıyla veritabanına yazılırken AES-256-GCM ile şifrelenir. 
            Veritabanı yedeği çalınsa dahi hiçbir müşteri verisi okunamaz.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-600 space-y-1">
            <div>Düz Veri: <span className="text-slate-900 font-bold">28472910482 (TCKN)</span></div>
            <div className="text-cyan-700">Şifrelenmiş DB Kaydı: <span className="text-[11px] break-all">enc:v1:7f4a8b92c10d8e21:a8f94e2...[AES-256-GCM]</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
