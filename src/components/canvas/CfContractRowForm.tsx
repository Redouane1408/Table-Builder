"use client";
import React, { useState } from 'react';
import { BudgetSource, FormeMarche, NaturePrestation, ModePassation, Devise, CfContractRow, DynamicColumn } from '@/lib/types';
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
  const [budgetOptions, setBudgetOptions] = useState<string[]>([]);
  const [formeOptions, setFormeOptions] = useState<string[]>([]);
  const [natureOptions, setNatureOptions] = useState<string[]>([]);
  const [modeOptions, setModeOptions] = useState<string[]>([]);
  const fetchCols = async () => { const cols = await mockApi.listDynamicColumns(); setDynCols(cols); };
  React.useEffect(() => { fetchCols(); }, []);
  React.useEffect(() => {
    const handler = () => { fetchCols(); };
    window.addEventListener('dynamic-columns-changed', handler as any);
    return () => window.removeEventListener('dynamic-columns-changed', handler as any);
  }, []);
  const fetchBaseOptions = async () => {
    const [b,f,n,m] = await Promise.all([
      mockApi.getBaseColumnOptions('Service Contractant'),
      mockApi.getBaseColumnOptions('Forme du marché'),
      mockApi.getBaseColumnOptions('Nature de prestation'),
      mockApi.getBaseColumnOptions('Mode de passation du marché'),
    ]);
    setBudgetOptions(b);
    setFormeOptions(f);
    setNatureOptions(n);
    setModeOptions(m);
  };
  React.useEffect(() => { fetchBaseOptions(); }, []);
  React.useEffect(() => {
    const handler = () => { fetchBaseOptions(); };
    window.addEventListener('base-options-changed', handler as any);
    return () => window.removeEventListener('base-options-changed', handler as any);
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Service Contractant</label>
          <div className="flex gap-2">
            <RadixSelect className="input-gradient" value={form.service_contractant.source as any} onChange={(v)=>update('service_contractant', { ...form.service_contractant, source: v as BudgetSource })} options={budgetOptions} />
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
        <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50" onClick={() => onSubmit({ ...form, dynamic_values: dynValues })}>Ajouter la ligne</button>
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
