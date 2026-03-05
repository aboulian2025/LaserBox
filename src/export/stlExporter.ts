import * as THREE from 'three';
import { STLExporter as ThreeSTLExporter } from 'three/examples/jsm/exporters/STLExporter.js';

/**
 * STLExporter: Generates binary or ASCII STL for 3D printing.
 */
export class STLExporter {
  static export(scene: THREE.Object3D, binary: boolean = true): Blob {
    const exporter = new ThreeSTLExporter();
    const result = exporter.parse(scene, { binary });
    return new Blob([result], { type: binary ? 'application/octet-stream' : 'text/plain' });
  }
}
