import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { useCADStore } from '../store/cadStore';
import { generateBoxPanels } from '../engine/boxGenerator';
import { BayonetBoxGenerator } from '../engine/bayonetBoxGenerator';
import { FlattenEngine } from '../engine/flattenEngine';

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private transformControls: TransformControls;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private container: HTMLElement;
  private objects: Map<string, THREE.Group> = new Map();
  private frameId: number | null = null;
  private grid: THREE.GridHelper;
  private selectionBox: THREE.BoxHelper;
  private resizeObserver: ResizeObserver;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);

    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight || 1,
      0.1,
      20000
    );
    this.camera.position.set(400, 400, 400);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
    this.transformControls.addEventListener('dragging-changed', (event) => {
      this.controls.enabled = !event.value;
    });
    this.scene.add(this.transformControls as any);

    this.selectionBox = new THREE.BoxHelper(new THREE.Mesh(), 0x3b82f6);
    this.selectionBox.visible = false;
    this.scene.add(this.selectionBox);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.setupLights();
    this.grid = new THREE.GridHelper(2000, 100, 0x222222, 0x111111);
    this.scene.add(this.grid);

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(container);

    this.animate();
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
  }

  private setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(200, 500, 200);
    this.scene.add(dirLight);
  }

  private onResize() {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private onPointerDown(event: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(Array.from(this.objects.values()), true);

    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj.parent && !(obj.userData && obj.userData.id)) {
        obj = obj.parent;
      }
      if (obj.userData && obj.userData.id) {
        useCADStore.getState().selectObject(obj.userData.id);
      }
    } else {
      useCADStore.getState().selectObject(null);
    }
  }

  public updateObjects(objects: any[], selectedId: string | null, explodedView: boolean, showWireframe: boolean, viewMode: '3d' | 'flat', gridVisible: boolean) {
    this.grid.visible = gridVisible;

    // Cleanup
    const currentIds = new Set(objects.map(o => o.id));
    for (const [id, group] of this.objects.entries()) {
      if (!currentIds.has(id)) {
        this.scene.remove(group);
        this.objects.delete(id);
      }
    }

    objects.forEach(obj => {
      let group = this.objects.get(obj.id);
      if (!group) {
        group = new THREE.Group();
        group.userData.id = obj.id;
        this.scene.add(group);
        this.objects.set(obj.id, group);
      }
      group.clear();
      group.visible = obj.visible;

      const material = new THREE.MeshStandardMaterial({
        color: obj.color,
        wireframe: showWireframe,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });

      if (obj.type === 'box') {
        const panels = generateBoxPanels(obj.params);
        if (viewMode === 'flat') {
          const flattened = FlattenEngine.layoutPanels(panels as any);
          flattened.forEach(panel => {
            const mesh = new THREE.Mesh(panel.geometry, material);
            mesh.position.copy(panel.layoutPosition);
            mesh.rotation.set(-Math.PI / 2, 0, 0);
            group!.add(mesh);
          });
        } else {
          panels.forEach(panel => {
            const mesh = new THREE.Mesh(panel.geometry, material);
            let pos = panel.position.clone();
            if (explodedView) pos.multiplyScalar(1.5);
            mesh.position.copy(pos);
            mesh.rotation.copy(panel.rotation);
            group!.add(mesh);
          });
        }
      } else if (obj.type === 'bayonet') {
        const layers = BayonetBoxGenerator.generate(obj.params);
        if (viewMode === 'flat') {
          // Manual layout for circular layers
          layers.forEach((layer, i) => {
            const mesh = new THREE.Mesh(layer.geometry, material);
            mesh.position.set(i * (obj.params.diameter + 10), 0, 0);
            mesh.rotation.set(-Math.PI / 2, 0, 0);
            group!.add(mesh);
          });
        } else {
          layers.forEach(layer => {
            const mesh = new THREE.Mesh(layer.geometry, material);
            let pos = layer.position.clone();
            if (explodedView) pos.z *= 2.5;
            mesh.position.copy(pos);
            group!.add(mesh);
          });
        }
      } else {
        // Primitive types
        let geometry: THREE.BufferGeometry;
        if (obj.type === 'cylinder') {
          geometry = new THREE.CylinderGeometry(obj.params.radius, obj.params.radius, obj.params.height, obj.params.segments);
        } else {
          geometry = new THREE.BoxGeometry(obj.params.width || 50, obj.params.height || 50, obj.params.thickness || 3);
        }
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
      }

      if (viewMode === '3d') {
        group.position.set(...(obj.position as [number, number, number]));
        group.rotation.set(...(obj.rotation as [number, number, number]));
      } else {
        group.position.set(0, 0, 0);
        group.rotation.set(0, 0, 0);
      }

      if (obj.id === selectedId) {
        this.selectionBox.setFromObject(group);
        this.selectionBox.visible = true;
        if (viewMode === '3d') this.transformControls.attach(group);
      }
    });

    if (!selectedId || viewMode === 'flat') {
      this.transformControls.detach();
      this.selectionBox.visible = false;
    }
  }

  private animate() {
    this.frameId = requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.resizeObserver.disconnect();
    this.renderer.dispose();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
