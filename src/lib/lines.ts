import * as THREE from 'three';

export class LineBuilder {
  private positions: number[] = [];
  private colors: number[] = [];

  add(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    color: THREE.Color,
    dim = 1,
  ): void {
    this.positions.push(x1, y1, z1, x2, y2, z2);
    const r = color.r * dim;
    const g = color.g * dim;
    const b = color.b * dim;
    this.colors.push(r, g, b, r, g, b);
  }

  addPolyline(points: Array<{ x: number; y: number; z: number }>, color: THREE.Color, dim = 1): void {
    for (let i = 0; i < points.length - 1; i += 1) {
      const a = points[i];
      const b = points[i + 1];
      this.add(a.x, a.y, a.z, b.x, b.y, b.z, color, dim);
    }
  }

  get segmentCount(): number {
    return this.positions.length / 6;
  }

  build(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(this.positions), 3),
    );
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(this.colors), 3),
    );
    geometry.computeBoundingSphere();
    return geometry;
  }
}
