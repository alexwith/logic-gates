import { GateMeta, Pos, TerminalMeta, WireMeta } from "../common/types";
import { Buffer } from "buffer";
import { OffsetBuffer } from "../utils/OffsetBuffer";
import {
  gateIdFromPinId,
  indexFromPinId,
  inputPinId,
  inputTerminalId,
  isInputPinId,
  isTerminalId,
  outputPinId,
  outputTerminalId,
} from "../utils/idUtil";

export const serializeCircuit = (
  gateTypes: GateMeta[],
  gates: GateMeta[],
  terminals: TerminalMeta[],
  wires: WireMeta[]
): Buffer => {
  console.log(wires);

  let size = 9; // see spec

  gateTypes.forEach((gateType) => {
    size +=
      6 +
      (gateType.name.length + 1) +
      (gateType.inputs + gateType.outputs) * gateType.truthTable.length; // see spec
  });

  gates.forEach((gate) => {
    size += 8; // see spec
  });

  terminals.forEach((terminal) => {
    size += 5 + (terminal.name.length + 1); // see spec
  });

  wires.forEach((wire) => {
    size += 12 + 4 * wire.checkpoints.length; // see spec
  });

  const buffer = new OffsetBuffer(Buffer.alloc(size));

  buffer.writeUInt16(0xc1c0); // magic
  buffer.writeUInt8(0x01); // version

  buffer.writeUInt16(gateTypes.length);
  gateTypes.forEach((gateType) => {
    buffer.writeString(gateType.name);
    buffer.writeUInt8(gateType.inputs);
    buffer.writeUInt8(gateType.outputs);
    buffer.writeUInt16(gateType.truthTable.length);

    gateType.truthTable.forEach((valuation) => {
      valuation.forEach((truthValue) => {
        buffer.writeUInt8(truthValue ? 1 : 0);
      });
    });
  });

  buffer.writeUInt16(gates.length);
  gates.forEach((gate) => {
    buffer.writeUInt16(gate.id);
    buffer.writeUInt16(
      gateTypes.indexOf(gateTypes.find((gateType) => gateType.name === gate.name)!)
    );
    buffer.writeUInt16(gate.pos.x);
    buffer.writeUInt16(gate.pos.y);
  });

  buffer.writeUInt16(terminals.length);
  terminals.forEach((terminal) => {
    buffer.writeUInt8(terminal.input ? 1 : 0);
    buffer.writeUInt16(indexFromPinId(terminal.id));
    buffer.writeString(terminal.name);
    buffer.writeUInt16(terminal.yPos);
  });

  buffer.writeUInt16(wires.length);
  wires.forEach((wire) => {
    const isPin0Terminal = isTerminalId(wire.pin0Id);
    buffer.writeUInt8(isPin0Terminal ? 1 : 0);
    buffer.writeUInt8(isInputPinId(wire.pin0Id) ? 1 : 0);
    buffer.writeUInt16(isPin0Terminal ? 0 : gateIdFromPinId(wire.pin0Id));
    buffer.writeUInt16(indexFromPinId(wire.pin0Id));

    const isPin1Terminal = isTerminalId(wire.pin1Id);
    buffer.writeUInt8(isPin1Terminal ? 1 : 0);
    buffer.writeUInt8(isInputPinId(wire.pin1Id) ? 1 : 0);
    buffer.writeUInt16(isPin1Terminal ? 0 : gateIdFromPinId(wire.pin1Id));
    buffer.writeUInt16(indexFromPinId(wire.pin1Id));

    buffer.writeUInt16(wire.checkpoints.length);
    wire.checkpoints.forEach((checkpoint) => {
      buffer.writeUInt16(checkpoint.x);
      buffer.writeUInt16(checkpoint.y);
    });
  });

  return buffer.buffer;
};

