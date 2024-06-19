import { IO, Pos } from "../common/types";
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
    this.pin = new PinEntity(this.id, 0, this.io);
  }

  getPinPos(): Pos {
    //const editorRect: DOMRect = editorRef.current.getBoundingClientRect();

    return {
      //x: this.io == IO.Input ? 40 : editorRect.width - 49,
      x: this.io == IO.Input ? 40 : 600 - 49,
      y: this.yPos - 15,
    };
  }
}

export default TerminalEntity;
