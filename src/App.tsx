import React, { useEffect, useRef, useState } from 'react';
import { useCADStore } from './store/cadStore';
import { SceneManager } from './scene/sceneManager';
import {
  Box,
  Plus,
  Settings,
  MousePointer2,
  Move,
  BoxSelect,
  Activity,
  Zap,
  Sliders,
  Scissors,
  ChevronRight,
  Layers,
  Calculator,
  Download,
  Circle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import InspectorPanel from './ui/panels/InspectorPanel';
import ScenePanel from './ui/panels/ScenePanel';
import ExportPanel from './ui/panels/ExportPanel';
import ParameterPanel from './ui/panels/ParameterPanel';
import ViewportControls from './ui/panels/ViewportControls';
import EngineeringPanel from './ui/panels/EngineeringPanel';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const {
    objects,
    selectedId,
    viewMode,
    explodedView,
    showWireframe,
    gridVisible,
    addObject,
    setViewMode,
  } = useCADStore();

  const viewportRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const [activeTab, setActiveTab] = useState('inspector');
  const [initialized, setInitialized] = useState(false);

  // تهيئة المحرك لمرة واحدة فقط
  useEffect(() => {
    if (viewportRef.current && !sceneManagerRef.current) {
      sceneManagerRef.current = new SceneManager(viewportRef.current);
      setInitialized(true);
    }
    return () => {
      sceneManagerRef.current?.dispose();
      sceneManagerRef.current = null;
    };
  }, []);

  // تحديث النماذج عند تغيير أي بارامتر
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.updateObjects(objects, selectedId, explodedView, showWireframe, viewMode, gridVisible);
    }
  }, [objects, selectedId, explodedView, showWireframe, viewMode, gridVisible, initialized]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0a0a] text-zinc-300 font-sans overflow-hidden">
      <header className="h-14 border-b border-white/5 bg-[#111111] flex items-center px-4 gap-6 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="font-black text-xs tracking-[0.3em] text-white uppercase">LASERBOX</span>
            <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">STUDIO ADVANCED</span>
          </div>
        </div>

        <nav className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5">
          <button
            onClick={() => setViewMode('3d')}
            className={cn(
              "px-5 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase",
              viewMode === '3d' ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            3D VIEW
          </button>
          <button
            onClick={() => setViewMode('flat')}
            className={cn(
              "px-5 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase",
              viewMode === 'flat' ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            FABRICATION
          </button>
        </nav>

        {/* أزرار إضافة الأشكال الجديدة */}
        <div className="flex items-center bg-black/20 rounded-lg p-1 border border-white/5 ml-4 gap-1">
          <button
            onClick={() => addObject('box')}
            className="p-2 hover:bg-white/5 rounded text-zinc-400 hover:text-blue-400 transition-colors"
            title="Add Interlocking Box"
          >
            <Box size={18} />
          </button>
          <button
            onClick={() => addObject('bayonet')}
            className="p-2 hover:bg-white/5 rounded text-zinc-400 hover:text-orange-400 transition-colors"
            title="Add Bayonet Lock Box"
          >
            <Circle size={18} />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Engine Stable</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 bg-[#111111] border-r border-white/5 flex flex-col shadow-xl z-20">
          <div className="p-4 border-b border-white/5 flex items-center gap-2 text-blue-500">
            <Sliders className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Parameters</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <ParameterPanel />
          </div>
        </aside>

        <main className="flex-1 bg-[#0a0a0a] relative overflow-hidden">
          <div ref={viewportRef} className="w-full h-full cursor-move" />
          <ViewportControls sceneManager={sceneManagerRef.current} />
          <div className="absolute bottom-6 left-6 pointer-events-none opacity-40">
            <div className="text-[9px] text-zinc-500 font-mono tracking-[0.2em] uppercase">
              1:1 Metric Precision | Layered Assembly
            </div>
          </div>
        </main>

        <aside className="w-80 bg-[#111111] border-l border-white/5 flex flex-col shadow-xl z-20">
          <div className="flex border-b border-white/5 bg-black/40">
            <TabButton active={activeTab === 'inspector'} onClick={() => setActiveTab('inspector')} label="Inspector" />
            <TabButton active={activeTab === 'scene'} onClick={() => setActiveTab('scene')} label="Scene" />
            <TabButton active={activeTab === 'export'} onClick={() => setActiveTab('export')} label="Export" />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'inspector' && (
              <div className="flex flex-col">
                <InspectorPanel />
                <EngineeringPanel />
              </div>
            )}
            {activeTab === 'scene' && <ScenePanel />}
            {activeTab === 'export' && <ExportPanel />}
          </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}} />
    </div>
  );
}

function TabButton({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all border-b-2",
        active ? "text-blue-500 border-blue-500 bg-blue-500/5" : "text-zinc-600 border-transparent hover:text-zinc-400"
      )}
    >
      {label}
    </button>
  );
}
