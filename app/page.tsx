'use client';

import React, { useState } from 'react';
import InputForm from '@/components/InputForm';
import Dashboard from '@/components/Dashboard';
import { CarbonInputs, GeminiResponse } from '@/lib/gemini';

interface CalculationResult {
  breakdown: {
    transportation: number;
    energy: number;
    diet: number;
    waste: number;
  };
  total: number;
  aiTip: GeminiResponse;
}

export default function Home() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (inputs: CarbonInputs) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      if (!res.ok) {
        throw new Error('Calculation request failed');
      }

      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        throw new Error(data.error || 'Failed to calculate carbon footprint');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            🌱 hackathon prototype
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            footprint<span className="text-emerald-500 font-normal">.ai</span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-550 dark:text-slate-400 font-medium leading-relaxed">
            Understand your carbon footprint in seconds. Provide your daily lifestyle inputs to receive personalized, AI-driven reduction tips.
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="w-full max-w-xl p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-start gap-3.5 text-rose-800 dark:text-rose-350 text-sm animate-fadeIn">
            <span className="text-lg">⚠️</span>
            <div className="flex-1">
              <h4 className="font-bold">Calculation Failed</h4>
              <p className="mt-0.5 font-medium opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Switch Views */}
        {!result ? (
          <div className="w-full flex justify-center animate-fadeIn">
            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <Dashboard 
            breakdown={result.breakdown} 
            total={result.total} 
            aiTip={result.aiTip} 
            onReset={handleReset} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-2xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
        CARBON FOOTPRINT AWARENESS PLATFORM &copy; 2026
      </footer>
    </div>
  );
}

