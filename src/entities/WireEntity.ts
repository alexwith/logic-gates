import { IO, Pos } from "../common/types";
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
    if (this.startPin.io === IO.Output && this.endPin.io === IO.Input) {
      this.endPin.active = this.startPin.active;
    } else if (this.startPin.io === IO.Input && this.endPin.io === IO.Output) {
      this.startPin.active = this.endPin.active;
    } else {
      this.startPin.active = this.startPin.active || this.endPin.active;
      this.endPin.active = this.startPin.active;
    }
  }
}

export default WireEntity;
