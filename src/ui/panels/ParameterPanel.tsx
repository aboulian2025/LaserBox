import React from 'react';
import { Sliders } from 'lucide-react';
import { useCADStore } from '../../store/cadStore';

const PropertyInput = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">{label}</label>
    </div>
    {children}
  </div>
);

export default function ParameterPanel() {
  const { objects, selectedId, updateObject } = useCADStore();
  const selectedObject = objects.find(o => o.id === selectedId);

  if (!selectedObject) return (
    <div className="p-8 text-center opacity-20 flex flex-col items-center gap-4">
      <Sliders className="w-12 h-12" />
      <span className="text-[10px] uppercase font-bold tracking-widest">Select an Object</span>
    </div>
  );

  const handleParamChange = (key: string, value: any) => {
    if (!selectedId) return;
    updateObject(selectedId, {
      params: { ...selectedObject.params, [key]: value }
    });
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-3">
        <Sliders className="w-4 h-4 text-blue-500" />
        <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Parameters</h3>
      </div>

      <div className="space-y-5">
        {Object.entries(selectedObject.params).map(([key, value]) => {
          const displayLabel = key.replace(/([A-Z])/g, ' $1').toUpperCase();

          return (
            <PropertyInput key={key} label={displayLabel}>
              {typeof value === 'number' ? (
                <div className="flex gap-2">
                  <input
                    type="range"
                    min={key === 'thickness' ? 0.5 : 5}
                    max={key === 'thickness' ? 20 : 500}
                    step={key === 'thickness' ? 0.1 : 1}
                    value={value}
                    onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleParamChange(key, parseFloat(e.target.value) || 0)}
                    className="bg-black/40 border border-white/10 rounded px-2 py-1 w-16 text-[11px] font-mono outline-none focus:border-blue-500 transition-all text-right text-white"
                  />
                </div>
              ) : typeof value === 'boolean' ? (
                <button
                  onClick={() => handleParamChange(key, !value)}
                  className={`w-full py-2 rounded border text-[10px] font-bold tracking-widest transition-all ${
                    value ? "bg-blue-600/20 border-blue-500 text-blue-400" : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20"
                  }`}
                >
                  {value ? "ENABLED" : "DISABLED"}
                </button>
              ) : key === 'jointType' ? (
                <select
                  value={value as string}
                  onChange={(e) => handleParamChange(key, e.target.value)}
                  className="bg-black/40 border border-white/10 rounded px-2 py-2 w-full text-[11px] outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer text-white"
                >
                  <option value="none">None</option>
                  <option value="finger">Finger Joint</option>
                  <option value="tab">Tab & Slot</option>
                </select>
              ) : key === 'dimensionType' ? (
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                  <button
                    onClick={() => handleParamChange(key, 'inside')}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                      value === 'inside' ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    INSIDE
                  </button>
                  <button
                    onClick={() => handleParamChange(key, 'outside')}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                      value === 'outside' ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    OUTSIDE
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) => handleParamChange(key, e.target.value)}
                  className="bg-black/40 border border-white/10 rounded px-2.5 py-1.5 w-full text-[11px] outline-none focus:border-blue-500 transition-all text-white"
                />
              )}
            </PropertyInput>
          );
        })}
      </div>
    </div>
  );
}
