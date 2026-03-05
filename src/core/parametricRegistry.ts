import * as THREE from 'three';
import { GeometryKernel } from './geometryKernel';

export type ShapeGeneratorFunc = (params: any) => THREE.BufferGeometry;

/**
 * ParametricRegistry: Central authority for available shape generators.
 * Handles registration and instantiation of parametric geometries.
 */
export class ParametricRegistry {
  private static shapes = new Map<string, ShapeGeneratorFunc>();

  static registerShape(type: string, generator: ShapeGeneratorFunc) {
    this.shapes.set(type, generator);
  }

  static generateShape(type: string, params: any): THREE.BufferGeometry {
    const generator = this.shapes.get(type);
    if (!generator) {
      console.warn(`Shape type "${type}" not registered. Falling back to primitive box.`);
      // Fallback to avoid breaking the scene
      return new THREE.BoxGeometry(10, 10, 10);
    }
    return generator(params);
  }

  static getAvailableTypes(): string[] {
    return Array.from(this.shapes.keys());
  }
}

// Internal registration of standard CAD primitives
ParametricRegistry.registerShape('box', (params) => GeometryKernel.createBox(params.width, params.height, params.depth));
ParametricRegistry.registerShape('panel', (params) => GeometryKernel.createPanel(params.width, params.height, params.thickness));
ParametricRegistry.registerShape('cylinder', (params) => GeometryKernel.createCylinder(params.radius, params.height, params.segments));
