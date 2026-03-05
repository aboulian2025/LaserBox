import * as THREE from 'three';

export type JointType = 'male' | 'female' | 'none';

/**
 * JointEngine: Procedural path generator for high-precision fabrication joints.
 */
export class JointEngine {
  /**
   * Generates a set of points for a finger joint edge.
   * length: Length of the edge.
   * thickness: Material thickness (depth of the joint).
   * nominalFingerSize: Desired size of one finger.
   * type: 'male' (ends are raised) or 'female' (ends are recessed).
   * tolerance: Kerf compensation.
   */
  static generateFingerJointPoints(
    length: number,
    thickness: number,
    nominalFingerSize: number,
    type: JointType,
    tolerance: number = 0
  ): THREE.Vector2[] {
    if (type === 'none' || nominalFingerSize <= 0) return [];

    // Calculate optimal number of segments (must be odd for symmetry)
    let numSegments = Math.max(3, Math.floor(length / nominalFingerSize));
    if (numSegments % 2 === 0) numSegments++;
    
    const fingerSize = length / numSegments;
    const points: THREE.Vector2[] = [];

    // Initial point
    points.push(new THREE.Vector2(0, 0));

    for (let i = 0; i < numSegments; i++) {
      // For 'male', even segments (0, 2, 4...) are raised.
      // For 'female', even segments are recessed.
      const isRaised = type === 'male' ? (i % 2 === 0) : (i % 2 !== 0);

      const xStart = i * fingerSize;
      const xEnd = (i + 1) * fingerSize;

      // Apply kerf tolerance: male fingers get wider, female slots get narrower.
      // This means shifting the vertical cuts.
      const tShift = type === 'male' ? tolerance : -tolerance;

      const adjustedXStart = (i === 0) ? xStart : xStart - tShift;
      const adjustedXEnd = (i === numSegments - 1) ? xEnd : xEnd + tShift;

      const y = isRaised ? thickness : 0;

      // Vertical line up/down
      points.push(new THREE.Vector2(adjustedXStart, y));
      // Horizontal line
      points.push(new THREE.Vector2(adjustedXEnd, y));
    }

    // Final point to close the edge baseline
    points.push(new THREE.Vector2(length, 0));

    return points;
  }

  /**
   * Creates a THREE.Shape for a panel with configurable joints on all 4 sides.
   * Counter-clockwise: Bottom, Right, Top, Left.
   */
  static createParametricPanel(
    width: number,
    height: number,
    thickness: number,
    fingerSize: number,
    config: {
      bottom: JointType,
      right: JointType,
      top: JointType,
      left: JointType
    },
    tolerance: number = 0
  ): THREE.Shape {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);

    // Bottom edge: (0,0) -> (W,0). Protrudes downwards (-Y).
    if (config.bottom !== 'none') {
      const pts = this.generateFingerJointPoints(width, thickness, fingerSize, config.bottom, tolerance);
      pts.forEach(p => shape.lineTo(p.x, -p.y));
    } else {
      shape.lineTo(width, 0);
    }

    // Right edge: (W,0) -> (W,H). Protrudes rightwards (+X).
    if (config.right !== 'none') {
      const pts = this.generateFingerJointPoints(height, thickness, fingerSize, config.right, tolerance);
      pts.forEach(p => shape.lineTo(width + p.y, p.x));
    } else {
      shape.lineTo(width, height);
    }

    // Top edge: (W,H) -> (0,H). Protrudes upwards (+Y).
    if (config.top !== 'none') {
      const pts = this.generateFingerJointPoints(width, thickness, fingerSize, config.top, tolerance);
      // Reverse because we are going backwards from W to 0
      pts.reverse().forEach(p => shape.lineTo(p.x, height + p.y));
    } else {
      shape.lineTo(0, height);
    }

    // Left edge: (0,H) -> (0,0). Protrudes leftwards (-X).
    if (config.left !== 'none') {
      const pts = this.generateFingerJointPoints(height, thickness, fingerSize, config.left, tolerance);
      // Reverse because we go from H to 0
      pts.reverse().forEach(p => shape.lineTo(-p.y, p.x));
    } else {
      shape.lineTo(0, 0);
    }

    return shape;
  }
}
