import * as THREE from 'three';

/**
 * Advanced Vector Math Abstraction Layer for Parametric CAD
 * Decouples Three.js internals from the core geometry logic.
 */

export class VectorMath {
  static create(x: number = 0, y: number = 0, z: number = 0): THREE.Vector3 {
    return new THREE.Vector3(x, y, z);
  }

  static add(v1: THREE.Vector3, v2: THREE.Vector3): THREE.Vector3 {
    return v1.clone().add(v2);
  }

  static sub(v1: THREE.Vector3, v2: THREE.Vector3): THREE.Vector3 {
    return v1.clone().sub(v2);
  }

  static multiply(v1: THREE.Vector3, scalar: number): THREE.Vector3 {
    return v1.clone().multiplyScalar(scalar);
  }

  static cross(v1: THREE.Vector3, v2: THREE.Vector3): THREE.Vector3 {
    return v1.clone().cross(v2);
  }

  static dot(v1: THREE.Vector3, v2: THREE.Vector3): number {
    return v1.dot(v2);
  }

  static normalize(v1: THREE.Vector3): THREE.Vector3 {
    return v1.clone().normalize();
  }

  /**
   * Calculates a perpendicular vector for offsetting edges in 2D
   */
  static getPerpendicular2D(v: THREE.Vector2): THREE.Vector2 {
    return new THREE.Vector2(-v.y, v.x).normalize();
  }

  /**
   * Linear interpolation between two vectors
   */
  static lerp(v1: THREE.Vector3, v2: THREE.Vector3, alpha: number): THREE.Vector3 {
    return v1.clone().lerp(v2, alpha);
  }

  /**
   * Projects point P onto line segment AB
   */
  static projectPointOnSegment(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3): THREE.Vector3 {
    const ab = this.sub(b, a);
    const ap = this.sub(p, a);
    const t = this.dot(ap, ab) / this.dot(ab, ab);
    const clampedT = Math.max(0, Math.min(1, t));
    return this.add(a, this.multiply(ab, clampedT));
  }
}

export class GeometryUtils {
  /**
   * Generates a rotation matrix to align a normal to a target vector
   */
  static getRotationFromNormal(normal: THREE.Vector3): THREE.Euler {
    const up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(normal.dot(up)) > 0.99) {
      up.set(1, 0, 0);
    }
    const matrix = new THREE.Matrix4();
    matrix.lookAt(new THREE.Vector3(0, 0, 0), normal, up);
    return new THREE.Euler().setFromRotationMatrix(matrix);
  }

  /**
   * Computes the bounding box for a set of vertices
   */
  static computeBounds(vertices: THREE.Vector3[]) {
    const box = new THREE.Box3().setFromPoints(vertices);
    return {
      min: box.min,
      max: box.max,
      size: box.getSize(new THREE.Vector3()),
      center: box.getCenter(new THREE.Vector3())
    };
  }
}
