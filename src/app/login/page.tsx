"use client";
import React, { useState } from 'react';
import Image from 'next/image';
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
    <div className={`relative min-h-screen ${isRTL ? 'direction-rtl' : ''}`}>
      <Image src="/login_background.jpg" alt="Background" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        <div className="mb-6">
          <Image src="/Logo_MF.svg" alt="Logo" width={220} height={60} priority />
        </div>
        <div className="card-gradient-border w-full max-w-md rounded-2xl">
          <div className="glass-card rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-bold">Stats App</h2>
                  <p className="text-white/70 text-sm">Connexion sécurisée</p>
                </div>
              </div>
              <button onClick={() => setLanguage(currentLanguage === 'fr' ? 'ar' : 'fr')} className="px-3 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10">
                {currentLanguage === 'fr' ? 'العربية' : 'Français'}
              </button>
            </div>

            {error && <div className="mt-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg border border-red-200">{error}</div>}

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div className="relative">
                <Mail className="w-4 h-4 text-white/80 absolute right-0 top-1/2 -translate-y-1/2" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-transparent outline-none focus:outline-none border-b border-white/30 focus:border-white transition-colors duration-200 text-white placeholder-white/70 py-3 pr-6" />
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/80 absolute right-0 top-1/2 -translate-y-1/2" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" className="w-full bg-transparent outline-none focus:outline-none border-b border-white/30 focus:border-white transition-colors duration-200 text-white placeholder-white/70 py-3 pr-16" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-xs text-white/85 hover:text-white">{showPassword ? 'Masquer' : 'Afficher'}</button>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-white">
                  <input type="checkbox" className="rounded border-white/50" /> Se souvenir de moi
                </label>
                <a className="text-sm text-blue-300 hover:text-blue-200" href="#">Mot de passe oublié ?</a>
              </div>
              <button type="submit" className="w-full px-4 py-3 rounded-lg btn-brand">
                Se connecter
              </button>
            </form>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <button onClick={() => quick('cf.user@example.com')} className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/30 text-white hover:bg-white/20">CF</button>
              <button onClick={() => quick('drb.admin@example.com')} className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/30 text-white hover:bg-white/20">DRB</button>
              <button onClick={() => quick('dgb.superadmin@example.com')} className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/30 text-white hover:bg-white/20">DGB</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
