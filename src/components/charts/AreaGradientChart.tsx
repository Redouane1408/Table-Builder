"use client";
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface AreaGradientChartProps<T extends Record<string, any>> {
  title?: string;
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  height?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

const AreaGradientChart = <T extends Record<string, any>>({ title, data, xKey, yKey, height = 300, gradientFrom = '#3b82f6', gradientTo = 'rgba(59, 130, 246, 0.2)' }: AreaGradientChartProps<T>) => {
  const gradientId = `area-gradient-${String(xKey)}-${String(yKey)}`;
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientFrom} stopOpacity={0.9} />
              <stop offset="95%" stopColor={gradientTo} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={String(xKey)} />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey={String(yKey)} stroke={gradientFrom} fill={`url(#${gradientId})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaGradientChart;

