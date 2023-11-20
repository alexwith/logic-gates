import { create } from "zustand";
import { BASE_PORTS } from "./common/constants";
import { ConnectionMeta, GlobalPinMeta, PortMeta } from "./common/types";
import { createTruthTable } from "./libs/truthTable";
import { globalInputPinId, globalOutputPinId } from "./utils/idUtil";

export interface DiagramState {
  portTypes: PortMeta[];
  globalPins: GlobalPinMeta[];
  ports: PortMeta[];
  connections: ConnectionMeta[];
  selectedPortId: number;
  selectedPinId: string;
  currentTruthTable: boolean[][];
  addingPortType: PortMeta | null;
  activeGlobalPinIds: string[];
  addPort: (port: PortMeta) => void;
  setSelectedPin: (portId: string) => void;
  setSelectedPort: (portId: number) => void;
  updateSelectedPort: (port: PortMeta) => void;
  updateCurrentTruthTable: () => void;
  addPortType: (type: PortMeta) => void;
  addConnection: (connection: ConnectionMeta) => void;
  addGlobalPin: (isInput: boolean) => void;
  setAddingPortType: (type: PortMeta) => void;
  toggleGlobalPin: (pinId: string) => void;
  setGlobalPinName: (pinId: string, name: string) => void;
  clear: () => void;
}

export const useDiagramStore = create<DiagramState>((set) => {
  return {
    portTypes: BASE_PORTS,
    globalPins: [],
    ports: [],
    connections: [],
    selectedPortId: -1,
    selectedPinId: "",
    currentTruthTable: [],
    addingPortType: null,
    activeGlobalPinIds: [],
    addPort: (port: PortMeta) => {
      set((state) => ({
        ports: [...state.ports, port],
      }));
    },
    setSelectedPin: (pinId: string) => {
      set(() => ({
        selectedPinId: pinId,
      }));
    },
    setSelectedPort: (portId: number) => {
      set(() => ({
        selectedPortId: portId,
      }));
    },
    updateSelectedPort: (port: PortMeta) => {
      set((state) => {
        const { selectedPortId, ports } = state;
        if (selectedPortId === -1) {
          return {};
        }

        const updatedPorts = [...ports];
        updatedPorts[selectedPortId] = port;
        return { ports: updatedPorts };
      });
    },
    updateCurrentTruthTable: () => {
      set((state) => ({
        currentTruthTable: createTruthTable(state.globalPins, state.connections, state.ports),
      }));
    },
    addPortType: (type: PortMeta) => {
      set((state) => ({
        portTypes: [...state.portTypes, type],
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
    setAddingPortType: (type: PortMeta) => {
      set((state) => ({
        addingPortType: type,
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
    clear: () => {
      set(() => ({
        globalPins: [],
        ports: [],
        connections: [],
        selectedPortId: -1,
        selectedPinId: "",
        currentTruthTable: [],
        addingPortType: null,
        activeGlobalPinIds: [],
      }));
    },
  };
});
