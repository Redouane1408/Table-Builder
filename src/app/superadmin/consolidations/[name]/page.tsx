"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useParams } from "next/navigation";
import { mockApi } from "@/lib/mockData";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

export default function ConsolidationPage() {
  const params = useParams();
  const name = decodeURIComponent(params?.name as string);
  const [rows, setRows] = useState<{ option: string; count: number }[]>([]);
  useEffect(() => { (async () => { const data = await mockApi.getDropdownConsolidation(name); setRows(data); })(); }, [name]);
  return (
    <ProtectedRoute allowedRoles={['DGB']}>
      <Layout>
        <div className="space-y-6">
          <div className="bg-brand-gradient rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold">Consolidation • {name}</h1>
            <p className="text-white/80">Comptage des valeurs depuis le canva des marchés</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Table</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Option</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Count</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rows.map(r => (
                      <tr key={r.option} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{r.option}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{r.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Barres</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rows.map(r => ({ label: r.option, value: r.count }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" radius={[4,4,4,4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

