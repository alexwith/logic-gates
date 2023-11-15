export interface Pos {
  x: number;
  y: number;
}

export interface PortMeta {
  id: number;
  name: string;
  pos: Pos;
  height: number;
  width: number;
  inputs: number;
  outputs: number;
  truthTable: Map<string, boolean[]>  
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
