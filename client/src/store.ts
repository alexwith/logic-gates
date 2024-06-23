import { create } from "zustand";
import { BASE_GATES } from "./common/constants";
import { IEditorSettings, IO } from "./common/types";
import { createTruthTable } from "./libs/truthTable";
import { simulate } from "./libs/circuit";
import GateTypeEntity from "./entities/GateTypeEntity";
import TerminalEntity from "./entities/TerminalEntity";
import GateEntity from "./entities/GateEntity";
import WireEntity from "./entities/WireEntity";
import PinEntity from "./entities/PinEntity";

export interface EditorState {
  settings: IEditorSettings;
  gateTypes: GateTypeEntity[];
  terminals: TerminalEntity[];
  gates: GateEntity[];
  wires: WireEntity[];
  selectedGate: GateEntity | null;
  selectedPin: PinEntity | null;
  currentTruthTable: boolean[][];
  addingGateType: GateTypeEntity | null;
  activeTerminalIds: number[];
  activePinIds: number[];
  setSettings: (settings: IEditorSettings) => void;
  setGates: (gates: GateEntity[]) => void;
  addGate: (gate: GateEntity) => void;
  removeGate: (gate: GateEntity) => void;
  setSelectedPin: (pin: PinEntity | null) => void;
  setSelectedGate: (gate: GateEntity | null) => void;
  updateCurrentTruthTable: () => void;
  setGateTypes: (gateTypes: GateTypeEntity[]) => void;
  addGateType: (gateType: GateTypeEntity) => void;
  setWires: (wires: WireEntity[]) => void;
  addWire: (wire: WireEntity) => void;
  removeWire: (wire: WireEntity) => void;
  setTerminals: (terminals: TerminalEntity[]) => void;
  addTerminal: (isInput: boolean, yPos: number) => void;
  setAddingGateType: (type: GateTypeEntity) => void;
  toggleTerminal: (pinId: number) => void;
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
    selectedGate: null,
    selectedPin: null,
    currentTruthTable: [],
    addingGateType: null,
    activeTerminalIds: [],
    activePinIds: [],
    setSettings: (settings: IEditorSettings) => {
      set(() => ({
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
    removeGate: (gate: GateEntity) => {
      set((state) => ({
        gates: state.gates.filter((gate2) => gate2 !== gate),
      }));
    },
    setSelectedPin: (pin: PinEntity | null) => {
      set(() => ({
        selectedPin: pin,
      }));
    },
    setSelectedGate: (gate: GateEntity | null) => {
      set(() => ({
        selectedGate: gate,
      }));
    },
    updateCurrentTruthTable: () => {
      set((state) => ({
        currentTruthTable: createTruthTable(state.terminals, state.wires),
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
        const terminal: TerminalEntity = new TerminalEntity(
          "?",
          isInput ? IO.Input : IO.Output,
          yPos
        );

        return { terminals: [...state.terminals, terminal] };
      });
    },
    setAddingGateType: (type: GateTypeEntity) => {
      set(() => ({
        addingGateType: type,
      }));
    },
    toggleTerminal: (pinId: number) => {
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
        const activePinIds: number[] = [...state.activeTerminalIds];
        simulate(state.terminals, state.wires, activePinIds);
        return { activePinIds };
      });
    },
    clear: () => {
      TerminalEntity.idCounter = 0;
      GateEntity.idCounter = 0;

      set(() => ({
        terminals: [],
        gates: [],
        wires: [],
        selectedGate: null,
        selectedPin: null,
        currentTruthTable: [],
        addingGateType: null,
        activeTerminalIds: [],
        activePinIds: [],
      }));
    },
  };
});
