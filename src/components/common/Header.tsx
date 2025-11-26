"use client";
import React from 'react';
import { LogOut, User, Bell, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import NotificationsCard from '@/components/common/NotificationsCard';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import RadixSelect from '@/components/ui/RadixSelect';

interface HeaderProps { onToggleSidebar: () => void }

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();

  const roleLabel = (role?: 'CF'|'DRB'|'DGB') => {
    if (!role) return '';
    const labels = { fr: { CF: 'Utilisateur', DRB: 'Administrateur', DGB: 'Super Administrateur' }, ar: { CF: 'مستخدم', DRB: 'مدير', DGB: 'مدير عام' } };
    return labels[currentLanguage][role];
  };
  return (
    <header className="bg-brand-gradient text-white shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={onToggleSidebar} className="p-2 rounded-md hover:bg-blue-500 transition-colors">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-white"></div>
                <div className="w-full h-0.5 bg-white"></div>
                <div className="w-full h-0.5 bg-white"></div>
              </div>
            </button>
            <div className="ml-4 flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold">{t('platform_name')}</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-28">
              <RadixSelect value={currentLanguage} onChange={(v)=>setLanguage(v as any)} options={["fr","ar"]} />
            </div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="p-2 rounded-md hover:bg-blue-500 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-50">
                  <NotificationsCard />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.email || 'guest@example.com'}</p>
                <p className="text-xs text-blue-200">{roleLabel(user?.role)}</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </div>
            <button onClick={logout} className="p-2 rounded-md hover:bg-blue-500 transition-colors" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
