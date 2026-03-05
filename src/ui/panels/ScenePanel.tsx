import React from 'react';
import { Layers, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useCADStore } from '../../store/cadStore';

export default function ScenePanel() {
  const { objects, selectedId, selectObject, updateObject, removeObject } = useCADStore();

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Layers className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-white">Scene Tree</span>
      </div>
      <div className="flex flex-col gap-1">
        {objects.map(obj => (
          <div
            key={obj.id}
            onClick={() => selectObject(obj.id)}
            className={`
              group flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-all border
              ${selectedId === obj.id
                ? "bg-blue-600/10 border-blue-500/30 text-blue-400"
                : "hover:bg-white/5 border-transparent text-zinc-400"}
            `}
          >
            <div className={`w-2 h-2 rounded-full ${obj.type === 'box' ? "bg-blue-500" : "bg-emerald-500"}`} />
            <span className="truncate flex-1 font-medium">{obj.name}</span>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { visible: !obj.visible }); }}
                className="p-1 hover:text-white"
              >
                {obj.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); removeObject(obj.id); }}
                className="p-1 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
