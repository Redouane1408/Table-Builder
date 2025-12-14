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
      const API_BASE = '/api';
      const headers = { 'Content-Type': 'application/json', Accept: 'application/json' } as const;
      const unwrap = async (res: Response) => { const j = await res.json().catch(() => ({})); return typeof (j as any)?.data !== 'undefined' ? (j as any).data : j; };
      try {
        const c = await mockApi.createCanvas({});
        setCanvas(c);
        const pfRes = await fetch(`${API_BASE}/portefeuilles`, { headers });
        const pfData = await unwrap(pfRes);
        const pfList = Array.isArray(pfData) ? pfData.map((p: any) => ({ id: String(p.id ?? crypto.randomUUID()), name_fr: p.nameFr ?? p.name_fr ?? '', name_ar: p.nameAr ?? p.name_ar ?? '', code: p.code ?? '' })) : [];
        setPortefeuilles(pfList);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => { (async () => {
    const API_BASE = '/api';
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' } as const;
    const unwrap = async (res: Response) => { const j = await res.json().catch(() => ({})); return typeof (j as any)?.data !== 'undefined' ? (j as any).data : j; };
    if (!pfId) { setTitres([]); setTitreNumero(undefined); return; }
    try {
      const res = await fetch(`${API_BASE}/titres`, { headers });
      const data = await unwrap(res);
      const list = Array.isArray(data) ? data.map((t: any) => ({ id: String(t.id ?? crypto.randomUUID()), numero: Number((t as any).numero ?? 0), name_fr: t.nomFr ?? '', name_ar: t.nomAr ?? '', code: t.code ?? '' })) : [];
      setTitres(list);
    } catch {}
  })(); }, [pfId]);

  useEffect(() => { (async () => {
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

  useEffect(() => { (async () => {
    const API_BASE = '/api';
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' } as const;
    const unwrap = async (res: Response) => { const j = await res.json().catch(() => ({})); return typeof (j as any)?.data !== 'undefined' ? (j as any).data : j; };
    if (!progId) { setSousProgrammes([]); return; }
    try {
      const idPath = String(Number(progId));
      const res = await fetch(`${API_BASE}/sous-programmes/programme/${idPath}`, { headers });
      const data = await unwrap(res);
      const arr = Array.isArray(data) ? data : (Array.isArray((data as any)?.data) ? (data as any).data : []);
      const list = arr.map((s: any) => ({ id: String(s.id ?? crypto.randomUUID()), programme_id: String(s.programmeId ?? progId), name_fr: s.nomFr ?? s.name_fr ?? '', name_ar: s.nomAr ?? s.name_ar ?? '', code: s.code ?? '' }));
      setSousProgrammes(list);
    } catch {}
  })(); }, [progId]);

  const filteredProgrammes = useMemo(() => (programmes || []).filter((p:any) => !pfId || String(p.portefeuille_id) === String(pfId)), [programmes, pfId]);
  const filteredSousProgrammes = useMemo(() => (sousProgrammes || []).filter((s:any) => !progId || String(s.programme_id) === String(progId)), [sousProgrammes, progId]);

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
