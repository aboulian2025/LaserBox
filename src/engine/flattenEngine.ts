import * as THREE from 'three';
import { Panel } from './boxGenerator';

export interface FlattenedPanel extends Panel {
  layoutPosition: THREE.Vector3;
}

export class FlattenEngine {
  /**
   * Lays out 3D panels into a 2D plane for fabrication
   */
  static layoutPanels(panels: Panel[], margin: number = 10, maxWidth: number = 1000): FlattenedPanel[] {
    let currentX = margin;
    let currentY = margin;
    let rowMaxHeight = 0;
    
    return panels.map(panel => {
      // If adding this panel exceeds maxWidth, wrap to next row
      if (currentX + panel.width > maxWidth) {
        currentX = margin;
        currentY += rowMaxHeight + margin;
        rowMaxHeight = 0;
      }
      
      const layoutPos = new THREE.Vector3(currentX + panel.width / 2, currentY + panel.height / 2, 0);
      
      const flattened: FlattenedPanel = {
        ...panel,
        layoutPosition: layoutPos
      };

      currentX += panel.width + margin;
      rowMaxHeight = Math.max(rowMaxHeight, panel.height);

      return flattened;
    });
  }
}
