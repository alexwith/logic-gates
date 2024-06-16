import { create } from "zustand";
import { BASE_GATES } from "./common/constants";
import { IEditorSettings, IO } from "./common/types";
import { createTruthTable } from "./libs/truthTable";
import { simulate } from "./libs/circuit";
import GateTypeEntity from "./entities/GateTypeEntity";
import TerminalEntity from "./entities/TerminalEntity";
import GateEntity from "./entities/GateEntity";
import WireEntity from "./entities/WireEntity";

export interface EditorState {
  settings: IEditorSettings;
  gateTypes: GateTypeEntity[];
  terminals: TerminalEntity[];
  gates: GateEntity[];
  wires: WireEntity[];
  selectedGateId: number;
  selectedPinId: string;
  currentTruthTable: boolean[][];
  addingGateType: GateTypeEntity | null;
  activeTerminalIds: string[];
  activePinIds: string[];
  setSettings: (settings: IEditorSettings) => void;
  setGates: (gates: GateEntity[]) => void;
  addGate: (gate: GateEntity) => void;
  removeGate: (gateId: number) => void;
  setSelectedPin: (gateId: string) => void;
  setSelectedGate: (gateId: number) => void;
  updateSelectedGate: (gate: GateEntity) => void;
  updateCurrentTruthTable: () => void;
  setGateTypes: (gateTypes: GateTypeEntity[]) => void;
  addGateType: (gateType: GateTypeEntity) => void;
  setWires: (wires: WireEntity[]) => void;
  addWire: (wire: WireEntity) => void;
  removeWire: (wire: WireEntity) => void;
  setTerminals: (terminals: TerminalEntity[]) => void;
  addTerminal: (isInput: boolean, yPos: number) => void;
  setAddingGateType: (type: GateTypeEntity) => void;
  toggleTerminal: (pinId: string) => void;
  setTerminalName: (terminalId: number, name: string) => void;
  updateActivity: () => void;
  clear: () => void;
}

export const useEditorStore = create<EditorState>((set) => {
  return {
    settings: {
      grid: true,
    },
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
    setSettings: (settings: IEditorSettings) => {
      set((gate) => ({
        settings,
      }));
    },
    setGates: (gates: GateEntity[]) => {
      set((state) => ({
        gates,
      }));
    },
    addGate: (gate: GateEntity) => {
      set((state) => ({
        gates: [...state.gates, gate],
      }));
    },
    removeGate: (gateId: number) => {
      set((state) => ({
        gates: state.gates.filter((gate) => gate.id !== gateId),
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
    updateSelectedGate: (gate: GateEntity) => {
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
    setGateTypes: (gateTypes: GateTypeEntity[]) => {
      set((state) => {
        return { gateTypes };
      });
    },
    addGateType: (type: GateTypeEntity) => {
      set((state) => ({
        gateTypes: [...state.gateTypes, type],
      }));
    },
    setWires: (wires: WireEntity[]) => {
      set((state) => ({
        wires,
      }));
    },
    addWire: (wire: WireEntity) => {
      set((state) => ({
        wires: [...state.wires, wire],
      }));
    },
    removeWire: (wire: WireEntity) => {
      set((state) => ({
        wires: state.wires.filter((value) => value !== wire),
      }));
    },
    setTerminals: (terminals: TerminalEntity[]) => {
      set((state) => ({
        terminals,
      }));
    },
    addTerminal: (isInput: boolean, yPos: number) => {
      set((state) => {
        const terminal: TerminalEntity = new TerminalEntity("?", isInput ? IO.Input : IO.Output, yPos);

        return { terminals: [...state.terminals, terminal] };
      });
    },
    setAddingGateType: (type: GateTypeEntity) => {
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
    setTerminalName: (terminalId: number, name: string) => {
      set((state) => {
        const terminals = [...state.terminals];
        const terminalIndex = terminals.findIndex((teminal) => teminal.id === terminalId);
        const terminal = { ...terminals[terminalIndex], name };

        terminals[terminalIndex] = terminal;
        return { terminals: terminals };
      });
    },
    updateActivity: () => {
      set((state) => {
        const activePinIds: string[] = [...state.activeTerminalIds];
        simulate(state.terminals, state.wires, state.gates, activePinIds);
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
