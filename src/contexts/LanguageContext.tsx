"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { translate } from "@/lib/i18n";

type Lang = 'fr' | 'ar';
type LanguageState = { currentLanguage: Lang; isRTL: boolean; setLanguage: (l: Lang) => void; t: (key: keyof typeof import("@/lib/i18n").dict['fr']) => string };

const LanguageContext = createContext<LanguageState | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Lang>('fr');
  useEffect(() => {
    const raw = localStorage.getItem('lang');
    if (raw === 'ar' || raw === 'fr') setCurrentLanguage(raw as Lang);
  }, []);
  const setLanguage = (l: Lang) => {
    setCurrentLanguage(l);
    localStorage.setItem('lang', l);
  };
  return (
    <LanguageContext.Provider value={{ currentLanguage, isRTL: currentLanguage === 'ar', setLanguage, t: (key) => translate(key, currentLanguage) }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('LanguageContext not found');
  return ctx;
};
