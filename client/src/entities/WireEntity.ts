import { Pos } from "../common/types";
import PinEntity from "./PinEntity";

class WireEntity {
  startPin: PinEntity;
  endPin: PinEntity;
  checkpoints: Pos[];

  constructor(startPin: PinEntity, endPin: PinEntity, checkpoints: Pos[]) {
    this.startPin = startPin;
    this.endPin = endPin;
    this.checkpoints = checkpoints;
  }
}

export default WireEntity;
