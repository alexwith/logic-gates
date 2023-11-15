import { ConnectionMeta, PortMeta } from "../common/types";
import { inputPinId, isInputPinId, outputPinId } from "../utils/idUtil";

export function treversePins(
  id: string,
  connections: ConnectionMeta[],
  ports: PortMeta[],
  activePins: string[]
) {
  const nextPins = [];
  for (const connection of connections) {
    const { pin0Id, pin1Id } = connection;
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
    const portId = Number(args[0]);
    const port = ports.find((port) => port.id === portId)!;

    const inputValues = [];
    for (let i = 0; i < port.inputs; i++) {
      inputValues.push(activePins.includes(inputPinId(portId, i)));
    }

    const outputValues =
      port.truthTable[inputValues.toString()] ?? Array(port.outputs).fill(false, 0, port.outputs);

    for (let i = 0; i < port.outputs; i++) {
      const pinId = outputPinId(portId, i);
      const outputValue = outputValues[i];
      if (outputValue) {
        activePins.push(pinId);
      } else {
        const index = activePins.indexOf(pinId);
        index !== -1 && activePins.splice(index, 1);
      }

      treversePins(pinId, connections, ports, activePins);
    }
  }
}
