"use client";
import React, { useState } from 'react';
import { BudgetSource, FormeMarche, NaturePrestation, ModePassation, Devise, CfContractRow, DynamicColumn, ServiceContractantMeta } from '@/lib/types';
import { mockApi } from '@/lib/mockData';
import RadixSelect from '@/components/ui/RadixSelect';

interface Props { initial?: Partial<CfContractRow>; onSubmit: (row: CfContractRow) => void; }

const deviseOptions: Devise[] = ['DZD', 'USD', 'EUR'];

const CfContractRowForm: React.FC<Props> = ({ initial, onSubmit }) => {
  const [form, setForm] = useState<CfContractRow>({
    id: initial?.id || crypto.randomUUID(),
    service_contractant: { source: (initial?.service_contractant?.source as BudgetSource) || 'Budget Etat', label: initial?.service_contractant?.label || '' },
    partenaire_cocontractant: initial?.partenaire_cocontractant || '',
    objet_du_marche: initial?.objet_du_marche || '',
    forme_du_marche: (initial?.forme_du_marche as FormeMarche) || 'travaux',
    nature_prestation: (initial?.nature_prestation as NaturePrestation) || 'Marché',
    mode_passation: (initial?.mode_passation as ModePassation) || "Appel d'offres ouvert",
    montant_versement_dzd: initial?.montant_versement_dzd || 0,
    taux_versement_pct: initial?.taux_versement_pct || 0,
    montant_ttc_dzd: initial?.montant_ttc_dzd || 0,
    montant_avenant_dzd: initial?.montant_avenant_dzd || 0,
    montant_final_marche_dzd: initial?.montant_final_marche_dzd || 0,
    montant_en_devise: initial?.montant_en_devise || { amount: 0, currency: 'USD' },
  });

  const update = (key: keyof CfContractRow, value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const numberInput = (v: string) => Number(v.replace(/[^0-9.]/g, '')) || 0;
  const [dynCols, setDynCols] = useState<DynamicColumn[]>([]);
  const [dynValues, setDynValues] = useState<Record<string, any>>(initial?.dynamic_values || {});
  const [serviceContractants, setServiceContractants] = useState<ServiceContractantMeta[]>([]);
  const [formeOptions, setFormeOptions] = useState<string[]>([]);
  const [natureOptions, setNatureOptions] = useState<string[]>([]);
  const [modeOptions, setModeOptions] = useState<string[]>([]);
  const [portefeuilles, setPortefeuilles] = useState<any[]>([]);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [sousProgrammes, setSousProgrammes] = useState<any[]>([]);
  const [titres, setTitres] = useState<any[]>([]);
  const [pfId, setPfId] = useState<string | undefined>(undefined);
  const [progId, setProgId] = useState<string | undefined>(undefined);
  const [spId, setSpId] = useState<string | undefined>(undefined);
  const [actionName, setActionName] = useState<string>(initial?.dynamic_values?.action_label || '');
  const [sousActionName, setSousActionName] = useState<string>(initial?.dynamic_values?.sous_action_label || '');
  const [titreNumero, setTitreNumero] = useState<string | undefined>(undefined);
  const [operationNumber, setOperationNumber] = useState<number | undefined>(undefined);
  const fetchCols = async () => { const cols = await mockApi.listDynamicColumns(); setDynCols(cols); };
  React.useEffect(() => { fetchCols(); }, []);
  React.useEffect(() => {
    const handler = () => { fetchCols(); };
    window.addEventListener('dynamic-columns-changed', handler as any);
    return () => window.removeEventListener('dynamic-columns-changed', handler as any);
  }, []);
  const fetchBaseOptions = async () => {
    const [f,n,m] = await Promise.all([
      mockApi.getBaseColumnOptions('Forme du marché'),
      mockApi.getBaseColumnOptions('Nature de prestation'),
      mockApi.getBaseColumnOptions('Mode de passation du marché'),
    ]);
    setFormeOptions(f);
    setNatureOptions(n);
    setModeOptions(m);
    const API_BASE = '/api';
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' } as const;
    const unwrap = async (res: Response) => { const j = await res.json().catch(() => ({})); return typeof (j as any)?.data !== 'undefined' ? (j as any).data : j; };
    try {
      const scRes = await fetch(`${API_BASE}/service-contractants`, { headers });
      const scData = await unwrap(scRes);
      const list: ServiceContractantMeta[] = (Array.isArray(scData) ? scData : (Array.isArray((scData as any)?.data) ? (scData as any).data : [])).map((s:any)=> ({ id: String(s.id ?? crypto.randomUUID()), denomination: s.denomination ?? '', sourceFinancement: { id: String(s.sourceFinancement?.id ?? ''), sourceFinancementFr: s.sourceFinancement?.sourceFinancementFr ?? '', sourceFinancementAr: s.sourceFinancement?.sourceFinancementAr ?? '' }, typeEtablissementId: s.typeEtablissementId ? String(s.typeEtablissementId) : undefined }));
      setServiceContractants(list);
    } catch {}
  };
  React.useEffect(() => { fetchBaseOptions(); }, []);
  React.useEffect(() => {
    const handler = () => { fetchBaseOptions(); };
    window.addEventListener('base-options-changed', handler as any);
    return () => window.removeEventListener('base-options-changed', handler as any);
  }, []);

  React.useEffect(() => { (async () => {
    const API_BASE = '/api';
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' } as const;
    const unwrap = async (res: Response) => { const j = await res.json().catch(() => ({})); return typeof (j as any)?.data !== 'undefined' ? (j as any).data : j; };
    try {
      const pfRes = await fetch(`${API_BASE}/portefeuilles`, { headers });
      const pfData = await unwrap(pfRes);
      const pfList = Array.isArray(pfData) ? pfData.map((p: any) => ({ id: String(p.id ?? crypto.randomUUID()), name_fr: p.nameFr ?? p.name_fr ?? '', name_ar: p.nameAr ?? p.name_ar ?? '', code: p.code ?? '' })) : [];
      setPortefeuilles(pfList);
    } catch {}
  })(); }, []);

  React.useEffect(() => { (async () => {
    const API_BASE = '/api';
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' } as const;
    const unwrap = async (res: Response) => { const j = await res.json().catch(() => ({})); return typeof (j as any)?.data !== 'undefined' ? (j as any).data : j; };
    if (!pfId) { setProgrammes([]); setProgId(undefined); return; }
    try {
      const res = await fetch(`${API_BASE}/portefeuilles/getProgrammesByPortfeuilleId/${pfId}`, { headers });
      const data = await unwrap(res);
      const list = Array.isArray(data) ? data.map((p: any) => ({ id: String(p.id ?? crypto.randomUUID()), portefeuille_id: String(p.portefeuilleId ?? pfId), name_fr: p.programmeNomFR ?? p.name_fr ?? '', name_ar: p.programmeNomAR ?? p.name_ar ?? '', code: p.programmeCode ?? '' })) : [];
      setProgrammes(list);
    } catch {}
  })(); }, [pfId]);

  React.useEffect(() => { (async () => {
    const API_BASE = '/api';
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' } as const;
    const unwrap = async (res: Response) => { const j = await res.json().catch(() => ({})); return typeof (j as any)?.data !== 'undefined' ? (j as any).data : j; };
    if (!progId) { setSousProgrammes([]); setSpId(undefined); return; }
    try {
      const idPath = String(Number(progId));
      const res = await fetch(`${API_BASE}/sous-programmes/programme/${idPath}`, { headers });
      const data = await unwrap(res);
      const arr = Array.isArray(data) ? data : (Array.isArray((data as any)?.data) ? (data as any).data : []);
      const list = arr.map((s: any) => ({ id: String(s.id ?? crypto.randomUUID()), programme_id: String(s.programmeId ?? progId), name_fr: s.nomFr ?? s.name_fr ?? '', name_ar: s.nomAr ?? s.name_ar ?? '', code: s.code ?? '' }));
      setSousProgrammes(list);
    } catch {}
  })(); }, [progId]);

  React.useEffect(() => { (async () => {
    const API_BASE = '/api';
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' } as const;
    const unwrap = async (res: Response) => { const j = await res.json().catch(() => ({})); return typeof (j as any)?.data !== 'undefined' ? (j as any).data : j; };
    try {
      const res = await fetch(`${API_BASE}/titres`, { headers });
      const data = await unwrap(res);
      const list = Array.isArray(data) ? data.map((t: any) => ({ id: String(t.id ?? crypto.randomUUID()), numero: Number((t as any).numero ?? 0), name_fr: t.nomFr ?? '', name_ar: t.nomAr ?? '', code: t.code ?? '' })) : [];
      setTitres(list);
    } catch {}
  })(); }, []);

  const filteredProgrammes = React.useMemo(() => (programmes || []).filter((p:any) => !pfId || String(p.portefeuille_id) === String(pfId)), [programmes, pfId]);
  const filteredSousProgrammes = React.useMemo(() => (sousProgrammes || []).filter((s:any) => !progId || String(s.programme_id) === String(progId)), [sousProgrammes, progId]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 border">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Données Programme</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Portefeuille</label>
            <RadixSelect className="input-gradient" value={pfId as any} onChange={(v)=>setPfId(v as any)} options={portefeuilles.map((p:any)=>({ label: p.name_fr, value: String(p.id) })) as any} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Programme</label>
            <RadixSelect className="input-gradient" value={progId as any} onChange={(v)=>setProgId(v as any)} options={filteredProgrammes.map((p:any)=>({ label: p.name_fr, value: String(p.id) })) as any} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Sous Programme</label>
            <RadixSelect className="input-gradient" value={spId as any} onChange={(v)=>setSpId(v as any)} options={filteredSousProgrammes.map((s:any)=>({ label: s.name_fr, value: String(s.id) })) as any} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Action / Sous Action</label>
            <input className="w-full px-3 py-2 rounded-lg input-gradient" value={actionName} onChange={(e)=>setActionName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Sous Action</label>
            <input className="w-full px-3 py-2 rounded-lg input-gradient" value={sousActionName} onChange={(e)=>setSousActionName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Titre</label>
            <RadixSelect className="input-gradient" value={titreNumero as any} onChange={(v)=>setTitreNumero(v as any)} options={titres.map((t:any)=>({ label: `Titre ${t.numero} — ${t.name_fr}`, value: String(t.numero) })) as any} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">N° Opération</label>
            <input type="number" className="w-full px-3 py-2 rounded-lg input-gradient" value={operationNumber ?? ''} onChange={(e)=>setOperationNumber(e.target.value ? Number(e.target.value) : undefined)} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Service Contractant</label>
          <div className="flex gap-2">
            <RadixSelect className="input-gradient" value={form.service_contractant.label as any} onChange={(v)=>{
              const sc = serviceContractants.find((s)=> String(s.id)===String(v));
              const fr = sc?.sourceFinancement?.sourceFinancementFr || '';
              const srcMap: Record<string, BudgetSource> = {
                'Etat': 'Budget Etat',
                'Collectivité locale': 'Budget Collectivité locale',
                'EPIC/EPA..': 'Budget EPIC/EPA..',
                'wilaya': 'Budget wilaya',
                'commune': 'Budget commune',
              };
              const source = srcMap[fr] || 'Budget Etat';
              update('service_contractant', { source, label: sc?.denomination || '' });
            }} options={serviceContractants.map((s)=>({ label: `${s.denomination} • ${s.sourceFinancement.sourceFinancementFr}`, value: String(s.id) })) as any} />
            <input className="flex-1 px-3 py-2 rounded-lg input-gradient" placeholder="Libellé" value={form.service_contractant.label} onChange={(e) => update('service_contractant', { ...form.service_contractant, label: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Partenaire Cocontractant</label>
          <input className="w-full px-3 py-2 rounded-lg input-gradient" value={form.partenaire_cocontractant} onChange={(e) => update('partenaire_cocontractant', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Objet du marché</label>
          <input className="w-full px-3 py-2 rounded-lg input-gradient" value={form.objet_du_marche} onChange={(e) => update('objet_du_marche', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Forme du marché</label>
          <RadixSelect className="input-gradient" value={form.forme_du_marche as any} onChange={(v)=>update('forme_du_marche', v as FormeMarche)} options={formeOptions} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Nature de prestation</label>
          <RadixSelect className="input-gradient" value={form.nature_prestation as any} onChange={(v)=>update('nature_prestation', v as NaturePrestation)} options={natureOptions} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Mode de passation du marché</label>
          <RadixSelect className="input-gradient" value={form.mode_passation as any} onChange={(v)=>update('mode_passation', v as ModePassation)} options={modeOptions} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Montant des versement (DZD)</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg input-gradient" value={form.montant_versement_dzd} onChange={(e) => update('montant_versement_dzd', numberInput(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Taux des versement (%)</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg input-gradient" value={form.taux_versement_pct} onChange={(e) => update('taux_versement_pct', numberInput(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Montant TTC (DZD)</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg input-gradient" value={form.montant_ttc_dzd} onChange={(e) => update('montant_ttc_dzd', numberInput(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Montant de l'avenant (DZD)</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg input-gradient" value={form.montant_avenant_dzd} onChange={(e) => update('montant_avenant_dzd', numberInput(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Montant final du marché (DZD)</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg input-gradient" value={form.montant_final_marche_dzd} onChange={(e) => update('montant_final_marche_dzd', numberInput(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Montant en devise</label>
          <div className="flex gap-2">
            <input type="text" className="flex-1 px-3 py-2 rounded-lg input-gradient" value={form.montant_en_devise?.amount || 0} onChange={(e) => update('montant_en_devise', { amount: numberInput(e.target.value), currency: form.montant_en_devise?.currency || 'USD' })} />
            <RadixSelect className="input-gradient" value={(form.montant_en_devise?.currency || 'DZD') as any} onChange={(v)=>update('montant_en_devise', { amount: form.montant_en_devise?.amount || 0, currency: v as Devise })} options={deviseOptions} />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50" onClick={() => onSubmit({ ...form, dynamic_values: { ...dynValues, portefeuille_id: pfId, programme_id: progId, sous_programme_id: spId, action_label: actionName, sous_action_label: sousActionName, titre_numero: titreNumero ? Number(titreNumero) : undefined, operation_number: typeof operationNumber === 'number' ? operationNumber : undefined } })}>Ajouter la ligne</button>
      </div>
      {dynCols.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Champs dynamiques</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dynCols.map(col => (
              <div key={col.id}>
                <label className="block text-sm text-gray-700 mb-1">{col.name}</label>
                {col.type === 'string' && (
                  <input className="w-full px-3 py-2 rounded-lg input-gradient" value={dynValues[col.name] || ''} onChange={(e) => setDynValues({ ...dynValues, [col.name]: e.target.value })} />
                )}
                {col.type === 'percentage' && (
                  <input type="text" className="w-full px-3 py-2 rounded-lg input-gradient" value={dynValues[col.name] || ''} onChange={(e) => setDynValues({ ...dynValues, [col.name]: numberInput(e.target.value) })} />
                )}
                {col.type === 'amount_dzd' && (
                  <input type="text" className="w-full px-3 py-2 rounded-lg input-gradient" value={dynValues[col.name] || ''} onChange={(e) => setDynValues({ ...dynValues, [col.name]: numberInput(e.target.value) })} />
                )}
                {col.type === 'amount_fx' && (
                  <div className="flex gap-2">
                    <input type="text" className="flex-1 px-3 py-2 rounded-lg input-gradient" value={dynValues[col.name]?.amount || 0} onChange={(e) => setDynValues({ ...dynValues, [col.name]: { amount: numberInput(e.target.value), currency: (dynValues[col.name]?.currency || 'USD') } })} />
                    <RadixSelect className="input-gradient" value={(dynValues[col.name]?.currency || 'DZD') as any} onChange={(v)=>setDynValues({ ...dynValues, [col.name]: { amount: (dynValues[col.name]?.amount || 0), currency: v as Devise } })} options={deviseOptions} />
                  </div>
                )}
                {col.type === 'dropdown' && (
                  <RadixSelect value={dynValues[col.name] || ''} onChange={(v)=>setDynValues({ ...dynValues, [col.name]: v })} options={(col.options || [])} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CfContractRowForm;
