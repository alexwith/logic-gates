export interface Pos {
  x: number;
  y: number;
}

export interface GateMeta {
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

export interface TerminalMeta {
  id: string;  
  name: string;
  input: boolean;
}
