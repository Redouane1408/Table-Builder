"use client";
import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/common/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { mockApi } from "@/lib/mockData";
import { User } from "@/lib/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("all");
  const [wilaya, setWilaya] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      const data = await mockApi.getUsers();
      setUsers(data);
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
            <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 border rounded-lg">
              <option value="all">Tous rôles</option>
              <option value="CF">CF</option>
              <option value="DRB">DRB</option>
              <option value="DGB">DGB</option>
            </select>
            <select value={wilaya} onChange={(e) => setWilaya(e.target.value)} className="px-3 py-2 border rounded-lg">
              <option value="all">Toutes wilayas</option>
              <option value="1">Algiers</option>
              <option value="2">Oran</option>
              <option value="3">Constantine</option>
              <option value="4">Annaba</option>
              <option value="5">Blida</option>
            </select>
            <button onClick={() => { setQ(''); setRole('all'); setWilaya('all'); }} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Réinitialiser</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wilaya</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créé</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{u.email}</td>
                    <td className="px-6 py-4 text-sm">{u.role}</td>
                    <td className="px-6 py-4 text-sm">{u.wilaya_name}</td>
                    <td className="px-6 py-4 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
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
