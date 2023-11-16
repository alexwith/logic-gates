import { BASE_PORTS } from "../common/constants";
import { ConnectionMeta, GlobalPinMeta, PortMeta, ReducerAction } from "../common/types";
import { createTruthTable } from "../libs/truthTable";
import { globalInputPinId, globalOutputPinId } from "../utils/idUtil";

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
}

const initialState: DiagramState = {
  portTypes: BASE_PORTS,
  globalPins: [],
  ports: [],
  connections: [],
  selectedPortId: -1,
  selectedPinId: "",
  currentTruthTable: [],
  addingPortType: null,
  activeGlobalPinIds: [],
};

export default function Reducer(
  state: DiagramState = initialState,
  { type, payload }: ReducerAction
) {
  switch (type) {
    case "ADD_PORT": {
      return { ...state, ports: [...state.ports, payload] };
    }
    case "SET_SELECTED_PIN": {
      return { ...state, selectedPinId: payload };
    }
    case "SET_SELECTED_PORT": {
      return { ...state, selectedPortId: payload };
    }
    case "UPDATE_SELECTED_PORT": {
      const { selectedPortId, ports } = state;
      if (selectedPortId === -1) {
        return { ...state };
      }

      const updatedPorts = [...ports];
      updatedPorts[selectedPortId] = payload;

      return { ...state, ports: updatedPorts };
    }
    case "UPDATE_CURRENT_TRUTH_TABLE":
      return {
        ...state,
        currentTruthTable: createTruthTable(state.globalPins, state.connections, state.ports),
      };
    case "ADD_PORT_TYPE": {
      return { ...state, portTypes: [...state.portTypes, payload] };
    }
    case "ADD_CONNECTION": {
      return { ...state, connections: [...state.connections, payload] };
    }
    case "ADD_GLOBAL_PIN": {
      const input = payload;
      const nextPinIndex = state.globalPins.filter((pin) => pin.input === input).length;

      const pin: GlobalPinMeta = {
        id: input ? globalInputPinId(nextPinIndex) : globalOutputPinId(nextPinIndex),
        name: "?",
        input,
      };

      return { ...state, globalPins: [...state.globalPins, pin] };
    }
    case "SET_ADDING_PORT_TYPE": {
      return { ...state, addingPortType: payload };
    }
    case "TOGGLE_GLOBAL_PIN": {
      const activeGlobalPinIds = [...state.activeGlobalPinIds];
      const index = activeGlobalPinIds.indexOf(payload);
      index !== -1 ? activeGlobalPinIds.splice(index, 1) : activeGlobalPinIds.push(payload);

      return { ...state, activeGlobalPinIds };
    }
    case "SET_GLOBAL_PIN_NAME": {
      const { id, name } = payload;

      const globalPins = [...state.globalPins];
      const pinIndex = globalPins.findIndex((pin) => pin.id === id);
      const pin = { ...globalPins[pinIndex], name };

      globalPins[pinIndex] = pin;

      return { ...state, globalPins };
    }
    case "CLEAR_DIAGRAM": {
      return {
        ...state,
        globalPins: [],
        ports: [],
        connections: [],
        selectedPortId: -1,
        selectedPinId: "",
        currentTruthTable: [],
        addingPortType: null,
        activeGlobalPinIds: [],
      };
    }
    default:
      return state;
  }
}
