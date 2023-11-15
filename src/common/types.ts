export interface Pos {
  x: number;
  y: number;
}

export interface ReducerAction {
  type: string;
  payload: any;
}

export interface PortMeta {
  id: number;
  name: string;
  pos: Pos;
  height: number;
  width: number;
  inputs: number;
  outputs: number;
  truthTable: any;
}

export interface ConnectionMeta {
  pin0Id: string;
  pin1Id: string;
}

export interface GlobalPinMeta {
  id: number;
  pos: Pos;
  label: string;
  input: boolean;
}
