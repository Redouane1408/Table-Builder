"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/common/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { mockApi } from '@/lib/mockData';
import { Canvas, AvenantCanvasData, AvenantRow } from '@/lib/types';
import AvenantRowForm from '@/components/canvas/AvenantRowForm';
import { useParams } from 'next/navigation';
import { Save, Send, Trash2 } from 'lucide-react';

const currency = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(n);

export default function AvenantEditPage() {
  const params = useParams();
  const id = params?.id as string;
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const c = await mockApi.getCanvasById(id);
        setCanvas(c || null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const data = useMemo(() => (canvas?.data as AvenantCanvasData) || { avenants: [] }, [canvas]);

  const addRow = async (row: AvenantRow) => {
    if (!canvas) return;
    const updated = await mockApi.addAvenantRow(canvas.id, row);
    setCanvas({ ...updated });
  };

  const removeRow = async (rowId: string) => {
    if (!canvas) return;
    const updated = await mockApi.deleteAvenantRow(canvas.id, rowId);
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
              <h1 className="text-2xl font-bold text-gray-900">Canva des Avenants</h1>
              <p className="text-gray-600">Période: {canvas.period} • Wilaya: {canvas.wilaya?.name}</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un avenant</h3>
            <AvenantRowForm onSubmit={addRow} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N°</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Objet</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant (DZD)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taux (%)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nouveau montant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.avenants.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{r.numero_avenant}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{r.date_avenant}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{r.objet_avenant}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{r.type_avenant}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{currency(r.montant_avenant_dzd)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{r.taux_variation_pct}%</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{currency(r.nouveau_montant_final_dzd)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <button className="text-red-600 hover:text-red-800 p-1" onClick={() => removeRow(r.id)}>
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

