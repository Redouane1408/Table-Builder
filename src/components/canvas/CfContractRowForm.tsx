"use client";
import React, { useState } from 'react';
import { BudgetSource, FormeMarche, NaturePrestation, ModePassation, Devise, CfContractRow } from '@/lib/types';

interface Props { initial?: Partial<CfContractRow>; onSubmit: (row: CfContractRow) => void; }

const budgetOptions: BudgetSource[] = ['Budget Etat','Budget Collectivité locale','Budget EPIC/EPA..','Budget wilaya','Budget commune'];
const formeOptions: FormeMarche[] = ['travaux', 'fournitures', 'études', 'services'];
const natureOptions: NaturePrestation[] = ['Marché','Marché à commande','Contrart-Programme','Etude et réalisation','une tranche ferme et une ou plusieurs tranche(s) conditionnelle(s)'];
const modeOptions: ModePassation[] = ["Appel d'offres ouvert","Appel d'offres ouvert avec exigence de capacité minimales","Appel d'offres restreint",'Concour','Négocier aprés consultation','Négocié direct',"Procédure de consultation des marchés","Procédure spécifique en cas d'urgence impérieuse"];
const deviseOptions: Devise[] = ['USD', 'EUR'];

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Service Contractant</label>
          <div className="flex gap-2">
            <select className="flex-1 px-3 py-2 border rounded-lg" value={form.service_contractant.source} onChange={(e) => update('service_contractant', { ...form.service_contractant, source: e.target.value as BudgetSource })}>
              {budgetOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
            <input className="flex-1 px-3 py-2 border rounded-lg" placeholder="Libellé" value={form.service_contractant.label} onChange={(e) => update('service_contractant', { ...form.service_contractant, label: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Partenaire Cocontractant</label>
          <input className="w-full px-3 py-2 border rounded-lg" value={form.partenaire_cocontractant} onChange={(e) => update('partenaire_cocontractant', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Objet du marché</label>
          <input className="w-full px-3 py-2 border rounded-lg" value={form.objet_du_marche} onChange={(e) => update('objet_du_marche', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Forme du marché</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={form.forme_du_marche} onChange={(e) => update('forme_du_marche', e.target.value as FormeMarche)}>
            {formeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Nature de prestation</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={form.nature_prestation} onChange={(e) => update('nature_prestation', e.target.value as NaturePrestation)}>
            {natureOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Mode de passation du marché</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={form.mode_passation} onChange={(e) => update('mode_passation', e.target.value as ModePassation)}>
            {modeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Montant des versement (DZD)</label>
          <input type="text" className="w-full px-3 py-2 border rounded-lg" value={form.montant_versement_dzd} onChange={(e) => update('montant_versement_dzd', numberInput(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Taux des versement (%)</label>
          <input type="text" className="w-full px-3 py-2 border rounded-lg" value={form.taux_versement_pct} onChange={(e) => update('taux_versement_pct', numberInput(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Montant TTC (DZD)</label>
          <input type="text" className="w-full px-3 py-2 border rounded-lg" value={form.montant_ttc_dzd} onChange={(e) => update('montant_ttc_dzd', numberInput(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Montant de l'avenant (DZD)</label>
          <input type="text" className="w-full px-3 py-2 border rounded-lg" value={form.montant_avenant_dzd} onChange={(e) => update('montant_avenant_dzd', numberInput(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Montant final du marché (DZD)</label>
          <input type="text" className="w-full px-3 py-2 border rounded-lg" value={form.montant_final_marche_dzd} onChange={(e) => update('montant_final_marche_dzd', numberInput(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Montant en devise</label>
          <div className="flex gap-2">
            <input type="text" className="flex-1 px-3 py-2 border rounded-lg" value={form.montant_en_devise?.amount || 0} onChange={(e) => update('montant_en_devise', { amount: numberInput(e.target.value), currency: form.montant_en_devise?.currency || 'USD' })} />
            <select className="px-3 py-2 border rounded-lg" value={form.montant_en_devise?.currency || 'USD'} onChange={(e) => update('montant_en_devise', { amount: form.montant_en_devise?.amount || 0, currency: e.target.value as Devise })}>
              {deviseOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50" onClick={() => onSubmit(form)}>Ajouter la ligne</button>
      </div>
    </div>
  );
};

export default CfContractRowForm;

