import { Buffer } from "buffer";
import { OffsetBuffer } from "../utils/OffsetBuffer";
import GateEntity from "../entities/GateEntity";
import GateTypeEntity from "../entities/GateTypeEntity";
import TerminalEntity from "../entities/TerminalEntity";
import WireEntity from "../entities/WireEntity";
import { IO, PinType, Pos } from "../common/types";

export const serializeCircuit = (
  gateTypes: GateTypeEntity[],
  gates: GateEntity[],
  terminals: TerminalEntity[],
  wires: WireEntity[],
): Buffer => {
  let size = 11; // see spec

  gateTypes.forEach((gateType) => {
    size +=
      4 +
      (gateType.name.length + 1) +
      Math.ceil(((gateType.inputs + gateType.outputs) * gateType.truthTable.length) / 8) * 2; // see spec
  });

  gates.forEach(() => {
    size += 8; // see spec
  });

  terminals.forEach((terminal) => {
    size += 5 + (terminal.name.length + 1); // see spec
  });

  wires.forEach((wire) => {
    size += 12 + 4 * wire.checkpoints.length; // see spec
  });

  const buffer = new OffsetBuffer(Buffer.alloc(size));
  buffer.writeUInt16(0x418); // magic
  buffer.writeUInt8(0x01); // version

  buffer.writeUInt16(gateTypes.length);
  gateTypes.forEach((gateType) => {
    buffer.writeString(gateType.name);
    buffer.writeUInt8(gateType.inputs);
    buffer.writeUInt8(gateType.outputs);
    buffer.writeUInt16(gateType.truthTable.length);

    let truthValueBitset = 0;
    let truthValueCounter = 0;
    gateType.truthTable.forEach((valuation) => {
      valuation.forEach((truthValue) => {
        if (truthValue) {
          truthValueBitset |= 1 << truthValueCounter;
        }

        if (++truthValueCounter === 8) {
          buffer.writeUInt16(truthValueBitset);
          truthValueBitset = 0;
          truthValueCounter = 0;
        }
      });
    });

    if (truthValueBitset !== 0) {
      buffer.writeUInt16(truthValueBitset);
    }
  });

  buffer.writeUInt16(gates.length);
  gates.forEach((gate) => {
    buffer.writeUInt16(gate.id);
    buffer.writeUInt16(gateTypes.indexOf(gate.type));
    buffer.writeUInt16(gate.pos.x);
    buffer.writeUInt16(gate.pos.y);
  });

  buffer.writeUInt16(terminals.length);
  terminals.forEach((terminal) => {
    buffer.writeUInt16(terminal.id);
    buffer.writeUInt8(terminal.io);
    buffer.writeString(terminal.name);
    buffer.writeUInt16(terminal.yPos);
  });

  buffer.writeUInt16(wires.length);
  wires.forEach((wire) => {
    const startEntity = wire.startPin.attached;
    buffer.writeUInt8(PinType.fromEntity(startEntity));
    buffer.writeUInt16(
      PinType.dynamicLogic(
        PinType.fromEntity(startEntity),
        () => terminals.indexOf(startEntity as TerminalEntity),
        () => gates.indexOf(startEntity as GateEntity),
      ),
    );
    buffer.writeUInt8(wire.startPin.index);
    buffer.writeUInt8(wire.startPin.io);

    const endEntity = wire.endPin.attached;
    buffer.writeUInt8(PinType.fromEntity(endEntity));
    buffer.writeUInt16(
      PinType.dynamicLogic(
        PinType.fromEntity(endEntity),
        () => terminals.indexOf(endEntity as TerminalEntity),
        () => gates.indexOf(endEntity as GateEntity),
      ),
    );
    buffer.writeUInt8(wire.endPin.index);
    buffer.writeUInt8(wire.endPin.io);

    buffer.writeUInt16(wire.checkpoints.length);
    wire.checkpoints.forEach((checkpoint) => {
      buffer.writeUInt16(checkpoint.x);
      buffer.writeUInt16(checkpoint.y);
    });
  });

  return buffer.buffer;
};

