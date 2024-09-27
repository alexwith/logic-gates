import { Pos } from "../common/types";

export function tryStraightenWire(start: Pos, end: Pos, checkpoints: Pos[]) {
  for (let i = 0; i < checkpoints.length; i++) {
    const pos = checkpoints[i];
    if (i === 0) {
      const xDiff = Math.abs(pos.x - start.x);
      const yDiff = Math.abs(pos.y - start.y);
      if (xDiff < yDiff) {
        pos.x = start.x;
      } else {
        pos.y = start.y;
      }
    }

    if (i === checkpoints.length - 1) {
      const xDiff = Math.abs(pos.x - end.x);
      const yDiff = Math.abs(pos.y - end.y);
      if (xDiff < yDiff) {
        pos.x = end.x;
      } else {
        pos.y = end.y;
      }
    } else {
      const xDiff = Math.abs(pos.x - checkpoints[i + 1].x);
      const yDiff = Math.abs(pos.y - checkpoints[i + 1].y);
      if (xDiff < yDiff) {
        const newX = (pos.x + checkpoints[i + 1].x) / 2;
        pos.x = newX;
        checkpoints[i + 1].x = newX;
      } else {
        const newY = (pos.y + checkpoints[i + 1].y) / 2;
        pos.y = newY;
        checkpoints[i + 1].y = newY;
      }
    }
  }
}
