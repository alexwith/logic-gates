import { GateMeta } from "./types";

export const BASE_GATES: GateMeta[] = [
  {
    id: -1,
    name: "AND",
    pos: { x: 0, y: 0 },
    height: 60,
    width: 30 + 15 * 3,
    inputs: 2,
    outputs: 1,
    truthTable: {
      "true,true": [true],
    },
  },
  {
    id: -1,
    name: "NOT",
    pos: { x: 0, y: 0 },
    height: 60,
    width: 30 + 15 * 3,
    inputs: 1,
    outputs: 1,
    truthTable: {
      false: [true],
    },
  },
  {
    id: -1,
    name: "OR",
    pos: { x: 0, y: 0 },
    height: 60,
    width: 30 + 15 * 3,
    inputs: 2,
    outputs: 1,
    truthTable: {
      "true,false": [true],
      "false,true": [true],
      "true,true": [true],
    },
  },
];

export const POS_ZERO = { x: 0, y: 0 };