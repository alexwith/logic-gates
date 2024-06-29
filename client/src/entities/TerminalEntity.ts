import { IO } from "../common/types";
import PinEntity from "./PinEntity";

class TerminalEntity {
  id: number;
  name: string;
  io: IO;
  yPos: number;
  pin: PinEntity;

  static idCounter: number = 0;

  constructor(name: string, io: IO, yPos: number, id?: number) {
    if (id && id >= TerminalEntity.idCounter) {
      TerminalEntity.idCounter = id + 1;
    }

    this.id = id || TerminalEntity.idCounter++;
    this.name = name;
    this.io = io;
    this.yPos = yPos;
    this.pin = new PinEntity(this, 0, this.io, false);
  }
}

export default TerminalEntity;
