import { ConnectionMeta, GlobalPinMeta, GateMeta } from "../common/types";
import { globalInputPinId } from "../utils/idUtil";
import { treversePins } from "./circuit";

export function createTruthTable(
  globalPins: GlobalPinMeta[],
  connections: ConnectionMeta[],
  gates: GateMeta[]
): boolean[][] {
  const truthTable: boolean[][] = [];

  const globalInputPins = globalPins.filter((pin) => pin.input).length;
  const combinationAmount = 1 << globalInputPins; // 2^(globalInputPins)
  const combinations: boolean[][] = [];
  for (let i = 0; i < combinationAmount; i++) {
    combinations.push([]);
    for (let j = 0; j < globalInputPins; j++) {
      if (((1 << j) & i) > 0) {
        combinations[i][j] = true;
      } else {
        combinations[i][j] = false;
      }
    }
  }

  combinations.forEach((combination, i) => {
    const globalPinCombination = [];
    for (let i = 0; i < combination.length; i++) {
      if (combination[i]) {
        globalPinCombination.push(globalInputPinId(i));
      }
    }

    const activePins: string[] = [...globalPinCombination];
    globalPins.forEach((globalPin, _) => {
      treversePins(globalPin.id, connections, gates, activePins);
    });

    const outputValues: boolean[] = [];
    globalPins
      .filter((pin) => !pin.input)
      .forEach((globalOutputPin) => {
        const id = globalOutputPin.id;

        let matchingPinId: string | null = null;
        for (const connection of connections) {
          const { pin0Id, pin1Id } = connection;
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
