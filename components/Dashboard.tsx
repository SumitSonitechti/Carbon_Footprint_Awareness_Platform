'use client';

import React from 'react';
import { GeminiResponse } from '@/lib/gemini';
import ImpactChart from './ImpactChart';

interface DashboardProps {
  breakdown: {
    transportation: number;
    energy: number;
    diet: number;
    waste: number;
  };
  total: number;
  aiTip: GeminiResponse;
  onReset: () => void;
}

export default function Dashboard({ breakdown, total, aiTip, onReset }: DashboardProps) {
  // Determine climate rating category
  let rating = { label: 'Moderate', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900', desc: 'Your carbon output is close to the average, but there is clear room for easy adjustments.' };
  
  if (total < 2.0) {
    rating = { label: 'Climate Hero', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900', desc: 'Amazing! Your footprint aligns with the global target of 2.0 tons per year needed to combat climate change.' };
  } else if (total > 5.0 && total <= 10.0) {
    rating = { label: 'High Impact', color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900', desc: 'Your footprint is above global averages. Implementing target changes in transport or diet can reduce it rapidly.' };
  } else if (total > 10.0) {
    rating = { label: 'Critical Impact', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900', desc: 'Your footprint is very high. Focus on your highest carbon hotspot to make major initial savings.' };
  }

  // Get matching icon for AI Tip Hot Spot Category
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('transport')) return '🚗';
    if (cat.includes('energy') || cat.includes('home')) return '🏠';
    if (cat.includes('diet') || cat.includes('food')) return '🥗';
    return '🛍️';
  };

  return (
    <div className="w-full max-w-4xl space-y-8 animate-fadeIn">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Score Card */}
        <div className="p-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Annual Footprint
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                {total}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                tons CO₂e
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs">
            <span className="text-slate-400 dark:text-slate-500">Global Avg:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-350">4.5 tons</span>
          </div>
        </div>

        {/* Rating Card */}
        <div className="p-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Sustainability Tier
            </span>
            <div className="mt-2.5">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${rating.color}`}>
                {rating.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
              {rating.desc}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs">
            <span className="text-slate-400 dark:text-slate-500">Target Benchmark:</span>
            <span className="font-bold text-emerald-500">2.0 tons</span>
          </div>
        </div>

        {/* Benchmark Visualizer Card */}
        <div className="p-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Climate Progress
            </span>
            <div className="space-y-3 mt-4">
              <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    total < 2.0 
                      ? 'bg-emerald-500' 
                      : total <= 5.0 
                      ? 'bg-amber-500' 
                      : total <= 10.0 
                      ? 'bg-orange-500' 
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min((total / 15) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase">
                <span>Hero (2.0)</span>
                <span>Avg (4.5)</span>
                <span>High (10.0)</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
            {total <= 2.0 
              ? 'Keep up the excellent lifestyle habits!' 
              : `Reduce your carbon by ${(total - 2.0).toFixed(1)} tons to meet international sustainability goals.`
            }
          </p>
        </div>
      </div>

      {/* Main Breakdown Section with Chart */}
      <ImpactChart breakdown={breakdown} total={total} />

      {/* AI hot-spot tip card */}
      <div className="relative p-6 md:p-8 bg-slate-900 dark:bg-slate-950 text-white rounded-3xl shadow-2xl overflow-hidden group">
        {/* Glow ambient background inside the dark card */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center gap-6 z-10">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/15">
            {getCategoryIcon(aiTip.category)}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xs font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Carbon Hot Spot
              </span>
              <span className="text-sm font-bold text-slate-350">
                in {aiTip.category}
              </span>
            </div>
            
            <h3 className="text-xl font-bold tracking-tight text-white">
              Actionable AI Tip
            </h3>
            
            <p className="text-sm leading-relaxed text-slate-300 antialiased font-medium">
              {aiTip.tip}
            </p>
          </div>
        </div>
      </div>

      {/* Re-calculate Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onReset}
          className="px-8 py-3.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-250 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl font-bold text-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-sm"
        >
          🔄 Modify Inputs & Recalculate
        </button>
      </div>
    </div>
  );
}
