"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { mockApi } from "@/lib/mockData";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import PieInteractive from "@/components/charts/PieInteractive";
import { Menu, ArrowUpRight, ArrowDownRight, Calendar, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [economicData, setEconomicData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"Day" | "Week" | "Month">("Day");

  useEffect(() => {
    const load = async () => {
      const eco = await mockApi.getEconomicData();
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

  const pieData = [
    { name: "Marketing Channels", value: 22.0, color: "#5e81f4" },
    { name: "Offline Channels", value: 18.6, color: "#f4be5e" },
    { name: "Direct Sales", value: 8.4, color: "#7ce7ac" },
    { name: "Other Channels", value: 15.3, color: "#ff808b" },
  ];
  const totalSales = 342000;
  const spendings = 200000;
  const income = 142000;

  return (
    <ProtectedRoute allowedRoles={["CF","DRB","DGB"]}>
      <Layout>
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Week comparison</p>
                  <p className="text-lg font-semibold">Sales</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold">1.345</p>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div className="mt-4 h-1 w-full bg-gray-200 rounded"><div className="h-1 bg-emerald-400 rounded" style={{ width: "65%" }} /></div>
            </div>
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Month comparison</p>
                  <p className="text-lg font-semibold">Leads</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold">3.820</p>
                  <ArrowDownRight className="w-4 h-4 text-rose-400" />
                </div>
              </div>
              <div className="mt-4 h-1 w-full bg-gray-200 rounded"><div className="h-1 bg-indigo-500 rounded" style={{ width: "70%" }} /></div>
            </div>
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Week comparison</p>
                  <p className="text-lg font-semibold">Income</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold">$690.00</p>
                  <ArrowUpRight className="w-4 h-4 text-rose-400" />
                </div>
              </div>
              <div className="mt-4 h-1 w-full bg-gray-200 rounded"><div className="h-1 bg-rose-400 rounded" style={{ width: "35%" }} /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Orders</h3>
                <div className="flex items-center gap-2">
                  <button className={`px-3 py-2 rounded-md border ${range === "Day" ? "border-gray-300" : "border-gray-200 text-gray-500"}`} onClick={() => setRange("Day")}>Day</button>
                  <button className={`px-3 py-2 rounded-md border ${range === "Week" ? "border-gray-300" : "border-gray-200 text-gray-500"}`} onClick={() => setRange("Week")}>Week</button>
                  <button className={`px-3 py-2 rounded-md border ${range === "Month" ? "border-gray-300" : "border-gray-200 text-gray-500"}`} onClick={() => setRange("Month")}>Month</button>
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-md bg-gray-200" />
                    <Calendar className="absolute w-4 h-4 text-gray-500 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={economicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="economic_growth" stroke="#5e81f4" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="unemployment_rate" stroke="#7ce7ac" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Planned Income</h3>
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-md bg-gray-200" />
                  <Calendar className="absolute w-4 h-4 text-gray-500 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={economicData}>
                  <defs>
                    <linearGradient id="plannedIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5e81f4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#5e81f4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="economic_growth" stroke="#5e81f4" fill="url(#plannedIncome)" strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Income Breakdown</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-md border">Day</button>
                  <button className="px-3 py-2 rounded-md text-gray-500 border">Week</button>
                  <button className="px-3 py-2 rounded-md text-gray-500 border">Month</button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute left-1/2 top-20 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-32 h-32 flex items-center justify-center">
                  <span className="text-3xl font-semibold">$85k</span>
                </div>
                <PieInteractive data={pieData} height={240} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-indigo-500" /><span className="text-sm">Marketing Channels</span></div>
                  <span className="text-sm font-semibold">$22.0k</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-amber-400" /><span className="text-sm">Offline Channels</span></div>
                  <span className="text-sm font-semibold">$18.6k</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-emerald-400" /><span className="text-sm">Direct Sales</span></div>
                  <span className="text-sm font-semibold">$8.4k</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-rose-400" /><span className="text-sm">Other Channels</span></div>
                  <span className="text-sm font-semibold">$15.3k</span>
                </div>
              </div>
            </div>
            <div className="xl:col-span-2 bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Income Details</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-md border">Day</button>
                  <button className="px-3 py-2 rounded-md text-gray-500 border">Week</button>
                  <button className="px-3 py-2 rounded-md text-gray-500 border">Month</button>
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-md bg-gray-200" />
                    <Calendar className="absolute w-4 h-4 text-gray-500 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={economicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="unemployment_rate" stroke="#7ce7ac" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-semibold">${totalSales.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">Total sales</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-semibold">${spendings.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">Spendings</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-semibold">${income.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">Income</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
