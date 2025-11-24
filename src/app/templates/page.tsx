"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { mockApi } from "@/lib/mockData";
import { Canvas } from "@/lib/types";
import Link from "next/link";

export default function TemplatesPage() {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await mockApi.getCanvases();
      setCanvases(data);
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
        <Link href="/templates/new" className="btn-brand px-4 py-2 rounded-lg">Nouveau Modèle</Link>
      </div>

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
    </div>
    </Layout>
    </ProtectedRoute>
  );
}
