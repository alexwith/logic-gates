import { BASE_PORTS } from "../common/constants";
import { ConnectionMeta, GlobalPinMeta, PortMeta, ReducerAction } from "../common/types";
import { createTruthTable } from "../libs/truthTable";

const testGlobalPins: GlobalPinMeta[] = [
  {
    id: 0,
    pos: { x: 100, y: 210 },
    label: "A",
    input: true,
  },
  {
    id: 1,
    pos: { x: 100, y: 250 },
    label: "B",
    input: true,
  },
  {
    id: 2,
    pos: { x: 500, y: 230 },
    label: "F",
    input: false,
  },
];

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
  globalPins: [...testGlobalPins],
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
    case "ADD_PORT":
      return { ...state, ports: [...state.ports, payload] };
    case "SET_SELECTED_PIN":
      return { ...state, selectedPinId: payload };
    case "SET_SELECTED_PORT":
      return { ...state, selectedPortId: payload };
    case "UPDATE_SELECTED_PORT":
      const { selectedPortId, ports } = state;
      if (selectedPortId === -1) {
        return { ...state };
      }

      const updatedPorts = [...ports];
      updatedPorts[selectedPortId] = payload;

      return { ...state, ports: updatedPorts };
    case "UPDATE_CURRENT_TRUTH_TABLE":
      return {
        ...state,
        currentTruthTable: createTruthTable(state.globalPins, state.connections, state.ports),
      };
    case "ADD_PORT_TYPE":
      return { ...state, portTypes: [...state.portTypes, payload] };
    case "ADD_CONNECTION":
      return { ...state, connections: [...state.connections, payload] };
    case "SET_ADDING_PORT_TYPE":
      return { ...state, addingPortType: payload };
    case "TOGGLE_GLOBAL_PIN":
      const activeGlobalPinIds = [...state.activeGlobalPinIds];      
      const index = activeGlobalPinIds.indexOf(payload);      
      index !== -1 ? activeGlobalPinIds.splice(index, 1) : activeGlobalPinIds.push(payload);

      return { ...state, activeGlobalPinIds };
    case "CLEAR_DIAGRAM":
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
    default:
      return state;
  }
}
