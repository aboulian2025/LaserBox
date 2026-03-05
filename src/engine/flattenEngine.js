import * as THREE from 'three';

/**
 * FlattenEngine: Fabrication layout optimizer.
 * Extracts 3D panels and nests them into a 2D plane for cutting.
 */
export class FlattenEngine {
  /**
   * Lays out an array of panels into a 2D grid.
   * @param {Array} panels - List of Panel objects (from BoxGenerator)
   * @param {number} margin - Spacing between panels in mm
   * @param {number} maxWidth - Maximum width of the material sheet in mm
   */
  static layoutPanels(panels, margin = 10, maxWidth = 1000) {
    let currentX = margin;
    let currentY = margin;
    let maxHeightInRow = 0;

    return panels.map(panel => {
      // Check if panel fits in current row
      if (currentX + panel.width + margin > maxWidth) {
        currentX = margin;
        currentY += maxHeightInRow + margin;
        maxHeightInRow = 0;
      }

      // Calculate layout position (center of panel in 2D)
      const layoutPosition = new THREE.Vector3(
        currentX + panel.width / 2,
        currentY + panel.height / 2,
        0
      );

      // Update row tracking
      currentX += panel.width + margin;
      maxHeightInRow = Math.max(maxHeightInRow, panel.height);

      return {
        ...panel,
        layoutPosition
      };
    });
  }

  /**
   * Estimates total material area required (rectangular bounds).
   */
  static estimateMaterialSize(flattenedPanels, margin = 10) {
    let maxX = 0;
    let maxY = 0;

    flattenedPanels.forEach(p => {
      maxX = Math.max(maxX, p.layoutPosition.x + p.width / 2 + margin);
      maxY = Math.max(maxY, p.layoutPosition.y + p.height / 2 + margin);
    });

    return { width: maxX, height: maxY, area: maxX * maxY };
  }
}
