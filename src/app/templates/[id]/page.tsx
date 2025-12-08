"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/common/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { mockApi } from '@/lib/mockData';
import { CFCanvasData, Canvas, CfContractRow, BudgetSource, FormeMarche, NaturePrestation, ModePassation } from '@/lib/types';
import CfContractRowForm from '@/components/canvas/CfContractRowForm';
import { useParams } from 'next/navigation';
import { Save, Send, Trash2 } from 'lucide-react';

const currency = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(n);

export default function TemplateDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [budgetFilter, setBudgetFilter] = useState<'all' | BudgetSource>('all');
  const [formeFilter, setFormeFilter] = useState<'all' | FormeMarche>('all');
  const [natureFilter, setNatureFilter] = useState<'all' | NaturePrestation>('all');
  const [modeFilter, setModeFilter] = useState<'all' | ModePassation>('all');
  const [montantMin, setMontantMin] = useState<string>('');
  const [montantMax, setMontantMax] = useState<string>('');
  const [tauxMin, setTauxMin] = useState<string>('');
  const [tauxMax, setTauxMax] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        const c = await mockApi.getCanvasById(id);
        if (!c) throw new Error('Canvas not found');
        setCanvas(c);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const data = useMemo(() => (canvas?.data as CFCanvasData) || { contracts: [] }, [canvas]);
  const filteredContracts = useMemo(() => {
    const q = search.toLowerCase();
    const minM = montantMin ? Number(montantMin) : undefined;
    const maxM = montantMax ? Number(montantMax) : undefined;
    const minT = tauxMin ? Number(tauxMin) : undefined;
    const maxT = tauxMax ? Number(tauxMax) : undefined;
    return (data.contracts || []).filter((r) => {
      const matchSearch = r.service_contractant.label.toLowerCase().includes(q) || r.partenaire_cocontractant.toLowerCase().includes(q) || r.objet_du_marche.toLowerCase().includes(q) || r.forme_du_marche.toLowerCase().includes(q) || r.nature_prestation.toLowerCase().includes(q) || r.mode_passation.toLowerCase().includes(q);
      const matchBudget = budgetFilter === 'all' || r.service_contractant.source === budgetFilter;
      const matchForme = formeFilter === 'all' || r.forme_du_marche === formeFilter;
      const matchNature = natureFilter === 'all' || r.nature_prestation === natureFilter;
      const matchMode = modeFilter === 'all' || r.mode_passation === modeFilter;
      const matchMontant = (minM === undefined || r.montant_final_marche_dzd >= minM) && (maxM === undefined || r.montant_final_marche_dzd <= maxM);
      const matchTaux = (minT === undefined || r.taux_versement_pct >= minT) && (maxT === undefined || r.taux_versement_pct <= maxT);
      return matchSearch && matchBudget && matchForme && matchNature && matchMode && matchMontant && matchTaux;
    });
  }, [data.contracts, search, budgetFilter, formeFilter, natureFilter, modeFilter, montantMin, montantMax, tauxMin, tauxMax]);

  const addRow = async (row: CfContractRow) => {
    if (!canvas) return;
    const updated = await mockApi.addContractRow(canvas.id, row);
    setCanvas({ ...updated });
  };

  const removeRow = async (rowId: string) => {
    if (!canvas) return;
    const updated = await mockApi.deleteContractRow(canvas.id, rowId);
    setCanvas({ ...updated });
  };

  const submit = async () => {
    if (!canvas) return;
    const updated = await mockApi.submitCanvas(canvas.id);
    setCanvas({ ...updated });
  };

  if (loading) return (<Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div></Layout>);
  if (error || !canvas) return (<Layout><div className="p-6">Erreur: {error || 'Canvas manquant'}</div></Layout>);

  return (
    <ProtectedRoute allowedRoles={['CF','DRB','DGB']}>
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Éditer le Modèle</h1>
            <p className="text-gray-600">Période: {canvas.period} • Wilaya: {canvas.wilaya?.name_fr || canvas.wilaya?.name_ar || (canvas.wilaya as any)?.name}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 flex items-center gap-2">
              <Save className="w-4 h-4" /> Brouillon
            </button>
            <button onClick={submit} className="px-4 py-2 rounded-lg btn-brand flex items-center gap-2">
              <Send className="w-4 h-4" /> Soumettre
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une ligne</h3>
          <CfContractRowForm onSubmit={addRow} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 grid grid-cols-1 md:grid-cols-6 gap-3 border-b">
            <div className="relative md:col-span-2">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filtre intelligent..." className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <select value={budgetFilter} onChange={(e) => setBudgetFilter(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg">
                <option value="all">Tous budgets</option>
                <option value="Budget Etat">Budget Etat</option>
                <option value="Budget Collectivité locale">Budget Collectivité locale</option>
                <option value="Budget EPIC/EPA..">Budget EPIC/EPA..</option>
                <option value="Budget wilaya">Budget wilaya</option>
                <option value="Budget commune">Budget commune</option>
              </select>
            </div>
            <div>
              <select value={formeFilter} onChange={(e) => setFormeFilter(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg">
                <option value="all">Toutes formes</option>
                <option value="travaux">travaux</option>
                <option value="fournitures">fournitures</option>
                <option value="études">études</option>
                <option value="services">services</option>
              </select>
            </div>
            <div>
              <select value={natureFilter} onChange={(e) => setNatureFilter(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg">
                <option value="all">Toutes natures</option>
                <option value="Marché">Marché</option>
                <option value="Marché à commande">Marché à commande</option>
                <option value="Contrart-Programme">Contrart-Programme</option>
                <option value="Etude et réalisation">Etude et réalisation</option>
                <option value="une tranche ferme et une ou plusieurs tranche(s) conditionnelle(s)">Tranche(s) conditionnelle(s)</option>
              </select>
            </div>
            <div>
              <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg">
                <option value="all">Tous modes</option>
                <option value="Appel d'offres ouvert">Appel d'offres ouvert</option>
                <option value="Appel d'offres ouvert avec exigence de capacité minimales">AO ouvert (exigences)</option>
                <option value="Appel d'offres restreint">Appel d'offres restreint</option>
                <option value="Concour">Concour</option>
                <option value="Négocier aprés consultation">Négocier aprés consultation</option>
                <option value="Négocié direct">Négocié direct</option>
                <option value="Procédure de consultation des marchés">Procédure de consultation</option>
                <option value="Procédure spécifique en cas d'urgence impérieuse">Urgence impérieuse</option>
              </select>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3 border-b">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Montant final ≥</label>
              <input value={montantMin} onChange={(e) => setMontantMin(e.target.value)} placeholder="DZD" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Montant final ≤</label>
              <input value={montantMax} onChange={(e) => setMontantMax(e.target.value)} placeholder="DZD" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Taux ≥</label>
              <input value={tauxMin} onChange={(e) => setTauxMin(e.target.value)} placeholder="%" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Taux ≤</label>
              <input value={tauxMax} onChange={(e) => setTauxMax(e.target.value)} placeholder="%" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Contractant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partenaire</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Objet</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Forme</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Versement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taux</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TTC</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avenant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Devise</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{r.service_contractant.source} • {r.service_contractant.label}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.partenaire_cocontractant}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.objet_du_marche}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.forme_du_marche}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.nature_prestation}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.mode_passation}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{currency(r.montant_versement_dzd)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.taux_versement_pct}%</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{currency(r.montant_ttc_dzd)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{currency(r.montant_avenant_dzd)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{currency(r.montant_final_marche_dzd)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.montant_en_devise ? `${r.montant_en_devise.amount} ${r.montant_en_devise.currency}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <button className="text-red-600 hover:text-red-800 p-1" title="Supprimer" onClick={() => removeRow(r.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
    </ProtectedRoute>
  );
}
