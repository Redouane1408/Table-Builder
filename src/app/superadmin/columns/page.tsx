"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DynamicColumn, BaseCanvaColumn, DerivedCanvas } from "@/lib/types";
import Link from "next/link";
import { mockApi } from "@/lib/mockData";
import * as Tabs from "@radix-ui/react-tabs";
import RadixSelect from "@/components/ui/RadixSelect";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function SuperAdminColumnsPage() {
  const [canva, setCanva] = useState<'marches'|'avenants'>('marches');
  const [cols, setCols] = useState<DynamicColumn[]>([]);
  const [nameFr, setNameFr] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [type, setType] = useState<DynamicColumn["type"]>("string");
  const [optionsBi, setOptionsBi] = useState<{ key: string; name_fr: string; name_ar: string }[]>([]);
  const [optFr, setOptFr] = useState("");
  const [optAr, setOptAr] = useState("");
  const [baseCols, setBaseCols] = useState<BaseCanvaColumn[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editNameFr, setEditNameFr] = useState("");
  const [editNameAr, setEditNameAr] = useState("");
  const [editType, setEditType] = useState<DynamicColumn["type"]>("string");
  const [editOptions, setEditOptions] = useState<string[]>([]);
  const [editOptionInput, setEditOptionInput] = useState("");
  const [editOptionAr, setEditOptionAr] = useState("");
  const [editOptionsBi, setEditOptionsBi] = useState<{ key: string; name_fr: string; name_ar: string }[]>([]);
  const [baseEditingId, setBaseEditingId] = useState<string | null>(null);
  const [baseEditName, setBaseEditName] = useState("");
  const [baseEditType, setBaseEditType] = useState<DynamicColumn["type"]>("string");
  const [baseEditNote, setBaseEditNote] = useState("");
  const [view, setView] = useState<'columns'|'overview'>('columns');
  const [derived, setDerived] = useState<DerivedCanvas[]>([]);

  useEffect(() => { (async () => { const list = await mockApi.listDynamicColumnsFor(canva); setCols(list); const base = await mockApi.getBaseColumnsFor(canva); setBaseCols(base); const d = await mockApi.listDerivedCanvasesFor(canva); setDerived(d); })(); }, [canva]);

  const addOption = () => { const fr = optFr.trim(); const ar = optAr.trim(); if (!fr) return; const key = fr; setOptionsBi(prev => [...prev, { key, name_fr: fr, name_ar: ar || fr }]); setOptFr(""); setOptAr(""); };
  const save = async () => { if (!nameFr && !nameAr) return; const def: Omit<DynamicColumn, 'id'|'created_at'> = { name: nameFr || nameAr, name_fr: nameFr || undefined, name_ar: nameAr || undefined, type, options: type === 'dropdown' ? optionsBi.map(o=>o.key) : undefined, options_bi: type === 'dropdown' ? optionsBi : undefined } as any; const created = await mockApi.addDynamicColumnFor(canva, def); setCols(prev => [...prev, created]); const d = await mockApi.listDerivedCanvasesFor(canva); setDerived(d); setNameFr(""); setNameAr(""); setType("string"); setOptionsBi([]); setOptFr(""); setOptAr(""); window.dispatchEvent(new Event('dynamic-columns-changed')); };
  const startEdit = (c: DynamicColumn) => { setEditingId(c.id); setEditName(c.name); setEditType(c.type); setEditOptions(c.options || []); setEditOptionInput(""); setEditNameFr((c as any).name_fr || c.name); setEditNameAr((c as any).name_ar || c.name); setEditOptionsBi((c as any).options_bi || (c.options || []).map(o=>({ key: o, name_fr: o, name_ar: o }))); };
  const addEditOption = () => { const fr = editOptionInput.trim(); const ar = editOptionAr.trim(); if (!fr) return; const key = fr; setEditOptionsBi(prev => [...prev, { key, name_fr: fr, name_ar: ar || fr }]); setEditOptionInput(""); setEditOptionAr(""); };
  const removeEditOption = (opt: string) => { setEditOptionsBi(prev => prev.filter(o => o.key !== opt)); };
  const saveEdit = async () => { if (!editingId) return; const updated = await mockApi.updateDynamicColumnFor(canva, editingId, { name: editName, name_fr: editNameFr, name_ar: editNameAr, type: editType, options: editType === 'dropdown' ? editOptionsBi.map(o=>o.key) : undefined, options_bi: editType === 'dropdown' ? editOptionsBi : undefined } as any); setCols(prev => prev.map(c => c.id === updated.id ? updated : c)); const d = await mockApi.listDerivedCanvasesFor(canva); setDerived(d); setEditingId(null); window.dispatchEvent(new Event('dynamic-columns-changed')); };
  const cancelEdit = () => { setEditingId(null); };
  const deleteCol = async (id: string) => { if (!confirm('Supprimer cette colonne ?')) return; await mockApi.deleteDynamicColumnFor(canva, id); setCols(prev => prev.filter(c => c.id !== id)); const d = await mockApi.listDerivedCanvasesFor(canva); setDerived(d); window.dispatchEvent(new Event('dynamic-columns-changed')); };
  const startBaseEdit = (b: BaseCanvaColumn) => { setBaseEditingId(b.id); setBaseEditName(b.name); setBaseEditType(b.type); setBaseEditNote(b.note || ""); };
  const saveBaseEdit = async () => { if (!baseEditingId) return; const updated = await mockApi.updateBaseColumn(baseEditingId, { name: baseEditName, type: baseEditType, note: baseEditNote }); setBaseCols(prev => prev.map(b => b.id === updated.id ? updated : b)); setBaseEditingId(null); window.dispatchEvent(new Event('base-columns-changed')); };
  const cancelBaseEdit = () => { setBaseEditingId(null); };
  const deleteBaseCol = async (id: string) => { if (!confirm('Supprimer cette colonne du canva ?')) return; await mockApi.deleteBaseColumn(id); setBaseCols(prev => prev.filter(b => b.id !== id)); window.dispatchEvent(new Event('base-columns-changed')); };

  return (
    <ProtectedRoute allowedRoles={['DGB']}>
      <Layout>
        <Tabs.Root value={canva} onValueChange={(v)=>setCanva(v as any)} className="mb-4">
          <Tabs.List className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-700">
            <Tabs.Trigger value="marches" className={`px-4 py-2 rounded-md ${canva==='marches' ? 'bg-white shadow text-gray-900' : 'hover:bg-gray-200'}`}>Canva des Marchés</Tabs.Trigger>
            <Tabs.Trigger value="avenants" className={`px-4 py-2 rounded-md ${canva==='avenants' ? 'bg-white shadow text-gray-900' : 'hover:bg-gray-200'}`}>Canva des Avenants</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <Tabs.Root value={view} onValueChange={(v)=>setView(v as any)} className="space-y-6">
          <Tabs.List className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-700">
            <Tabs.Trigger value="columns" className={`px-4 py-2 rounded-md ${view==='columns' ? 'bg-white shadow text-gray-900' : 'hover:bg-gray-200'}`}>Gestion des colonnes</Tabs.Trigger>
            <Tabs.Trigger value="overview" className={`px-4 py-2 rounded-md ${view==='overview' ? 'bg-white shadow text-gray-900' : 'hover:bg-gray-200'}`}>Canvas Overview</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="columns">
            <div className="space-y-6">
              <div className="bg-brand-gradient rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">Colonnes dynamiques</h1>
                <p className="text-white/80">Définissez de nouvelles colonnes pour le canva sélectionné</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une colonne</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={nameFr} onChange={(e) => setNameFr(e.target.value)} placeholder="Nom FR de la colonne" className="w-full px-3 py-2 border rounded-lg" />
                    <input value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder="Nom AR de la colonne" className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <RadixSelect value={type} onChange={(v)=>setType(v as any)} options={["string","dropdown","percentage","amount_dzd","amount_fx"]} />
                  {type === 'dropdown' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input value={optFr} onChange={(e) => setOptFr(e.target.value)} placeholder="Option FR" className="px-3 py-2 border rounded-lg" />
                        <input value={optAr} onChange={(e) => setOptAr(e.target.value)} placeholder="Option AR" className="px-3 py-2 border rounded-lg" />
                        <button onClick={addOption} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Ajouter</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {optionsBi.map((opt) => (<span key={opt.key} className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">{opt.name_fr} • {opt.name_ar}</span>))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button onClick={save} className="px-4 py-2 rounded-lg btn-brand">Enregistrer</button>
                  </div>
                </div>
              </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Colonnes existantes</h3>
                    <div className="space-y-3">
                      {baseCols.map((b) => (
                        <div key={b.id} className="border rounded-lg px-3 py-2">
                          {baseEditingId === b.id ? (
                            <div className="space-y-2">
                              <input value={baseEditName} onChange={(e)=>setBaseEditName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                              <RadixSelect value={baseEditType} onChange={(v)=>setBaseEditType(v as any)} options={["string","dropdown","percentage","amount_dzd","amount_fx"]} />
                              <input value={baseEditNote} onChange={(e)=>setBaseEditNote(e.target.value)} placeholder="Note" className="w-full px-3 py-2 border rounded-lg" />
                              {baseEditType === 'dropdown' && (
                                <BaseOptionsEditor canva={canva} columnName={baseEditName} />
                              )}
                              <div className="flex gap-2 justify-end">
                                <button onClick={saveBaseEdit} className="px-3 py-2 rounded-lg btn-brand">Enregistrer</button>
                                <button onClick={cancelBaseEdit} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Annuler</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{b.name}</p>
                                <p className="text-xs text-gray-600">{b.type}{b.note ? ` • ${b.note}` : ''}</p>
                                {b.type === 'dropdown' && (
                                  <BaseOptionsViewer canva={canva} columnName={b.name} />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={()=>startBaseEdit(b)} className="px-3 py-1 rounded-lg border hover:bg-gray-50">Modifier</button>
                                <button onClick={()=>deleteBaseCol(b.id)} className="px-3 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50">Supprimer</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Colonnes dynamiques (CRUD)</h3>
                    <div className="space-y-3">
                      {cols.length === 0 && (
                        <p className="text-sm text-gray-600">Aucune colonne dynamique. Ajoutez une colonne à gauche.</p>
                      )}
                      {cols.map((c) => (
                        <div key={c.id} className="border rounded-lg px-3 py-2">
                          {editingId === c.id ? (
                            <div className="space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input value={editNameFr} onChange={(e)=>setEditNameFr(e.target.value)} placeholder="Nom FR" className="w-full px-3 py-2 border rounded-lg" />
                            <input value={editNameAr} onChange={(e)=>setEditNameAr(e.target.value)} placeholder="Nom AR" className="w-full px-3 py-2 border rounded-lg" />
                          </div>
                          <RadixSelect value={editType} onChange={(v)=>setEditType(v as any)} options={["string","dropdown","percentage","amount_dzd","amount_fx"]} />
                          {editType === 'dropdown' && (
                            <div className="space-y-2">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <input value={editOptionInput} onChange={(e)=>setEditOptionInput(e.target.value)} placeholder="Option FR" className="px-3 py-2 border rounded-lg" />
                                <input value={editOptionAr} onChange={(e)=>setEditOptionAr(e.target.value)} placeholder="Option AR" className="px-3 py-2 border rounded-lg" />
                                <button onClick={addEditOption} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Ajouter</button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {editOptionsBi.map((opt)=> (
                                  <span key={opt.key} className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-2">
                                    {opt.name_fr} • {opt.name_ar}
                                    <button onClick={()=>removeEditOption(opt.key)} className="text-blue-700">×</button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                              <div className="flex gap-2 justify-end">
                                <button onClick={saveEdit} className="px-3 py-2 rounded-lg btn-brand">Enregistrer</button>
                                <button onClick={cancelEdit} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Annuler</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{c.name}</p>
                                <p className="text-xs text-gray-600">{c.type}{c.type === 'dropdown' && c.options ? ` • ${c.options.length} options` : ''}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {c.type === 'dropdown' && canva === 'marches' && (
                                  <Link href={`/superadmin/consolidations/${encodeURIComponent(c.name)}`} className="px-3 py-1 rounded-lg border hover:bg-gray-50">Consolidation</Link>
                                )}
                                <button onClick={()=>startEdit(c)} className="px-3 py-1 rounded-lg border hover:bg-gray-50">Modifier</button>
                                <button onClick={()=>deleteCol(c.id)} className="px-3 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50">Supprimer</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="overview">
            <div className="space-y-6">
              <div className="bg-brand-gradient rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">Canvas Overview</h1>
                <p className="text-white/80">Aperçu des canvases dérivés des listes déroulantes</p>
              </div>
              <div className="space-y-4">
                {derived.length === 0 && (
                  <p className="text-sm text-gray-600">Aucun canvas dérivé. Créez une colonne de type liste déroulante.</p>
                )}
                {derived.map(dc => (
                  <DerivedCanvasCard key={dc.id} canva={canva} dc={dc} onUpdated={async()=>{ const d = await mockApi.listDerivedCanvasesFor(canva); setDerived(d); }} />
                ))}
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </Layout>
    </ProtectedRoute>
  );
}

function BaseOptionsViewer({ canva, columnName }: { canva: 'marches'|'avenants', columnName: string }) {
  const [opts, setOpts] = React.useState<string[]>([]);
  React.useEffect(() => { (async () => { setOpts(await mockApi.getBaseColumnOptionsFor(canva, columnName)); })(); }, [canva, columnName]);
  if (!opts.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {opts.map(o => (
        <span key={o} className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-700 border border-gray-200">{o}</span>
      ))}
    </div>
  );
}

function BaseOptionsEditor({ canva, columnName }: { canva: 'marches'|'avenants', columnName: string }) {
  const [opts, setOpts] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  const [editValue, setEditValue] = React.useState<string>("");
  React.useEffect(() => { (async () => { setOpts(await mockApi.getBaseColumnOptionsFor(canva, columnName)); })(); }, [canva, columnName]);
  const add = async () => { const next = await mockApi.addBaseColumnOptionFor(canva, columnName, input.trim()); setOpts(next); setInput(""); window.dispatchEvent(new Event('base-options-changed')); };
  const remove = async (o: string) => { const next = await mockApi.deleteBaseColumnOptionFor(canva, columnName, o); setOpts(next); window.dispatchEvent(new Event('base-options-changed')); };
  const update = async (prev: string) => { if (!editValue.trim()) return; const next = await mockApi.updateBaseColumnOptionFor(canva, columnName, prev, editValue.trim()); setOpts(next); setEditValue(""); window.dispatchEvent(new Event('base-options-changed')); };
  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-2">
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Nouvelle option" className="flex-1 px-3 py-2 border rounded-lg" />
        <button onClick={add} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Ajouter option</button>
      </div>
      <div className="space-y-1">
        {opts.map(o => (
          <div key={o} className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">{o}</span>
            <input value={editValue} onChange={(e)=>setEditValue(e.target.value)} placeholder="Modifier" className="px-2 py-1 border rounded" />
            <button onClick={()=>update(o)} className="px-2 py-1 rounded border hover:bg-gray-50">Mettre à jour</button>
            <button onClick={()=>remove(o)} className="px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50">Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DerivedCanvasCard({ canva, dc, onUpdated }: { canva: 'marches'|'avenants', dc: DerivedCanvas, onUpdated: () => void }) {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const [nameFr, setNameFr] = React.useState<string>(dc.name_fr);
  const [nameAr, setNameAr] = React.useState<string>(dc.name_ar);
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [colEdits, setColEdits] = React.useState<Record<string, { fr: string; ar: string }>>(() => Object.fromEntries(dc.columns.map(c => [c.key, { fr: c.name_fr, ar: c.name_ar }])));
  const [pivot, setPivot] = React.useState<{ wilaya_id: string; wilaya_name: string; counts: Record<string, number> }[]>([]);
  React.useEffect(() => { (async () => {
    const list = await mockApi.getDerivedCanvasCounts(canva, dc.id);
    const map: Record<string, number> = {};
    for (const item of list) map[item.key] = item.count;
    setCounts(map);
    const pv = await mockApi.getDerivedCanvasPivot(canva, dc.id);
    setPivot(pv);
  })(); }, [canva, dc.id]);
  const saveNames = async () => { await mockApi.updateDerivedCanvasNames(canva, dc.id, nameFr.trim() || dc.name_fr, nameAr.trim() || dc.name_ar); await onUpdated(); };
  const updateCol = async (key: string) => { const edit = colEdits[key]; if (!edit) return; await mockApi.updateDerivedCanvasColumnNames(canva, dc.id, key, edit.fr, edit.ar); await onUpdated(); };
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Source colonne</p>
          <h3 className="text-lg font-semibold text-gray-900">{currentLanguage === 'ar' ? dc.name_ar : dc.name_fr}</h3>
        </div>
        <div className="flex gap-2">
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
            {pivot.map(row => (
              <tr key={row.wilaya_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{row.wilaya_name}</td>
                {dc.columns.map(col => (
                  <td key={col.id} className="px-4 py-3 text-sm text-gray-900">{row.counts[col.key] || 0}</td>
                ))}
                <td className="px-4 py-3 text-sm text-gray-900">{Object.values(row.counts).reduce((a,b)=>a+b,0)}</td>
              </tr>
            ))}
            {(() => {
              const totals: Record<string, number> = {};
              for (const c of dc.columns) totals[c.key] = 0;
              for (const r of pivot) {
                for (const k of Object.keys(r.counts)) totals[k] = (totals[k] || 0) + r.counts[k];
              }
              const grand = Object.values(totals).reduce((a,b)=>a+b,0);
              const drbLabel = `${currentLanguage === 'ar' ? 'DRB' : 'DRB'} — ${user?.wilaya_name || 'National'}`;
              return (
                <tr className="bg-emerald-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{drbLabel}</td>
                  {dc.columns.map(col => (
                    <td key={col.id} className="px-4 py-3 text-sm font-semibold text-gray-900">{totals[col.key] || 0}</td>
                  ))}
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{grand}</td>
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
              <input value={colEdits[col.key]?.fr || ''} onChange={(e)=>setColEdits(prev => ({ ...prev, [col.key]: { fr: e.target.value, ar: prev[col.key]?.ar || '' } }))} placeholder="Nom FR" className="px-2 py-1 border rounded" />
              <input value={colEdits[col.key]?.ar || ''} onChange={(e)=>setColEdits(prev => ({ ...prev, [col.key]: { fr: prev[col.key]?.fr || '', ar: e.target.value } }))} placeholder="Nom AR" className="px-2 py-1 border rounded" />
              <button onClick={()=>updateCol(col.key)} className="px-3 py-1 rounded-lg border hover:bg-gray-50">Mettre à jour</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
