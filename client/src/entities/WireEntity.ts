import { Pos } from "../common/types";

class WireEntity {
  startId: number;
  startIndex: number;
  endId: number;
  endIndex: number;
  checkpoints: Pos[];

  constructor(startId: number, startIndex: number, endId: number, endIndex: number, checkpoints: Pos[]) {
    this.startId = startId;
    this.startIndex = startIndex;
    this.endId = endId;
    this.endIndex = endIndex;
    this.checkpoints = checkpoints;
  }
}

export default WireEntity;