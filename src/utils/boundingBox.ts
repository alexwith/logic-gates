import { Pos } from "../common/types";

export class BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;

  constructor(minX: number, minY: number, maxX: number, maxY: number) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }

  isInside(pos: Pos) {
    return pos.x >= this.minX && pos.x <= this.maxX && pos.y >= this.minY && pos.y <= this.maxY;
  }

  distanceToSq = (pos: Pos): number => {
    const dx = Math.max(this.minX - pos.x, 0, pos.x - this.maxX);
    const dy = Math.max(this.minY - pos.y, 0, pos.y - this.maxY);
    return Math.abs(dx * dx + dy * dy);
  };

  grow = (amount: number) => {
    return new BoundingBox(
      this.minX - amount,
      this.minY - amount,
      this.maxX + amount,
      this.maxY + amount
    );
  };
}
