import { WireMeta, TerminalMeta, GateMeta } from "../common/types";
import { inputTerminalId } from "../utils/idUtil";
import { simulate } from "./circuit";

export function createTruthTable(
  terminals: TerminalMeta[],
  wires: WireMeta[],
  gates: GateMeta[]
): boolean[][] {
  const truthTable: boolean[][] = [];

  const inputTerminals = terminals.filter((pin) => pin.input).length;
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
        terminalCombination.push(inputTerminalId(i));
      }
    }

    const activePins: string[] = [...terminalCombination];
    simulate(terminals, wires, gates, activePins);

    const outputValues: boolean[] = [];
    terminals
      .filter((pin) => !pin.input)
      .forEach((outputTerminal) => {
        const id = outputTerminal.id;

        let matchingPinId: string | null = null;
        for (const wire of wires) {
          const { pin0Id, pin1Id } = wire;
          if (pin0Id === id) {
            matchingPinId = pin1Id;
            break;
          }
          if (pin1Id === id) {
            matchingPinId = pin0Id;
            break;
          }
        }

        if (!matchingPinId) {
          outputValues.push(false);
          return;
        }

        const outputValue = activePins.includes(matchingPinId);
        outputValues.push(outputValue);
      });

    truthTable.push(combination.concat(outputValues));
  });

  return truthTable;
}
