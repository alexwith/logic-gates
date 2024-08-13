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

export interface SimulatorState {
  settings: IEditorSettings;
  gateTypes: GateTypeEntity[];
  terminals: TerminalEntity[];
  gates: GateEntity[];
  wires: WireEntity[];
  selectedGate: GateEntity | null;
  selectedPin: PinEntity | null;
  currentTruthTable: boolean[][];
  addingGateType: GateTypeEntity | null;
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
  addTerminal: (io: IO, yPos: number) => void;
  updateTerminal: (terminal: TerminalEntity) => void;
  setSelectedPin: (pin: PinEntity | null) => void;
  setSelectedGate: (gate: GateEntity | null) => void;
  setAddingGateType: (type: GateTypeEntity) => void;
  updateCurrentTruthTable: () => void;
  updateActivity: () => void;
  reset: () => void;
}

const initialSimulatorState = {
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
};

export const useSimulatorStore = create<SimulatorState>((set) => {
  return {
    ...initialSimulatorState,
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
    addTerminal: (io: IO, yPos: number) => {
      set((state) => {
        const terminal: TerminalEntity = new TerminalEntity("?", io, yPos);

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
    updateCurrentTruthTable: () => {
      set((state) => ({
        currentTruthTable: createTruthTable(state.terminals, state.wires, state.gates),
      }));
    },
    updateActivity: () => {
      set((state) => {
        simulate(state.wires, state.gates);

        return {};
      });
    },
    reset: () => {
      TerminalEntity.idCounter = 0;
      GateEntity.idCounter = 0;
      PinEntity.idCounter = 0;

      console.log("reset state");

      set(initialSimulatorState);
    },
  };
});
