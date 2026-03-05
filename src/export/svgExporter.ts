import { Panel } from '../engine/boxGenerator';

/**
 * SVGExporter: High-Precision Fabrication Module for LaserBox Studio.
 *
 * DESIGN PRINCIPLES:
 * 1. 1:1 Real-world scale (1 unit = 1mm).
 * 2. Zero-transform architecture (Offsets applied to raw coordinates).
 * 3. Inkscape/CNC Compatible (SVG Header with mm units).
 */
export class SVGExporter {
  /**
   * Rounds a number to 2 decimal places for CNC precision.
   */
  private static r(val: number): number {
    return Math.round(val * 100) / 100;
  }

  /**
   * Generates a production-ready SVG string from an array of panels.
   *
   * @param panels - Array of panel objects containing dimensions and shapes.
   * @param margin - Spacing between panels in mm.
   * @param sheetWidth - Maximum width of the material sheet in mm.
   */
  static export(panels: Panel[], margin: number = 10, sheetWidth: number = 1000): string {
    let currentX = margin;
    let currentY = margin;
    let rowMaxHeight = 0;
    const paths: string[] = [];

    panels.forEach((panel) => {
      // 1. Simple Nesting Logic (Row-based)
      if (currentX + panel.width + margin > sheetWidth) {
        currentX = margin;
        currentY += rowMaxHeight + margin;
        rowMaxHeight = 0;
      }

      // 2. Identify Panel in Output
      paths.push(`  <!-- Panel: ${panel.name} (${panel.width}x${panel.height}x${panel.thickness}mm) -->`);

      // 3. Process Shape Points
      // Three.js Shape uses Y-up, SVG uses Y-down.
      // We apply the nesting offset directly to coordinates to avoid 'transform' attributes.
      const points = panel.shape.getPoints();
      if (points.length > 0) {
        let d = '';
        points.forEach((p, i) => {
          const char = i === 0 ? 'M' : 'L';
          const x = this.r(p.x + currentX);
          // Flip Y: (currentY + panelHeight) - p.y
          const y = this.r(currentY + (panel.height - p.y));
          d += `${char}${x} ${y} `;
        });
        d += 'Z';

        // 4. Generate Path Entry
        // stroke-width is set to 0.1mm (Hairline), typical for laser "Cut" operations
        paths.push(`  <path d="${d.trim()}" fill="none" stroke="#FF0000" stroke-width="0.1mm" />`);

        // 5. Annotations (Non-cutting layer for identification)
        const labelX = this.r(currentX + 5);
        const labelY = this.r(currentY + 5);
        paths.push(`  <text x="${labelX}" y="${labelY}" font-family="monospace" font-size="3" fill="#0000FF">${panel.name}</text>`);
      }

      // 6. Update cursors
      rowMaxHeight = Math.max(rowMaxHeight, panel.height);
      currentX += panel.width + margin;
    });

    // 7. Calculate ViewBox based on used area
    const totalWidth = sheetWidth;
    const totalHeight = this.r(currentY + rowMaxHeight + margin);

    // 8. Assemble Final XML
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
  width="${totalWidth}mm"
  height="${totalHeight}mm"
  viewBox="0 0 ${totalWidth} ${totalHeight}"
  xmlns="http://www.w3.org/2000/svg"
  version="1.1"
>
  <desc>LaserBox Studio - Parametric Fabrication Export</desc>
  <!--
    UNITS: Millimeters
    SCALE: 1:1
    COMPATIBILITY: Inkscape, CorelDraw, Illustrator, LightBurn
  -->
${paths.join('\n')}
</svg>`;
  }
}
