import React from 'react';
import { MousePointer2, Trash2, Info, Settings } from 'lucide-react';
import { useCADStore } from '../../store/cadStore';

const PropertyInput = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">{label}</label>
    </div>
    {children}
  </div>
);

export default function InspectorPanel() {
  const { objects, selectedId, updateObject, removeObject } = useCADStore();
  const selectedObject = objects.find(o => o.id === selectedId);

  if (!selectedObject) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center opacity-30">
        <MousePointer2 className="w-10 h-10 mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-4">No Active Selection</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-8">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-3 h-3 text-blue-500" /> Identity
          </h3>
          <button
            onClick={() => selectedId && removeObject(selectedId)}
            className="p-1 text-zinc-600 hover:text-red-500 transition-colors"
            title="Delete Object"
          >
             <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-4">
          <PropertyInput label="Entity Name">
            <input
              type="text"
              value={selectedObject.name}
              onChange={(e) => selectedId && updateObject(selectedId, { name: e.target.value })}
              className="bg-black/40 border border-white/10 rounded px-2.5 py-1.5 w-full text-[11px] outline-none focus:border-blue-500 transition-all text-white font-medium"
            />
          </PropertyInput>
          <PropertyInput label="Appearance">
             <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedObject.color}
                  onChange={(e) => selectedId && updateObject(selectedId, { color: e.target.value })}
                  className="bg-transparent border-none w-10 h-6 cursor-pointer p-0 block rounded overflow-hidden"
                />
                <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase">{selectedObject.color}</span>
             </div>
          </PropertyInput>
        </div>
      </section>

      <section className="pt-2">
        <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Settings className="w-3 h-3 text-blue-500" /> Geometry Context
        </h3>
        <div className="bg-black/20 rounded-lg border border-white/5 p-3 space-y-2">
           <div className="flex justify-between">
              <span className="text-[9px] text-zinc-500 uppercase">Class</span>
              <span className="text-[10px] text-white font-bold uppercase">{selectedObject.type}</span>
           </div>
           <div className="flex justify-between">
              <span className="text-[9px] text-zinc-500 uppercase">State</span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase">Manifold</span>
           </div>
        </div>
      </section>
    </div>
  );
}
