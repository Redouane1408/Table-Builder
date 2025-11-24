"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { mockApi } from "@/lib/mockData";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import AreaGradientChart from "@/components/charts/AreaGradientChart";
import BarHorizontalChart from "@/components/charts/BarHorizontalChart";
import PieInteractive from "@/components/charts/PieInteractive";

export default function DashboardPage() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [economicData, setEconomicData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [pop, eco] = await Promise.all([mockApi.getChartData(), mockApi.getEconomicData()]);
      setChartData(pop);
      setEconomicData(eco);
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
        <div className="bg-brand-gradient rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-blue-100">Vue SSR avec données mock</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Population par Wilaya</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Tendances Économiques</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={economicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="economic_growth" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="unemployment_rate" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AreaGradientChart title="Croissance Économique (Aire avec Dégradé)" data={economicData} xKey={'name'} yKey={'economic_growth'} />
          <BarHorizontalChart title="Chômage par Mois (Barres Horizontales)" data={economicData.map((d: any) => ({ label: d.name, value: d.unemployment_rate }))} xKey={'value'} yKey={'label'} color="#f59e0b" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PieInteractive title="Répartition des Statuts" data={[{ name: 'Brouillon', value: 5, color: '#f59e0b' }, { name: 'Soumis', value: 8, color: '#3b82f6' }, { name: 'Approuvé', value: 3, color: '#10b981' }]} />
          <PieInteractive title="Population par Wilaya" data={chartData.map((d: any) => ({ name: d.label, value: d.value, color: d.color }))} />
          <PieInteractive title="Inflation vs Croissance (mock)" data={economicData.map((d: any) => ({ name: d.name, value: d.inflation_rate }))} />
        </div>
      </div>
    </Layout>
    </ProtectedRoute>
  );
}
