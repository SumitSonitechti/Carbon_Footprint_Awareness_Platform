'use client';

import React from 'react';

interface ImpactChartProps {
  breakdown: {
    transportation: number;
    energy: number;
    diet: number;
    waste: number;
  };
  total: number;
}

export default function ImpactChart({ breakdown, total }: ImpactChartProps) {
  const data = [
    { name: 'Transportation', value: breakdown.transportation, color: '#10b981', icon: '🚗' }, // emerald-500
    { name: 'Home Energy', value: breakdown.energy, color: '#f59e0b', icon: '🏠' }, // amber-500
    { name: 'Diet', value: breakdown.diet, color: '#ec4899', icon: '🥗' }, // pink-500
    { name: 'Waste & Consumption', value: breakdown.waste, color: '#3b82f6', icon: '🛍️' }, // blue-500
  ];

  // Filter out zero values for calculation, but keep them for display
  const nonZeroTotal = total > 0 ? total : 1;

  // SVG calculations
  const radius = 50;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius; // ~314.16

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-xl w-full">
      {/* SVG Donut */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Base track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            className="dark:stroke-slate-850"
            strokeWidth={strokeWidth}
          />
          
          {total === 0 ? (
            // If total is 0, show a grey circle
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke="#cbd5e1"
              strokeWidth={strokeWidth}
            />
          ) : (
            data.map((item) => {
              const percent = item.value / nonZeroTotal;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = circumference - (accumulatedPercent * circumference);
              
              accumulatedPercent += percent;

              if (item.value === 0) return null;

              return (
                <circle
                  key={item.name}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out hover:stroke-[14px] cursor-pointer"
                  style={{ transformOrigin: 'center' }}
                />
              );
            })
          )}
        </svg>

        {/* Center Labels */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {total}
          </span>
          <span className="text-2xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
            Tons CO₂e / yr
          </span>
        </div>
      </div>

      {/* Legend & Breakdown */}
      <div className="flex-1 w-full space-y-3.5">
        <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Emission Sources
        </h4>
        
        <div className="grid grid-cols-1 gap-2.5">
          {data.map((item) => {
            const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div 
                key={item.name}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{item.icon}</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-150">
                    {item.value} t
                  </span>
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 ml-2">
                    ({percent}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
