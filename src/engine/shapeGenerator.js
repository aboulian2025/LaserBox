import * as THREE from 'three';
import { parametricRegistry } from '../core/parametricRegistry';

/**
 * ShapeGenerator: Converts parametric definitions into scene-ready meshes.
 */
export class ShapeGenerator {
  static create(type, params, color = '#3b82f6', wireframe = false) {
    const geometry = parametricRegistry.generate(type, params);
    const material = new THREE.MeshStandardMaterial({
      color,
      wireframe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  static update(mesh, type, params) {
    if (mesh.geometry) mesh.geometry.dispose();
    mesh.geometry = parametricRegistry.generate(type, params);
  }
}
