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

  execute() {
    /*if (
      this.startPin.io === this.endPin.io &&
      this.startPin instanceof PinEntity &&
      this.endPin instanceof PinEntity
    ) {
      this.startPin.active = this.startPin.active || this.endPin.active;
      this.endPin.active = this.startPin.active;
    } else {
      this.endPin.active = this.startPin.active;
    }*/

    this.endPin.active = this.startPin.active;
  }
}

export default WireEntity;
