"use client";
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Globe, Shield, UserCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { currentLanguage, setLanguage, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const quick = async (email: string) => {
    try {
      await login(email, 'password123');
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isRTL ? 'direction-rtl' : ''}`}>
      <div className="absolute inset-0 bg-animated-gradient opacity-70"></div>
      <div className="absolute inset-0 bg-grid-overlay"></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-[blobFloat_12s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-[blobFloat_14s_ease-in-out_infinite]"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="card-gradient-border w-full max-w-md rounded-2xl">
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-200 text-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-bold">Stats App</h2>
                  <p className="text-gray-600 text-sm">Connexion sécurisée</p>
                </div>
              </div>
              <button onClick={() => setLanguage(currentLanguage === 'fr' ? 'ar' : 'fr')} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                {currentLanguage === 'fr' ? 'العربية' : 'Français'}
              </button>
            </div>

            {error && <div className="mt-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg border border-red-200">{error}</div>}

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" className="w-full pl-10 pr-12 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800">{showPassword ? 'Masquer' : 'Afficher'}</button>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="rounded border-gray-300" /> Se souvenir de moi
                </label>
                <a className="text-sm text-blue-600 hover:text-blue-800" href="#">Mot de passe oublié ?</a>
              </div>
              <button type="submit" className="w-full px-4 py-3 rounded-lg btn-brand relative overflow-hidden">
                <span className="relative z-10">Se connecter</span>
                <span className="absolute inset-0 opacity-20 button-shine"></span>
              </button>
            </form>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <button onClick={() => quick('cf.user@example.com')} className="px-3 py-2 rounded-lg border border-gray-200 text-gray-900 hover:bg-gray-50">CF</button>
              <button onClick={() => quick('drb.admin@example.com')} className="px-3 py-2 rounded-lg border border-gray-200 text-gray-900 hover:bg-gray-50">DRB</button>
              <button onClick={() => quick('dgb.superadmin@example.com')} className="px-3 py-2 rounded-lg border border-gray-200 text-gray-900 hover:bg-gray-50">DGB</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
