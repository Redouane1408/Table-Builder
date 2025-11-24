"use client";
import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

type PieDatum = { name: string; value: number; color?: string };
interface PieInteractiveProps { title?: string; data: PieDatum[]; height?: number; innerRadius?: number; outerRadius?: number }
const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const PieInteractive: React.FC<PieInteractiveProps> = ({ title, data, height = 220, innerRadius = 60, outerRadius = 80 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data.map((d, i) => ({ ...d, color: d.color || defaultColors[i % defaultColors.length] }))}
            cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius + (hoveredIndex !== null ? 4 : 0)} dataKey="value"
            onMouseEnter={(_, index) => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || defaultColors[index % defaultColors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.map((d, i) => (
          <button key={d.name} className={`flex items-center gap-2 text-xs px-2 py-1 rounded-md border ${hoveredIndex === i ? 'border-blue-500 text-blue-700' : 'border-gray-200 text-gray-600'}`} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: d.color || defaultColors[i % defaultColors.length] }} />
            {d.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PieInteractive;
