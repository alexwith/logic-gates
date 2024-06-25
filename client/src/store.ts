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
  activeTerminalPinIds: number[];
  activePinIds: number[];
  setSettings: (settings: IEditorSettings) => void;
  setGateTypes: (gateTypes: GateTypeEntity[]) => void;
  addGateType: (gateType: GateTypeEntity) => void;
  setGates: (gates: GateEntity[]) => void;
  addGate: (gate: GateEntity) => void;
  removeGate: (gate: GateEntity) => void;
  setWires: (wires: WireEntity[]) => void;
  addWire: (wire: WireEntity) => void;
  removeWire: (wire: WireEntity) => void;
  setTerminals: (terminals: TerminalEntity[]) => void;
  addTerminal: (isInput: boolean, yPos: number) => void;
  updateTerminal: (terminal: TerminalEntity) => void;
  setSelectedPin: (pin: PinEntity | null) => void;
  setSelectedGate: (gate: GateEntity | null) => void;
  setAddingGateType: (type: GateTypeEntity) => void;
  toggleTerminal: (terminal: TerminalEntity) => void;
  updateCurrentTruthTable: () => void;
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
    activeTerminalPinIds: [],
    activePinIds: [],
    setSettings: (settings: IEditorSettings) => {
      set(() => ({
        settings,
      }));
    },
    setGateTypes: (gateTypes: GateTypeEntity[]) => {
      set(() => ({
        gateTypes,
      }));
    },
    addGateType: (type: GateTypeEntity) => {
      set((state) => ({
        gateTypes: [...state.gateTypes, type],
      }));
    },
    setGates: (gates: GateEntity[]) => {
      set(() => ({
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
        gates: state.gates.filter((value) => value !== gate),
      }));
    },
    setWires: (wires: WireEntity[]) => {
      set(() => ({
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
      set(() => ({
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
    updateTerminal: (terminal: TerminalEntity) => {
      set((state) => {
        const terminals = [...state.terminals];
        const index = terminals.findIndex((otherTerminal) => otherTerminal.id === terminal.id);
        terminals[index] = terminal;

        return { terminals };
      });
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
    setAddingGateType: (type: GateTypeEntity) => {
      set(() => ({
        addingGateType: type,
      }));
    },
    toggleTerminal: (terminal: TerminalEntity) => {
      set((state) => {
        const activeTerminalIds = [...state.activeTerminalPinIds];
        const index = activeTerminalIds.indexOf(terminal.pin.id);
        index !== -1 ? activeTerminalIds.splice(index, 1) : activeTerminalIds.push(terminal.pin.id);

        return { activeTerminalPinIds: activeTerminalIds };
      });
    },
    updateCurrentTruthTable: () => {
      set((state) => ({
        currentTruthTable: createTruthTable(state.terminals, state.wires),
      }));
    },
    updateActivity: () => {
      set((state) => {
        const activePinIds: number[] = [...state.activeTerminalPinIds];
        simulate(state.terminals, state.wires, activePinIds);
        return { activePinIds };
      });
    },
    clear: () => {
      TerminalEntity.idCounter = 0;
      GateEntity.idCounter = 0;
      PinEntity.idCounter = 0;

      set(() => ({
        terminals: [],
        gates: [],
        wires: [],
        selectedGate: null,
        selectedPin: null,
        currentTruthTable: [],
        addingGateType: null,
        activeTerminalPinIds: [],
        activePinIds: [],
      }));
    },
  };
});
