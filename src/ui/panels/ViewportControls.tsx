import React from 'react';
import { RefreshCcw, Maximize2, Box, Layers, Grid, Eye } from 'lucide-react';
import { useCADStore } from '../../store/cadStore';

export default function ViewportControls({ sceneManager }: { sceneManager: any }) {
  const { toggleGrid, toggleWireframe, setExplodedView, explodedView } = useCADStore();

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
      <ControlButton
        icon={<RefreshCcw className="w-4 h-4" />}
        onClick={() => sceneManager?.resetCamera()}
        tooltip="Reset Camera"
      />
      <ControlButton
        icon={<Maximize2 className="w-4 h-4" />}
        onClick={() => sceneManager?.autoCenter()}
        tooltip="Auto Center"
      />
      <div className="h-px bg-white/10 my-1" />
      <ControlButton
        icon={<Grid className="w-4 h-4" />}
        onClick={toggleGrid}
        tooltip="Toggle Grid"
      />
      <ControlButton
        icon={<Layers className="w-4 h-4" />}
        onClick={toggleWireframe}
        tooltip="Toggle Wireframe"
      />
      <ControlButton
        icon={<Box className="w-4 h-4" />}
        active={explodedView}
        onClick={() => setExplodedView(!explodedView)}
        tooltip="Exploded View"
      />
    </div>
  );
}

function ControlButton({ icon, onClick, tooltip, active }: any) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`
        p-2 rounded-lg border transition-all
        ${active
          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
          : "bg-black/40 border-white/5 text-zinc-400 hover:text-white hover:bg-black/60"}
      `}
    >
      {icon}
    </button>
  );
}
