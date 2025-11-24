"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, BarChart3, ChevronLeft, ChevronRight, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps { isCollapsed: boolean; onToggle: () => void }

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isRTL, t } = useLanguage();
  const items = [
    { name: t('dashboard'), href: '/dashboard', icon: LayoutDashboard, roles: ['CF','DRB','DGB'] },
    { name: t('templates'), href: '/templates', icon: FileText, roles: ['CF','DRB','DGB'] },
    { name: t('users'), href: '/users', icon: Users, roles: ['DRB','DGB'] },
    { name: t('reports'), href: '/reports', icon: BarChart3, roles: ['CF','DRB'] },
    { name: t('profile'), href: '/profile', icon: UserCircle, roles: ['CF','DRB','DGB'] },
  ].filter(i => i.roles.includes(user?.role || 'CF'));

  return (
    <div className={`${isCollapsed ? 'w-18' : 'w-72'} bg-gradient-to-b from-white to-blue-50 shadow-xl transition-all duration-300 flex flex-col border-r border-gray-200`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">{user?.email?.charAt(0).toUpperCase()}</div>
            <div>
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
              <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">{user?.role}</span>
            </div>
          </div>
        )}
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          {isCollapsed ? (isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />) : (isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />)}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${isCollapsed ? 'justify-center' : 'justify-start'} flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive ? 'bg-brand-gradient text-white shadow-sm' : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white border border-gray-200 px-3 py-2">
              <p className="text-xs text-gray-500">Wilaya</p>
              <p className="text-sm font-medium text-gray-900">{user?.wilaya_name || '-'}</p>
            </div>
            <div className="rounded-lg bg-white border border-gray-200 px-3 py-2">
              <p className="text-xs text-gray-500">Langue</p>
              <p className="text-sm font-medium text-gray-900">{isRTL ? 'العربية' : 'Français'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
