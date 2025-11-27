"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import * as Tabs from "@radix-ui/react-tabs";
import { mockApi } from "@/lib/mockData";
import { DerivedCanvas } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function TemplatesOverviewPage() {
  const [canva, setCanva] = useState<'marches'|'avenants'>('marches');
  const [derived, setDerived] = useState<DerivedCanvas[]>([]);
  useEffect(() => { (async () => { const d = await mockApi.listDerivedCanvasesFor(canva); setDerived(d); })(); }, [canva]);
  return (
    <ProtectedRoute allowedRoles={['CF','DRB','DGB']}>
      <Layout>
        <Tabs.Root value={canva} onValueChange={(v)=>setCanva(v as any)} className="space-y-6">
          <Tabs.List className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-700">
            <Tabs.Trigger value="marches" className={`px-4 py-2 rounded-md ${canva==='marches' ? 'bg-white shadow text-gray-900' : 'hover:bg-gray-200'}`}>Canva des Marchés</Tabs.Trigger>
            <Tabs.Trigger value="avenants" className={`px-4 py-2 rounded-md ${canva==='avenants' ? 'bg-white shadow text-gray-900' : 'hover:bg-gray-200'}`}>Canva des Avenants</Tabs.Trigger>
          </Tabs.List>

          <div className="space-y-4">
            {derived.length === 0 && (
              <p className="text-sm text-gray-600">Aucun canvas dérivé pour ce canva.</p>
            )}
            {derived.map(dc => (
              <DerivedCanvasCard key={dc.id} canva={canva} dc={dc} onUpdated={async()=>{ const d = await mockApi.listDerivedCanvasesFor(canva); setDerived(d); }} />
            ))}
          </div>
        </Tabs.Root>
      </Layout>
    </ProtectedRoute>
  );
}

function DerivedCanvasCard({ canva, dc, onUpdated }: { canva: 'marches'|'avenants', dc: DerivedCanvas, onUpdated: () => void }) {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const [nameFr, setNameFr] = React.useState<string>(dc.name_fr);
  const [nameAr, setNameAr] = React.useState<string>(dc.name_ar);
  const [pivotCounts, setPivotCounts] = React.useState<{ wilaya_id: string; wilaya_name: string; counts: Record<string, number> }[]>([]);
  const [pivotAmounts, setPivotAmounts] = React.useState<{ wilaya_id: string; wilaya_name: string; counts: Record<string, number> }[]>([]);
  const [metric, setMetric] = React.useState<'count'|'amount'>('count');
  React.useEffect(() => { (async () => { const pvC = await mockApi.getDerivedCanvasPivot(canva, dc.id); setPivotCounts(pvC); const pvA = await mockApi.getDerivedCanvasPivotAmounts(canva, dc.id); setPivotAmounts(pvA); })(); }, [canva, dc.id]);
  const saveNames = async () => { await mockApi.updateDerivedCanvasNames(canva, dc.id, nameFr.trim() || dc.name_fr, nameAr.trim() || dc.name_ar); await onUpdated(); };
  const updateCol = async (key: string, fr: string, ar: string) => { await mockApi.updateDerivedCanvasColumnNames(canva, dc.id, key, fr, ar); await onUpdated(); };
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Source colonne</p>
          <h3 className="text-lg font-semibold text-gray-900">{currentLanguage === 'ar' ? dc.name_ar : dc.name_fr}</h3>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-xs text-gray-600">Counts</span>
          <button role="switch" aria-checked={metric==='amount'} onClick={()=>setMetric(metric==='count' ? 'amount' : 'count')} className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${metric==='amount' ? 'bg-blue-600 border-blue-600' : 'bg-gray-300 border-gray-300'}`} title={metric==='amount' ? 'Afficher Amounts' : 'Afficher Counts'}>
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${metric==='amount' ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
          <span className="text-xs text-gray-600">Amounts</span>
          <input value={nameFr} onChange={(e)=>setNameFr(e.target.value)} placeholder="Nom FR" className="px-3 py-2 border rounded-lg" />
          <input value={nameAr} onChange={(e)=>setNameAr(e.target.value)} placeholder="Nom AR" className="px-3 py-2 border rounded-lg" />
          <button onClick={saveNames} className="px-3 py-2 rounded-lg btn-brand">Sauvegarder</button>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{currentLanguage === 'ar' ? 'الولايات' : 'Wilayas'}</th>
              {dc.columns.map(col => (
                <th key={col.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{currentLanguage === 'ar' ? col.name_ar : col.name_fr}</th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{currentLanguage === 'ar' ? 'المجموع' : 'Sommes'}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(metric==='count' ? pivotCounts : pivotAmounts).map(row => (
              <tr key={row.wilaya_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{row.wilaya_name}</td>
                {dc.columns.map(col => (
                  <td key={col.id} className="px-4 py-3 text-sm text-gray-900">{metric==='count' ? (row.counts[col.key] || 0) : `${Math.round(row.counts[col.key] || 0).toLocaleString()} DZD`}</td>
                ))}
                <td className="px-4 py-3 text-sm text-gray-900">{metric==='count' ? Object.values(row.counts).reduce((a,b)=>a+b,0) : `${Math.round(Object.values(row.counts).reduce((a,b)=>a+b,0)).toLocaleString()} DZD`}</td>
              </tr>
            ))}
            {(() => {
              const totals: Record<string, number> = {};
              for (const c of dc.columns) totals[c.key] = 0;
              for (const r of (metric==='count' ? pivotCounts : pivotAmounts)) {
                for (const k of Object.keys(r.counts)) totals[k] = (totals[k] || 0) + r.counts[k];
              }
              const grand = Object.values(totals).reduce((a,b)=>a+b,0);
              const drbLabel = `${currentLanguage === 'ar' ? 'DRB' : 'DRB'} — ${user?.wilaya_name || 'National'}`;
              return (
                <tr className="bg-emerald-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{drbLabel}</td>
                  {dc.columns.map(col => (
                    <td key={col.id} className="px-4 py-3 text-sm font-semibold text-gray-900">{metric==='count' ? (totals[col.key] || 0) : `${Math.round(totals[col.key] || 0).toLocaleString()} DZD`}</td>
                  ))}
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{metric==='count' ? grand : `${Math.round(grand).toLocaleString()} DZD`}</td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <p className="text-sm text-gray-600">Édition des libellés</p>
        <div className="mt-2 grid grid-cols-1 gap-2">
          {dc.columns.map(col => (
            <div key={col.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <span className="text-sm text-gray-700">{col.key}</span>
              <input defaultValue={col.name_fr} onBlur={(e)=>updateCol(col.key, e.target.value, col.name_ar)} placeholder="Nom FR" className="px-2 py-1 border rounded" />
              <input defaultValue={col.name_ar} onBlur={(e)=>updateCol(col.key, col.name_fr, e.target.value)} placeholder="Nom AR" className="px-2 py-1 border rounded" />
              <button onClick={()=>updateCol(col.key, col.name_fr, col.name_ar)} className="px-3 py-1 rounded-lg border hover:bg-gray-50">Mettre à jour</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
