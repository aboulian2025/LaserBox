<div align="center">
<img width="1200" height="475" alt="LaserBox Studio Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# LaserBox Studio – Advanced CAD Edition
**High-Performance Parametric CAD Engine for Precision Fabrication**
</div>

## 🚀 Vision
LaserBox Studio is a modular parametric CAD system designed specifically for additive and subtractive fabrication. Unlike simple box generators, it utilizes a custom geometry kernel to handle complex joinery, topological constraints, and real-time boolean operations.

## 🛠 Tech Stack
- **Engine**: Three.js (WebGL 2.0)
- **Framework**: React + Vite
- **State**: Zustand (Atomic Parametric Updates)
- **Geometry**: Custom CSG Kernel + Vector Math Abstraction
- **Styling**: TailwindCSS 4.0

## 💎 Core Features
- **Parametric Joinery**: Procedural Finger, Tab-and-Slot, and Dovetail joints with tolerance control.
- **Topological Flattening**: One-click transformation from 3D assembly to 2D fabrication layout.
- **CSG Boolean Engine**: Perform Subtract/Union/Intersect operations while maintaining parametric history.
- **Fabrication Export**: Clean, production-ready SVG and DXF exports with path optimization.
- **Exploded View**: Dynamic assembly verification and internal collision checking.

## 📦 Getting Started

**Prerequisites:** Node.js (v18+)

1. **Initialize Project:**
   ```bash
   npm install
   ```
2. **Launch Development Environment:**
   ```bash
   npm run dev
   ```
3. **Build for Production:**
   ```bash
   npm run build
   ```

## 🏗 Modular Architecture
The system is divided into four primary layers:
1. **Core (Kernel)**: Constraint solvers and boolean engines.
2. **Engine**: Specific shape generators (Box, Cylinder, Extrusions).
3. **Scene**: WebGL rendering and interaction handlers.
4. **Export**: Translation of 3D geometry to 2D vector paths.

---
*Developed by Senior CAD Software Architects & Computational Geometry Experts.*
