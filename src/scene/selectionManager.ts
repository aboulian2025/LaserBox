import * as THREE from 'three';
import { useCADStore } from '../store/cadStore';

export class SelectionManager {
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private camera: THREE.Camera;
  private scene: THREE.Scene;

  constructor(camera: THREE.Camera, scene: THREE.Scene) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera = camera;
    this.scene = scene;
  }

  handlePointerDown(event: PointerEvent, container: HTMLElement, objectGroups: THREE.Group[]) {
    const rect = container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(objectGroups, true);

    if (intersects.length > 0) {
      let obj = intersects[0].object;
      // Traverse up to find the group with userData.id
      while (obj.parent && !(obj.userData && obj.userData.id)) {
        obj = obj.parent;
      }
      if (obj.userData && obj.userData.id) {
        useCADStore.getState().selectObject(obj.userData.id);
        return obj.userData.id;
      }
    } else {
      useCADStore.getState().selectObject(null);
      return null;
    }
    return null;
  }
}
