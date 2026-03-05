import * as THREE from 'three';
import { JointEngine } from './jointEngine';

/**
 * Advanced Parametric Box Engine
 */
export function generateBoxPanels(params) {
  const { width, height, depth, thickness, jointType, jointSize, lid } = params;
  const panels = [];

  const createPanel = (id, name, w, h, pos, rot, config) => {
    let shape;
    let geometry;

    if (jointType === 'finger') {
      shape = JointEngine.createParametricPanel(w, h, thickness, jointSize, config);
      const extrudeSettings = { steps: 1, depth: thickness, bevelEnabled: false };
      geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.translate(-w / 2, -h / 2, -thickness / 2);
    } else {
      shape = new THREE.Shape();
      shape.moveTo(0, 0); shape.lineTo(w, 0); shape.lineTo(w, h); shape.lineTo(0, h); shape.lineTo(0, 0);
      geometry = new THREE.BoxGeometry(w, h, thickness);
    }

    return { id, name, width: w, height: h, thickness, position: pos, rotation: rot, geometry, shape };
  };

  panels.push(createPanel('front', 'Front', width, height, new THREE.Vector3(0, 0, depth / 2), new THREE.Euler(0, 0, 0), { bottom: 'male', right: 'male', top: 'male', left: 'male' }));
  panels.push(createPanel('back', 'Back', width, height, new THREE.Vector3(0, 0, -depth / 2), new THREE.Euler(0, Math.PI, 0), { bottom: 'male', right: 'male', top: 'male', left: 'male' }));
  panels.push(createPanel('left', 'Left', depth, height, new THREE.Vector3(-width / 2, 0, 0), new THREE.Euler(0, -Math.PI / 2, 0), { bottom: 'male', right: 'female', top: 'male', left: 'female' }));
  panels.push(createPanel('right', 'Right', depth, height, new THREE.Vector3(width / 2, 0, 0), new THREE.Euler(0, Math.PI / 2, 0), { bottom: 'male', right: 'female', top: 'male', left: 'female' }));
  panels.push(createPanel('bottom', 'Bottom', width, depth, new THREE.Vector3(0, -height / 2, 0), new THREE.Euler(Math.PI / 2, 0, 0), { bottom: 'female', right: 'female', top: 'female', left: 'female' }));

  if (lid) {
    panels.push(createPanel('top', 'Top', width, depth, new THREE.Vector3(0, height / 2, 0), new THREE.Euler(-Math.PI / 2, 0, 0), { bottom: 'female', right: 'female', top: 'female', left: 'female' }));
  }

  return panels;
}
