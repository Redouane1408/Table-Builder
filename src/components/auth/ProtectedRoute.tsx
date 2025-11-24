"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: Array<'CF'|'DRB'|'DGB'> }> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
    else if (allowedRoles && user && !allowedRoles.includes(user.role)) router.replace('/dashboard');
  }, [isAuthenticated, allowedRoles, user, router]);
  if (!isAuthenticated) return null;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null;
  return <>{children}</>;
};

export default ProtectedRoute;

