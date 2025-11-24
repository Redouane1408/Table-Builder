"use client";
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface BarHorizontalChartProps<T extends Record<string, any>> {
  title?: string;
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  height?: number;
  color?: string;
}

const BarHorizontalChart = <T extends Record<string, any>>({ title, data, xKey, yKey, height = 300, color = '#10b981' }: BarHorizontalChartProps<T>) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey={String(yKey)} width={100} />
          <Tooltip />
          <Bar dataKey={String(xKey)} fill={color} radius={[4, 4, 4, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarHorizontalChart;

