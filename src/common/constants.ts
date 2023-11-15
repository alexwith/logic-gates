import { PortMeta } from "./types";

export const BASE_PORTS: PortMeta[] = [
  {
    id: -1,
    name: "AND",
    pos: { x: 0, y: 0 },
    height: 60,
    width: 30 + 15 * 3,
    inputs: 2,
    outputs: 1,
    truthTable: new Map().set([true, true].toString(), [true]),
  },
  {
    id: -1,
    name: "NOT",
    pos: { x: 0, y: 0 },
    height: 60,
    width: 30 + 15 * 3,
    inputs: 1,
    outputs: 1,
    truthTable: new Map().set([false].toString(), [true]),
  },
  {
    id: -1,
    name: "OR",
    pos: { x: 0, y: 0 },
    height: 60,
    width: 30 + 15 * 3,
    inputs: 2,
    outputs: 1,
    truthTable: new Map()
      .set([true, false].toString(), [true])
      .set([false, true].toString(), [true])
      .set([true, true].toString(), [true]),
  },
];
