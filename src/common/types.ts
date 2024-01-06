export interface Pos {
  x: number;
  y: number;
}

export interface IEditorSettings {
  grid: boolean;
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

export interface WireMeta {
  pin0Id: string;
  pin1Id: string;
  checkpoints: Pos[];
}

export interface TerminalMeta {
  id: string;
  name: string;
  input: boolean;
  yPos: number;
}
