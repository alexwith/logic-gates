import { IO } from "../common/types";
import GateEntity from "../entities/GateEntity";
import PinEntity from "../entities/PinEntity";
import TerminalEntity from "../entities/TerminalEntity";
import WireEntity from "../entities/WireEntity";

export function simulate(terminals: TerminalEntity[], wires: WireEntity[], activePins: number[]) {
  const visitedPins: number[] = [];
  terminals.forEach((terminal) => {
    if (terminal.io !== IO.Input) {
      return;
    }

    signalPin(terminal.pin, wires, activePins, visitedPins);
  });
}

function signalPin(
  pin: PinEntity,
  wires: WireEntity[],
  activePins: number[],
  visitedPins: number[]
) {
  wires
    .filter((wire) => wire.startPin === pin || wire.endPin === pin)
    .forEach((wire) => {      
      const entryPin = pin === wire.startPin ? wire.endPin : wire.startPin;
      visitedPins.push(entryPin.id);

      if (activePins.includes(pin.id)) {
        activePins.push(entryPin.id);
      }

      if (!(entryPin.attached instanceof GateEntity)) {
        return;
      }

      const gate = entryPin.attached;

      const inputValues = [];
      for (const pin of gate.inputPins) {
        if (!visitedPins.includes(pin.id)) {
          return;
        }

        inputValues.push(activePins.includes(pin.id));
      }

      let outputValues: boolean[] | undefined;
      truthTableLoop: for (const valuation of gate.type.truthTable) {
        const inputValutation = valuation.slice(0, gate.type.inputs);

        for (let i = 0; i < inputValutation.length; i++) {
          if (inputValutation[i] !== inputValues[i]) {
            continue truthTableLoop;
          }
        }

        outputValues = valuation.slice(gate.type.inputs);
        break;
      }

      if (!outputValues) {
        outputValues = Array(gate.type.outputs).fill(false, 0, gate.type.outputs);
      }

      gate.outputPins.forEach((pin, i) => {
        const outputValue = outputValues![i];
        if (outputValue) {
          activePins.push(pin.id);
        }

        signalPin(pin, wires, activePins, visitedPins);
      });
    });
}
