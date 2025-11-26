"use client";
import React, { useState } from 'react';
import { AvenantRow, Devise } from '@/lib/types';
import { mockApi } from '@/lib/mockData';
import RadixSelect from '@/components/ui/RadixSelect';

interface Props { initial?: Partial<AvenantRow>; onSubmit: (row: AvenantRow) => void }

const deviseOptions: Devise[] = ['DZD','USD','EUR'];

const AvenantRowForm: React.FC<Props> = ({ initial, onSubmit }) => {
  const [modeOptions, setModeOptions] = useState<string[]>([]);
  React.useEffect(() => { (async () => setModeOptions(await mockApi.getBaseColumnOptions('Mode de passation du marché')))(); }, []);
  const [form, setForm] = useState<AvenantRow>({
    id: initial?.id || crypto.randomUUID(),
    numero_avenant: initial?.numero_avenant || '',
    date_avenant: initial?.date_avenant || '',
    objet_avenant: initial?.objet_avenant || '',
    type_avenant: (initial?.type_avenant as any) || 'additif',
    mode_passation: initial?.mode_passation,
    montant_avenant_dzd: initial?.montant_avenant_dzd || 0,
    taux_variation_pct: initial?.taux_variation_pct || 0,
    nouveau_montant_final_dzd: initial?.nouveau_montant_final_dzd || 0,
    montant_en_devise: initial?.montant_en_devise || { amount: 0, currency: 'DZD' },
    motif: initial?.motif || '',
  });
  const update = (key: keyof AvenantRow, value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const numberInput = (v: string) => Number(v.replace(/[^0-9.]/g, '')) || 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Numéro de l'avenant</label>
          <input className="w-full px-3 py-2 rounded-lg input-gradient" value={form.numero_avenant} onChange={(e)=>update('numero_avenant', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Date de l'avenant</label>
          <input type="date" className="w-full px-3 py-2 rounded-lg input-gradient" value={form.date_avenant} onChange={(e)=>update('date_avenant', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Objet de l'avenant</label>
          <input className="w-full px-3 py-2 rounded-lg input-gradient" value={form.objet_avenant} onChange={(e)=>update('objet_avenant', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Type d'avenant</label>
          <RadixSelect value={form.type_avenant as any} onChange={(v)=>update('type_avenant', v as any)} options={["additif","soustractif","reallocation"]} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Mode de passation</label>
          <RadixSelect value={form.mode_passation as any} onChange={(v)=>update('mode_passation', v as any)} options={modeOptions} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Montant de l'avenant (DZD)</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg input-gradient" value={form.montant_avenant_dzd} onChange={(e)=>update('montant_avenant_dzd', numberInput(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Taux de variation (%)</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg input-gradient" value={form.taux_variation_pct} onChange={(e)=>update('taux_variation_pct', numberInput(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Nouveau montant final (DZD)</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg input-gradient" value={form.nouveau_montant_final_dzd} onChange={(e)=>update('nouveau_montant_final_dzd', numberInput(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Montant en devise</label>
          <div className="flex gap-2">
            <input type="text" className="flex-1 px-3 py-2 rounded-lg input-gradient" value={form.montant_en_devise?.amount || 0} onChange={(e)=>update('montant_en_devise', { amount: numberInput(e.target.value), currency: form.montant_en_devise?.currency || 'DZD' })} />
            <RadixSelect value={(form.montant_en_devise?.currency || 'DZD') as any} onChange={(v)=>update('montant_en_devise', { amount: form.montant_en_devise?.amount || 0, currency: v as Devise })} options={deviseOptions} />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Motif</label>
          <input className="w-full px-3 py-2 rounded-lg input-gradient" value={form.motif} onChange={(e)=>update('motif', e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50" onClick={()=>onSubmit(form)}>Ajouter l'avenant</button>
      </div>
    </div>
  );
};

export default AvenantRowForm;
