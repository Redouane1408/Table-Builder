"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DynamicColumn, BaseCanvaColumn, DerivedCanvas, ServiceContractantMeta, SourceFinancementMeta, PartenaireCocontractantMeta, NationaliteMeta, ObjetMetaCommon } from "@/lib/types";
import Link from "next/link";
import { mockApi } from "@/lib/mockData";
import * as Tabs from "@radix-ui/react-tabs";
import RadixSelect from "@/components/ui/RadixSelect";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function SuperAdminColumnsPage() {
  const [canva, setCanva] = useState<'marches'|'avenants'>('marches');
  const [cols, setCols] = useState<DynamicColumn[]>([]);
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const API_BASE = '/api';
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' } as const;
  const unwrap = async (res: Response) => { const j = await res.json().catch(() => ({})); return typeof (j as any)?.data !== 'undefined' ? (j as any).data : j; };
  const [nameFr, setNameFr] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [dcNameFr, setDcNameFr] = useState("");
  const [dcNameAr, setDcNameAr] = useState("");
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
  const [view, setView] = useState<'columns'|'overview'|'metadata'>('columns');
  const [derived, setDerived] = useState<DerivedCanvas[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attrOptionsMap, setAttrOptionsMap] = useState<Record<string, { fr: string; ar: string; children?: { fr: string; ar: string }[] }[]>>({});
  const [attrOptionsById, setAttrOptionsById] = useState<Record<string, { fr: string; ar: string; children?: { fr: string; ar: string }[] }[]>>({});
  const [drbs, setDrbs] = useState<{ id: string; name_fr: string; name_ar: string }[]>([]);
  const [wilayasByDrb, setWilayasByDrb] = useState<Record<string, { id: string; name_fr: string; name_ar: string }[]>>({});
  const [aggModeByAttr, setAggModeByAttr] = useState<Record<string, 'count'|'amount'>>({});

  useEffect(() => { (async () => {
    const list = await mockApi.listDynamicColumnsFor(canva); setCols(list);
    try {
      const res = await fetch('/api/attributes', { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } });
      const j = await res.json().catch(() => ({}));
      const data = Array.isArray(j?.data) ? j.data : (Array.isArray(j) ? j : []);
      setAttributes(data);
      const mapType = (t: string): DynamicColumn["type"] => {
        const v = (t || '').toLowerCase();
        if (v === 'dropdown') return 'dropdown';
        if (v === 'string') return 'string';
        if (v === 'percentage') return 'percentage';
        if (v.includes('amount')) return 'amount_dzd';
        return 'string';
      };
      const base = data.filter((a:any)=> a.actif).map((a:any)=> ({ id: String(a.id), name: currentLanguage === 'ar' ? (a.attributeAr || a.attributeFr) : (a.attributeFr || a.attributeAr), type: mapType(a.typeAttribute), note: currentLanguage === 'ar' ? (a.canvaTitleAr || a.canvaTitleFr || '') : (a.canvaTitleFr || a.canvaTitleAr || '') }));
      setBaseCols(base);
      const optMap: Record<string, { fr: string; ar: string; children?: { fr: string; ar: string }[] }[]> = {};
      const byIdInitial: Record<string, { fr: string; ar: string; children?: { fr: string; ar: string }[] }[]> = {};
      for (const a of data) {
        const opts = Array.isArray(a.options) ? a.options.map((o:any)=> ({
          fr: o.optionFr,
          ar: o.optionAr,
          children: [
            ...(Array.isArray(o.optionTypeEtablissements) ? o.optionTypeEtablissements.map((t:any)=> ({ fr: t.typeEtablissementFr, ar: t.typeEtablissementAr })) : []),
            ...(Array.isArray(o.optionNationalites) ? o.optionNationalites.map((n:any)=> ({ fr: n.nationaliteFr, ar: n.nationaliteAr })) : []),
            ...(Array.isArray(o.optionTypeCocontractant) ? o.optionTypeCocontractant.map((c:any)=> ({ fr: c.optionFr, ar: c.optionAr })) : []),
          ].filter(Boolean)
        })) : [];
        const frKey = a.attributeFr || '';
        const arKey = a.attributeAr || '';
        if (frKey) optMap[frKey] = opts;
        if (arKey) optMap[arKey] = opts;
        byIdInitial[String(a.id)] = opts;
      }
      setAttrOptionsMap(optMap);
      setAttrOptionsById(byIdInitial);
      try {
        const oRes = await fetch('/api/options', { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } });
        const oj = await oRes.json().catch(() => ({}));
        const optsAll: any[] = Array.isArray(oj?.data) ? oj.data : (Array.isArray(oj) ? oj : []);
        const byAttr: Record<string, any[]> = {};
        for (const o of optsAll) {
          const aid = String(o.attributeId ?? '');
          if (!aid) continue;
          if (!byAttr[aid]) byAttr[aid] = [];
          byAttr[aid].push(o);
        }
        const mergedById: Record<string, { fr: string; ar: string; children?: { fr: string; ar: string }[] }[]> = { ...byIdInitial };
        for (const a of data) {
          const aid = String(a.id);
          const list = byAttr[aid] || [];
          if (list.length) {
            const mapped = list.map((o:any)=> ({
              fr: o.optionFr,
              ar: o.optionAr,
              children: [
                ...(Array.isArray(o.optionTypeEtablissements) ? o.optionTypeEtablissements.map((t:any)=> ({ fr: t.typeEtablissementFr, ar: t.typeEtablissementAr })) : []),
                ...(Array.isArray(o.optionNationalites) ? o.optionNationalites.map((n:any)=> ({ fr: n.nationaliteFr, ar: n.nationaliteAr })) : []),
                ...(Array.isArray(o.optionTypeCocontractant) ? o.optionTypeCocontractant.map((c:any)=> ({ fr: c.optionFr, ar: c.optionAr })) : []),
              ].filter(Boolean)
            }));
            mergedById[aid] = mapped;
            const frKey = a.attributeFr || '';
            const arKey = a.attributeAr || '';
            if (frKey) optMap[frKey] = mapped;
            if (arKey) optMap[arKey] = mapped;
          }
        }
        setAttrOptionsById(mergedById);
        setAttrOptionsMap(optMap);
      } catch {}
      setAttrOptionsById(() => {
        const byId: Record<string, { fr: string; ar: string; children?: { fr: string; ar: string }[] }[]> = {};
        for (const a of data) {
          const key = String(a.id);
          const mapped = optMap[a.attributeFr || a.attributeAr] || [];
          byId[key] = mapped;
        }
        return byId;
      });
    } catch { setBaseCols([]); setAttrOptionsMap({}); }
    const d = await mockApi.listDerivedCanvasesFor(canva); setDerived(d);
    try {
      const drbRes = await fetch('/api/drbs', { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } });
      const dj = await drbRes.json().catch(()=>({}));
      const dlist = Array.isArray(dj?.data) ? dj.data : (Array.isArray(dj) ? dj : []);
      const drbItems = dlist.map((x:any)=> ({ id: String(x.id ?? x.drbId ?? crypto.randomUUID()), name_fr: x.name_fr ?? x.drbFr ?? x.name ?? '', name_ar: x.name_ar ?? x.drbAr ?? '' }));
      setDrbs(drbItems);
      const out: Record<string, { id: string; name_fr: string; name_ar: string }[]> = {};
      for (const drb of drbItems) {
        try {
          const wRes = await fetch(`/api/drbs/${drb.id}/wilayas`, { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } });
          const wj = await wRes.json().catch(()=>({}));
          const wdata = Array.isArray(wj?.data) ? wj.data : (Array.isArray(wj) ? wj : []);
          out[drb.id] = wdata.map((w:any)=> ({ id: String(w.id ?? w.wilayaId ?? crypto.randomUUID()), name_fr: w.wilayaNomFR ?? w.wilayaFr ?? w.name_fr ?? w.name ?? '', name_ar: w.wilayaNomAR ?? w.wilayaAr ?? w.name_ar ?? '' }));
        } catch {}
      }
      setWilayasByDrb(out);
    } catch {}
  })(); }, [canva, currentLanguage]);

  const addOption = () => { const fr = optFr.trim(); const ar = optAr.trim(); if (!fr) return; const key = fr; setOptionsBi(prev => [...prev, { key, name_fr: fr, name_ar: ar || fr }]); setOptFr(""); setOptAr(""); };
  const save = async () => {
    if (!nameFr.trim() && !nameAr.trim()) return;
    const payload = {
      attributeFr: nameFr.trim() || '',
      attributeAr: nameAr.trim() || '',
      canvaTitleFr: dcNameFr.trim() || '',
      canvaTitleAr: dcNameAr.trim() || '',
      typeAttribute: type === 'dropdown' ? 'DropDown' : 'String',
      typeList: canva === 'marches' ? 'MARCHE' : 'AVENANT',
      actif: true,
    };
    try {
      const res = await fetch(`${API_BASE}/attributes`, { method: 'POST', headers, body: JSON.stringify(payload) });
      const created = await unwrap(res);
      const attrId = Number((created as any)?.id ?? (created as any)?.attributeId ?? 0);
      if (type === 'dropdown' && attrId) {
        for (const opt of optionsBi) {
          const body = { optionFr: opt.name_fr, optionAr: opt.name_ar, attributeId: attrId, activatedOption: true };
          await fetch(`${API_BASE}/options`, { method: 'POST', headers, body: JSON.stringify(body) });
        }
      }
      // Reload attributes list to reflect creation
      const aRes = await fetch(`${API_BASE}/attributes`, { headers });
      const j = await aRes.json().catch(() => ({}));
      const data = Array.isArray(j?.data) ? j.data : (Array.isArray(j) ? j : []);
      setAttributes(data);
      const mapType = (t: string): DynamicColumn["type"] => {
        const v = (t || '').toLowerCase();
        if (v === 'dropdown') return 'dropdown';
        if (v === 'string') return 'string';
        if (v === 'percentage') return 'percentage';
        if (v.includes('amount')) return 'amount_dzd';
        return 'string';
      };
      const base = data.filter((a:any)=> a.actif).map((a:any)=> ({ id: String(a.id), name: currentLanguage === 'ar' ? (a.attributeAr || a.attributeFr) : (a.attributeFr || a.attributeAr), type: mapType(a.typeAttribute), note: currentLanguage === 'ar' ? (a.canvaTitleAr || a.canvaTitleFr || '') : (a.canvaTitleFr || a.canvaTitleAr || '') }));
      setBaseCols(base);
      const optMap: Record<string, { fr: string; ar: string; children?: { fr: string; ar: string }[] }[]> = {};
      for (const a of data) {
        const opts = Array.isArray(a.options) ? a.options.map((o:any)=> ({
          fr: o.optionFr,
          ar: o.optionAr,
          children: [
            ...(Array.isArray(o.optionTypeEtablissements) ? o.optionTypeEtablissements.map((t:any)=> ({ fr: t.typeEtablissementFr, ar: t.typeEtablissementAr })) : []),
            ...(Array.isArray(o.optionNationalite) ? o.optionNationalite.map((n:any)=> ({ fr: n.nationaliteFr, ar: n.nationaliteAr })) : []),
            ...(Array.isArray(o.optionTypeCocontractant) ? o.optionTypeCocontractant.map((c:any)=> ({ fr: c.optionFr, ar: c.optionAr })) : []),
          ].filter(Boolean)
        })) : [];
        const frKey = a.attributeFr || '';
        const arKey = a.attributeAr || '';
        if (frKey) optMap[frKey] = opts;
        if (arKey) optMap[arKey] = opts;
      }
      setAttrOptionsMap(optMap);
    } catch {}
    setNameFr(""); setNameAr(""); setDcNameFr(""); setDcNameAr(""); setType("string"); setOptionsBi([]); setOptFr(""); setOptAr("");
  };
  const startEdit = (c: DynamicColumn) => { setEditingId(c.id); setEditName(c.name); setEditType(c.type); setEditOptions(c.options || []); setEditOptionInput(""); setEditNameFr((c as any).name_fr || c.name); setEditNameAr((c as any).name_ar || c.name); setEditOptionsBi((c as any).options_bi || (c.options || []).map(o=>({ key: o, name_fr: o, name_ar: o }))); };
  const addEditOption = () => { const fr = editOptionInput.trim(); const ar = editOptionAr.trim(); if (!fr) return; const key = fr; setEditOptionsBi(prev => [...prev, { key, name_fr: fr, name_ar: ar || fr }]); setEditOptionInput(""); setEditOptionAr(""); };
  const removeEditOption = (opt: string) => { setEditOptionsBi(prev => prev.filter(o => o.key !== opt)); };
  const saveEdit = async () => { if (!editingId) return; const updated = await mockApi.updateDynamicColumnFor(canva, editingId, { name: editName, name_fr: editNameFr, name_ar: editNameAr, type: editType, options: editType === 'dropdown' ? editOptionsBi.map(o=>o.key) : undefined, options_bi: editType === 'dropdown' ? editOptionsBi : undefined } as any); setCols(prev => prev.map(c => c.id === updated.id ? updated : c)); const d = await mockApi.listDerivedCanvasesFor(canva); setDerived(d); setEditingId(null); window.dispatchEvent(new Event('dynamic-columns-changed')); };
  const cancelEdit = () => { setEditingId(null); };
  const deleteCol = async (id: string) => { if (!confirm('Désactiver cette colonne ?')) return; await mockApi.deleteDynamicColumnFor(canva, id); setCols(prev => prev.filter(c => c.id !== id)); const d = await mockApi.listDerivedCanvasesFor(canva); setDerived(d); window.dispatchEvent(new Event('dynamic-columns-changed')); };
  const startBaseEdit = (b: BaseCanvaColumn) => { setBaseEditingId(b.id); setBaseEditName(b.name); setBaseEditType(b.type); setBaseEditNote(b.note || ""); };
  const saveBaseEdit = async () => { if (!baseEditingId) return; const updated = await mockApi.updateBaseColumn(baseEditingId, { name: baseEditName, type: baseEditType, note: baseEditNote }); setBaseCols(prev => prev.map(b => b.id === updated.id ? updated : b)); setBaseEditingId(null); window.dispatchEvent(new Event('base-columns-changed')); };
  const cancelBaseEdit = () => { setBaseEditingId(null); };
  const deleteBaseCol = async (id: string) => { if (!confirm('Supprimer cette colonne du canva ?')) return; await mockApi.deleteBaseColumn(id); setBaseCols(prev => prev.filter(b => b.id !== id)); window.dispatchEvent(new Event('base-columns-changed')); };
  const clearBaseColumns = async () => { if (!confirm('Supprimer toutes les colonnes existantes ?')) return; for (const b of baseCols) { try { await mockApi.deleteBaseColumn(b.id); } catch {} } setBaseCols([]); window.dispatchEvent(new Event('base-columns-changed')); };

  const ServiceContractantOptionsViewer: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    useEffect(() => { (async () => {
      const API_BASE = '/api';
      const headers = { 'Content-Type': 'application/json', Accept: 'application/json' } as const;
      const unwrap = async (res: Response) => { const j = await res.json().catch(() => ({})); return typeof (j as any)?.data !== 'undefined' ? (j as any).data : j; };
      try { const res = await fetch(`${API_BASE}/service-contractants`, { headers }); const data = await unwrap(res); const list = Array.isArray(data) ? data.map((s:any)=> ({ id: String(s.id ?? crypto.randomUUID()), denomination: s.denomination ?? '', sourceFr: s.sourceFinancement?.sourceFinancementFr ?? '' })) : []; setItems(list); } catch {}
    })(); }, []);
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map(it => (
          <span key={it.id} className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">{it.denomination} • {it.sourceFr}</span>
        ))}
        {items.length === 0 && (<span className="text-xs text-gray-500">Aucune option chargée depuis l'API</span>)}
      </div>
    );
  };

  return (
    <ProtectedRoute allowedRoles={['DGB','DRB']}>
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
            <Tabs.Trigger value="metadata" className={`px-4 py-2 rounded-md ${view==='metadata' ? 'bg-white shadow text-gray-900' : 'hover:bg-gray-200'}`}>Metadonnées</Tabs.Trigger>
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
                  {type === 'dropdown' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input value={dcNameFr} onChange={(e)=>setDcNameFr(e.target.value)} placeholder="Titre FR du canvas dérivé" className="w-full px-3 py-2 border rounded-lg" />
                      <input value={dcNameAr} onChange={(e)=>setDcNameAr(e.target.value)} placeholder="Titre AR du canvas dérivé" className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                  )}
                  <RadixSelect value={type as any} onChange={(v)=>setType(v as DynamicColumn["type"])} options={[
                    { label: 'Text', value: 'string' },
                    { label: 'Liste déroulante', value: 'dropdown' },
                    { label: 'percentage(%)', value: 'percentage' },
                    { label: 'Montant Dinars', value: 'amount_dzd' },
                    { label: 'Montant Devise', value: 'amount_fx' },
                  ] as any} />
                  {type === 'dropdown' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input value={optFr} onChange={(e) => setOptFr(e.target.value)} placeholder="Option FR" className="px-3 py-2 border rounded-lg" />
                        <input value={optAr} onChange={(e) => setOptAr(e.target.value)} placeholder="Option AR" className="px-3 py-2 border rounded-lg" />
                        <button onClick={addOption} title="Ajouter" className="px-3 py-2 rounded-lg border hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {optionsBi.map((opt) => (<span key={opt.key} className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">{opt.name_fr} • {opt.name_ar}</span>))}
                      </div>
                    </div>
                  )}
                    <div className="flex justify-end">
                      <button onClick={save} aria-label="Créer" title="Créer" className="p-2 rounded-lg btn-brand"><Plus className="w-4 h-4" /></button>
                    </div>
                </div>
              </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Colonnes existantes</h3>
                      <button onClick={clearBaseColumns} className="px-3 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50">Supprimer tout</button>
                    </div>
                    <div className="space-y-3">
                      {baseCols.map((b) => (
                        <div key={b.id} className="border rounded-lg px-3 py-2">
                          {baseEditingId === b.id ? (
                            <div className="space-y-2">
                              <input value={baseEditName} onChange={(e)=>setBaseEditName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                              <RadixSelect value={baseEditType as any} onChange={(v)=>setBaseEditType(v as DynamicColumn["type"])} options={[
                                { label: 'Text', value: 'string' },
                                { label: 'Liste déroulante', value: 'dropdown' },
                                { label: 'percentage(%)', value: 'percentage' },
                                { label: 'Montant Dinars', value: 'amount_dzd' },
                                { label: 'Montant Devise', value: 'amount_fx' },
                              ] as any} />
                              <input value={baseEditNote} onChange={(e)=>setBaseEditNote(e.target.value)} placeholder="Note" className="w-full px-3 py-2 border rounded-lg" />
                              {baseEditType === 'dropdown' && (
                                <BaseOptionsEditor canva={canva} columnName={baseEditName} />
                              )}
                              <div className="flex gap-2 justify-end">
                                <button onClick={saveBaseEdit} aria-label="Enregistrer" title="Enregistrer" className="p-2 rounded-lg btn-brand"><Plus className="w-4 h-4" /></button>
                                <button onClick={cancelBaseEdit} aria-label="Annuler" title="Annuler" className="p-2 rounded-lg border hover:bg-gray-50">×</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{b.name}</p>
                                <p className="text-xs text-gray-600">{b.type}{b.note ? ` • ${b.note}` : ''}</p>
                                {b.type === 'dropdown' && (
                                  <AttributeOptionsViewer columnName={b.name} options={attrOptionsMap[b.name] || []} />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={()=>startBaseEdit(b)} aria-label="Modifier" title="Modifier" className="p-2 rounded-lg border hover:bg-gray-50"><Pencil className="w-4 h-4" /></button>
                                <button onClick={()=>deleteBaseCol(b.id)} aria-label="Supprimer" title="Supprimer" className="p-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
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
                          <RadixSelect value={editType as any} onChange={(v)=>setEditType(v as DynamicColumn["type"])} options={[
                            { label: 'Text', value: 'string' },
                            { label: 'Liste déroulante', value: 'dropdown' },
                            { label: 'percentage(%)', value: 'percentage' },
                            { label: 'Montant Dinars', value: 'amount_dzd' },
                            { label: 'Montant Devise', value: 'amount_fx' },
                          ] as any} />
                          {editType === 'dropdown' && (
                            <div className="space-y-2">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <input value={editOptionInput} onChange={(e)=>setEditOptionInput(e.target.value)} placeholder="Option FR" className="px-3 py-2 border rounded-lg" />
                                <input value={editOptionAr} onChange={(e)=>setEditOptionAr(e.target.value)} placeholder="Option AR" className="px-3 py-2 border rounded-lg" />
                                <button onClick={addEditOption} aria-label="Ajouter" title="Ajouter" className="p-2 rounded-lg border hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
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
                                <button onClick={saveEdit} aria-label="Enregistrer" title="Enregistrer" className="p-2 rounded-lg btn-brand"><Plus className="w-4 h-4" /></button>
                                <button onClick={cancelEdit} aria-label="Annuler" title="Annuler" className="p-2 rounded-lg border hover:bg-gray-50">×</button>
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
                                <button onClick={()=>startEdit(c)} aria-label="Modifier" title="Modifier" className="p-2 rounded-lg border hover:bg-gray-50"><Pencil className="w-4 h-4" /></button>
                                <button onClick={()=>deleteCol(c.id)} aria-label="Supprimer" title="Supprimer" className="p-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
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
                {attributes
                  .filter((a:any)=> String(a.typeAttribute).toLowerCase()==='dropdown' && a.actif)
                  .filter((a:any)=> {
                    const fr = String(a.attributeFr || '').toLowerCase();
                    const ar = String(a.attributeAr || '').toLowerCase();
                    return !(fr.includes('cocontractant') || fr.includes('partenaire') || ar.includes('cocontractant') || ar.includes('partenaire'));
                  })
                  .map((a:any)=>{
                  const attrId = String(a.id);
                  const label = currentLanguage==='ar' ? (a.attributeAr || a.attributeFr) : (a.attributeFr || a.attributeAr);
                  const options = attrOptionsById[attrId] || [];
                  const mode = aggModeByAttr[attrId] || 'count';
                  const isDGB = String((user as any)?.role || '').toUpperCase() === 'DGB';
                  const userDrbId = String((user as any)?.drbId ?? (user as any)?.drb_id ?? '');
                  const visibleDrbs = isDGB ? drbs : drbs.filter(d => d.id === userDrbId || !userDrbId);
                  return (
                    <div key={attrId} className="glass-card rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Mode</span>
                          <div className="flex items-center rounded-full border border-gray-300 overflow-hidden">
                            <button onClick={()=>setAggModeByAttr(prev=>({ ...prev, [attrId]: 'count' }))} className={`px-3 py-1 text-xs ${mode==='count' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>Count</button>
                            <button onClick={()=>setAggModeByAttr(prev=>({ ...prev, [attrId]: 'amount' }))} className={`px-3 py-1 text-xs ${mode==='amount' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>Amount</button>
                          </div>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50"><tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{isDGB ? 'DRB' : 'Wilaya'}</th>
                            {options.map((o,idx)=>(<th key={idx} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{currentLanguage==='ar' ? o.ar : o.fr}</th>))}
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sommes</th>
                          </tr></thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {visibleDrbs.flatMap(drb => {
                              const wils = wilayasByDrb[drb.id] || [];
                              if (isDGB) {
                                // Single row per DRB
                                return [{ type: 'drb', drb }];
                              }
                              // Rows per wilaya for this DRB, plus a DRB summary row
                              return [
                                ...wils.map(w => ({ type: 'wilaya', drb, w })),
                                { type: 'sum', drb }
                              ];
                            }).map((row, idx) => (
                              <tr key={`row-${attrId}-${idx}`} className={row.type==='sum' ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                                <td className="px-3 py-2 whitespace-nowrap font-medium">
                                  {row.type==='drb' ? (currentLanguage==='ar' ? (row as any).drb.name_ar : (row as any).drb.name_fr)
                                    : row.type==='wilaya' ? (currentLanguage==='ar' ? (row as any).w.name_ar : (row as any).w.name_fr)
                                    : (currentLanguage==='ar' ? (row as any).drb.name_ar : (row as any).drb.name_fr)}
                                </td>
                                {options.map((o,ii)=>(<td key={`cell-${ii}`} className="px-3 py-2">–</td>))}
                                <td className="px-3 py-2">–</td>
                              </tr>
                            ))}
                            {/* Final total row for whole table */}
                            <tr className="bg-gray-100">
                              <td className="px-3 py-2 font-semibold">Sommes</td>
                              {options.map((o,ii)=>(<td key={`final-${ii}`} className="px-3 py-2 font-semibold">–</td>))}
                              <td className="px-3 py-2 font-semibold">–</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Tabs.Content>
          <Tabs.Content value="metadata">
            <MetadataManager />
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

function AttributeOptionsViewer({ columnName, options }: { columnName: string; options: { fr: string; ar: string; children?: { fr: string; ar: string }[] }[] }) {
  if (!options.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((o, idx) => (
        <span key={`${columnName}-${idx}`} className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-700 border border-gray-200">{o.fr} • {o.ar}</span>
      ))}
      {options.flatMap((o, idx) => (o.children || []).map((c, jdx) => (
        <span key={`${columnName}-${idx}-child-${jdx}`} className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">{c.fr} • {c.ar}</span>
      )))}
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
  const [pivotCounts, setPivotCounts] = React.useState<{ wilaya_id: string; wilaya_name: string; counts: Record<string, number> }[]>([]);
  const [pivotAmounts, setPivotAmounts] = React.useState<{ wilaya_id: string; wilaya_name: string; counts: Record<string, number> }[]>([]);
  const [metric, setMetric] = React.useState<'count'|'amount'>('count');
  const [colEdits, setColEdits] = React.useState<Record<string, { fr: string; ar: string }>>(() => Object.fromEntries(dc.columns.map(c => [c.key, { fr: c.name_fr, ar: c.name_ar }])));
  React.useEffect(() => { (async () => {
    const list = await mockApi.getDerivedCanvasCounts(canva, dc.id);
    const map: Record<string, number> = {};
    for (const item of list) map[item.key] = item.count;
    setCounts(map);
    const pvC = await mockApi.getDerivedCanvasPivot(canva, dc.id);
    setPivotCounts(pvC);
    const pvA = await mockApi.getDerivedCanvasPivotAmounts(canva, dc.id);
    setPivotAmounts(pvA);
  })(); }, [canva, dc.id]);
  const saveNames = async () => { await mockApi.updateDerivedCanvasNames(canva, dc.id, nameFr.trim() || dc.name_fr, nameAr.trim() || dc.name_ar); await onUpdated(); };
  const updateCol = async (key: string) => { const edit = colEdits[key]; if (!edit) return; await mockApi.updateDerivedCanvasColumnNames(canva, dc.id, key, edit.fr, edit.ar); await onUpdated(); };
  const formatAmount = (n: number) => `${Math.round(n).toLocaleString()} DZD`;
  const viewRows = metric === 'count' ? pivotCounts : pivotAmounts;
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Source colonne</p>
          <h3 className="text-lg font-semibold text-gray-900">{currentLanguage === 'ar' ? dc.name_ar : dc.name_fr}</h3>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-xs text-gray-600">Counts</span>
          <button
            role="switch"
            aria-checked={metric==='amount'}
            onClick={()=>setMetric(metric==='count' ? 'amount' : 'count')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${metric==='amount' ? 'bg-blue-600 border-blue-600' : 'bg-gray-300 border-gray-300'}`}
            title={metric==='amount' ? 'Afficher Amounts' : 'Afficher Counts'}
          >
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
            {viewRows.map(row => (
              <tr key={row.wilaya_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{row.wilaya_name}</td>
                {dc.columns.map(col => (
                  <td key={col.id} className="px-4 py-3 text-sm text-gray-900">{metric==='count' ? (row.counts[col.key] || 0) : formatAmount(row.counts[col.key] || 0)}</td>
                ))}
                <td className="px-4 py-3 text-sm text-gray-900">{metric==='count' ? Object.values(row.counts).reduce((a,b)=>a+b,0) : formatAmount(Object.values(row.counts).reduce((a,b)=>a+b,0))}</td>
              </tr>
            ))}
            {(() => {
              const totals: Record<string, number> = {};
              for (const c of dc.columns) totals[c.key] = 0;
              for (const r of viewRows) {
                for (const k of Object.keys(r.counts)) totals[k] = (totals[k] || 0) + r.counts[k];
              }
              const grand = Object.values(totals).reduce((a,b)=>a+b,0);
              const drbLabel = `${currentLanguage === 'ar' ? 'DRB' : 'DRB'} — ${user?.wilaya_name || 'National'}`;
              return (
                <tr className="bg-emerald-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{drbLabel}</td>
                  {dc.columns.map(col => (
                    <td key={col.id} className="px-4 py-3 text-sm font-semibold text-gray-900">{metric==='count' ? (totals[col.key] || 0) : formatAmount(totals[col.key] || 0)}</td>
                  ))}
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{metric==='count' ? grand : formatAmount(grand)}</td>
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

function MetadataManager() {
  const [drbs, setDrbs] = React.useState<any[]>([]);
  const [wilayas, setWilayas] = React.useState<any[]>([]);
  const [communes, setCommunes] = React.useState<any[]>([]);
  const [portefeuilles, setPortefeuilles] = React.useState<any[]>([]);
  const [programmes, setProgrammes] = React.useState<any[]>([]);
  const [sousProgrammes, setSousProgrammes] = React.useState<any[]>([]);
  const [actions, setActions] = React.useState<any[]>([]);
  const [titres, setTitres] = React.useState<any[]>([]);
  const [operations, setOperations] = React.useState<any[]>([]);
  const [newDrbFr, setNewDrbFr] = React.useState("");
  const [newDrbAr, setNewDrbAr] = React.useState("");
  const [newWilayaFr, setNewWilayaFr] = React.useState("");
  const [newWilayaAr, setNewWilayaAr] = React.useState("");
  const [newWilayaDrb, setNewWilayaDrb] = React.useState<string | undefined>(undefined);
  const [newCommuneFr, setNewCommuneFr] = React.useState("");
  const [newCommuneAr, setNewCommuneAr] = React.useState("");
  const [newCommuneWilaya, setNewCommuneWilaya] = React.useState<string | undefined>(undefined);
  const [qWilaya, setQWilaya] = React.useState("");
  const [qCommune, setQCommune] = React.useState("");
  const [newPfFr, setNewPfFr] = React.useState("");
  const [newPfAr, setNewPfAr] = React.useState("");
  const [newPfCode, setNewPfCode] = React.useState("");
  const [newPfTitreIds, setNewPfTitreIds] = React.useState<string[]>([]);
  const [newProgFr, setNewProgFr] = React.useState("");
  const [newProgAr, setNewProgAr] = React.useState("");
  const [newProgPf, setNewProgPf] = React.useState<string | undefined>(undefined);
  const [newProgCode, setNewProgCode] = React.useState("");
  const [newSpFr, setNewSpFr] = React.useState("");
  const [newSpAr, setNewSpAr] = React.useState("");
  const [newSpProg, setNewSpProg] = React.useState<string | undefined>(undefined);
  const [newSpCode, setNewSpCode] = React.useState("");
  const [newActionName, setNewActionName] = React.useState("");
  const [newActionSp, setNewActionSp] = React.useState<string | undefined>(undefined);
  const [titrePf, setTitrePf] = React.useState<string | undefined>(undefined);
  const [titreInputs, setTitreInputs] = React.useState<Record<number, { fr: string; ar: string; code: string }>>({});
  const [titreAddNum, setTitreAddNum] = React.useState<string | undefined>(undefined);
  const [titreAddFr, setTitreAddFr] = React.useState("");
  const [titreAddAr, setTitreAddAr] = React.useState("");
  const [titreAddCode, setTitreAddCode] = React.useState("");
  const [newOpSp, setNewOpSp] = React.useState<string | undefined>(undefined);
  const [newOpNumber, setNewOpNumber] = React.useState<number | undefined>(undefined);
  const [communesWilayaId, setCommunesWilayaId] = React.useState<string | undefined>(undefined);
  const api = mockApi as any;
  const [programmesPfFilter, setProgrammesPfFilter] = React.useState<string | undefined>(undefined);
  const [sousProgProgFilter, setSousProgProgFilter] = React.useState<string | undefined>(undefined);
  const [titresMaster, setTitresMaster] = React.useState<any[]>([]);
  const [newTitreFr, setNewTitreFr] = React.useState("");
  const [newTitreAr, setNewTitreAr] = React.useState("");
  const [newTitreCode, setNewTitreCode] = React.useState("");

  const [serviceContractants, setServiceContractants] = React.useState<ServiceContractantMeta[]>([]);
  const [scSources, setScSources] = React.useState<SourceFinancementMeta[]>([]);
  const [newScName, setNewScName] = React.useState("");
  const [newScSourceId, setNewScSourceId] = React.useState<string | undefined>(undefined);
  const [newScTypeEtabId, setNewScTypeEtabId] = React.useState<string | undefined>(undefined);
  const [partners, setPartners] = React.useState<PartenaireCocontractantMeta[]>([]);
  const [nationalites, setNationalites] = React.useState<NationaliteMeta[]>([]);
  const [newPartnerName, setNewPartnerName] = React.useState("");
  const [newPartnerType, setNewPartnerType] = React.useState<'interne'|'externe' | undefined>(undefined);
  const [newPartnerNatId, setNewPartnerNatId] = React.useState<string | undefined>(undefined);
  const [objets, setObjets] = React.useState<ObjetMetaCommon[]>([]);
  const [newObjetContent, setNewObjetContent] = React.useState("");

  const API_BASE = "/api";
  const headers = { "Content-Type": "application/json", Accept: "application/json" } as const;
  const unwrap = async (res: Response) => {
    const j = await res.json().catch(() => ({}));
    return typeof j?.data !== 'undefined' ? j.data : j;
  };
  const loadPortefeuilles = async () => {
    try {
      const res = await fetch(`${API_BASE}/portefeuilles`, { headers });
      const data = await unwrap(res);
      if (!Array.isArray(titresMaster) || titresMaster.length === 0) {
        await loadTitresMaster();
      }
      const list = Array.isArray(data) ? data.map((p: any) => {
        const ids: string[] = Array.isArray(p.titreIds) ? p.titreIds.map((x:any)=>String(x)) : [];
        const mapped = ids.map(id => titresMaster.find((t:any)=> String(t.id)===String(id))).filter(Boolean).map((t:any)=> ({ id: t.id, code: t.code, name_fr: t.name_fr, name_ar: t.name_ar }));
        return { id: String(p.id ?? crypto.randomUUID()), name_fr: p.nameFr ?? p.name_fr ?? '', name_ar: p.nameAr ?? p.name_ar ?? '', code: p.code ?? '', titre_ids: ids, liste_titres: mapped };
      }) : [];
      setPortefeuilles(list);
      setProgrammesPfFilter(prev => prev ?? list[0]?.id);
    } catch {}
  };
  const loadProgrammesForPf = async (pfId?: string) => {
    if (!pfId) { setProgrammes([]); return; }
    try {
      const res = await fetch(`${API_BASE}/portefeuilles/getProgrammesByPortfeuilleId/${pfId}`, { headers });
      const data = await unwrap(res);
      const list = Array.isArray(data) ? data.map((p: any) => ({ id: String(p.id ?? crypto.randomUUID()), portefeuille_id: String(p.portefeuilleId ?? pfId), name_fr: p.programmeNomFR ?? p.name_fr ?? '', name_ar: p.programmeNomAR ?? p.name_ar ?? '', code: p.programmeCode ?? '' })) : [];
      setProgrammes(list);
      setSousProgProgFilter(prev => prev ?? list[0]?.id);
    } catch {}
  };
  const loadSousProgrammesFor = async (progId?: string) => {
    if (!progId) { setSousProgrammes([]); return; }
    try {
      const programmeId = String(Number(progId));
      const res = await fetch(`${API_BASE}/sous-programmes/programme/${programmeId}`, { headers });
      const data = await unwrap(res);
      const arr = Array.isArray(data) ? data : (Array.isArray((data as any)?.data) ? (data as any).data : []);
      const list = arr.map((s: any) => ({ id: String(s.id ?? crypto.randomUUID()), programme_id: String(s.programmeId ?? progId), name_fr: s.nomFr ?? s.programmeNomFr ?? s.name_fr ?? '', name_ar: s.nomAr ?? s.name_ar ?? '', code: s.code ?? '' }));
      setSousProgrammes(list);
    } catch {}
  };
  const loadTitresMaster = async () => {
    try {
      const res = await fetch(`${API_BASE}/titres`, { headers });
      const data = await unwrap(res);
      const list = Array.isArray(data) ? data.map((t: any) => ({ id: String(t.id ?? crypto.randomUUID()), code: String(t.code ?? ''), name_fr: t.nomFr ?? '', name_ar: t.nomAr ?? '' })) : [];
      setTitresMaster(list);
    } catch {}
  };
  const loadServiceContractants = async () => {
    try {
      const res = await fetch(`${API_BASE}/service-contractants`, { headers });
      const data = await unwrap(res);
      const list = Array.isArray(data) ? data : (Array.isArray((data as any)?.data) ? (data as any).data : []);
      const scList: ServiceContractantMeta[] = list.map((s:any)=> ({ id: String(s.id ?? crypto.randomUUID()), denomination: s.denomination ?? s.name ?? '', sourceFinancement: { id: String(s.sourceFinancement?.id ?? ''), sourceFinancementFr: s.sourceFinancement?.sourceFinancementFr ?? '', sourceFinancementAr: s.sourceFinancement?.sourceFinancementAr ?? '', typesEtablissementPublic: Array.isArray(s.sourceFinancement?.typesEtablissementPublic) ? s.sourceFinancement.typesEtablissementPublic.map((t:any)=> ({ id: String(t.id ?? crypto.randomUUID()), nomFr: t.nomFr ?? '', nomAr: t.nomAr ?? '' })) : undefined }, typeEtablissementId: s.typeEtablissementId ? String(s.typeEtablissementId) : undefined }));
      setServiceContractants(scList);
      const sources = (data?.listesourceFinancement as any[]) || [];
      const uniq: SourceFinancementMeta[] = Array.isArray(sources) && sources.length>0 ? sources.map((x:any)=> ({ id: String(x.id ?? crypto.randomUUID()), sourceFinancementFr: x.sourceFinancementFr ?? '', sourceFinancementAr: x.sourceFinancementAr ?? '', typesEtablissementPublic: Array.isArray(x.typesEtablissementPublic) ? x.typesEtablissementPublic.map((t:any)=> ({ id: String(t.id ?? crypto.randomUUID()), nomFr: t.nomFr ?? '', nomAr: t.nomAr ?? '' })) : [] })) : Array.from(new Map(scList.map((s:any)=>[s.sourceFinancement.id, { id: s.sourceFinancement.id, sourceFinancementFr: s.sourceFinancement.sourceFinancementFr, sourceFinancementAr: s.sourceFinancement.sourceFinancementAr, typesEtablissementPublic: [] }])).values()) as SourceFinancementMeta[];
      setScSources(uniq);
    } catch {}
  };
  const addServiceContractant = async () => { if (!newScName.trim() || !newScSourceId) return; const body = { denomination: newScName.trim(), sourceFinancementId: Number(newScSourceId), typeEtablissementId: newScTypeEtabId ? Number(newScTypeEtabId) : undefined }; const res = await fetch(`${API_BASE}/service-contractants`, { method: 'POST', headers, body: JSON.stringify(body) }); await unwrap(res); await loadServiceContractants(); setNewScName(""); setNewScSourceId(undefined); setNewScTypeEtabId(undefined); };
  const updateServiceContractant = async (id: string, patch: any) => { const body = { denomination: patch.denomination, sourceFinancementId: patch.sourceId ? Number(patch.sourceId) : undefined, typeEtablissementId: patch.typeEtablissementId ? Number(patch.typeEtablissementId) : undefined }; const res = await fetch(`${API_BASE}/service-contractants/${id}`, { method: 'PATCH', headers, body: JSON.stringify(body) }); await unwrap(res); await loadServiceContractants(); };
  const deleteServiceContractant = async (id: string) => { await fetch(`${API_BASE}/service-contractants/${id}`, { method: 'DELETE', headers, body: JSON.stringify({ id: Number(id) }) }); setServiceContractants(prev => prev.filter(x => x.id !== id)); };
  const loadPartners = async () => { try { const res = await fetch(`${API_BASE}/partenaires-cocontractants`, { headers }); const data = await unwrap(res); const list = Array.isArray(data) ? data : (Array.isArray((data as any)?.data) ? (data as any).data : []); setPartners(list.map((p:any)=> ({ id: String(p.id ?? crypto.randomUUID()), name: p.name ?? '', type_cocontractant: (p.type_cocontractant ?? p.typeCocontractant ?? 'interne') as any, nationaliteId: p.nationaliteId ? String(p.nationaliteId) : undefined }))); const nat = (data?.liste_of_type_cocontractant as any[]) || []; const natList: NationaliteMeta[] = Array.isArray(nat) ? nat.map((n:any)=> ({ id: String(n.id ?? crypto.randomUUID()), nameFr: n.nameFr ?? n.nomFr ?? '', nameAr: n.nameAr ?? n.nomAr ?? '' })) : []; setNationalites(natList); } catch {} };
  const addPartner = async () => { if (!newPartnerName.trim() || !newPartnerType) return; const body = { name: newPartnerName.trim(), type_cocontractant: newPartnerType, nationaliteId: newPartnerType==='externe' && newPartnerNatId ? Number(newPartnerNatId) : undefined }; const res = await fetch(`${API_BASE}/partenaires-cocontractants`, { method: 'POST', headers, body: JSON.stringify(body) }); await unwrap(res); await loadPartners(); setNewPartnerName(""); setNewPartnerType(undefined); setNewPartnerNatId(undefined); };
  const updatePartner = async (id: string, patch: any) => { const res = await fetch(`${API_BASE}/partenaires-cocontractants/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ name: patch.name, type_cocontractant: patch.type_cocontractant ?? patch.type, nationaliteId: patch.nationaliteId ? Number(patch.nationaliteId) : undefined }) }); await unwrap(res); await loadPartners(); };
  const deletePartner = async (id: string) => { await fetch(`${API_BASE}/partenaires-cocontractants/${id}`, { method: 'DELETE', headers, body: JSON.stringify({ id: Number(id) }) }); setPartners(prev => prev.filter(x => x.id !== id)); };
  const loadObjets = async () => { try { const res = await fetch(`${API_BASE}/objets`, { headers }); const data = await unwrap(res); const list = Array.isArray(data) ? data : (Array.isArray((data as any)?.data) ? (data as any).data : []); setObjets(list.map((o:any)=> ({ id: String(o.id ?? crypto.randomUUID()), content: o.content ?? o.nom ?? '' }))); } catch {} };
  const addObjet = async () => { if (!newObjetContent.trim()) return; const res = await fetch(`${API_BASE}/objets`, { method: 'POST', headers, body: JSON.stringify({ content: newObjetContent.trim() }) }); await unwrap(res); await loadObjets(); setNewObjetContent(""); };
  const updateObjet = async (id: string, patch: any) => { const res = await fetch(`${API_BASE}/objets/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ content: patch.content }) }); await unwrap(res); await loadObjets(); };
  const deleteObjet = async (id: string) => { await fetch(`${API_BASE}/objets/${id}`, { method: 'DELETE', headers, body: JSON.stringify({ id: Number(id) }) }); setObjets(prev => prev.filter(x => x.id !== id)); };
  const loadCommunesForWilaya = async (wilayaId?: string) => {
    if (!wilayaId) { setCommunes([]); return; }
    const res = await fetch(`${API_BASE}/wilayas/${wilayaId}/communes`, { headers });
    const data = await unwrap(res);
    setCommunes(Array.isArray(data) ? data.map((c: any) => ({ id: String(c.id ?? c.communeId ?? crypto.randomUUID()), wilaya_id: String(c.wilayaId ?? c.wilaya_id ?? ''), name_fr: c.communeFr ?? c.name_fr ?? c.name ?? '', name_ar: c.communeAr ?? c.name_ar ?? '' })) : []);
  };
  React.useEffect(() => { (async () => {
    try {
      const drbRes = await fetch(`${API_BASE}/drbs`, { headers });
      const drbData = await unwrap(drbRes);
      setDrbs(Array.isArray(drbData) ? drbData.map((d: any) => ({ id: String(d.id ?? d.drbId ?? crypto.randomUUID()), name_fr: d.name_fr || d.drbFr || d.name || '', name_ar: d.name_ar || d.drbAr || '' })) : []);
    } catch {}
    try {
      const wilRes = await fetch(`${API_BASE}/wilayas`, { headers });
      const wilData = await unwrap(wilRes);
      const mapped = Array.isArray(wilData) ? wilData.map((w: any) => ({ id: String(w.id ?? w.wilayaId ?? crypto.randomUUID()), name_fr: w.wilayaNomFR ?? w.name_fr ?? w.wilayaFr ?? w.name ?? '', name_ar: w.wilayaNomAR ?? w.name_ar ?? w.wilayaAr ?? '', drb_id: String(w.drbId ?? w.drb_id ?? '') })) : [];
      setWilayas(mapped);
      setCommunesWilayaId(mapped[0]?.id);
    } catch {}
    try {
      await loadPortefeuilles();
      const acts: any[] = (await api.listActions?.()) ?? [];
      setActions(acts.map((a: any) => ({ id: a.id, sous_programme_id: a.sous_programme_id, name: a.name })));
      const tts: any[] = (await api.listTitres?.()) ?? [];
      setTitres(tts.map((t: any) => ({ id: t.id, portefeuille_id: t.portefeuille_id, numero: t.numero, name_fr: t.name_fr, name_ar: t.name_ar, code: t.code })));
      const ops: any[] = (await api.listOperations?.()) ?? [];
      setOperations(ops.map((o: any) => ({ id: o.id, sous_programme_id: o.sous_programme_id, number: o.number })));
      await loadTitresMaster();
      await loadServiceContractants();
    } catch {}
  })(); }, []);

  React.useEffect(() => { (async () => { await loadCommunesForWilaya(communesWilayaId); })(); }, [communesWilayaId]);
  React.useEffect(() => { (async () => { await loadProgrammesForPf(programmesPfFilter); })(); }, [programmesPfFilter]);
  React.useEffect(() => { (async () => { await loadSousProgrammesFor(sousProgProgFilter); })(); }, [sousProgProgFilter]);

  const addDrb = async () => { const res = await fetch(`${API_BASE}/drbs`, { method: 'POST', headers, body: JSON.stringify({ drbFr: newDrbFr.trim(), drbAr: newDrbAr.trim() }) }); const d = await unwrap(res); setDrbs(prev => [...prev, { id: d.id, name_fr: d.drbFr || d.name_fr || newDrbFr, name_ar: d.drbAr || d.name_ar || newDrbAr }]); setNewDrbFr(""); setNewDrbAr(""); };
  const updateDrb = async (id: string, fr: string, ar: string) => { const res = await fetch(`${API_BASE}/drbs/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ id, drbFr: fr, drbAr: ar }) }); const d = await unwrap(res); setDrbs(prev => prev.map(x => x.id === id ? { ...x, name_fr: d.drbFr || fr, name_ar: d.drbAr || ar } : x)); };
  const deleteDrb = async (id: string) => { await fetch(`${API_BASE}/drbs/${id}`, { method: 'DELETE', headers, body: JSON.stringify({ id }) }); setDrbs(prev => prev.filter(x => x.id !== id)); const wilRes = await fetch(`${API_BASE}/wilayas`, { headers }); const wilData = await unwrap(wilRes); setWilayas(Array.isArray(wilData) ? wilData.map((w: any) => ({ id: w.id ?? w.wilayaId, name_fr: w.wilayaNomFR ?? w.wilayaFr ?? w.name_fr ?? w.name, name_ar: w.wilayaNomAR ?? w.wilayaAr ?? w.name_ar ?? '', drb_id: w.drbId ?? w.drb_id })) : []); };

  const addWilaya = async () => { if (!newWilayaFr.trim()) return; const res = await fetch(`${API_BASE}/wilayas`, { method: 'POST', headers, body: JSON.stringify({ wilayaNomFR: newWilayaFr.trim(), wilayaNomAR: newWilayaAr.trim(), drbId: Number(newWilayaDrb) }) }); const w = await unwrap(res); setWilayas(prev => [...prev, { id: String(w.id ?? w.wilayaId ?? crypto.randomUUID()), name_fr: w.wilayaNomFR ?? w.wilayaFr ?? w.name_fr ?? newWilayaFr, name_ar: w.wilayaNomAR ?? w.wilayaAr ?? w.name_ar ?? newWilayaAr, drb_id: String(w.drbId ?? w.drb_id ?? newWilayaDrb ?? '') }]); setNewWilayaFr(""); setNewWilayaAr(""); setNewWilayaDrb(undefined); };
  const updateWilaya = async (id: string, patch: any) => { const res = await fetch(`${API_BASE}/wilayas/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ id: Number(id), wilayaNomFR: patch.name_fr, wilayaNomAR: patch.name_ar, drbId: Number(patch.drb_id) }) }); const w = await unwrap(res); setWilayas(prev => prev.map(x => x.id === id ? { ...x, name_fr: w.wilayaNomFR ?? w.wilayaFr ?? x.name_fr, name_ar: w.wilayaNomAR ?? w.wilayaAr ?? x.name_ar, drb_id: String(w.drbId ?? x.drb_id ?? '') } : x)); };
  const deleteWilaya = async (id: string) => { await fetch(`${API_BASE}/wilayas/${id}`, { method: 'DELETE', headers, body: JSON.stringify({ id }) }); setWilayas(prev => prev.filter(x => x.id !== id)); await loadCommunesForWilaya(communesWilayaId); };

  const addCommune = async () => {
    if (!newCommuneWilaya || !newCommuneFr.trim()) return;
    const res = await fetch(`${API_BASE}/communes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ communeFr: newCommuneFr.trim(), communeAr: newCommuneAr.trim(), wilayaId: Number(newCommuneWilaya) })
    });
    const c = await unwrap(res);
    const id = String(c?.id ?? c?.communeId ?? crypto.randomUUID());
    if (String(c.wilayaId ?? newCommuneWilaya) === String(communesWilayaId)) {
      setCommunes(prev => [...prev, { id, wilaya_id: String(c.wilayaId ?? newCommuneWilaya), name_fr: c.communeFr || newCommuneFr, name_ar: c.communeAr || newCommuneAr }]);
    }
    setNewCommuneFr("");
    setNewCommuneAr("");
    setNewCommuneWilaya(undefined);
    await loadCommunesForWilaya(communesWilayaId);
  };
  const updateCommune = async (id: string, patch: any) => {
    const current = communes.find(x => x.id === id);
    const body = {
      id: Number(id),
      communeFr: patch?.name_fr ?? current?.name_fr ?? '',
      communeAr: patch?.name_ar ?? current?.name_ar ?? '',
      wilayaId: Number(patch?.wilaya_id ?? current?.wilaya_id ?? 0),
    };
    const res = await fetch(`${API_BASE}/communes/${id}`, { method: 'PATCH', headers, body: JSON.stringify(body) });
    const c = await unwrap(res);
    setCommunes(prev => prev.map(x => x.id === id ? { ...x, wilaya_id: String(c.wilayaId ?? body.wilayaId), name_fr: c.communeFr ?? body.communeFr, name_ar: c.communeAr ?? body.communeAr } : x));
    await loadCommunesForWilaya(communesWilayaId);
  };
  const deleteCommune = async (id: string) => { await fetch(`${API_BASE}/communes/${id}`, { method: 'DELETE', headers, body: JSON.stringify({ id: Number(id) }) }); setCommunes(prev => prev.filter(x => x.id !== id)); await loadCommunesForWilaya(communesWilayaId); };

  const addPf = async () => { if (!newPfFr.trim()) return; const body = { nameFr: newPfFr.trim(), nameAr: newPfAr.trim(), code: newPfCode.trim(), titreIds: (newPfTitreIds || []).map((tid:string)=>Number(tid)) }; const res = await fetch(`${API_BASE}/portefeuilles`, { method: 'POST', headers, body: JSON.stringify(body) }); const p = await unwrap(res); const ids: string[] = Array.isArray(p.titreIds) ? p.titreIds.map((x:any)=>String(x)) : [...newPfTitreIds]; const mapped = ids.map((tid:string) => titresMaster.find((t:any)=> String(t.id)===String(tid))).filter(Boolean).map((t:any)=> ({ id: t.id, code: t.code, name_fr: t.name_fr, name_ar: t.name_ar })); const item = { id: String(p.id ?? crypto.randomUUID()), name_fr: p.nameFr ?? newPfFr, name_ar: p.nameAr ?? newPfAr, code: p.code ?? newPfCode, titre_ids: ids, liste_titres: mapped }; setPortefeuilles(prev => [...prev, item]); setNewPfTitreIds([]); setNewPfFr(""); setNewPfAr(""); setNewPfCode(""); };
  const togglePfTitreId = async (pfId: string, titreId: string, assign: boolean) => {
    const current = portefeuilles.find((p:any)=> String(p.id)===String(pfId));
    const base: string[] = Array.isArray((current as any)?.titre_ids) ? [...(current as any).titre_ids] : [];
    const next = assign ? (base.includes(titreId) ? base : [...base, titreId]) : base.filter((x:any)=> String(x)!==String(titreId));
    await updatePf(pfId, { titre_ids: next });
  };
  const updatePf = async (id: string, patch: any) => { const res = await fetch(`${API_BASE}/portefeuilles/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ id: Number(id), nameFr: patch.name_fr, nameAr: patch.name_ar, code: patch.code, titreIds: Array.isArray(patch.titre_ids) ? patch.titre_ids.map((t:any)=>Number(t)) : undefined }) }); const p = await unwrap(res); const ids: string[] = Array.isArray(p.titreIds) ? p.titreIds.map((q:any)=>String(q)) : ((portefeuilles.find((x:any)=> x.id===id) as any)?.titre_ids || []); const mapped = ids.map((tid:string) => titresMaster.find((t:any)=> String(t.id)===String(tid))).filter(Boolean).map((t:any)=> ({ id: t.id, code: t.code, name_fr: t.name_fr, name_ar: t.name_ar })); setPortefeuilles(prev => prev.map(x => x.id === id ? { ...x, name_fr: p.nameFr ?? x.name_fr, name_ar: p.nameAr ?? x.name_ar, code: p.code ?? x.code, titre_ids: ids, liste_titres: mapped } : x)); };
  const deletePf = async (id: string) => { await fetch(`${API_BASE}/portefeuilles/${id}`, { method: 'DELETE', headers, body: JSON.stringify({ id: Number(id) }) }); setPortefeuilles(prev => prev.filter(x => x.id !== id)); if (programmesPfFilter === id) setProgrammesPfFilter(undefined); setProgrammes(prev => prev.filter(x => x.portefeuille_id !== id)); setTitres(prev => prev.filter(x => x.portefeuille_id !== id)); };

  const addProg = async () => { if (!newProgPf || !newProgFr.trim()) return; const res = await fetch(`${API_BASE}/programmes`, { method: 'POST', headers, body: JSON.stringify({ programmeCode: newProgCode.trim(), programmeNomAR: newProgAr.trim(), programmeNomFR: newProgFr.trim(), portefeuilleId: Number(newProgPf) }) }); const pr = await unwrap(res); const item = { id: String(pr.id ?? crypto.randomUUID()), portefeuille_id: String(pr.portefeuilleId ?? newProgPf), name_fr: pr.programmeNomFR ?? newProgFr, name_ar: pr.programmeNomAR ?? newProgAr, code: pr.programmeCode ?? newProgCode }; if (String(item.portefeuille_id) === String(programmesPfFilter)) setProgrammes(prev => [...prev, item]); setNewProgFr(""); setNewProgAr(""); setNewProgPf(undefined); setNewProgCode(""); await loadProgrammesForPf(programmesPfFilter); };
  const updateProg = async (id: string, patch: any) => { const body = { id: Number(id), programmeCode: patch.code, programmeNomAR: patch.name_ar, programmeNomFR: patch.name_fr, portefeuilleId: Number(patch.portefeuille_id) }; const res = await fetch(`${API_BASE}/programmes/${id}`, { method: 'PATCH', headers, body: JSON.stringify(body) }); const pr = await unwrap(res); setProgrammes(prev => prev.map(x => x.id === id ? { ...x, name_fr: pr.programmeNomFR ?? x.name_fr, name_ar: pr.programmeNomAR ?? x.name_ar, portefeuille_id: String(pr.portefeuilleId ?? x.portefeuille_id), code: pr.programmeCode ?? x.code } : x)); await loadProgrammesForPf(programmesPfFilter); };
  const deleteProg = async (id: string) => { await fetch(`${API_BASE}/programmes/${id}`, { method: 'DELETE', headers, body: JSON.stringify({ id: Number(id) }) }); setProgrammes(prev => prev.filter(x => x.id !== id)); setSousProgrammes(prev => prev.filter(x => x.programme_id !== id)); await loadProgrammesForPf(programmesPfFilter); };

  const addSp = async () => { if (!newSpProg || !newSpFr.trim()) return; const res = await fetch(`${API_BASE}/sous-programmes`, { method: 'POST', headers, body: JSON.stringify({ code: newSpCode.trim(), nomAr: newSpAr.trim(), nomFr: newSpFr.trim(), programmeId: Number(newSpProg) }) }); const sp = await unwrap(res); const item = { id: String(sp.id ?? crypto.randomUUID()), programme_id: String(sp.programmeId ?? newSpProg), name_fr: sp.nomFr ?? newSpFr, name_ar: sp.nomAr ?? newSpAr, code: sp.code ?? newSpCode }; if (String(item.programme_id) === String(sousProgProgFilter)) setSousProgrammes(prev => [...prev, item]); setNewSpFr(""); setNewSpAr(""); setNewSpProg(undefined); setNewSpCode(""); await loadSousProgrammesFor(sousProgProgFilter); };
  const updateSp = async (id: string, patch: any) => { const body = { id: Number(id), code: patch.code, nomAr: patch.name_ar, nomFr: patch.name_fr, programmeId: Number(patch.programme_id) }; const res = await fetch(`${API_BASE}/sous-programmes/${id}`, { method: 'PATCH', headers, body: JSON.stringify(body) }); const sp = await unwrap(res); setSousProgrammes(prev => prev.map(x => x.id === id ? { ...x, name_fr: sp.nomFr ?? x.name_fr, name_ar: sp.nomAr ?? x.name_ar, programme_id: String(sp.programmeId ?? x.programme_id), code: sp.code ?? x.code } : x)); await loadSousProgrammesFor(sousProgProgFilter); };
  const deleteSp = async (id: string) => { await fetch(`${API_BASE}/sous-programmes/${id}`, { method: 'DELETE', headers, body: JSON.stringify({ id: Number(id) }) }); setSousProgrammes(prev => prev.filter(x => x.id !== id)); setActions(prev => prev.filter(x => x.sous_programme_id !== id)); setOperations(prev => prev.filter(x => x.sous_programme_id !== id)); await loadSousProgrammesFor(sousProgProgFilter); };

  const addActionMeta = async () => { if (!newActionSp || !newActionName.trim()) return; const a = await api.addAction(newActionSp, newActionName.trim()); setActions(prev => [...prev, { id: a.id, sous_programme_id: a.sous_programme_id, name: a.name }]); setNewActionName(""); setNewActionSp(undefined); };
  const updateActionMeta = async (id: string, patch: any) => { const a = await api.updateAction(id, { name: patch.name, sous_programme_id: patch.sous_programme_id }); setActions(prev => prev.map(x => x.id === id ? { ...x, name: a.name ?? x.name, sous_programme_id: a.sous_programme_id ?? x.sous_programme_id } : x)); };
  const deleteActionMeta = async (id: string) => { await api.deleteAction(id); setActions(prev => prev.filter(x => x.id !== id)); };

  const loadTitresForPf = (pfId: string) => {
    setTitrePf(pfId);
    const map: Record<number, { fr: string; ar: string; code: string }> = {};
    for (let n = 1; n <= 7; n++) {
      const t = titres.find((x:any) => x.portefeuille_id === pfId && x.numero === n);
      map[n] = { fr: t?.name_fr || '', ar: t?.name_ar || '', code: t?.code || '' };
    }
    setTitreInputs(map);
  };
  const saveTitre = async (numero: number) => { if (!titrePf) return; const vals = titreInputs[numero] || { fr: '', ar: '', code: '' }; const code = (vals.code || '').replace(/\D/g,'').slice(0,5); if (!vals.fr.trim() && !vals.ar.trim() && !code) { await api.deleteTitre(titrePf, numero as any); setTitres(prev => prev.filter((x:any) => !(x.portefeuille_id === titrePf && x.numero === numero))); setTitreInputs(prev => ({ ...prev, [numero]: { fr: '', ar: '', code: '' } })); return; } const t = await api.updateTitre(titrePf, numero as any, vals.fr.trim(), vals.ar.trim(), code); setTitres(prev => { const idx = prev.findIndex((x:any) => x.portefeuille_id === titrePf && x.numero === numero); if (idx !== -1) { const next = [...prev]; next[idx] = { ...next[idx], name_fr: t.name_fr, name_ar: t.name_ar, code: t.code }; return next; } return [...prev, { id: t.id, portefeuille_id: t.portefeuille_id, numero: t.numero, name_fr: t.name_fr, name_ar: t.name_ar, code: t.code }]; }); setTitreInputs(prev => ({ ...prev, [numero]: { fr: t.name_fr, ar: t.name_ar, code: t.code } })); };
  const createTitre = async () => { if (!titrePf || !titreAddNum || !titreAddFr.trim()) return; const num = Number(titreAddNum) as any; const code = (titreAddCode || '').replace(/\D/g,'').slice(0,5); const t = await api.addTitre(titrePf, num, titreAddFr.trim(), titreAddAr.trim(), code); setTitres(prev => { const idx = prev.findIndex((x:any) => x.portefeuille_id === titrePf && x.numero === t.numero); if (idx !== -1) { const next = [...prev]; next[idx] = { ...next[idx], name_fr: t.name_fr, name_ar: t.name_ar, code: t.code }; return next; } return [...prev, { id: t.id, portefeuille_id: t.portefeuille_id, numero: t.numero, name_fr: t.name_fr, name_ar: t.name_ar, code: t.code }]; }); setTitreInputs(prev => ({ ...prev, [Number(t.numero)]: { fr: t.name_fr, ar: t.name_ar, code: t.code } })); setTitreAddNum(undefined); setTitreAddFr(""); setTitreAddAr(""); setTitreAddCode(""); };

  const addOp = async () => { if (!newOpSp || typeof newOpNumber !== 'number') return; const op = await api.addOperation(newOpSp, newOpNumber); setOperations(prev => [...prev, { id: op.id, sous_programme_id: op.sous_programme_id, number: op.number }]); setNewOpSp(undefined); setNewOpNumber(undefined); };
  const updateOp = async (id: string, patch: any) => { const op = await api.updateOperation(id, { number: patch.number, sous_programme_id: patch.sous_programme_id }); setOperations(prev => prev.map(x => x.id === id ? { ...x, number: op.number ?? x.number, sous_programme_id: op.sous_programme_id ?? x.sous_programme_id } : x)); };
  const deleteOp = async (id: string) => { await api.deleteOperation(id); setOperations(prev => prev.filter(x => x.id !== id)); };

  return (
    <div className="space-y-6">
      <div className="bg-brand-gradient rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Metadonnées</h1>
        <p className="text-white/80">Gestion hiérarchique des DRB, Wilayas et Communes</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="glass-card rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">DRBs</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">{drbs.length}</span>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input value={newDrbFr} onChange={(e)=>setNewDrbFr(e.target.value)} placeholder="Nom FR" className="px-3 py-2 rounded-lg input-gradient" />
              <input value={newDrbAr} onChange={(e)=>setNewDrbAr(e.target.value)} placeholder="Nom AR" className="px-3 py-2 rounded-lg input-gradient" />
              <button onClick={addDrb} className="px-3 py-2 rounded-lg btn-brand flex items-center gap-2"><Plus className="w-4 h-4" /> Ajouter</button>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[30vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom FR</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom AR</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {drbs.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2"><input defaultValue={d.name_fr} onBlur={(e)=>updateDrb(d.id, e.target.value, d.name_ar)} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><input defaultValue={d.name_ar} onBlur={(e)=>updateDrb(d.id, d.name_fr, e.target.value)} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><button onClick={()=>{ if(confirm('Supprimer ce DRB ?')) deleteDrb(d.id); }} className="p-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Titres</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">{titresMaster.length}</span>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input value={newTitreFr} onChange={(e)=>setNewTitreFr(e.target.value)} placeholder="Nom FR" className="px-3 py-2 rounded-lg input-gradient" />
              <input value={newTitreAr} onChange={(e)=>setNewTitreAr(e.target.value)} placeholder="Nom AR" className="px-3 py-2 rounded-lg input-gradient" />
              <input value={newTitreCode} onChange={(e)=>setNewTitreCode(e.target.value)} placeholder="Code (5 chiffres)" className="px-3 py-2 rounded-lg input-gradient" />
              <button onClick={async()=>{ if (!newTitreFr.trim()) return; const res = await fetch(`${API_BASE}/titre`, { method: 'POST', headers, body: JSON.stringify({ code: newTitreCode.trim(), nomAr: newTitreAr.trim(), nomFr: newTitreFr.trim() }) }); const t = await unwrap(res); const item = { id: String(t.id ?? crypto.randomUUID()), code: String(t.code ?? newTitreCode), name_fr: t.nomFr ?? newTitreFr, name_ar: t.nomAr ?? newTitreAr }; setTitresMaster(prev => [...prev, item]); setNewTitreFr(''); setNewTitreAr(''); setNewTitreCode(''); }} className="px-3 py-2 rounded-lg btn-brand flex items-center gap-2"><Plus className="w-4 h-4" /> Ajouter</button>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[30vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10"><tr><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom FR</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom AR</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {titresMaster.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2"><input defaultValue={t.code} onBlur={async(e)=>{ const res = await fetch(`${API_BASE}/titre/${t.id}`, { method: 'PATCH', headers, body: JSON.stringify({ id: Number(t.id), code: e.target.value, nomAr: t.name_ar, nomFr: t.name_fr }) }); const d = await unwrap(res); setTitresMaster(prev => prev.map(x => x.id === t.id ? { ...x, code: String(d.code ?? e.target.value) } : x)); }} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><input defaultValue={t.name_fr} onBlur={async(e)=>{ const res = await fetch(`${API_BASE}/titre/${t.id}`, { method: 'PATCH', headers, body: JSON.stringify({ id: Number(t.id), code: t.code, nomAr: t.name_ar, nomFr: e.target.value }) }); const d = await unwrap(res); setTitresMaster(prev => prev.map(x => x.id === t.id ? { ...x, name_fr: d.nomFr ?? e.target.value } : x)); }} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><input defaultValue={t.name_ar} onBlur={async(e)=>{ const res = await fetch(`${API_BASE}/titre/${t.id}`, { method: 'PATCH', headers, body: JSON.stringify({ id: Number(t.id), code: t.code, nomAr: e.target.value, nomFr: t.name_fr }) }); const d = await unwrap(res); setTitresMaster(prev => prev.map(x => x.id === t.id ? { ...x, name_ar: d.nomAr ?? e.target.value } : x)); }} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><button onClick={async()=>{ if(!confirm('Supprimer ce titre ?')) return; await fetch(`${API_BASE}/titre/${t.id}`, { method: 'DELETE', headers, body: JSON.stringify({ id: Number(t.id) }) }); setTitresMaster(prev => prev.filter(x => x.id !== t.id)); }} className="p-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        

        
        <div className="glass-card rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Wilayas</h3>
            <div className="flex items-center gap-2">
              <input value={qWilaya} onChange={(e)=>setQWilaya(e.target.value)} placeholder="Filtrer" className="px-2 py-1 rounded input-gradient" />
              <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">{wilayas.length}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input value={newWilayaFr} onChange={(e)=>setNewWilayaFr(e.target.value)} placeholder="Nom FR" className="px-3 py-2 rounded-lg input-gradient" />
              <input value={newWilayaAr} onChange={(e)=>setNewWilayaAr(e.target.value)} placeholder="Nom AR" className="px-3 py-2 rounded-lg input-gradient" />
              <RadixSelect value={newWilayaDrb as any} onChange={(v)=>setNewWilayaDrb(v as any)} options={drbs.map((d:any)=>({ label: d.name_fr, value: String(d.id) })) as any} />
              <button onClick={addWilaya} className="px-3 py-2 rounded-lg btn-brand flex items-center gap-2"><Plus className="w-4 h-4" /> Ajouter</button>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[30vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom FR</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom AR</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">DRB</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {wilayas.filter((w:any)=> ((w.name_fr || w.name || '').toLowerCase()).includes((qWilaya || '').toLowerCase())).map(w => (
                    <tr key={w.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2"><input defaultValue={w.name_fr || w.name} onBlur={(e)=>updateWilaya(w.id, { name_fr: e.target.value })} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><input defaultValue={w.name_ar || ''} onBlur={(e)=>updateWilaya(w.id, { name_ar: e.target.value })} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><RadixSelect value={(String(w.drb_id || '')) as any} onChange={(v)=>updateWilaya(w.id, { drb_id: v as any })} options={drbs.map((d:any)=>({ label: d.name_fr, value: String(d.id) })) as any} /></td>
                      <td className="px-3 py-2"><button onClick={()=>{ if(confirm('Supprimer cette wilaya ?')) deleteWilaya(w.id); }} className="p-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Communes</h3>
            <div className="flex items-center gap-2">
              <RadixSelect value={communesWilayaId as any} onChange={(v)=>setCommunesWilayaId(v as any)} options={wilayas.map((w:any)=>({ label: w.name_fr || w.name, value: String(w.id) })) as any} />
              <input value={qCommune} onChange={(e)=>setQCommune(e.target.value)} placeholder="Filtrer" className="px-2 py-1 rounded input-gradient" />
              <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">{communes.length}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <RadixSelect value={newCommuneWilaya as any} onChange={(v)=>setNewCommuneWilaya(v as any)} options={wilayas.map((w:any)=>({ label: w.name_fr || w.name, value: String(w.id) })) as any} />
              <input value={newCommuneFr} onChange={(e)=>setNewCommuneFr(e.target.value)} placeholder="Nom FR" className="px-3 py-2 rounded-lg input-gradient" />
              <input value={newCommuneAr} onChange={(e)=>setNewCommuneAr(e.target.value)} placeholder="Nom AR" className="px-3 py-2 rounded-lg input-gradient" />
              <button onClick={addCommune} className="px-3 py-2 rounded-lg btn-brand flex items-center gap-2"><Plus className="w-4 h-4" /> Ajouter</button>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[30vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Wilaya</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom FR</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom AR</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {communes.filter((c:any)=> ((c.name_fr || '').toLowerCase().includes((qCommune || '').toLowerCase()) || (c.name_ar || '').toLowerCase().includes((qCommune || '').toLowerCase()))).map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2"><RadixSelect value={c.wilaya_id as any} onChange={(v)=>updateCommune(c.id, { wilaya_id: v as any })} options={wilayas.map((w:any)=>({ label: w.name_fr || w.name, value: String(w.id) })) as any} /></td>
                      <td className="px-3 py-2"><input defaultValue={c.name_fr} onBlur={(e)=>updateCommune(c.id, { name_fr: e.target.value, wilaya_id: c.wilaya_id })} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><input defaultValue={c.name_ar} onBlur={(e)=>updateCommune(c.id, { name_ar: e.target.value, wilaya_id: c.wilaya_id })} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><button onClick={()=>{ if(confirm('Supprimer cette commune ?')) deleteCommune(c.id); }} className="p-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Portefeuille de programmes</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">{portefeuilles.length}</span>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input value={newPfFr} onChange={(e)=>setNewPfFr(e.target.value)} placeholder="Nom FR" className="px-3 py-2 rounded-lg input-gradient" />
              <input value={newPfAr} onChange={(e)=>setNewPfAr(e.target.value)} placeholder="Nom AR" className="px-3 py-2 rounded-lg input-gradient" />
              <input value={newPfCode} onChange={(e)=>setNewPfCode(e.target.value)} placeholder="Code" className="px-3 py-2 rounded-lg input-gradient" />
              <button onClick={addPf} className="px-3 py-2 rounded-lg btn-brand flex items-center gap-2"><Plus className="w-4 h-4" /> Ajouter</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {titresMaster.map((t:any)=> (
                <button key={t.id} onClick={()=>setNewPfTitreIds(prev => prev.includes(String(t.id)) ? prev.filter(x=>x!==String(t.id)) : [...prev, String(t.id)])} className={`px-2 py-1 text-xs rounded-full border ${newPfTitreIds.includes(String(t.id)) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>{t.code} • {t.name_fr}</button>
              ))}
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[30vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10"><tr><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom FR</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom AR</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Titres affectés</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portefeuilles.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2"><input defaultValue={p.name_fr} onBlur={(e)=>updatePf(p.id, { name_fr: e.target.value })} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><input defaultValue={p.name_ar} onBlur={(e)=>updatePf(p.id, { name_ar: e.target.value })} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><input defaultValue={(p as any).code || ''} onBlur={(e)=>updatePf(p.id, { code: e.target.value })} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-2">
                          {titresMaster.map((t:any)=> {
                            const assigned = Array.isArray((p as any).titre_ids) ? (p as any).titre_ids.includes(String(t.id)) : false;
                            return (
                              <button key={t.id} onClick={()=>togglePfTitreId(p.id, String(t.id), !assigned)} className={`px-2 py-1 text-xs rounded-full border ${assigned ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>{t.code} • {t.name_fr}</button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-3 py-2"><button onClick={()=>{ if(confirm('Supprimer ce portefeuille ?')) deletePf(p.id); }} className="p-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Programmes</h3>
            <div className="flex items-center gap-2">
              <RadixSelect value={programmesPfFilter as any} onChange={(v)=>setProgrammesPfFilter(v as any)} options={portefeuilles.map((p:any)=>({ label: p.name_fr, value: String(p.id) })) as any} />
              <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">{programmes.length}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <RadixSelect value={newProgPf as any} onChange={(v)=>setNewProgPf(v as any)} options={portefeuilles.map((p:any)=>({ label: p.name_fr, value: String(p.id) })) as any} />
              <input value={newProgFr} onChange={(e)=>setNewProgFr(e.target.value)} placeholder="Nom FR" className="px-3 py-2 rounded-lg input-gradient" />
              <input value={newProgAr} onChange={(e)=>setNewProgAr(e.target.value)} placeholder="Nom AR" className="px-3 py-2 rounded-lg input-gradient" />
              <input value={newProgCode} onChange={(e)=>setNewProgCode(e.target.value)} placeholder="Code" className="px-3 py-2 rounded-lg input-gradient" />
              <button onClick={addProg} className="px-3 py-2 rounded-lg btn-brand flex items-center gap-2"><Plus className="w-4 h-4" /> Ajouter</button>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[30vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10"><tr><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Portefeuille</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom FR</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom AR</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {programmes.filter((pr:any)=> !programmesPfFilter || String(pr.portefeuille_id)===String(programmesPfFilter)).map(pr => (
                    <tr key={pr.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2"><RadixSelect value={String(pr.portefeuille_id) as any} onChange={(v)=>updateProg(pr.id, { portefeuille_id: v as any })} options={portefeuilles.map((p:any)=>({ label: p.name_fr, value: String(p.id) })) as any} /></td>
                      <td className="px-3 py-2"><input defaultValue={pr.name_fr} onBlur={(e)=>updateProg(pr.id, { name_fr: e.target.value })} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><input defaultValue={pr.name_ar} onBlur={(e)=>updateProg(pr.id, { name_ar: e.target.value })} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><input defaultValue={(pr as any).code || ''} onBlur={(e)=>updateProg(pr.id, { code: e.target.value })} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><button onClick={()=>{ if(confirm('Supprimer ce programme ?')) deleteProg(pr.id); }} className="p-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sous Programmes</h3>
            <div className="flex items-center gap-2">
              <RadixSelect value={sousProgProgFilter as any} onChange={(v)=>setSousProgProgFilter(v as any)} options={programmes.map((pr:any)=>({ label: pr.name_fr, value: String(pr.id) })) as any} />
              <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">{sousProgrammes.length}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <RadixSelect value={newSpProg as any} onChange={(v)=>setNewSpProg(v as any)} options={programmes.map((pr:any)=>({ label: pr.name_fr, value: String(pr.id) })) as any} />
              <input value={newSpFr} onChange={(e)=>setNewSpFr(e.target.value)} placeholder="Nom FR" className="px-3 py-2 rounded-lg input-gradient" />
              <input value={newSpAr} onChange={(e)=>setNewSpAr(e.target.value)} placeholder="Nom AR" className="px-3 py-2 rounded-lg input-gradient" />
              <input value={newSpCode} onChange={(e)=>setNewSpCode(e.target.value)} placeholder="Code" className="px-3 py-2 rounded-lg input-gradient" />
              <button onClick={addSp} className="px-3 py-2 rounded-lg btn-brand flex items-center gap-2"><Plus className="w-4 h-4" /> Ajouter</button>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[30vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10"><tr><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Programme</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom FR</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom AR</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sousProgrammes.filter((sp:any)=> !sousProgProgFilter || String(sp.programme_id)===String(sousProgProgFilter)).map(sp => (
                    <tr key={sp.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2"><RadixSelect value={String(sp.programme_id) as any} onChange={(v)=>updateSp(sp.id, { programme_id: v as any })} options={programmes.map((pr:any)=>({ label: pr.name_fr, value: String(pr.id) })) as any} /></td>
                      <td className="px-3 py-2"><input defaultValue={sp.name_fr} onBlur={(e)=>updateSp(sp.id, { name_fr: e.target.value })} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><input defaultValue={sp.name_ar} onBlur={(e)=>updateSp(sp.id, { name_ar: e.target.value })} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><input defaultValue={(sp as any).code || ''} onBlur={(e)=>updateSp(sp.id, { code: e.target.value })} className="w-full px-2 py-1 rounded input-gradient" /></td>
                      <td className="px-3 py-2"><button onClick={()=>{ if(confirm('Supprimer ce sous programme ?')) deleteSp(sp.id); }} className="p-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

{/*         <div className="glass-card rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Titres (1 à 7) par Portefeuille</h3>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {portefeuilles.map((p:any)=> (
                <button
                  key={p.id}
                  onClick={()=>loadTitresForPf(String(p.id))}
                  className={`px-2 py-1 text-xs rounded-full border ${titrePf===p.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                >
                  {p.name_fr}
                </button>
              ))}
            </div>
            {titrePf && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  <input value={titreAddNum || ''} onChange={(e)=>{ const v = e.target.value.replace(/\D/g,'').slice(0,1); setTitreAddNum(v); }} placeholder="Numéro (1–7)" className="px-3 py-2 rounded-lg input-gradient" />
                  <input value={titreAddFr} onChange={(e)=>setTitreAddFr(e.target.value)} placeholder="Nom FR" className="px-3 py-2 rounded-lg input-gradient" />
                  <input value={titreAddAr} onChange={(e)=>setTitreAddAr(e.target.value)} placeholder="Nom AR" className="px-3 py-2 rounded-lg input-gradient" />
                  <input value={titreAddCode} onChange={(e)=>setTitreAddCode(e.target.value.replace(/\D/g,'').slice(0,5))} placeholder="Code (5 chiffres)" className="px-3 py-2 rounded-lg input-gradient" />
                  <button onClick={createTitre} className="px-3 py-2 rounded-lg btn-brand">Ajouter</button>
                </div>
                <div className="overflow-x-auto overflow-y-auto max-h-[30vh]">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom FR</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom AR</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {titres.filter((t:any)=> t.portefeuille_id === titrePf).sort((a:any,b:any)=> a.numero - b.numero).map((t:any) => (
                        <tr key={`${t.portefeuille_id}-${t.numero}`} className="hover:bg-gray-50">
                          <td className="px-3 py-2">{t.numero}</td>
                          <td className="px-3 py-2"><input value={titreInputs[t.numero]?.fr ?? t.name_fr ?? ''} onChange={(e)=>setTitreInputs(prev => ({ ...prev, [t.numero]: { fr: e.target.value, ar: prev[t.numero]?.ar ?? t.name_ar ?? '', code: prev[t.numero]?.code ?? t.code ?? '' } }))} className="w-full px-2 py-1 rounded input-gradient" /></td>
                          <td className="px-3 py-2"><input value={titreInputs[t.numero]?.ar ?? t.name_ar ?? ''} onChange={(e)=>setTitreInputs(prev => ({ ...prev, [t.numero]: { fr: prev[t.numero]?.fr ?? t.name_fr ?? '', ar: e.target.value, code: prev[t.numero]?.code ?? t.code ?? '' } }))} className="w-full px-2 py-1 rounded input-gradient" /></td>
                          <td className="px-3 py-2"><input value={(titreInputs[t.numero]?.code ?? t.code ?? '').toString()} onChange={(e)=>setTitreInputs(prev => ({ ...prev, [t.numero]: { fr: prev[t.numero]?.fr ?? t.name_fr ?? '', ar: prev[t.numero]?.ar ?? t.name_ar ?? '', code: e.target.value.replace(/\D/g,'').slice(0,5) } }))} className="w-full px-2 py-1 rounded input-gradient" /></td>
                          <td className="px-3 py-2 flex items-center gap-2 justify-end">
                            <button onClick={()=>saveTitre(t.numero)} className="px-3 py-2 rounded-lg btn-brand">Enregistrer</button>
                            <button onClick={async ()=>{ await mockApi.deleteTitre(t.portefeuille_id, t.numero as any); setTitres(prev => prev.filter((x:any)=> !(x.portefeuille_id===t.portefeuille_id && x.numero===t.numero))); setTitreInputs(prev => ({ ...prev, [t.numero]: { fr: '', ar: '', code: '' } })); }} className="p-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
