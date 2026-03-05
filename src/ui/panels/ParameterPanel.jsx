import React from 'react';
import { Settings, Sliders } from 'lucide-react';
import { useCADStore } from '../../store/cadStore';

const PropertyInput = ({ label, children }) => (
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

  if (!selectedObject) return null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Sliders className="w-3.5 h-3.5 text-blue-500" />
        <h3 className="text-[10px] font-bold text-white uppercase tracking-wider">Parameters</h3>
      </div>

      <div className="space-y-4">
        {Object.entries(selectedObject.params).map(([key, value]) => (
          <PropertyInput key={key} label={key.replace(/([A-Z])/g, ' $1')}>
            {typeof value === 'number' ? (
              <input
                type="number"
                value={value}
                onChange={(e) => updateObject(selectedId, {
                  params: { ...selectedObject.params, [key]: parseFloat(e.target.value) }
                })}
                className="bg-black/40 border border-white/10 rounded px-2.5 py-1.5 w-full text-[11px] font-mono outline-none focus:border-blue-500 transition-all"
              />
            ) : typeof value === 'boolean' ? (
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateObject(selectedId, {
                  params: { ...selectedObject.params, [key]: e.target.checked }
                })}
                className="w-4 h-4 accent-blue-600"
              />
            ) : (
              <select
                value={value}
                onChange={(e) => updateObject(selectedId, {
                  params: { ...selectedObject.params, [key]: e.target.value }
                })}
                className="bg-black/40 border border-white/10 rounded px-2 py-1.5 w-full text-[11px] outline-none focus:border-blue-500"
              >
                <option value="none">None</option>
                <option value="finger">Finger Joint</option>
                <option value="tab">Tab & Slot</option>
              </select>
            )}
          </PropertyInput>
        ))}
      </div>
    </div>
  );
}
