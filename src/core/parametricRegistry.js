import { GeometryKernel } from './geometryKernel';

/**
 * ParametricRegistry: Central authority for available shape generators.
 * Core of the modular CAD system.
 */
class ParametricRegistry {
  constructor() {
    this.shapes = new Map();
    this._initializeBuiltIns();
  }

  _initializeBuiltIns() {
    // Basic primitives using the GeometryKernel
    this.registerShape('box', (params) => GeometryKernel.createBox(params.width, params.height, params.depth));
    this.registerShape('panel', (params) => GeometryKernel.createPanel(params.width, params.height, params.thickness));
    this.registerShape('cylinder', (params) => GeometryKernel.createCylinder(params.radius, params.height, params.segments));

    // Extruded profiles would be registered here as well
    this.registerShape('extrusion', (params) => {
      // Placeholder for custom profile logic
      return GeometryKernel.createBox(params.width || 10, params.height || 10, params.depth || 10);
    });
  }

  /**
   * Registers a new shape generator function.
   * @param {string} type - Unique identifier for the shape
   * @param {Function} generatorFunction - Function that returns a BufferGeometry
   */
  registerShape(type, generatorFunction) {
    this.shapes.set(type, generatorFunction);
  }

  /**
   * Instantiates a geometry based on registered type and parameters.
   * @param {string} type
   * @param {Object} parameters
   * @returns {THREE.BufferGeometry}
   */
  generateShape(type, parameters) {
    const generator = this.shapes.get(type);
    if (!generator) {
      console.error(`Shape type "${type}" is not registered.`);
      // Fallback to a small unit cube to prevent crash
      return GeometryKernel.createBox(1, 1, 1);
    }
    return generator(parameters);
  }

  getRegisteredTypes() {
    return Array.from(this.shapes.keys());
  }
}

const registryInstance = new ParametricRegistry();

// Exporting the API as requested
export const registerShape = registryInstance.registerShape.bind(registryInstance);
export const generateShape = registryInstance.generateShape.bind(registryInstance);
export const parametricRegistry = registryInstance;
