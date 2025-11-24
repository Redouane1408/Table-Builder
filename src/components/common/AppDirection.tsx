"use client";
import React, { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const AppDirection: React.FC = () => {
  const { currentLanguage, isRTL } = useLanguage();
  useEffect(() => {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", currentLanguage);
    if (isRTL) document.body.classList.add("rtl");
    else document.body.classList.remove("rtl");
  }, [currentLanguage, isRTL]);
  return null;
};

export default AppDirection;

