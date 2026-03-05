import React, { useEffect, useRef, useState } from 'react';
import { useCADStore } from './store/cadStore';
import { SceneManager } from './scene/sceneManager';
import {
  Box,
  Grid,
  Layers,
  Maximize,
  Plus,
  Settings,
  MousePointer2,
  Move,
  BoxSelect,
  Activity,
  Zap,
  Calculator
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import InspectorPanel from './ui/panels/InspectorPanel';
import ScenePanel from './ui/panels/ScenePanel';
import ExportPanel from './ui/panels/ExportPanel';
import ParameterPanel from './ui/panels/ParameterPanel';
import ViewportControls from './ui/panels/ViewportControls';
import EngineeringPanel from './ui/panels/EngineeringPanel';

function cn(...inputs) {
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
    setExplodedView,
    toggleWireframe,
    toggleGrid
  } = useCADStore();

  const viewportRef = useRef(null);
  const [sceneManager, setSceneManager] = useState(null);
  const [activeTab, setActiveTab] = useState('inspector');

  useEffect(() => {
    if (viewportRef.current && !sceneManager) {
      const manager = new SceneManager(viewportRef.current);
      setSceneManager(manager);
    }
    return () => {
      if (sceneManager) {
        sceneManager.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (sceneManager) {
      sceneManager.updateObjects(objects, selectedId, explodedView, showWireframe, viewMode, gridVisible);
    }
  }, [objects, selectedId, explodedView, showWireframe, viewMode, gridVisible, sceneManager]);

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-zinc-300 font-sans overflow-hidden selection:bg-blue-500/30">
      {/* Sidebar - Tools */}
      <div className="w-14 flex flex-col items-center py-4 border-r border-white/5 bg-[#111111] z-20 shadow-xl">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-6 shadow-lg shadow-blue-500/20">
          <Zap className="w-5 h-5 text-white" />
        </div>

        <div className="flex flex-col gap-2">
          <ToolButton icon={<MousePointer2 />} active={true} tooltip="Select (V)" />
          <ToolButton icon={<Move />} tooltip="Transform (T)" />
          <ToolButton icon={<BoxSelect />} tooltip="Boolean Ops" />
        </div>

        <div className="h-px w-8 bg-white/5 my-4" />

        <div className="flex flex-col gap-2">
          <ToolButton icon={<Box />} onClick={() => addObject('box')} tooltip="New Parametric Box" />
          <ToolButton icon={<Plus className="rotate-45" />} onClick={() => addObject('cylinder')} tooltip="New Cylinder" />
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <ToolButton icon={<Settings />} tooltip="System Settings" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-12 border-b border-white/5 bg-[#111111] flex items-center px-4 gap-6 z-10">
          <div className="flex items-center gap-2">
            <span className="font-black text-xs tracking-[0.2em] text-white">LASERBOX <span className="text-blue-500">STUDIO</span></span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[8px] font-bold border border-blue-500/20">ADVANCED</span>
          </div>

          <nav className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/5">
            <button
              onClick={() => setViewMode('3d')}
              className={cn(
                "px-4 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider",
                viewMode === '3d' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              3D Perspective
            </button>
            <button
              onClick={() => setViewMode('flat')}
              className={cn(
                "px-4 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider",
                viewMode === 'flat' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              2D Fabrication
            </button>
          </nav>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-1">
            <ToolbarAction icon={<Grid />} active={gridVisible} onClick={toggleGrid} label="Grid" />
            <ToolbarAction icon={<Layers />} active={showWireframe} onClick={toggleWireframe} label="Wire" />
            <ToolbarAction icon={<Maximize />} active={explodedView} onClick={() => setExplodedView(!explodedView)} label="Explode" />
          </div>
        </header>

        {/* Viewport */}
        <main ref={viewportRef} className="flex-1 bg-[#0e0e0e] relative cursor-crosshair">
          <ViewportControls sceneManager={sceneManager} />
          <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-4">
             <div className="bg-black/40 backdrop-blur-md border border-white/5 p-3 rounded-lg flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">Engine: Active</span>
                </div>
             </div>
          </div>
        </main>
      </div>

      {/* Right Sidebar */}
      <aside className="w-80 border-l border-white/5 bg-[#111111] flex flex-col shadow-2xl z-20">
        <div className="flex border-b border-white/5 bg-black/20">
          <TabButton active={activeTab === 'inspector'} onClick={() => setActiveTab('inspector')} label="Inspector" />
          <TabButton active={activeTab === 'scene'} onClick={() => setActiveTab('scene')} label="Scene" />
          <TabButton active={activeTab === 'calc'} onClick={() => setActiveTab('calc')} label="Calculations" />
          <TabButton active={activeTab === 'export'} onClick={() => setActiveTab('export')} label="Export" />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'inspector' && (
            <>
              <InspectorPanel />
              <div className="h-px bg-white/5 mx-5" />
              <ParameterPanel />
            </>
          )}
          {activeTab === 'scene' && <ScenePanel />}
          {activeTab === 'calc' && <EngineeringPanel />}
          {activeTab === 'export' && <ExportPanel />}
        </div>
      </aside>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}} />
    </div>
  );
}

function ToolButton({ icon, active, onClick, tooltip }) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={cn(
        "p-2.5 rounded-xl transition-all group relative",
        active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
      )}
    >
      {React.cloneElement(icon, { className: "w-5 h-5" })}
    </button>
  );
}

function ToolbarAction({ icon, active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all border",
        active ? "bg-blue-600/10 border-blue-500/20 text-blue-400" : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
      )}
    >
      {React.cloneElement(icon, { className: "w-3.5 h-3.5" })}
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
        active ? "text-white border-b-2 border-blue-500" : "text-zinc-600 hover:text-zinc-400"
      )}
    >
      {label}
    </button>
  );
}
