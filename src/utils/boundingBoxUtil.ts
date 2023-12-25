import { GateMeta, Pos } from "../common/types";
import { BoundingBox } from "./boundingBox";
import { isInputPinId } from "./idUtil";

export const boundingBoxFromGate = (gate: GateMeta): BoundingBox => {
  const { x, y } = gate.pos;

  return new BoundingBox(x, y, x + gate.width, y + gate.height);
};

export const boundingBoxFromTerminal = (terminalId: string, pos: Pos): BoundingBox => {
  return isInputPinId(terminalId)
    ? new BoundingBox(pos.x - 6, pos.y + 3, pos.x, pos.y - 3)
    : new BoundingBox(pos.x + 6, pos.y + 3, pos.x, pos.y - 3);
};

export const nearestBoundingBox = (
  boundingBoxes: BoundingBox[],
  point: Pos
): BoundingBox | null => {
  let nearest: BoundingBox | null = null;
  let nearestDistance: number = -1;
  boundingBoxes.forEach((boundingBox) => {
    const distance = boundingBox.distanceToSq(point);
    if (nearest != null && distance > nearestDistance) {
      return;
    }

    nearest = boundingBox;
    nearestDistance = distance;
  });

  return nearest;
};
