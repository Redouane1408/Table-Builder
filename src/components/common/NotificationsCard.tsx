"use client";
import React, { useEffect, useState } from 'react';
import { mockApi } from '@/lib/mockData';

const NotificationsCard: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      const data = await mockApi.getNotifications();
      setItems(data);
    };
    load();
  }, []);
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border p-4 z-50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900">Notifications</h4>
        <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-700">Fermer</button>
      </div>
      <div className="space-y-3">
        {items.map((n) => (
          <div key={n.id} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${n.type === 'success' ? 'bg-green-500' : n.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{n.title}</p>
              <p className="text-xs text-gray-600">{n.description}</p>
              <p className="text-xs text-gray-400 mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsCard;

