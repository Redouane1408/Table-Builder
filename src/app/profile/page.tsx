"use client";
import React from "react";
import Layout from "@/components/common/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  return (
    <ProtectedRoute allowedRoles={['CF','DRB','DGB']}>
      <Layout>
        <div className="space-y-6">
          <div className="bg-brand-gradient rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold">{t('profile')}</h1>
            <p className="text-white/80">{user?.email}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Email</span><span className="font-medium text-gray-900">{user?.email}</span></div>
                <div className="flex justify-between"><span>Rôle</span><span className="font-medium text-gray-900">{user?.role}</span></div>
                <div className="flex justify-between"><span>{t('wilaya')}</span><span className="font-medium text-gray-900">{user?.wilaya_name}</span></div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={logout} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Déconnexion</button>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('language')}</h3>
              <div className="flex gap-2">
                <button onClick={() => setLanguage('fr')} className={`px-4 py-2 rounded-lg border ${currentLanguage==='fr' ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}>Français</button>
                <button onClick={() => setLanguage('ar')} className={`px-4 py-2 rounded-lg border ${currentLanguage==='ar' ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}>العربية</button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

