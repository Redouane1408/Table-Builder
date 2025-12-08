"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/common/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { mockApi } from '@/lib/mockData';
import { CFCanvasData, Canvas, CfContractRow } from '@/lib/types';
import CfContractRowForm from '@/components/canvas/CfContractRowForm';
import { Save, Send, Trash2 } from 'lucide-react';
import RadixSelect from '@/components/ui/RadixSelect';

const currency = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(n);

export default function TemplateNewPage() {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canvaType, setCanvaType] = useState<'marches'|'avenants'>('marches');
  const [portefeuilles, setPortefeuilles] = useState<any[]>([]);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [sousProgrammes, setSousProgrammes] = useState<any[]>([]);
  const [titres, setTitres] = useState<any[]>([]);
  const [pfId, setPfId] = useState<string | undefined>(undefined);
  const [progId, setProgId] = useState<string | undefined>(undefined);
  const [spId, setSpId] = useState<string | undefined>(undefined);
  const [actionName, setActionName] = useState('');
  const [titreNumero, setTitreNumero] = useState<string | undefined>(undefined);
  const [operationNumber, setOperationNumber] = useState<number | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      try {
        const c = await mockApi.createCanvas({});
        setCanvas(c);
        const pf = await (mockApi as any).listPortefeuilles?.();
        setPortefeuilles(pf);
        const pr = await (mockApi as any).listProgrammes?.();
        setProgrammes(pr);
        const sp = await (mockApi as any).listSousProgrammes?.();
        setSousProgrammes(sp);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => { (async () => { if (!pfId) { setTitres([]); setTitreNumero(undefined); return; } const tts = await (mockApi as any).listTitres?.(pfId); setTitres(tts); })(); }, [pfId]);

  const filteredProgrammes = useMemo(() => programmes.filter((p:any) => !pfId || p.portefeuille_id === pfId), [programmes, pfId]);
  const filteredSousProgrammes = useMemo(() => sousProgrammes.filter((s:any) => !progId || s.programme_id === progId), [sousProgrammes, progId]);

  const data = useMemo(() => (canvas?.data as CFCanvasData) || { contracts: [] }, [canvas]);

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

  if (loading) return (
    <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div></Layout>
  );
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Portefeuille</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Programme</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sous Programme</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sous Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Opération</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.contracts.map((r) => (
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
                    <td className="px-4 py-3 text-sm text-gray-900">{r.dynamic_values?.portefeuille_id || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.dynamic_values?.programme_id || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.dynamic_values?.sous_programme_id || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.dynamic_values?.action_label || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.dynamic_values?.sous_action_label || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{typeof r.dynamic_values?.titre_numero === 'number' ? `Titre ${r.dynamic_values?.titre_numero}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{typeof r.dynamic_values?.operation_number === 'number' ? r.dynamic_values?.operation_number : '-'}</td>
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
