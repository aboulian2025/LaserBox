import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

/**
 * BooleanEngine: High-level wrapper for constructive solid geometry operations.
 * Uses three-csg-ts for manifold geometry operations.
 */
export class BooleanEngine {
  /**
   * Subtracts meshB from meshA.
   */
  static subtract(meshA: THREE.Mesh, meshB: THREE.Mesh): THREE.BufferGeometry {
    meshA.updateMatrixWorld();
    meshB.updateMatrixWorld();
    
    // CSG.subtract returns a new Mesh
    const resultMesh = CSG.subtract(meshA, meshB);
    return resultMesh.geometry;
  }

  /**
   * Unites meshA and meshB.
   */
  static union(meshA: THREE.Mesh, meshB: THREE.Mesh): THREE.BufferGeometry {
    meshA.updateMatrixWorld();
    meshB.updateMatrixWorld();
    
    const resultMesh = CSG.union(meshA, meshB);
    return resultMesh.geometry;
  }

  /**
   * Intersects meshA and meshB.
   */
  static intersect(meshA: THREE.Mesh, meshB: THREE.Mesh): THREE.BufferGeometry {
    meshA.updateMatrixWorld();
    meshB.updateMatrixWorld();
    
    const resultMesh = CSG.intersect(meshA, meshB);
    return resultMesh.geometry;
  }
}
