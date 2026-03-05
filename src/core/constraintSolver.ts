export class ConstraintSolver {
  static validateBoxParams(params: any) {
    const validated = { ...params };
    
    // Minimum dimensions for fabrication
    validated.width = Math.max(10, validated.width);
    validated.height = Math.max(10, validated.height);
    validated.depth = Math.max(10, validated.depth);
    validated.thickness = Math.max(0.5, validated.thickness);
    validated.jointSize = Math.max(2, validated.jointSize);
    
    // Ensure joint size isn't larger than dimensions
    validated.jointSize = Math.min(validated.jointSize, validated.width / 2, validated.height / 2, validated.depth / 2);
    
    return validated;
  }

  static applyEqualLength(objA: any, objB: any, param: string) {
    const val = objA.params[param];
    return { ...objB.params, [param]: val };
  }
}
