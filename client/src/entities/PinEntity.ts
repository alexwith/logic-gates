import { IO, Pos } from "../common/types";
import GateEntity from "./GateEntity";
import TerminalEntity from "./TerminalEntity";

class PinEntity {
  id: number;
  attached: GateEntity | TerminalEntity;
  index: number;
  io: IO;

  static idCounter: number = 0;

  constructor(attached: GateEntity | TerminalEntity, index: number, io: IO, id?: number) {
    if (id && id >= PinEntity.idCounter) {
      PinEntity.idCounter = id + 1;
    }

    this.id = id || PinEntity.idCounter++;
    this.attached = attached;
    this.index = index;
    this.io = io;
  }

  getPos(): Pos {
    if (this.attached instanceof PinEntity)
    return {    
      x: this.io == IO.Input ? 40 : 600 - 49,
      y: this.yPos - 15,
    };
  }
}

export default PinEntity;
