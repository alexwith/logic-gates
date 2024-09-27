import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { BASE_GATES } from "../common/constants";
import { IEditorSettings, IO } from "../common/types";
import GateTypeEntity from "../entities/GateTypeEntity";
import TerminalEntity from "../entities/TerminalEntity";
import GateEntity from "../entities/GateEntity";
import WireEntity from "../entities/WireEntity";
import PinEntity from "../entities/PinEntity";
import { createTruthTable } from "../libs/truthTable";
import { simulate } from "../libs/circuit";

export interface SimulatorState {
  settings: IEditorSettings;
  gateTypes: GateTypeEntity[];
  terminals: TerminalEntity[];
  gates: GateEntity[];
  wires: WireEntity[];
  currentGate: GateEntity | null;
  currentPin: PinEntity | null;
  truthTable: boolean[][];
  addingGateType: GateTypeEntity | null;
}

export interface SimulatorActions {
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
  removeTerminal: (terminal: TerminalEntity) => void;
  updateTerminal: (terminal: TerminalEntity) => void;
  setCurrentPin: (pin: PinEntity | null) => void;
  setCurrentGate: (gate: GateEntity | null) => void;
  setAddingGateType: (type: GateTypeEntity) => void;
  updateTruthTable: () => void;
  updateActivity: () => void;
  resetSimulator: () => void;
  reset: () => void;
}

const initialSimulatorState: SimulatorState = {
  settings: {
    grid: true,
    autoStraightWires: true,
  },
  gateTypes: BASE_GATES,
  terminals: [],
  gates: [],
  wires: [],
  currentGate: null,
  currentPin: null,
  truthTable: [],
  addingGateType: null,
};

export const useSimulatorStore = create(
  subscribeWithSelector<SimulatorState & SimulatorActions>((set) => {
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
      removeTerminal: (terminal: TerminalEntity) => {
        set((state) => ({
          terminals: state.terminals.filter((value) => value !== terminal),
        }));
      },
      updateTerminal: (terminal: TerminalEntity) => {
        set((state) => {
          const terminals = [...state.terminals];
          const index = terminals.findIndex((otherTerminal) => otherTerminal.id === terminal.id);
          terminals[index] = terminal;

          return { terminals };
        });
      },
      setCurrentPin: (pin: PinEntity | null) => {
        set(() => ({
          currentPin: pin,
        }));
      },
      setCurrentGate: (gate: GateEntity | null) => {
        set(() => ({
          currentGate: gate,
        }));
      },
      setAddingGateType: (type: GateTypeEntity) => {
        set(() => ({
          addingGateType: type,
        }));
      },
      updateTruthTable: () => {
        set((state) => ({
          truthTable: createTruthTable(state.terminals, state.wires, state.gates),
        }));
      },
      updateActivity: () => {
        set((state) => {
          simulate(state.wires, state.gates);

          return {};
        });
      },
      resetSimulator: () => {
        set({
          terminals: [],
          gates: [],
          wires: [],
          currentGate: null,
          currentPin: null,
          truthTable: [],
          addingGateType: null,
        });
      },
      reset: () => {
        TerminalEntity.idCounter = 0;
        GateEntity.idCounter = 0;
        PinEntity.idCounter = 0;

        set(initialSimulatorState);
      },
    };
  }),
);
