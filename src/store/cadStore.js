import { create } from 'zustand';
import { ConstraintSolver } from '../core/constraintSolver';

export const useCADStore = create((set, get) => ({
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
        lid: true,
      },
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      color: '#3b82f6',
      operations: [] // List of boolean operations applied to this object
    }
  ],
  constraints: [],
  selectedId: 'initial-box',
  viewMode: '3d',
  explodedView: false,
  showWireframe: false,
  gridVisible: true,
  shadingMode: 'shaded', // 'shaded' or 'wireframe' or 'both'

  addObject: (type) => set((state) => {
    const newObj = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      params: type === 'box' ? {
        width: 80, height: 60, depth: 80, thickness: 3, jointType: 'finger', jointSize: 15, lid: true
      } : type === 'cylinder' ? {
        radius: 40, height: 80, segments: 32
      } : {
        width: 80, height: 80, thickness: 3
      },
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      color: '#6366f1',
      operations: []
    };
    return { objects: [...state.objects, newObj], selectedId: newObj.id };
  }),

  removeObject: (id) => set((state) => ({
    objects: state.objects.filter(o => o.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId,
    constraints: state.constraints.filter(c => c.sourceId !== id && c.targetId !== id)
  })),

  updateObject: (id, updates) => set((state) => {
    let newObjects = state.objects.map(o => {
      if (o.id === id) {
        let merged = { ...o, ...updates };
        if (updates.params) {
          merged.params = ConstraintSolver.validateBoxParams(merged.params);
        }
        return merged;
      }
      return o;
    });

    // Solve constraints after update
    if (state.constraints.length > 0) {
      newObjects = ConstraintSolver.solveConstraints(newObjects, state.constraints);
    }

    return { objects: newObjects };
  }),

  addConstraint: (constraint) => set((state) => {
    const newConstraints = [...state.constraints, constraint];
    const solvedObjects = ConstraintSolver.solveConstraints(state.objects, newConstraints);
    return { constraints: newConstraints, objects: solvedObjects };
  }),

  performBoolean: (operation, targetId, operandId) => set((state) => {
    const target = state.objects.find(o => o.id === targetId);
    if (!target) return state;

    const newObjects = state.objects.map(o => {
      if (o.id === targetId) {
        return {
          ...o,
          operations: [...(o.operations || []), { type: operation, operandId }]
        };
      }
      if (o.id === operandId) {
        return { ...o, visible: false }; // Hide operand
      }
      return o;
    });

    return { objects: newObjects };
  }),

  selectObject: (id) => set({ selectedId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setExplodedView: (val) => set({ explodedView: val }),
  toggleWireframe: () => set(state => ({ showWireframe: !state.showWireframe })),
  toggleGrid: () => set(state => ({ gridVisible: !state.gridVisible })),
  setShadingMode: (mode) => set({ shadingMode: mode }),
}));
