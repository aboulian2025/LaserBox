import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { useCADStore } from '../store/cadStore';

export class TransformManager {
  private transformControls: TransformControls;
  private camera: THREE.Camera;
  private domElement: HTMLElement;

  constructor(camera: THREE.Camera, domElement: HTMLElement, scene: THREE.Scene) {
    this.camera = camera;
    this.domElement = domElement;
    this.transformControls = new TransformControls(this.camera, this.domElement);

    this.transformControls.addEventListener('dragging-changed', (event) => {
      // Logic to disable orbit controls while dragging
    });

    this.transformControls.addEventListener('change', () => {
      const activeObject = this.transformControls.object;
      if (activeObject && activeObject.userData.id) {
        // Debounced or direct update to store if needed
      }
    });

    scene.add(this.transformControls as any);
  }

  attach(object: THREE.Object3D) {
    this.transformControls.attach(object);
  }

  detach() {
    this.transformControls.detach();
  }

  setMode(mode: 'translate' | 'rotate' | 'scale') {
    this.transformControls.setMode(mode);
  }

  getControls() {
    return this.transformControls;
  }
}
