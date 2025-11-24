export const dict = {
  fr: {
    platform_name: 'Plateforme Nationale',
    dashboard: 'Tableau de bord',
    templates: 'Modèles',
    users: 'Utilisateurs',
    reports: 'Rapports',
    profile: 'Profil',
    wilaya: 'Wilaya',
    language: 'Langue',
    login_title: 'Connexion',
    login_subtitle: 'Entrez vos informations ou utilisez un accès rapide.',
    login_cta: 'Se connecter',
  },
  ar: {
    platform_name: 'المنصة الوطنية',
    dashboard: 'لوحة التحكم',
    templates: 'القوالب',
    users: 'المستخدمون',
    reports: 'التقارير',
    profile: 'الملف الشخصي',
    wilaya: 'الولاية',
    language: 'اللغة',
    login_title: 'تسجيل الدخول',
    login_subtitle: 'أدخل معلوماتك أو استخدم الوصول السريع.',
    login_cta: 'تسجيل',
  },
};

export const translate = (key: keyof typeof dict['fr'], lang: 'fr' | 'ar') => {
  return dict[lang][key] || key;
};

