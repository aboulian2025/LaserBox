import React from 'react';
import { Download, FileCode, FileJson, Package, FileArchive } from 'lucide-react';
import { useCADStore } from '../../store/cadStore';
import { SVGExporter } from '../../export/svgExporter';
import { DxfExporter } from '../../export/dxfExporter';
import { generateBoxPanels } from '../../engine/boxGenerator';

export default function ExportPanel() {
  const { objects, selectedId } = useCADStore();
  const selectedObject = objects.find(o => o.id === selectedId);

  const download = (content: string | Blob, fileName: string, type: string) => {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSVGExport = () => {
    if (selectedObject && selectedObject.type === 'box') {
      const panels = generateBoxPanels(selectedObject.params as any);
      const svg = SVGExporter.export(panels);
      download(svg, `LaserBox_${selectedObject.name}.svg`, 'image/svg+xml');
    }
  };

  const handleDXFExport = () => {
    if (selectedObject && selectedObject.type === 'box') {
      const panels = generateBoxPanels(selectedObject.params as any);
      const dxf = DxfExporter.export(panels);
      download(dxf, `LaserBox_${selectedObject.name}.dxf`, 'application/dxf');
    }
  };

  const handleJSONExport = () => {
    const data = JSON.stringify({ version: "2.0", objects }, null, 2);
    download(data, `LaserBox_Project.json`, 'application/json');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-3">
        <Download className="w-3.5 h-3.5 text-blue-500" />
        <h3 className="text-[10px] font-bold text-white uppercase tracking-wider">Export Production</h3>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <ExportButton
          icon={<FileCode className="w-4 h-4" />}
          label="SVG Vector (.svg)"
          description="Millimeter accurate paths"
          onClick={handleSVGExport}
          disabled={!selectedObject || selectedObject.type !== 'box'}
        />
        <ExportButton
          icon={<FileArchive className="w-4 h-4" />}
          label="DXF Industrial (.dxf)"
          description="CNC/AutoCAD compatible"
          onClick={handleDXFExport}
          disabled={!selectedObject || selectedObject.type !== 'box'}
        />
        <ExportButton
          icon={<Package className="w-4 h-4" />}
          label="STL Binary (.stl)"
          description="3D Print ready mesh"
          disabled={true}
        />
        <ExportButton
          icon={<FileJson className="w-4 h-4" />}
          label="Project JSON (.json)"
          description="Save parametric assembly"
          onClick={handleJSONExport}
        />
      </div>
    </div>
  );
}

function ExportButton({ icon, label, description, onClick, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all
        ${disabled
          ? "opacity-40 cursor-not-allowed border-white/5 bg-transparent"
          : "border-white/5 bg-black/20 hover:border-blue-500/50 hover:bg-blue-500/5"}
      `}
    >
      <div className={`${disabled ? "text-zinc-600" : "text-blue-400"}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold text-zinc-200 truncate">{label}</div>
        <div className="text-[9px] text-zinc-500 font-medium truncate">{description}</div>
      </div>
    </button>
  );
}
