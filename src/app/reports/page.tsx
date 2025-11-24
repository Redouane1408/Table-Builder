"use client";
import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/common/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { mockApi } from "@/lib/mockData";
import { Report } from "@/lib/types";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      const data = await mockApi.getReports();
      setReports(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return reports.filter(r => (
      (status === 'all' || r.status === status) &&
      (r.title.toLowerCase().includes(qq) || (r.user?.email || '').toLowerCase().includes(qq))
    ));
  }, [reports, q, status]);

  if (loading) return (<Layout><div className="h-64 flex items-center justify-center">Loading...</div></Layout>);

  return (
    <ProtectedRoute allowedRoles={['CF','DRB']}>
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
            <p className="text-gray-600">Statuts et métadonnées</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." className="px-3 py-2 border rounded-lg" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded-lg">
              <option value="all">Tous statuts</option>
              <option value="draft">Brouillon</option>
              <option value="submitted">Soumis</option>
              <option value="approved">Approuvé</option>
            </select>
            <button onClick={() => { setQ(''); setStatus('all'); }} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Réinitialiser</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">{r.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{r.user?.email} • {new Date(r.created_at).toLocaleDateString()}</p>
              <span className={`mt-2 inline-flex px-2 py-1 text-xs rounded-full ${r.status === 'submitted' ? 'bg-blue-100 text-blue-800' : r.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{r.status}</span>
              <p className="text-sm text-gray-700 mt-3 line-clamp-3">{r.content}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
    </ProtectedRoute>
  );
}
