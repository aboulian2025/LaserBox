import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

/**
 * BooleanEngine: High-level wrapper for constructive solid geometry operations.
 */
export class BooleanEngine {
  static subtract(meshA, meshB) {
    meshA.updateMatrixWorld();
    meshB.updateMatrixWorld();
    const result = CSG.subtract(meshA, meshB);
    return result.geometry;
  }

  static union(meshA, meshB) {
    meshA.updateMatrixWorld();
    meshB.updateMatrixWorld();
    const result = CSG.union(meshA, meshB);
    return result.geometry;
  }

  static intersect(meshA, meshB) {
    meshA.updateMatrixWorld();
    meshB.updateMatrixWorld();
    const result = CSG.intersect(meshA, meshB);
    return result.geometry;
  }
}
