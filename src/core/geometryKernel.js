import * as THREE from 'three';

/**
 * GeometryKernel: High-performance computational geometry primitives.
 */
export class GeometryKernel {
  static createBox(w, h, d) {
    return new THREE.BoxGeometry(w, h, d);
  }

  static createCylinder(r, h, s = 32) {
    return new THREE.CylinderGeometry(r, r, h, s);
  }

  static createPanel(w, h, t) {
    // Basic panel is a box, but can be extended for complex profiles
    return new THREE.BoxGeometry(w, h, t);
  }

  static computeNormal(v1, v2, v3) {
    const a = new THREE.Vector3().subVectors(v2, v1);
    const b = new THREE.Vector3().subVectors(v3, v1);
    return new THREE.Vector3().crossVectors(a, b).normalize();
  }
}
