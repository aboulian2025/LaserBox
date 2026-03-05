import * as THREE from 'three';

export interface PanelData {
  id: string;
  name: string;
  width: number;
  height: number;
  thickness: number;
  vertices: THREE.Vector3[];
  faces: number[][];
  normal: THREE.Vector3;
  offset: THREE.Vector3; // For exploded view
  rotation: THREE.Euler;
}

export class GeometryKernel {
  static createBoxGeometry(params: any): THREE.BufferGeometry {
    // This is a simplified version, real one would generate 6 panels
    const { width, height, depth } = params;
    return new THREE.BoxGeometry(width, height, depth);
  }

  static createCylinderGeometry(params: any): THREE.BufferGeometry {
    const { radius, height, segments } = params;
    return new THREE.CylinderGeometry(radius, radius, height, segments);
  }

  static createPanelGeometry(params: any): THREE.BufferGeometry {
    const { width, height, thickness } = params;
    return new THREE.BoxGeometry(width, height, thickness);
  }
}

export const parametricRegistry = {
  box: GeometryKernel.createBoxGeometry,
  cylinder: GeometryKernel.createCylinderGeometry,
  panel: GeometryKernel.createPanelGeometry,
};
