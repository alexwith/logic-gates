import { create } from "zustand";
import { BASE_GATES } from "./common/constants";
import { ConnectionMeta, GlobalPinMeta, GateMeta } from "./common/types";
import { createTruthTable } from "./libs/truthTable";
import { globalInputPinId, globalOutputPinId } from "./utils/idUtil";
import { treversePins } from "./libs/circuit";

export interface DiagramState {
  gateTypes: GateMeta[];
  globalPins: GlobalPinMeta[];
  gates: GateMeta[];
  connections: ConnectionMeta[];
  selectedGateId: number;
  selectedPinId: string;
  currentTruthTable: boolean[][];
  addingGateType: GateMeta | null;
  activeGlobalPinIds: string[];
  activePinIds: string[];
  addGate: (gate: GateMeta) => void;
  setSelectedPin: (gateId: string) => void;
  setSelectedGate: (gateId: number) => void;
  updateSelectedGate: (gate: GateMeta) => void;
  updateCurrentTruthTable: () => void;
  addGateType: (type: GateMeta) => void;
  addConnection: (connection: ConnectionMeta) => void;
  addGlobalPin: (isInput: boolean) => void;
  setAddingGateType: (type: GateMeta) => void;
  toggleGlobalPin: (pinId: string) => void;
  setGlobalPinName: (pinId: string, name: string) => void;
  updateActivity: () => void;
  clear: () => void;
}

export const useDiagramStore = create<DiagramState>((set) => {
  return {
    gateTypes: BASE_GATES,
    globalPins: [],
    gates: [],
    connections: [],
    selectedGateId: -1,
    selectedPinId: "",
    currentTruthTable: [],
    addingGateType: null,
    activeGlobalPinIds: [],
    activePinIds: [],
    addGate: (gate: GateMeta) => {
      set((state) => ({
        gates: [...state.gates, gate],
      }));
    },
    setSelectedPin: (pinId: string) => {
      set(() => ({
        selectedPinId: pinId,
      }));
    },
    setSelectedGate: (gateId: number) => {
      set(() => ({
        selectedGateId: gateId,
      }));
    },
    updateSelectedGate: (gate: GateMeta) => {
      set((state) => {
        const { selectedGateId, gates } = state;
        if (selectedGateId === -1) {
          return {};
        }

        const updatedGates = [...gates];
        updatedGates[selectedGateId] = gate;
        return { gates: updatedGates };
      });
    },
    updateCurrentTruthTable: () => {
      set((state) => ({
        currentTruthTable: createTruthTable(state.globalPins, state.connections, state.gates),
      }));
    },
    addGateType: (type: GateMeta) => {
      set((state) => ({
        gateTypes: [...state.gateTypes, type],
      }));
    },
    addConnection: (connection: ConnectionMeta) => {
      set((state) => ({
        connections: [...state.connections, connection],
      }));
    },
    addGlobalPin: (isInput: boolean) => {
      set((state) => {
        const nextPinIndex = state.globalPins.filter((pin) => pin.input === isInput).length;
        const pin: GlobalPinMeta = {
          id: isInput ? globalInputPinId(nextPinIndex) : globalOutputPinId(nextPinIndex),
          name: "?",
          input: isInput,
        };

        return { globalPins: [...state.globalPins, pin] };
      });
    },
    setAddingGateType: (type: GateMeta) => {
      set(() => ({
        addingGateType: type,
      }));
    },
    toggleGlobalPin: (pinId: string) => {
      set((state) => {
        const activeGlobalPinIds = [...state.activeGlobalPinIds];
        const index = activeGlobalPinIds.indexOf(pinId);
        index !== -1 ? activeGlobalPinIds.splice(index, 1) : activeGlobalPinIds.push(pinId);

        return { activeGlobalPinIds };
      });
    },
    setGlobalPinName: (pinId: string, name: string) => {
      set((state) => {
        const globalPins = [...state.globalPins];
        const pinIndex = globalPins.findIndex((pin) => pin.id === pinId);
        const pin = { ...globalPins[pinIndex], name };

        globalPins[pinIndex] = pin;
        return { globalPins };
      });
    },
    updateActivity: () => {
      set((state) => {
        const activePinIds: string[] = [...state.activeGlobalPinIds];
        state.globalPins.forEach((globalPin) => {
          treversePins(globalPin.id, state.connections, state.gates, activePinIds);
        });

        return { activePinIds };
      });
    },
    clear: () => {
      set(() => ({
        globalPins: [],
        gates: [],
        connections: [],
        selectedGateId: -1,
        selectedPinId: "",
        currentTruthTable: [],
        addingGateType: null,
        activeGlobalPinIds: [],
        activePinIds: [],
      }));
    },
  };
});