export const deserializeCircuit = (
  data: ArrayBuffer,
): [GateTypeEntity[], GateEntity[], TerminalEntity[], WireEntity[]] | null => {
  const buffer = new OffsetBuffer(Buffer.from(data));

  try {
    const magic = buffer.readUInt16();
    if (magic !== 0x418) {
      // the file is not a circuit file
      console.error("The file is not a circuit file.");
      return null;
    }
  } catch {
    return null;
  }

  const version = buffer.readUInt8();
  if (version !== 0x01) {
    // only supported version for now
    console.error("The file version is invalid.");
    return null;
  }

  const gateTypesSize = buffer.readUInt16();
  const gateTypes: GateTypeEntity[] = [];
  for (let i = 0; i < gateTypesSize; i++) {
    const name = buffer.readString();
    const inputs = buffer.readUInt8();
    const outputs = buffer.readUInt8();
    const valuations = buffer.readUInt16();

    const truthTable: boolean[][] = [];
    const truthValueBitsets = Math.ceil(((inputs + outputs) * valuations) / 8);

    let valuation: boolean[] = [];
    for (let i = 0; i < truthValueBitsets; i++) {
      const truthValueBitset = buffer.readUInt16();
      for (let j = 0; j < 8; j++) {
        valuation.push((truthValueBitset & (1 << j)) !== 0);

        if (valuation.length === inputs + outputs) {
          truthTable.push(valuation);
          valuation = [];
        }
      }
    }

    gateTypes.push(new GateTypeEntity(name, inputs, outputs, truthTable));
  }

  const gatesSize = buffer.readUInt16();
  const gates: GateEntity[] = [];
  for (let i = 0; i < gatesSize; i++) {
    const id = buffer.readUInt16();
    const gateTypeIndex = buffer.readUInt16();
    const pos: Pos = {
      x: buffer.readUInt16(),
      y: buffer.readUInt16(),
    };

    const gateType = gateTypes[gateTypeIndex];
    gates.push(new GateEntity(pos, gateType, id));
  }

  const terminalsSize = buffer.readUInt16();
  const terminals: TerminalEntity[] = [];
  for (let i = 0; i < terminalsSize; i++) {
    const id = buffer.readUInt16();
    const io = buffer.readUInt8();
    const name = buffer.readString();
    const yPos = buffer.readUInt16();

    terminals.push(new TerminalEntity(name, io, yPos, id));
  }

  const wiresSize = buffer.readUInt16();
  const wires: WireEntity[] = [];
  for (let i = 0; i < wiresSize; i++) {
    const startPinType = buffer.readUInt8();
    const startPinAttachedIndex = buffer.readUInt16();
    const startPinIndex = buffer.readUInt8();
    const startIo = buffer.readUInt8();

    const startEntity = PinType.dynamicLogic<TerminalEntity | GateEntity>(
      startPinType,
      () => terminals[startPinAttachedIndex],
      () => gates[startPinAttachedIndex],
    );

    const startPin = PinType.dynamicLogic(
      startPinType,
      () => (startEntity as TerminalEntity).pin,
      () => {
        const gateEntity = startEntity as GateEntity;
        return startIo === IO.Input
          ? gateEntity.inputPins[startPinIndex]
          : gateEntity.outputPins[startPinIndex];
      },
    );
    const endPinType = buffer.readUInt8();
    const endPinAttachedId = buffer.readUInt16();
    const endPinIndex = buffer.readUInt8();
    const endIo = buffer.readUInt8();

    const endEntity = PinType.dynamicLogic<TerminalEntity | GateEntity>(
      endPinType,
      () => terminals[endPinAttachedId],
      () => gates[endPinAttachedId],
    );

    const endPin = PinType.dynamicLogic(
      endPinType,
      () => (endEntity as TerminalEntity).pin,
      () => {
        const gateEntity = endEntity as GateEntity;
        return endIo === IO.Input
          ? gateEntity.inputPins[endPinIndex]
          : gateEntity.outputPins[endPinIndex];
      },
    );

    const checkpointsSize = buffer.readUInt16();
    const checkpoints: Pos[] = [];
    for (let i = 0; i < checkpointsSize; i++) {
      checkpoints.push({
        x: buffer.readUInt16(),
        y: buffer.readUInt16(),
      });
    }

    wires.push(new WireEntity(startPin, endPin, checkpoints));
  }

  return [gateTypes, gates, terminals, wires];
};
