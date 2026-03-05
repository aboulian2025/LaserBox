import { create } from 'zustand';
import { ConstraintSolver } from '../core/constraintSolver';

export type ShapeType = 'box' | 'panel' | 'cylinder' | 'bayonet' | 'extrusion';
export type JointType = 'none' | 'finger' | 'tab';
export type DimensionType = 'inside' | 'outside';

export interface ParametricObject {
  id: string;
  type: ShapeType;
  name: string;
  params: Record<string, any>;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  visible: boolean;
  color: string;
}

interface CADState {
  objects: ParametricObject[];
  selectedId: string | null;
  viewMode: '3d' | 'flat';
  explodedView: boolean;
  showWireframe: boolean;
  gridVisible: boolean;
  addObject: (type: ShapeType) => void;
  removeObject: (id: string) => void;
  updateObject: (id: string, updates: Partial<ParametricObject>) => void;
  selectObject: (id: string | null) => void;
  setViewMode: (mode: '3d' | 'flat') => void;
  setExplodedView: (val: boolean) => void;
  toggleWireframe: () => void;
  toggleGrid: () => void;
}

export const useCADStore = create<CADState>((set) => ({
  objects: [
    {
      id: 'initial-box',
      type: 'box',
      name: 'Master Assembly',
      params: {
        width: 150,
        height: 100,
        depth: 120,
        thickness: 3.0,
        jointType: 'finger',
        jointSize: 20,
        dimensionType: 'outside',
        lid: true,
      },
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      color: '#3b82f6',
    }
  ],
  selectedId: 'initial-box',
  viewMode: '3d',
  explodedView: false,
  showWireframe: false,
  gridVisible: true,

  addObject: (type) => set((state) => {
    let params: any = {};
    if (type === 'box') {
      params = { width: 80, height: 60, depth: 80, thickness: 3, jointType: 'finger', jointSize: 15, dimensionType: 'outside', lid: true };
    } else if (type === 'cylinder') {
      params = { radius: 40, height: 80, segments: 32 };
    } else if (type === 'bayonet') {
      params = { diameter: 100, lugs: 10, thickness: 3, alignmentPins: 2, dimensionType: 'outside' };
    } else {
      params = { width: 80, height: 80, thickness: 3 };
    }

    const newObj: ParametricObject = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      params,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      color: type === 'bayonet' ? '#f59e0b' : '#6366f1',
    };
    return { objects: [...state.objects, newObj], selectedId: newObj.id };
  }),

  removeObject: (id) => set((state) => ({
    objects: state.objects.filter(o => o.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),

  updateObject: (id, updates) => set((state) => {
    const objects = state.objects.map(o => {
      if (o.id === id) {
        let merged = { ...o, ...updates };
        if (updates.params) {
          merged.params = ConstraintSolver.validateBoxParams(merged.params);
        }
        return merged;
      }
      return o;
    });
    return { objects };
  }),

  selectObject: (id) => set({ selectedId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setExplodedView: (val) => set({ explodedView: val }),
  toggleWireframe: () => set(state => ({ showWireframe: !state.showWireframe })),
  toggleGrid: () => set(state => ({ gridVisible: !state.gridVisible })),
}));
