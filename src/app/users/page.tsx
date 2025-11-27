"use client";
import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/common/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { mockApi } from "@/lib/mockData";
import RadixSelect from "@/components/ui/RadixSelect";
import * as Dialog from "@radix-ui/react-dialog";
import { User } from "@/lib/types";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("all");
  const [wilaya, setWilaya] = useState<string>("all");
  const [wilayas, setWilayas] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<'CF'|'DRB'|'DGB'>('CF');
  const [newWilaya, setNewWilaya] = useState<string>('1');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<'CF'|'DRB'|'DGB'>('CF');
  const [editWilaya, setEditWilaya] = useState<string>('1');
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdValue, setPwdValue] = useState<string>("");
  const [pwdEmail, setPwdEmail] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const data = await mockApi.getUsers();
      setUsers(data);
      setWilayas(await mockApi.listWilayas());
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return users.filter(u => (
      (role === 'all' || u.role === role) &&
      (wilaya === 'all' || u.wilaya_id === wilaya) &&
      (u.email.toLowerCase().includes(qq) || (u.wilaya_name || '').toLowerCase().includes(qq))
    ));
  }, [users, q, role, wilaya]);

  if (loading) return (<Layout><div className="h-64 flex items-center justify-center">Loading...</div></Layout>);

  return (
    <ProtectedRoute allowedRoles={['DRB','DGB']}>
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
            <p className="text-gray-600">Gestion des utilisateurs</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." className="px-3 py-2 border rounded-lg" />
            <RadixSelect value={role as any} onChange={(v)=>setRole(v as any)} options={[{label:'Tous rôles',value:'all'},{label:'CF',value:'CF'},{label:'DRB',value:'DRB'},{label:'DGB',value:'DGB'}] as any} />
            <RadixSelect value={wilaya as any} onChange={(v)=>setWilaya(v as any)} options={[{label:'Toutes wilayas',value:'all'}, ...wilayas.map(w=>({label:w.name_fr || w.name, value:w.id}))] as any} />
            <button onClick={() => { setQ(''); setRole('all'); setWilaya('all'); }} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Réinitialiser</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex items-center gap-2">
            <input value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} placeholder="Email" className="px-3 py-2 border rounded-lg" />
            <RadixSelect value={newRole as any} onChange={(v)=>setNewRole(v as any)} options={[{label:'CF',value:'CF'},{label:'DRB',value:'DRB'},{label:'DGB',value:'DGB'}] as any} />
            <RadixSelect value={newWilaya as any} onChange={(v)=>setNewWilaya(v as any)} options={wilayas.map(w=>({label:w.name_fr || w.name, value:w.id})) as any} />
            <button onClick={async()=>{ if(!newEmail.trim()) return; const res = await mockApi.createUser(newEmail.trim(), newRole, newWilaya); setUsers(prev=>[...prev,res.user]); setPwdEmail(res.user.email); setPwdValue(res.password); setPwdOpen(true); setNewEmail(''); setNewRole('CF'); setNewWilaya(wilayas[0]?.id || '1'); }} aria-label="Créer" title="Créer" className="p-2 rounded-lg btn-brand"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wilaya</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créé</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      {editingId === u.id ? (
                        <input value={editEmail} onChange={(e)=>setEditEmail(e.target.value)} className="px-2 py-1 border rounded" />
                      ) : u.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {editingId === u.id ? (
                        <RadixSelect value={editRole as any} onChange={(v)=>setEditRole(v as any)} options={[{label:'CF',value:'CF'},{label:'DRB',value:'DRB'},{label:'DGB',value:'DGB'}] as any} />
                      ) : u.role}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {editingId === u.id ? (
                        <RadixSelect value={editWilaya as any} onChange={(v)=>setEditWilaya(v as any)} options={wilayas.map(w=>({label:w.name_fr || w.name, value:w.id})) as any} />
                      ) : u.wilaya_name}
                    </td>
                    <td className="px-6 py-4 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      {editingId === u.id ? (
                        <div className="flex gap-2">
                          <button onClick={async()=>{ const updated = await mockApi.updateUser(u.id, { email: editEmail, role: editRole, wilaya_id: editWilaya }); setUsers(prev=>prev.map(x=>x.id===u.id?updated:x)); setEditingId(null); }} className="px-3 py-1 rounded-lg btn-brand">Enregistrer</button>
                          <button onClick={()=>setEditingId(null)} className="px-3 py-1 rounded-lg border hover:bg-gray-50">Annuler</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={()=>{ setEditingId(u.id); setEditEmail(u.email); setEditRole(u.role as any); setEditWilaya(u.wilaya_id); }} aria-label="Modifier" title="Modifier" className="p-2 rounded-lg border hover:bg-gray-50"><Pencil className="w-4 h-4" /></button>
                          <button onClick={async()=>{ await mockApi.deleteUser(u.id); setUsers(prev=>prev.filter(x=>x.id!==u.id)); }} aria-label="Supprimer" title="Supprimer" className="p-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Dialog.Root open={pwdOpen} onOpenChange={(o)=>{ if(!o) { setPwdOpen(false); setPwdValue(""); setPwdEmail(""); } }}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl p-6 space-y-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">Mot de passe généré</Dialog.Title>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Email: <span className="font-medium text-gray-900">{pwdEmail}</span></p>
                <p className="text-amber-600">Affiché une seule fois</p>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-900">{pwdValue}</code>
                <button onClick={async()=>{ try { await navigator.clipboard.writeText(pwdValue); } catch {} }} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Copier</button>
              </div>
              <div className="flex justify-end">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 rounded-lg btn-brand">Fermer</button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </Layout>
    </ProtectedRoute>
  );
}
