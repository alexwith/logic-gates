import { IO, Pos } from "../common/types";
import GateTypeEntity from "./GateTypeEntity";
import PinEntity from "./PinEntity";

class GateEntity {
  id: number;
  pos: Pos;
  type: GateTypeEntity;
  inputPins: PinEntity[];
  outputPins: PinEntity[];

  static idCounter: number = 0;

  constructor(pos: Pos, type: GateTypeEntity, id?: number) {
    if (id && id >= GateEntity.idCounter) {
      GateEntity.idCounter = id + 1;
    }

    this.id = id || GateEntity.idCounter++;
    this.pos = pos;
    this.type = type;
    this.inputPins = this.populatePins(IO.Input);
    this.outputPins = this.populatePins(IO.Output);
  }

  private populatePins(io: IO): PinEntity[] {
    const pins: PinEntity[] = [];
    for (let i = 0; i < (io === IO.Input ? this.type.inputs : this.type.outputs); i++) {
      pins.push(new PinEntity(this.id, i, io));
    }

    return pins;
  }
}

export default GateEntity;
