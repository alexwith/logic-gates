import GateEntity from "../entities/GateEntity";
import TerminalEntity from "../entities/TerminalEntity";

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
