import * as THREE from 'three';

export interface BayonetLayer {
  id: string;
  name: string;
  shape: THREE.Shape;
  geometry: THREE.BufferGeometry;
  position: THREE.Vector3;
}

export class BayonetBoxGenerator {
  static generate(params: any): BayonetLayer[] {
    const { diameter, lugs, thickness, alignmentPins, dimensionType } = params;
    const radius = (dimensionType === 'inside' ? diameter + thickness * 4 : diameter) / 2;
    const layers: BayonetLayer[] = [];

    /**
     * رسم المسار المتعرج للقفل (محاكاة لـ polyline في بايثون)
     */
    const addLugGeometry = (path: THREE.Path, r: number, isUpper: boolean) => {
      const angleStep = (Math.PI * 2) / lugs;
      for (let i = 0; i < lugs; i++) {
        const startA = i * angleStep;
        const midA = startA + angleStep * 0.6;
        const endA = (i + 1) * angleStep;

        if (isUpper) {
          path.absarc(0, 0, r, startA, midA, false);
          path.absarc(0, 0, r - thickness, midA, endA, false);
        } else {
          path.absarc(0, 0, r + thickness, startA, midA, false);
          path.absarc(0, 0, r, midA, endA, false);
        }
      }
    };

    const createLayer = (id: string, name: string, z: number, config: 'solid' | 'wall' | 'lower' | 'upper' | 'lid') => {
      const shape = new THREE.Shape();
      shape.absarc(0, 0, radius, 0, Math.PI * 2, false);

      const hole = new THREE.Path();
      if (config === 'wall') {
        hole.absarc(0, 0, radius - thickness * 1.5, 0, Math.PI * 2, true);
        shape.holes.push(hole);
      } else if (config === 'lower') {
        addLugGeometry(hole, radius - thickness * 2, false);
        shape.holes.push(hole);
      } else if (config === 'upper') {
        addLugGeometry(hole, radius - thickness * 2, true);
        shape.holes.push(hole);
      }

      // إضافة فتحات المسامير (Alignment Pins)
      for (let i = 0; i < 3; i++) {
        const pinHole = new THREE.Path();
        const angle = (i * Math.PI * 2) / 3;
        const pr = radius - thickness / 2;
        pinHole.absarc(Math.cos(angle) * pr, Math.sin(angle) * pr, alignmentPins / 2, 0, Math.PI * 2, true);
        shape.holes.push(pinHole);
      }

      const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
      geometry.translate(0, 0, -thickness / 2);

      return { id, name, shape, geometry, position: new THREE.Vector3(0, 0, z) };
    };

    // تكوين الطبقات الـ 5 كما في بايثون
    layers.push(createLayer('base', 'Bottom Base', 0, 'solid'));
    layers.push(createLayer('wall', 'Bottom Wall', thickness, 'wall'));
    layers.push(createLayer('lower', 'Lower Bayonet', thickness * 2, 'lower'));
    layers.push(createLayer('upper', 'Upper Bayonet', thickness * 3, 'upper'));
    layers.push(createLayer('top', 'Top Lid', thickness * 4, 'solid'));

    return layers;
  }
}
