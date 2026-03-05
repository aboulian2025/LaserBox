import { Panel } from '../engine/boxGenerator';

/**
 * DxfExporter: Converts 3D panel geometry to industrial standard DXF format.
 */
export class DxfExporter {
  static export(panels: Panel[]): string {
    let dxf = [
      "0", "SECTION",
      "2", "HEADER",
      "9", "$ACADVER",
      "1", "AC1006",
      "0", "ENDSEC",
      "0", "SECTION",
      "2", "ENTITIES"
    ];

    let currentX = 0;
    const margin = 10;

    panels.forEach((panel) => {
      const points = panel.shape.getPoints();
      
      // Use LWPOLYLINE for each panel profile
      dxf.push("0", "LWPOLYLINE");
      dxf.push("100", "AcDbEntity");
      dxf.push("8", "0"); // Layer
      dxf.push("100", "AcDbPolyline");
      dxf.push("90", points.length.toString());
      dxf.push("70", "1"); // Closed polyline

      points.forEach(p => {
        dxf.push("10", (p.x + currentX).toFixed(4));
        dxf.push("20", (p.y).toFixed(4));
      });

      currentX += panel.width + margin;
    });

    dxf.push("0", "ENDSEC", "0", "EOF");

    return dxf.join("\n");
  }
}
