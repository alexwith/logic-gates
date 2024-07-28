import GateEntity from "../entities/GateEntity";
import TerminalEntity from "../entities/TerminalEntity";

export interface User {
  id: number;
  githubId: number;
  username: string;
}

export interface Project {
  id?: number;
  name: string;
  shortDescription: string;
  description: string;
  visibility: ProjectVisibilty;
}

export enum ProjectVisibilty {
  Public = "PUBLIC",
  Private = "PRIVATE",
}

export interface Pos {
  x: number;
  y: number;
}

export interface IEditorSettings {
  grid: boolean;
}

export enum IO {
  Input,
  Output,
}

export namespace IO {
  export function opposite(io: IO) {
    if (io === IO.Input) {
      return IO.Output;
    } else {
      return IO.Input;
    }
  }
}

export enum PinType {
  Terminal,
  Gate,
}

export namespace PinType {
  export function fromEntity(entity: TerminalEntity | GateEntity): PinType {
    if (entity instanceof TerminalEntity) {
      return PinType.Terminal;
    } else {
      return PinType.Gate;
    }
  }

  export function dynamicLogic<T>(type: PinType, terminal: () => T, gate: () => T): T {
    if (type === PinType.Terminal) {
      return terminal();
    } else {
      return gate();
    }
  }
}