export const deserializeCircuit = (
  data: ArrayBuffer
): [GateMeta[], GateMeta[], TerminalMeta[], WireMeta[]] | null => {
  const buffer = new OffsetBuffer(Buffer.from(data));

  const magic = buffer.readUInt16();
  if (magic !== 0xc1c0) {
    // the file is not a circuit file
    console.error("The file is not a circuit file.");
    return null;
  }

  const version = buffer.readUInt8();
  if (version !== 0x01) {
    // only supported version for now
    console.error("The file version is invalid.");
    return null;
  }

  const gateTypesSize = buffer.readUInt16();
  const gateTypes: GateMeta[] = [];
  for (let i = 0; i < gateTypesSize; i++) {
    const name = buffer.readString();
    const inputs = buffer.readUInt8();
    const outputs = buffer.readUInt8();
    const valuations = buffer.readUInt16();

    const truthTable: boolean[][] = [];
    for (let j = 0; j < valuations; j++) {
      const valuation: boolean[] = [];
      for (let k = 0; k < inputs + outputs; k++) {
        valuation.push(buffer.readUInt8() === 1);
      }

      truthTable.push(valuation);
    }

    gateTypes.push({
      id: -1,
      name,
      pos: { x: 0, y: 0 },
      inputs,
      outputs,
      truthTable,
    });
  }

  const gatesSize = buffer.readUInt16();
  const gates: GateMeta[] = [];
  for (let i = 0; i < gatesSize; i++) {
    const id = buffer.readUInt16();
    const gateTypeIndex = buffer.readUInt16();
    const pos: Pos = {
      x: buffer.readUInt16(),
      y: buffer.readUInt16(),
    };

    const gateType = gateTypes[gateTypeIndex];
    gates.push({
      id,
      name: gateType.name,
      pos,
      inputs: gateType.inputs,
      outputs: gateType.outputs,
      truthTable: gateType.truthTable,
    });
  }

  const terminalsSize = buffer.readUInt16();
  const terminals: TerminalMeta[] = [];
  for (let i = 0; i < terminalsSize; i++) {
    const input = buffer.readUInt8() === 1;
    const index = buffer.readUInt16();
    const name = buffer.readString();
    const yPos = buffer.readUInt16();

    terminals.push({
      input,
      id: input ? inputTerminalId(index) : outputTerminalId(index),
      name,
      yPos,
    });
  }

  const wiresSize = buffer.readUInt16();
  const wires: WireMeta[] = [];
  for (let i = 0; i < wiresSize; i++) {
    const isPin0Terminal = buffer.readUInt8() === 1;
    const isPin0Input = buffer.readUInt8() === 1;
    const pin0Id = buffer.readUInt16();
    const pin0Index = buffer.readUInt16();

    let pin0;
    if (isPin0Terminal) {
      pin0 = isPin0Input ? inputTerminalId(pin0Index) : outputTerminalId(pin0Index);
    } else {
      pin0 = isPin0Input ? inputPinId(pin0Id, pin0Index) : outputPinId(pin0Id, pin0Index);
    }

    const isPin1Terminal = buffer.readUInt8() === 1;
    const isPin1Input = buffer.readUInt8() === 1;
    const pin1Id = buffer.readUInt16();
    const pin1Index = buffer.readUInt16();

    let pin1;
    if (isPin1Terminal) {
      pin1 = isPin1Input ? inputTerminalId(pin1Index) : outputTerminalId(pin1Index);
    } else {
      pin1 = isPin1Input ? inputPinId(pin1Id, pin1Index) : outputPinId(pin1Id, pin1Index);
    }

    const checkpointsSize = buffer.readUInt16();
    const checkpoints: Pos[] = [];
    for (let i = 0; i < checkpointsSize; i++) {
      checkpoints.push({
        x: buffer.readUInt16(),
        y: buffer.readUInt16(),
      });
    }

    wires.push({
      pin0Id: pin0,
      pin1Id: pin1,
      checkpoints,
    });
  }

  return [gateTypes, gates, terminals, wires];
};
