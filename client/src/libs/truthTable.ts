import { IO } from "../common/types";
import GateEntity from "../entities/GateEntity";
import TerminalEntity from "../entities/TerminalEntity";
import WireEntity from "../entities/WireEntity";
import { simulate } from "./circuit";

export function createTruthTable(
  terminals: TerminalEntity[],
  wires: WireEntity[],
  gates: GateEntity[]
): boolean[][] {
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

  const previousInputValues = terminals
    .filter((terminal) => terminal.io === IO.Input)
    .map((terminal) => terminal.pin.active);

  combinations.forEach((combination) => {
    for (let i = 0; i < combination.length; i++) {
      terminals[i].pin.active = combination[i];
    }

    simulate(wires, gates);

    const outputValues: boolean[] = [];
    terminals
      .filter((pin) => pin.io === IO.Output)
      .forEach((outputTerminal) => {
        const outputValue = outputTerminal.pin.active;
        outputValues.push(outputValue);
      });

    truthTable.push(combination.concat(outputValues));
  });

  terminals
    .filter((terminal) => terminal.io === IO.Input)
    .forEach((terminal, i) => (terminal.pin.active = previousInputValues[i]));

  return truthTable;
}
