import { WireMeta, GateMeta } from "../common/types";
import { inputPinId, isInputPinId, outputPinId } from "../utils/idUtil";

export function treversePins(
  id: string,
  wires: WireMeta[],
  gates: GateMeta[],
  activePins: string[]
) {
  const nextPins = [];
  for (const wire of wires) {
    const { pin0Id, pin1Id } = wire;
    if (pin0Id === id && isInputPinId(pin1Id)) {
      nextPins.push(pin1Id);
      if (activePins.includes(id)) {
        activePins.push(pin1Id);
      }
    }
    if (pin1Id === id && isInputPinId(pin0Id)) {
      nextPins.push(pin0Id);
      if (activePins.includes(id)) {
        activePins.push(pin0Id);
      }
    }
  }

  for (const pinId of nextPins) {
    const args = pinId.split("-");
    const gateId = Number(args[0]);
    const gate = gates.find((gate) => gate.id === gateId)!;

    const inputValues = [];
    for (let i = 0; i < gate.inputs; i++) {
      inputValues.push(activePins.includes(inputPinId(gateId, i)));
    }

    const outputValues =
      gate.truthTable[inputValues.toString()] ?? Array(gate.outputs).fill(false, 0, gate.outputs);

    for (let i = 0; i < gate.outputs; i++) {
      const pinId = outputPinId(gateId, i);
      const outputValue = outputValues[i];
      if (outputValue) {
        activePins.push(pinId);
      } else {
        const index = activePins.indexOf(pinId);
        index !== -1 && activePins.splice(index, 1);
      }

      treversePins(pinId, wires, gates, activePins);
    }
  }
}
