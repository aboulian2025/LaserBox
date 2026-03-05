import * as THREE from 'three';
import { JointEngine, JointType } from './jointEngine';

export interface Panel {
  id: string;
  name: string;
  width: number;
  height: number;
  thickness: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  geometry: THREE.BufferGeometry;
  shape: THREE.Shape;
}

export function generateBoxPanels(params: {
  width: number;
  height: number;
  depth: number;
  thickness: number;
  jointType: string;
  jointSize: number;
  lid: boolean;
  dimensionType?: 'inside' | 'outside';
  tolerance?: number;
}): Panel[] {
  const {
    width: inputW,
    height: inputH,
    depth: inputD,
    thickness,
    jointType,
    jointSize,
    lid,
    dimensionType = 'outside',
    tolerance = 0.01
  } = params;

  // Calculate actual dimensions based on type
  // If 'inside', we add 2*thickness to get the outside dimensions for the math kernel
  const width = dimensionType === 'inside' ? inputW + (thickness * 2) : inputW;
  const height = dimensionType === 'inside' ? inputH + (thickness * 2) : inputH;
  const depth = dimensionType === 'inside' ? inputD + (thickness * 2) : inputD;

  const panels: Panel[] = [];

  const createPanel = (
    id: string,
    name: string,
    w: number,
    h: number,
    pos: THREE.Vector3,
    rot: THREE.Euler,
    config: { bottom: JointType, right: JointType, top: JointType, left: JointType }
  ): Panel => {
    let shape: THREE.Shape;
    let geometry: THREE.BufferGeometry;
    
    if (jointType === 'finger') {
      shape = JointEngine.createParametricPanel(w, h, thickness, jointSize, config, tolerance);
      const extrudeSettings = {
        steps: 1,
        depth: thickness,
        bevelEnabled: false
      };
      geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.translate(-w / 2, -h / 2, -thickness / 2);
    } else {
      shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(w, 0);
      shape.lineTo(w, h);
      shape.lineTo(0, h);
      shape.lineTo(0, 0);
      geometry = new THREE.BoxGeometry(w, h, thickness);
    }
    
    return {
      id,
      name,
      width: w,
      height: h,
      thickness,
      position: pos,
      rotation: rot,
      geometry,
      shape
    };
  };

  const zShift = (depth - thickness) / 2;
  const xShift = (width - thickness) / 2;
  const yShift = (height - thickness) / 2;

  panels.push(createPanel('front', 'Front Panel', width, height,
    new THREE.Vector3(0, 0, zShift),
    new THREE.Euler(0, 0, 0),
    { bottom: 'male', right: 'male', top: 'male', left: 'male' }
  ));

  panels.push(createPanel('back', 'Back Panel', width, height,
    new THREE.Vector3(0, 0, -zShift),
    new THREE.Euler(0, Math.PI, 0),
    { bottom: 'male', right: 'male', top: 'male', left: 'male' }
  ));

  panels.push(createPanel('left', 'Left Panel', depth, height,
    new THREE.Vector3(-xShift, 0, 0),
    new THREE.Euler(0, -Math.PI / 2, 0),
    { bottom: 'male', right: 'female', top: 'male', left: 'female' }
  ));

  panels.push(createPanel('right', 'Right Panel', depth, height,
    new THREE.Vector3(xShift, 0, 0),
    new THREE.Euler(0, Math.PI / 2, 0),
    { bottom: 'male', right: 'female', top: 'male', left: 'female' }
  ));

  panels.push(createPanel('bottom', 'Bottom Panel', width, depth,
    new THREE.Vector3(0, -yShift, 0),
    new THREE.Euler(Math.PI / 2, 0, 0),
    { bottom: 'female', right: 'female', top: 'female', left: 'female' }
  ));

  if (lid) {
    panels.push(createPanel('top', 'Top Panel', width, depth,
      new THREE.Vector3(0, yShift, 0),
      new THREE.Euler(-Math.PI / 2, 0, 0),
      { bottom: 'female', right: 'female', top: 'female', left: 'female' }
    ));
  }

  return panels;
}
