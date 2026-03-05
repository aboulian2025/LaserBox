/**
 * ConstraintSolver: Lightweight parametric constraint engine.
 * Handles dimensional dependencies and geometric relationships.
 */
export class ConstraintSolver {
  /**
   * Validates and enforces physical constraints on a parametric object.
   */
  static validateBoxParams(params) {
    const validated = { ...params };

    // Hard floor for fabrication
    validated.width = Math.max(1, validated.width);
    validated.height = Math.max(1, validated.height);
    validated.depth = Math.max(1, validated.depth);
    validated.thickness = Math.max(0.1, validated.thickness);

    // Joint logic constraints
    if (validated.jointType !== 'none') {
      const minSide = Math.min(validated.width, validated.height, validated.depth);
      // Ensure we have at least 3 segments for joints
      if (validated.jointSize > minSide / 3) {
        validated.jointSize = minSide / 3;
      }
      validated.jointSize = Math.max(2, validated.jointSize);
    }

    return validated;
  }

  /**
   * Applies geometric constraints between two objects.
   * Currently supports: Equal Length, Parallel, Perpendicular.
   */
  static solveConstraints(objects, constraints) {
    const updatedObjects = [...objects];

    constraints.forEach(constraint => {
      const source = updatedObjects.find(o => o.id === constraint.sourceId);
      const targetIndex = updatedObjects.findIndex(o => o.id === constraint.targetId);

      if (!source || targetIndex === -1) return;
      const target = { ...updatedObjects[targetIndex] };

      switch (constraint.type) {
        case 'equal_length':
          // Constrains a specific parameter (e.g., width) to match source
          if (source.params[constraint.param] !== undefined) {
            target.params[constraint.param] = source.params[constraint.param];
          }
          break;

        case 'parallel':
          // Aligns rotation of target to source
          target.rotation = [...source.rotation];
          break;

        case 'perpendicular':
          // Aligns rotation to be 90deg offset from source on specified axis
          const axisIndex = constraint.axis === 'x' ? 0 : constraint.axis === 'y' ? 1 : 2;
          target.rotation = [...source.rotation];
          target.rotation[axisIndex] += Math.PI / 2;
          break;

        case 'fixed':
          // Enforces a hard-coded value regardless of user input
          target.params[constraint.param] = constraint.value;
          break;
      }

      updatedObjects[targetIndex] = target;
    });

    return updatedObjects;
  }
}
