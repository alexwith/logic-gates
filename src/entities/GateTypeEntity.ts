class GateTypeEntity {
  id: number;
  name: string;
  inputs: number;
  outputs: number;
  truthTable: boolean[][];

  static idCounter: number = 0;

  constructor(name: string, inputs: number, outputs: number, truthTable: boolean[][], id?: number) {
    if (id && id >= GateTypeEntity.idCounter) {
      GateTypeEntity.idCounter = id + 1;
    }

    this.id = id || GateTypeEntity.idCounter++;
    this.name = name;
    this.inputs = inputs;
    this.outputs = outputs;
    this.truthTable = truthTable;
  }
}

export default GateTypeEntity;
