import * as THREE from 'three';
import { ParametricRegistry } from '../core/parametricRegistry';

export class ShapeGenerator {
  static createMesh(type: string, params: any, color: string = '#64748b'): THREE.Mesh {
    const geometry = ParametricRegistry.generateShape(type, params);
    const material = new THREE.MeshStandardMaterial({ color });
    return new THREE.Mesh(geometry, material);
  }

  static updateGeometry(mesh: THREE.Mesh, type: string, params: any) {
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    mesh.geometry = ParametricRegistry.generateShape(type, params);
  }
}
