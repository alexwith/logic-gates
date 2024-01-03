import { create } from "zustand";
import { BASE_GATES } from "./common/constants";
import { WireMeta, TerminalMeta, GateMeta } from "./common/types";
import { createTruthTable } from "./libs/truthTable";
import { inputTerminalId, outputTerminalId } from "./utils/idUtil";
import { treversePins } from "./libs/circuit";

export interface DiagramState {
  gateTypes: GateMeta[];
  terminals: TerminalMeta[];
  gates: GateMeta[];
  wires: WireMeta[];
  selectedGateId: number;
  selectedPinId: string;
  currentTruthTable: boolean[][];
  addingGateType: GateMeta | null;
  activeTerminalIds: string[];
  activePinIds: string[];
  addGate: (gate: GateMeta) => void;
  setSelectedPin: (gateId: string) => void;
  setSelectedGate: (gateId: number) => void;
  updateSelectedGate: (gate: GateMeta) => void;
  updateCurrentTruthTable: () => void;
  addGateType: (type: GateMeta) => void;
  addWire: (wire: WireMeta) => void;
  addTerminal: (isInput: boolean) => void;
  setAddingGateType: (type: GateMeta) => void;
  toggleTerminal: (pinId: string) => void;
  setTerminalName: (pinId: string, name: string) => void;
  updateActivity: () => void;
  clear: () => void;
}

export const useDiagramStore = create<DiagramState>((set) => {
  return {
    gateTypes: BASE_GATES,
    terminals: [],
    gates: [],
    wires: [],
    selectedGateId: -1,
    selectedPinId: "",
    currentTruthTable: [],
    addingGateType: null,
    activeTerminalIds: [],
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
        currentTruthTable: createTruthTable(state.terminals, state.wires, state.gates),
      }));
    },
    addGateType: (type: GateMeta) => {
      set((state) => ({
        gateTypes: [...state.gateTypes, type],
      }));
    },
    addWire: (wire: WireMeta) => {
      set((state) => ({
        wires: [...state.wires, wire],
      }));
    },
    addTerminal: (isInput: boolean) => {
      set((state) => {
        const nextPinIndex = state.terminals.filter((pin) => pin.input === isInput).length;
        const pin: TerminalMeta = {
          id: isInput ? inputTerminalId(nextPinIndex) : outputTerminalId(nextPinIndex),
          name: "?",
          input: isInput,
        };

        return { terminals: [...state.terminals, pin] };
      });
    },
    setAddingGateType: (type: GateMeta) => {
      set(() => ({
        addingGateType: type,
      }));
    },
    toggleTerminal: (pinId: string) => {
      set((state) => {
        const activeTerminalIds = [...state.activeTerminalIds];
        const index = activeTerminalIds.indexOf(pinId);
        index !== -1 ? activeTerminalIds.splice(index, 1) : activeTerminalIds.push(pinId);

        return { activeTerminalIds: activeTerminalIds };
      });
    },
    setTerminalName: (pinId: string, name: string) => {
      set((state) => {
        const terminals = [...state.terminals];
        const pinIndex = terminals.findIndex((pin) => pin.id === pinId);
        const pin = { ...terminals[pinIndex], name };

        terminals[pinIndex] = pin;
        return { terminals: terminals };
      });
    },
    updateActivity: () => {
      set((state) => {
        const activePinIds: string[] = [...state.activeTerminalIds];
        state.terminals.forEach((terminal) => {
          treversePins(terminal.id, state.wires, state.gates, activePinIds);
        });

        return { activePinIds };
      });
    },
    clear: () => {
      set(() => ({
        terminals: [],
        gates: [],
        wires: [],
        selectedGateId: -1,
        selectedPinId: "",
        currentTruthTable: [],
        addingGateType: null,
        activeTerminalIds: [],
        activePinIds: [],
      }));
    },
  };
});
