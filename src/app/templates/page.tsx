"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { mockApi } from "@/lib/mockData";
import { Canvas } from "@/lib/types";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";

export default function TemplatesPage() {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [avenants, setAvenants] = useState<Canvas[]>([]);
  const [tab, setTab] = useState<'marches'|'avenants'>('marches');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [data, avs] = await Promise.all([mockApi.getCanvases(), mockApi.getAvenantCanvases()]);
      setCanvases(data);
      setAvenants(avs);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <Layout>
      <div className="h-64 flex items-center justify-center">Loading...</div>
    </Layout>
  );

  return (
    <ProtectedRoute allowedRoles={['CF','DRB','DGB']}>
    <Layout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modèles</h1>
          <p className="text-gray-600">Gérez vos canvases</p>
        </div>
        {tab === 'marches' ? (
          <Link href="/templates/new" className="btn-brand px-4 py-2 rounded-lg">Nouveau Modèle</Link>
        ) : (
          <Link href="/templates/avenants/new" className="btn-brand px-4 py-2 rounded-lg">Nouvel Avenant</Link>
        )}
      </div>
      <Tabs.Root value={tab} onValueChange={(v)=>setTab(v as any)} className="mt-4">
        <Tabs.List className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-700">
          <Tabs.Trigger value="marches" className={`px-4 py-2 rounded-md ${tab==='marches' ? 'bg-white shadow text-gray-900' : 'hover:bg-gray-200'}`}>Canva des Marchés</Tabs.Trigger>
          <Tabs.Trigger value="avenants" className={`px-4 py-2 rounded-md ${tab==='avenants' ? 'bg-white shadow text-gray-900' : 'hover:bg-gray-200'}`}>Canva des Avenants</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      {tab === 'marches' && (
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wilaya</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {canvases.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{c.period}</td>
                  <td className="px-6 py-4 text-sm">{c.wilaya?.name}</td>
                  <td className="px-6 py-4 text-sm">{c.status}</td>
                  <td className="px-6 py-4 text-sm">
                    <Link href={`/templates/${c.id}`} className="text-blue-600 hover:text-blue-800">Voir</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {tab === 'avenants' && (
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wilaya</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {avenants.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{c.period}</td>
                  <td className="px-6 py-4 text-sm">{c.wilaya?.name}</td>
                  <td className="px-6 py-4 text-sm">{c.status}</td>
                  <td className="px-6 py-4 text-sm">
                    <Link href={`/templates/avenants/${c.id}`} className="text-blue-600 hover:text-blue-800">Voir</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
    </Layout>
    </ProtectedRoute>
  );
}
