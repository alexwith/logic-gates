import { IO } from "../common/types";
import PinEntity from "../entities/PinEntity";
import TerminalEntity from "../entities/TerminalEntity";
import WireEntity from "../entities/WireEntity";
import { simulate } from "./circuit";

export function createTruthTable(terminals: TerminalEntity[], wires: WireEntity[]): boolean[][] {
  const truthTable: boolean[][] = [];

  const inputTerminals = terminals.filter((pin) => pin.io === IO.Input).length;
  const combinationAmount = 1 << inputTerminals; // 2^inputTerminals cause Math#pow is slow
  const combinations: boolean[][] = [];
  for (let i = 0; i < combinationAmount; i++) {
    combinations.push([]);
    for (let j = 0; j < inputTerminals; j++) {
      if (((1 << j) & i) > 0) {
        combinations[i][j] = true;
      } else {
        combinations[i][j] = false;
      }
    }
  }

  combinations.forEach((combination, i) => {
    const terminalCombination = [];
    for (let i = 0; i < combination.length; i++) {
      if (combination[i]) {
        terminalCombination.push(i); // TODO not sure about this, previously inputTerminalId(i)
      }
    }

    const activePins: number[] = [...terminalCombination];
    simulate(terminals, wires, activePins);

    const outputValues: boolean[] = [];
    terminals
      .filter((pin) => pin.io !== IO.Input)
      .forEach((outputTerminal) => {
        const pin = outputTerminal.pin;

        let matchingPin: PinEntity | null = null;
        for (const wire of wires) {
          const { startPin, endPin } = wire;
          if (startPin === pin) {
            matchingPin = endPin;
            break;
          }
          if (endPin === pin) {
            matchingPin = startPin;
            break;
          }
        }

        if (!matchingPin) {
          outputValues.push(false);
          return;
        }

        const outputValue = activePins.includes(matchingPin.id);
        outputValues.push(outputValue);
      });

    truthTable.push(combination.concat(outputValues));
  });

  return truthTable;
}
