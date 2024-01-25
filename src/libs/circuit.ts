import { WireMeta, GateMeta, TerminalMeta } from "../common/types";
import { gateIdFromPinId, inputPinId, outputPinId } from "../utils/idUtil";

export function simulate(  
  terminals: TerminalMeta[],
  wires: WireMeta[],
  gates: GateMeta[],
  activePins: string[]
) {
  const visitedPins: string[] = [];
  terminals.forEach((terminal) => {
    if (!terminal.input) {
      return;
    }

    signalPin(terminal.id, wires, gates, activePins, visitedPins)
  });
}

function signalPin(
  pinId: string,
  wires: WireMeta[],
  gates: GateMeta[],
  activePins: string[],
  visitedPins: string[]
) {
  wires
    .filter((wire) => wire.pin0Id === pinId || wire.pin1Id === pinId)
    .forEach((wire) => {
      const entryPinId = pinId === wire.pin0Id ? wire.pin1Id : wire.pin0Id;
      visitedPins.push(entryPinId);

      if (activePins.includes(pinId)) {
        activePins.push(entryPinId);
      }

      const gateId = gateIdFromPinId(entryPinId);
      const gate = gates.find((gate) => gate.id === gateId);
      if (!gate) {
        return;
      }

      const inputValues = [];
      for (let i = 0; i < gate.inputs; i++) {
        const pinId = inputPinId(gateId, i);
        if (!visitedPins.includes(pinId)) {
          return;
        }

        inputValues.push(activePins.includes(pinId));
      }

      const outputValues =
        gate.truthTable[inputValues.toString()] ?? Array(gate.outputs).fill(false, 0, gate.outputs);

      for (let i = 0; i < gate.outputs; i++) {
        const pinId = outputPinId(gateId, i);
        const outputValue = outputValues[i];        
        if (outputValue) {
          activePins.push(pinId);
        }

        signalPin(pinId, wires, gates, activePins, visitedPins);
      }
    });
}
