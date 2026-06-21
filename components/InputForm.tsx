'use client';

import React, { useState } from 'react';
import { CarbonInputs } from '@/lib/gemini';

interface InputFormProps {
  onSubmit: (inputs: CarbonInputs) => void;
  isLoading: boolean;
}

type TabType = 'transport' | 'energy' | 'diet' | 'consumption';

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>('transport');
  const [inputs, setInputs] = useState<CarbonInputs>({
    carMilesPerWeek: 40,
    carType: 'petrol',
    publicTransitHoursPerWeek: 2,
    flightsPerYear: 1,
    electricityKwhPerMonth: 250,
    heatingSource: 'gas',
    cleanEnergyPercent: 10,
    dietType: 'meat-average',
    recyclePercent: 40,
    shoppingHabits: 'average',
  });

  const handleChange = (key: keyof CarbonInputs, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeTab === 'transport') setActiveTab('energy');
    else if (activeTab === 'energy') setActiveTab('diet');
    else if (activeTab === 'diet') setActiveTab('consumption');
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeTab === 'energy') setActiveTab('transport');
    else if (activeTab === 'diet') setActiveTab('energy');
    else if (activeTab === 'consumption') setActiveTab('diet');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'transport', label: 'Transport', icon: '🚗' },
    { id: 'energy', label: 'Energy', icon: '🏠' },
    { id: 'diet', label: 'Diet', icon: '🥗' },
    { id: 'consumption', label: 'Consumption', icon: '🛍️' },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-center font-medium text-sm transition-all duration-200 border-b-2 flex flex-col md:flex-row items-center justify-center gap-1.5 ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900/40'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="text-xs md:text-sm font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="p-6 md:p-8 space-y-6">
        
        {/* TRANSPORT TAB */}
        {activeTab === 'transport' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span>🚗</span> Travel & Commuting
            </h3>
            
            {/* Car Type */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Primary Vehicle Fuel Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {[
                  { value: 'petrol', label: 'Petrol', icon: '⛽' },
                  { value: 'diesel', label: 'Diesel', icon: '🚛' },
                  { value: 'hybrid', label: 'Hybrid', icon: '🔄' },
                  { value: 'electric', label: 'Electric', icon: '⚡' },
                  { value: 'none', label: 'None', icon: '🚶' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange('carType', opt.value)}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                      inputs.carType === opt.value
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-xs">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Car Miles */}
            {inputs.carType !== 'none' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Weekly Car Mileage
                  </label>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {inputs.carMilesPerWeek} miles / week
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={inputs.carMilesPerWeek}
                  onChange={(e) => handleChange('carMilesPerWeek', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-2xs text-slate-400 dark:text-slate-500">
                  <span>0 mi</span>
                  <span>250 mi</span>
                  <span>500 mi+</span>
                </div>
              </div>
            )}

            {/* Public Transit */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Public Transit Usage
                </label>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {inputs.publicTransitHoursPerWeek} hours / week
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={inputs.publicTransitHoursPerWeek}
                onChange={(e) => handleChange('publicTransitHoursPerWeek', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-2xs text-slate-400 dark:text-slate-500">
                <span>0 hrs</span>
                <span>20 hrs</span>
                <span>40 hrs+</span>
              </div>
            </div>

            {/* Flights */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Flights per Year (Short & Long Haul)
                </label>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {inputs.flightsPerYear} flights / year
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={inputs.flightsPerYear}
                onChange={(e) => handleChange('flightsPerYear', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-2xs text-slate-400 dark:text-slate-500">
                <span>0 flights</span>
                <span>10 flights</span>
                <span>20 flights+</span>
              </div>
            </div>
          </div>
        )}

        {/* ENERGY TAB */}
        {activeTab === 'energy' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span>🏠</span> Home Energy Consumption
            </h3>

            {/* Electricity Kwh */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Monthly Electricity Usage
                </label>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {inputs.electricityKwhPerMonth} kWh / month
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1500"
                step="50"
                value={inputs.electricityKwhPerMonth}
                onChange={(e) => handleChange('electricityKwhPerMonth', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-2xs text-slate-400 dark:text-slate-500">
                <span>0 kWh</span>
                <span>750 kWh</span>
                <span>1500 kWh+</span>
              </div>
            </div>

            {/* Clean Energy % */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Clean/Renewable Energy Share
                </label>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {inputs.cleanEnergyPercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={inputs.cleanEnergyPercent}
                onChange={(e) => handleChange('cleanEnergyPercent', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-2xs text-slate-400 dark:text-slate-500">
                <span>0% (Grid Average)</span>
                <span>50%</span>
                <span>100% (Solar/Green Tarif)</span>
              </div>
            </div>

            {/* Heating Source */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Home Heating Source
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'gas', label: 'Natural Gas', icon: '🔥' },
                  { value: 'electricity', label: 'Heat Pump', icon: '💨' },
                  { value: 'oil', label: 'Heating Oil', icon: '🛢️' },
                  { value: 'renewable', label: 'Biomass/Solar', icon: '🌱' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange('heatingSource', opt.value)}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                      inputs.heatingSource === opt.value
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-xs">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DIET TAB */}
        {activeTab === 'diet' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span>🥗</span> Dietary Habits
            </h3>

            {/* Diet Type */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Choose your dietary style
              </label>
              <div className="space-y-2">
                {[
                  {
                    value: 'meat-heavy',
                    label: 'Meat-Heavy Diet',
                    desc: 'Eat beef, pork, or poultry almost daily',
                    icon: '🥩',
                  },
                  {
                    value: 'meat-average',
                    label: 'Average Diet',
                    desc: 'Balanced meat, fish, and plant food consumption',
                    icon: '🍗',
                  },
                  {
                    value: 'pescatarian',
                    label: 'Pescatarian Diet',
                    desc: 'Fish and plant-based foods, no red meat or poultry',
                    icon: '🐟',
                  },
                  {
                    value: 'vegetarian',
                    label: 'Vegetarian Diet',
                    desc: 'No meat or fish, but include dairy & eggs',
                    icon: '🧀',
                  },
                  {
                    value: 'vegan',
                    label: 'Vegan Diet',
                    desc: 'Strictly plant-based foods, no animal products',
                    icon: '🌿',
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange('dietType', opt.value)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-4 ${
                      inputs.dietType === opt.value
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-300 font-medium'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-2xl p-2 bg-slate-100 dark:bg-slate-850 rounded-xl">
                      {opt.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONSUMPTION TAB */}
        {activeTab === 'consumption' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span>🛍️</span> Consumption & Waste
            </h3>

            {/* Shopping Habits */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Shopping & Spending Habits
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    value: 'minimal',
                    label: 'Minimalist',
                    desc: 'Buy only essential products and clothes, prefer secondhand',
                    icon: '🎒',
                  },
                  {
                    value: 'average',
                    label: 'Average Consumer',
                    desc: 'Moderate buying habits, occasional upgrades & new clothes',
                    icon: '🛒',
                  },
                  {
                    value: 'frequent',
                    label: 'Frequent Shopper',
                    desc: 'Regularly purchase new items, gadgets, and fast fashion',
                    icon: '📦',
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange('shoppingHabits', opt.value)}
                    className={`p-4 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                      inputs.shoppingHabits === opt.value
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-300 font-medium'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {opt.label}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recycle % */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Waste Recycling Rate
                </label>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {inputs.recyclePercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={inputs.recyclePercent}
                onChange={(e) => handleChange('recyclePercent', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-2xs text-slate-400 dark:text-slate-500">
                <span>0% (None)</span>
                <span>50%</span>
                <span>100% (Full sorting)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Button Controls */}
      <div className="flex justify-between items-center p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/25">
        <div>
          {activeTab !== 'transport' && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-200"
            >
              Back
            </button>
          )}
        </div>
        
        <div>
          {activeTab !== 'consumption' ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-700 dark:hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Next Category
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-500 dark:hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/25 dark:shadow-none transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Calculating...
                </span>
              ) : (
                'Calculate Footprint'
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
