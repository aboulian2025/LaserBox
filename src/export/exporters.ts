import * as THREE from 'three';
import { Panel } from '../engine/boxGenerator';

export function exportToSVG(panels: Panel[]): string {
  // Determine total bounds for the SVG
  let minX = 0, minY = 0, maxX = 0, maxY = 0;

  // Basic layout if not already laid out
  let currentX = 10;
  let currentY = 10;
  let rowHeight = 0;
  const spacing = 10;
  const maxWidth = 800;

  const paths = panels.map(panel => {
    if (currentX + panel.width > maxWidth) {
      currentX = 10;
      currentY += rowHeight + spacing;
      rowHeight = 0;
    }

    const points = panel.shape.getPoints();
    // SVG uses Y-down, but Three.js Shape uses Y-up
    // We also need to translate it to its layout position
    const pathData = points.map((p, i) => {
      const command = i === 0 ? 'M' : 'L';
      return `${command} ${(p.x + currentX).toFixed(3)} ${(currentY + panel.height - p.y).toFixed(3)}`;
    }).join(' ') + ' Z';

    const textX = currentX + 5;
    const textY = currentY + 15;
    const label = `<text x="${textX}" y="${textY}" font-family="Arial" font-size="8" fill="red">${panel.name}</text>`;

    rowHeight = Math.max(rowHeight, panel.height);
    currentX += panel.width + spacing;

    maxX = Math.max(maxX, currentX);
    maxY = Math.max(maxY, currentY + rowHeight + spacing);

    return `  <path d="${pathData}" fill="none" stroke="black" stroke-width="0.1" />\n  ${label}`;
  });

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${maxX + 20}" height="${maxY + 20}" viewBox="0 0 ${maxX + 20} ${maxY + 20}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white" />
${paths.join('\n')}
</svg>`;
}

export function exportToSTL(group: THREE.Group): string {
  // In a real implementation, we would use THREE.STLExporter
  // For now, return a placeholder or implement a basic one if needed.
  return "solid LASERBOX_EXPORT\nendsolid LASERBOX_EXPORT";
}
