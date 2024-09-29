import GateEntity from "./GateEntity";
import TerminalEntity from "./TerminalEntity";
import WireEntity from "./WireEntity";

class GateTypeEntity {
  id: number;
  name: string;
  inputs: number;
  outputs: number;
  truthTable: boolean[][];
  terminals: TerminalEntity[];
  gates: GateEntity[];
  wires: WireEntity[];

  static idCounter: number = 0;

  constructor(
    name: string,
    inputs: number,
    outputs: number,
    truthTable: boolean[][],
    gates: GateEntity[],
    terminals: TerminalEntity[],
    wires: WireEntity[],
    id?: number,
  ) {
    if (id && id >= GateTypeEntity.idCounter) {
      GateTypeEntity.idCounter = id + 1;
    }

    this.id = id || GateTypeEntity.idCounter++;
    this.name = name;
    this.inputs = inputs;
    this.outputs = outputs;
    this.truthTable = truthTable;
    this.terminals = terminals;
    this.gates = gates;
    this.wires = wires;
  }
}

export default GateTypeEntity;
