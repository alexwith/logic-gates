import { IO } from "../common/types";

class TerminalEntity {
  id: number;
  name: string;
  io: IO;
  yPos: number;

  static idCounter: number = 0;

  constructor(name: string, io: IO, yPos: number, id?: number) {
    if (id && id >= TerminalEntity.idCounter) {
      TerminalEntity.idCounter = id + 1;
    }

    this.id = id || TerminalEntity.idCounter++;
    this.name = name;
    this.io = io;
    this.yPos = yPos;
  }
}

export default TerminalEntity;
