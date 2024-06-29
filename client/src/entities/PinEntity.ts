import { EDITOR_WIDTH } from "../common/constants";
import { IO, Pos } from "../common/types";
import GateEntity from "./GateEntity";
import TerminalEntity from "./TerminalEntity";

class PinEntity {
  id: number;
  attached: GateEntity | TerminalEntity;
  index: number;
  io: IO;
  active: boolean;

  static idCounter: number = 0;

  constructor(attached: GateEntity | TerminalEntity, index: number, io: IO, active: boolean, id?: number) {
    if (id && id >= PinEntity.idCounter) {
      PinEntity.idCounter = id + 1;
    }

    this.id = id || PinEntity.idCounter++;
    this.attached = attached;
    this.index = index;
    this.io = io;
    this.active = active;
  }

  getPos(): Pos {
    if (this.attached instanceof TerminalEntity) {
      return {
        x: this.io === IO.Input ? 40 : EDITOR_WIDTH - 49,
        y: this.attached.yPos - 15,
      };
    } else if (this.attached instanceof GateEntity) {
      const { x: cx, y: cy } = this.attached.pos;
      const pins = this.io === IO.Input ? this.attached.type.inputs : this.attached.type.outputs;
      const spacing = this.attached.height / pins;
      const offsetY = spacing / 2;
      const offsetX = this.io === IO.Input ? 0 : this.attached.width;

      return { x: cx + offsetX, y: cy + offsetY + spacing * this.index };
    }

    return { x: 0, y: 0 };
  }
}

export default PinEntity;
