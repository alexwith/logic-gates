import { IO } from "../common/types";

class PinEntity {
  attachedId: number;
  index: number;
  io: IO;

  constructor(attachedId: number, index: number, io: IO) {
    this.attachedId = attachedId;
    this.index = index;
    this.io = io;
  }
}

export default PinEntity;
