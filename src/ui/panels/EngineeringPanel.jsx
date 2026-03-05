import React, { useMemo } from 'react';
import { Calculator, Ruler, Box, Coins, Zap } from 'lucide-react';
import { useCADStore } from '../../store/cadStore';

/**
 * EngineeringPanel: Real-time analytical engine for fabrication costs and logistics.
 */
export default function EngineeringPanel() {
  const { objects, selectedId } = useCADStore();
  const selectedObject = objects.find(o => o.id === selectedId);

  const stats = useMemo(() => {
    if (!selectedObject) return null;

    const { width, height, depth, thickness } = selectedObject.params;

    // 1. Volume Calculation (mm³)
    const volume = width * height * (depth || 1);

    // 2. Surface Area (mm²) - 6 sides for a box
    const surfaceArea = 2 * (width * height + width * depth + height * depth);

    // 3. Cutting Path Length (Estimation based on panel perimeters + joints)
    // For a finger joint box, path is significantly longer than raw perimeter
    const jointMultiplier = 1.4; // Average factor for finger joint complexity
    const perimeter = 2 * (width + height) * 2 + 2 * (width + depth) * 2 + 2 * (height + depth) * 2;
    const cuttingLength = perimeter * jointMultiplier;

    // 4. Material Usage (Bounding box area on sheet)
    const materialArea = (width + 10) * (height + 10) * 6; // Rough estimate for 6 panels + margins

    // 5. Cost Estimation (Hypothetical rates)
    const materialRate = 0.00005; // $/mm²
    const laserRate = 0.002; // $/mm (cutting distance)
    const totalCost = (materialArea * materialRate) + (cuttingLength * laserRate);

    return {
      volume: (volume / 1000).toFixed(2), // cm³
      area: (surfaceArea / 100).toFixed(2), // cm²
      path: (cuttingLength / 10).toFixed(1), // cm
      material: (materialArea / 10000).toFixed(2), // dm²
      cost: totalCost.toFixed(2)
    };
  }, [selectedObject]);

  if (!selectedObject) return (
    <div className="p-8 text-center opacity-20 flex flex-col items-center gap-4">
      <Calculator className="w-12 h-12" />
      <span className="text-[10px] uppercase font-bold tracking-widest">Awaiting Data</span>
    </div>
  );

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-3">
        <Zap className="w-4 h-4 text-emerald-500" />
        <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Engineering Report</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <StatRow icon={<Box />} label="displacement" value={`${stats.volume} cm³`} />
        <StatRow icon={<Ruler />} label="cut distance" value={`${stats.path} cm`} />
        <StatRow icon={<Calculator />} label="surface area" value={`${stats.area} cm²`} />
        <StatRow icon={<Coins />} label="est. production" value={`$${stats.cost}`} />
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 mt-4">
        <div className="text-[8px] text-emerald-500 font-bold uppercase mb-1">Efficiency Grade</div>
        <div className="flex items-center gap-2">
           <div className="h-1.5 flex-1 bg-emerald-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[85%]" />
           </div>
           <span className="text-[10px] font-mono text-emerald-400">A+</span>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
      <div className="flex items-center gap-3">
        <div className="text-zinc-500">{React.cloneElement(icon, { size: 14 })}</div>
        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-xs text-white font-mono font-bold tracking-tight">{value}</span>
    </div>
  );
}
