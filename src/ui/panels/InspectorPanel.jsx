import React from 'react';
import { MousePointer2, Trash2, Info, Settings } from 'lucide-react';
import { useCADStore } from '../../store/cadStore';

const PropertyInput = ({ label, children }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">{label}</label>
    </div>
    {children}
  </div>
);

const MetricCard = ({ label, value }) => (
  <div className="bg-black/40 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors">
    <div className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mb-1">{label}</div>
    <div className="text-xs text-white font-mono font-bold">{value}</div>
  </div>
);

export default function InspectorPanel() {
  const { objects, selectedId, updateObject, removeObject } = useCADStore();
  const selectedObject = objects.find(o => o.id === selectedId);

  if (!selectedObject) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
        <MousePointer2 className="w-10 h-10 mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-widest">No Active Selection</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-8">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-3 h-3" /> Identity
          </h3>
          <button onClick={() => removeObject(selectedId)} className="text-zinc-600 hover:text-red-500 transition-colors">
             <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-4">
          <PropertyInput label="Entity Name">
            <input
              type="text"
              value={selectedObject.name}
              onChange={(e) => updateObject(selectedId, { name: e.target.value })}
              className="bg-black/40 border border-white/10 rounded px-2.5 py-1.5 w-full text-[11px] outline-none focus:border-blue-500 transition-all"
            />
          </PropertyInput>
          <PropertyInput label="Visual Style">
             <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedObject.color}
                  onChange={(e) => updateObject(selectedId, { color: e.target.value })}
                  className="bg-transparent border-none w-10 h-6 cursor-pointer p-0 block rounded"
                />
                <span className="text-[10px] font-mono text-zinc-500">{selectedObject.color.toUpperCase()}</span>
             </div>
          </PropertyInput>
        </div>
      </section>

      <section>
        <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Settings className="w-3 h-3" /> Parametric Kernel
        </h3>
        <div className="space-y-4">
          {Object.entries(selectedObject.params).map(([key, value]) => (
            <PropertyInput key={key} label={key.replace(/([A-Z])/g, ' $1')}>
              {typeof value === 'number' ? (
                <input
                  type="number"
                  value={value}
                  step={key === 'thickness' ? 0.1 : 1}
                  onChange={(e) => updateObject(selectedId, {
                    params: { ...selectedObject.params, [key]: parseFloat(e.target.value) }
                  })}
                  className="bg-black/40 border border-white/10 rounded px-2.5 py-1.5 w-full text-[11px] font-mono outline-none focus:border-blue-500 transition-all"
                />
              ) : typeof value === 'boolean' ? (
                <div
                  onClick={() => updateObject(selectedId, { params: { ...selectedObject.params, [key]: !value } })}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${value ? 'bg-blue-600' : 'bg-zinc-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${value ? 'left-6' : 'left-1'}`} />
                </div>
              ) : (
                <select
                  value={value}
                  onChange={(e) => updateObject(selectedId, {
                    params: { ...selectedObject.params, [key]: e.target.value }
                  })}
                  className="bg-black/40 border border-white/10 rounded px-2 py-1.5 w-full text-[11px] outline-none focus:border-blue-500 appearance-none transition-all"
                >
                  <option value="none">None</option>
                  <option value="finger">Finger Joint</option>
                  <option value="tab">Tab & Slot</option>
                </select>
              )}
            </PropertyInput>
          ))}
        </div>
      </section>

      <section className="pt-6 border-t border-white/5">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="Volume" value={`${(selectedObject.params.width * selectedObject.params.height * (selectedObject.params.depth || 1) / 1000).toFixed(1)} cm³`} />
          <MetricCard label="Cutting Len" value={`${((selectedObject.params.width + selectedObject.params.height) * 4 / 10).toFixed(1)} cm`} />
        </div>
      </section>
    </div>
  );
}
