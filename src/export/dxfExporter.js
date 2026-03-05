/**
 * DxfExporter: Converts 3D panel geometry to DXF format.
 * Optimized for CNC and industrial laser cutters.
 */
export class DxfExporter {
  static export(panels) {
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

      // Use LWPOLYLINE for each panel
      dxf.push("0", "LWPOLYLINE");
      dxf.push("100", "AcDbEntity");
      dxf.push("8", "0"); // Layer 0
      dxf.push("100", "AcDbPolyline");
      dxf.push("90", points.length.toString()); // Number of vertices
      dxf.push("70", "1"); // Closed

      points.forEach(p => {
        dxf.push("10", (p.x + currentX).toFixed(3));
        dxf.push("20", (p.y).toFixed(3));
      });

      currentX += panel.width + margin;
    });

    dxf.push("0", "ENDSEC", "0", "EOF");

    return dxf.join("\n");
  }
}
